import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import {
  AdminUserListQueryDto,
  AdminStoreListQueryDto,
  AdminStoreProductQueryDto,
  AdminStoreOrderQueryDto,
  AdminStoreWithdrawalQueryDto,
  AdminProductListQueryDto,
  UpdateStoreFeeDto,
} from '@module/admin/dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  private paginate(page = 1, limit = 20) {
    return { skip: (page - 1) * limit, take: limit };
  }

  private buildMeta(total: number, page = 1, limit = 20) {
    return { total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getAdminDashboard() {
    const [
      totalUsers,
      totalSellers,
      totalBuyers,
      totalShippers,
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingSellerApprovals,
      pendingWithdrawals,
      processingWithdrawals,
      platformWallet,
      gmvAgg,
      platformFeeAgg,
      returnRequests,
      recentOrders,
      ordersByStatus,
    ] = await Promise.all([
      this.prisma.user.count({ where: { deletedAt: null } }),
      this.prisma.sellerProfile.count({ where: { deletedAt: null } }),
      this.prisma.buyerProfile.count(),
      this.prisma.shipperProfile.count(),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'COMPLETED' } }),
      this.prisma.order.count({ where: { status: 'CANCELLED' } }),
      this.prisma.sellerProfile.count({
        where: { status: 'PENDING', deletedAt: null },
      }),
      this.prisma.withdrawalRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.withdrawalRequest.count({ where: { status: 'PROCESSING' } }),
      this.prisma.platformWallet.findUnique({ where: { walletId: 1 } }),
      this.prisma.order.aggregate({ _sum: { totalAmount: true } }),
      this.prisma.order.aggregate({ _sum: { platformFee: true } }),
      this.prisma.returnRequest.count({ where: { status: 'REQUESTED' } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          buyer: { select: { fullName: true } },
          seller: { select: { storeName: true } },
          payments: { select: { method: true, status: true } },
        },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { orderId: true },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        buyers: totalBuyers,
        sellers: totalSellers,
        shippers: totalShippers,
      },
      orders: {
        total: totalOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        byStatus: ordersByStatus.map((s) => ({
          status: s.status,
          count: s._count.orderId,
        })),
      },
      finance: {
        totalGmv: gmvAgg._sum.totalAmount ?? 0n,
        totalPlatformFee: platformFeeAgg._sum.platformFee ?? 0n,
        platformWallet,
      },
      pending: {
        sellerApprovals: pendingSellerApprovals,
        withdrawalsPending: pendingWithdrawals,
        withdrawalsProcessing: processingWithdrawals,
        returnRequests,
      },
      recentOrders,
    };
  }

  async getAdminStores(query: AdminStoreListQueryDto) {
    const { status, search, page = 1, limit = 20 } = query;
    const { skip, take } = this.paginate(page, limit);

    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { storeName: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, stores] = await Promise.all([
      this.prisma.sellerProfile.count({ where }),
      this.prisma.sellerProfile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              userId: true,
              email: true,
              phone: true,
              status: true,
              createdAt: true,
            },
          },
          wallet: true,
          _count: {
            select: { products: true, orders: true, withdrawalRequests: true },
          },
        },
      }),
    ]);

    const sellerIds = stores.map((s) => s.sellerId);
    const orderStats = await this.prisma.order.groupBy({
      by: ['sellerId', 'status'],
      where: { sellerId: { in: sellerIds } },
      _count: { orderId: true },
      _sum: { totalAmount: true, platformFee: true },
    });

    const statsMap = new Map<
      number,
      {
        totalRevenue: bigint;
        platformFeeEarned: bigint;
        totalOrders: number;
        completedOrders: number;
        cancelledOrders: number;
      }
    >();
    for (const stat of orderStats) {
      if (!statsMap.has(stat.sellerId)) {
        statsMap.set(stat.sellerId, {
          totalRevenue: 0n,
          platformFeeEarned: 0n,
          totalOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
        });
      }
      const entry = statsMap.get(stat.sellerId)!;
      entry.totalOrders += stat._count.orderId;
      entry.totalRevenue += stat._sum.totalAmount ?? 0n;
      entry.platformFeeEarned += stat._sum.platformFee ?? 0n;
      if (stat.status === 'COMPLETED')
        entry.completedOrders += stat._count.orderId;
      if (stat.status === 'CANCELLED')
        entry.cancelledOrders += stat._count.orderId;
    }

    return {
      data: stores.map((store) => ({
        ...store,
        orderStats: statsMap.get(store.sellerId) ?? {
          totalRevenue: 0n,
          platformFeeEarned: 0n,
          totalOrders: 0,
          completedOrders: 0,
          cancelledOrders: 0,
        },
      })),
      meta: this.buildMeta(total, page, limit),
    };
  }

  async getAdminStoreDetail(sellerId: number) {
    const store = await this.prisma.sellerProfile.findUnique({
      where: { sellerId },
      include: {
        user: {
          select: {
            userId: true,
            email: true,
            phone: true,
            status: true,
            createdAt: true,
          },
        },
        wallet: true,
        bankAccounts: true,
      },
    });
    if (!store) throw new NotFoundException('Cửa hàng không tồn tại');

    const [orderStats, gmvAgg, platformFeeAgg] = await Promise.all([
      this.prisma.order.groupBy({
        by: ['status'],
        where: { sellerId },
        _count: { orderId: true },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: { sellerId },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: { sellerId },
        _sum: { platformFee: true },
      }),
    ]);

    return {
      ...store,
      orderSummary: {
        totalRevenue: gmvAgg._sum.totalAmount ?? 0n,
        platformFeeEarned: platformFeeAgg._sum.platformFee ?? 0n,
        byStatus: orderStats.map((s) => ({
          status: s.status,
          count: s._count.orderId,
          revenue: s._sum.totalAmount ?? 0n,
        })),
      },
    };
  }

  async getAdminStoreProducts(
    sellerId: number,
    query: AdminStoreProductQueryDto,
  ) {
    const { status, search, page = 1, limit = 20 } = query;
    const { skip, take } = this.paginate(page, limit);

    const where: any = { sellerId, deletedAt: null };
    if (status) where.status = status;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { categoryId: true, name: true } },
          images: { take: 1 },
          _count: { select: { orderItems: true } },
        },
      }),
    ]);

    return { data: products, meta: this.buildMeta(total, page, limit) };
  }

  async getAdminStoreOrders(sellerId: number, query: AdminStoreOrderQueryDto) {
    const { status, search, page = 1, limit = 20 } = query;
    const { skip, take } = this.paginate(page, limit);

    const where: any = { sellerId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { receiverName: { contains: search, mode: 'insensitive' } },
        { receiverPhone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          buyer: { select: { fullName: true } },
          orderItems: {
            include: {
              product: { select: { name: true, images: { take: 1 } } },
            },
          },
          payments: { select: { method: true, status: true, amount: true } },
          shipment: { select: { status: true, trackingCode: true } },
        },
      }),
    ]);

    return { data: orders, meta: this.buildMeta(total, page, limit) };
  }

  async getAdminStoreWithdrawals(
    sellerId: number,
    query: AdminStoreWithdrawalQueryDto,
  ) {
    const { status, page = 1, limit = 20 } = query;
    const { skip, take } = this.paginate(page, limit);

    const where: any = { sellerId };
    if (status) where.status = status;

    const [total, withdrawals] = await Promise.all([
      this.prisma.withdrawalRequest.count({ where }),
      this.prisma.withdrawalRequest.findMany({
        where,
        skip,
        take,
        orderBy: { requestedAt: 'desc' },
        include: { bankAccount: true },
      }),
    ]);

    return { data: withdrawals, meta: this.buildMeta(total, page, limit) };
  }

  async approveSeller(sellerId: number) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { sellerId },
    });
    if (!seller) throw new NotFoundException('Cửa hàng không tồn tại');
    if (seller.status !== 'PENDING')
      throw new BadRequestException(
        `Không thể duyệt cửa hàng có trạng thái ${seller.status}`,
      );
    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: { status: 'APPROVED' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async rejectSeller(sellerId: number, reason?: string) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { sellerId },
    });
    if (!seller) throw new NotFoundException('Cửa hàng không tồn tại');
    if (seller.status !== 'PENDING')
      throw new BadRequestException(
        `Không thể từ chối cửa hàng có trạng thái ${seller.status}`,
      );
    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: { status: 'REJECTED' },
    });
  }

  async suspendSeller(sellerId: number) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { sellerId },
    });
    if (!seller) throw new NotFoundException('Cửa hàng không tồn tại');
    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: { status: 'SUSPENDED' },
    });
  }

  async updateStoreFee(sellerId: number, dto: UpdateStoreFeeDto) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { sellerId },
    });
    if (!seller) throw new NotFoundException('Cửa hàng không tồn tại');
    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: { platformFeeRate: dto.platformFeeRate },
    });
  }

  async getAdminProducts(query: AdminProductListQueryDto) {
    const { status, search, categoryId, page = 1, limit = 20 } = query;
    const { skip, take } = this.paginate(page, limit);

    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          seller: { select: { sellerId: true, storeName: true } },
          category: { select: { categoryId: true, name: true } },
          images: { take: 1 },
          _count: { select: { orderItems: true } },
        },
      }),
    ]);

    return { data: products, meta: this.buildMeta(total, page, limit) };
  }

  async getAdminProductDetail(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { productId },
      include: {
        seller: { select: { sellerId: true, storeName: true } },
        category: true,
        images: true,
        _count: { select: { orderItems: true } },
      },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  async deleteProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { productId },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    await this.prisma.product.delete({ where: { productId } });
    return { message: 'Đã xóa sản phẩm thành công' };
  }

  async getAdminUsers(query: AdminUserListQueryDto) {
    const { role, status, search, page = 1, limit = 20 } = query;
    const { skip, take } = this.paginate(page, limit);

    const where: any = { deletedAt: null };
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        {
          buyerProfile: { fullName: { contains: search, mode: 'insensitive' } },
        },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          userId: true,
          email: true,
          nickname: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          buyerProfile: { select: { fullName: true, avatarUrl: true } },
          sellerProfile: {
            select: { sellerId: true, storeName: true, status: true },
          },
          shipperProfile: { select: { shipperId: true, status: true } },
          adminProfile: { select: { adminId: true, role: true } },
        },
      }),
    ]);

    return { data: users, meta: this.buildMeta(total, page, limit) };
  }

  async getAdminUserDetail(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        buyerProfile: { include: { _count: { select: { orders: true } } } },
        sellerProfile: {
          include: {
            wallet: true,
            _count: { select: { products: true, orders: true } },
          },
        },
        shipperProfile: true,
        adminProfile: true,
      },
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async suspendUser(userId: number, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (['SUSPENDED', 'BANNED', 'DELETED'].includes(user.status))
      throw new BadRequestException(
        `Không thể đình chỉ tài khoản có trạng thái ${user.status}`,
      );
    return this.prisma.user.update({
      where: { userId },
      data: { status: 'SUSPENDED' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async banUser(userId: number, reason?: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (user.status === 'BANNED')
      throw new ConflictException('Tài khoản đã bị cấm');
    return this.prisma.user.update({
      where: { userId },
      data: { status: 'BANNED' },
    });
  }

  async deleteUser(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    await this.prisma.user.update({
      where: { userId },
      data: { status: 'DELETED', deletedAt: new Date() },
    });
    return { message: 'Đã xóa người dùng thành công' };
  }

  async approveWithdrawal(withdrawalId: number) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { withdrawalId },
    });
    if (!withdrawal)
      throw new NotFoundException('Yêu cầu rút tiền không tồn tại');
    if (withdrawal.status !== 'PENDING')
      throw new BadRequestException(
        `Không thể duyệt yêu cầu có trạng thái ${withdrawal.status}`,
      );
    return this.prisma.withdrawalRequest.update({
      where: { withdrawalId },
      data: { status: 'PROCESSING', processedAt: new Date() },
    });
  }

  async rejectWithdrawal(withdrawalId: number, reason?: string) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { withdrawalId },
    });
    if (!withdrawal)
      throw new NotFoundException('Yêu cầu rút tiền không tồn tại');
    if (!['PENDING', 'PROCESSING'].includes(withdrawal.status))
      throw new BadRequestException(
        `Không thể từ chối yêu cầu có trạng thái ${withdrawal.status}`,
      );
    return this.prisma.withdrawalRequest.update({
      where: { withdrawalId },
      data: {
        status: 'FAILED',
        failureReason: reason,
        processedAt: new Date(),
      },
    });
  }

  async createAdmin(userId: number, role: string) {
    const user = await this.prisma.user.findUnique({ where: { userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    const existing = await this.prisma.adminProfile.findUnique({
      where: { userId },
    });
    if (existing) throw new ConflictException('Người dùng đã có quyền admin');
    return this.prisma.adminProfile.create({
      data: { userId, role: role as any },
    });
  }
}
