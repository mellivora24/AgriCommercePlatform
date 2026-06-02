import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import {
  CreateSellerDto,
  UpdateSellerDto,
  CreateSellerBankAccountDto,
  UpdateSellerBankAccountDto,
  UpdateSellerSettingsDto,
  SellerWithdrawDto,
} from './dto';
import { OrderStatus, ProductStatus } from '@prisma/client';

@Injectable()
export class SellersService {
  constructor(private readonly prisma: PrismaService) {}

  async createSellerProfile(userId: number, dto: CreateSellerDto) {
    const existingSeller = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });
    if (existingSeller) throw new ForbiddenException('Đã tạo hồ sơ bán hàng');

    return this.prisma.sellerProfile.create({
      data: {
        userId,
        storeName: dto.storeName,
        storeDescription: dto.storeDescription,
        platformFeeRate: dto.platformFeeRate || 10.0,
      },
    });
  }

  async getSellerProfile(sellerId: number) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { sellerId },
      include: {
        bankAccounts: true,
        wallet: true,
        products: { take: 5 },
      },
    });
    if (!seller) throw new NotFoundException('Bán hàng không tồn tại');
    return seller;
  }

  async updateSellerProfile(sellerId: number, dto: UpdateSellerDto) {
    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: dto,
    });
  }

  async createBankAccount(sellerId: number, dto: CreateSellerBankAccountDto) {
    if (dto.isPrimary) {
      await this.prisma.sellerBankAccount.updateMany({
        where: { sellerId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.sellerBankAccount.create({
      data: {
        sellerId,
        ...dto,
      },
    });
  }

  async getBankAccounts(sellerId: number) {
    return this.prisma.sellerBankAccount.findMany({
      where: { sellerId },
    });
  }

  async updateBankAccount(
    accountId: number,
    sellerId: number,
    dto: UpdateSellerBankAccountDto,
  ) {
    const account = await this.prisma.sellerBankAccount.findUnique({
      where: { bankAccountId: accountId },
    });
    if (!account || account.sellerId !== sellerId)
      throw new ForbiddenException('Không có quyền');

    if (dto.isPrimary) {
      await this.prisma.sellerBankAccount.updateMany({
        where: { sellerId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.sellerBankAccount.update({
      where: { bankAccountId: accountId },
      data: dto,
    });
  }

  async deleteBankAccount(accountId: number, sellerId: number) {
    const account = await this.prisma.sellerBankAccount.findUnique({
      where: { bankAccountId: accountId },
    });
    if (!account || account.sellerId !== sellerId)
      throw new ForbiddenException('Không có quyền');

    return this.prisma.sellerBankAccount.delete({
      where: { bankAccountId: accountId },
    });
  }

  async getSellerWallet(sellerId: number) {
    return this.prisma.sellerWallet.findUnique({
      where: { sellerId },
    });
  }

  async approveSeller(sellerId: number) {
    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: { status: 'APPROVED' },
    });
  }

  async rejectSeller(sellerId: number) {
    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: { status: 'REJECTED' },
    });
  }

  async suspendSeller(sellerId: number) {
    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: { status: 'SUSPENDED' },
    });
  }

  async getSellerDashboard(sellerId: number) {
    const [
      totalProducts,
      availableProducts,
      outOfStockProducts,
      totalOrders,
      waitingOrders,
      shippingOrders,
      completedOrders,
      wallet,
      recentOrders,
      revenueResult,
      orderStatusCounts,
      revenueChart,
      orderChart,
      topProductsRaw,
    ] = await Promise.all([
      this.prisma.product.count({ where: { sellerId, deletedAt: null } }),
      this.prisma.product.count({
        where: { sellerId, status: 'AVAILABLE', deletedAt: null },
      }),
      this.prisma.product.count({
        where: { sellerId, status: 'OUT_OF_STOCK', deletedAt: null },
      }),
      this.prisma.order.count({ where: { sellerId } }),
      this.prisma.order.count({
        where: { sellerId, status: 'WAITING_SELLER_CONFIRMATION' },
      }),
      this.prisma.order.count({ where: { sellerId, status: 'SHIPPING' } }),
      this.prisma.order.count({ where: { sellerId, status: 'COMPLETED' } }),
      this.prisma.sellerWallet.findUnique({ where: { sellerId } }),
      this.prisma.order.findMany({
        where: { sellerId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { buyer: true },
      }),
      this.prisma.order.aggregate({
        where: { sellerId, status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where: { sellerId },
        _count: true,
      }),
      this.prisma.$queryRaw<{ date: string; revenue: bigint }[]>`
        SELECT DATE(created_at) as date, COALESCE(SUM(total_amount),0)::bigint as revenue
        FROM orders
        WHERE seller_id = ${sellerId} AND status = 'COMPLETED' AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) ORDER BY DATE(created_at)
      `,
      this.prisma.$queryRaw<{ date: string; orders: bigint }[]>`
        SELECT DATE(created_at) as date, COUNT(*)::bigint as orders
        FROM orders
        WHERE seller_id = ${sellerId} AND created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) ORDER BY DATE(created_at)
      `,
      this.prisma.orderItem.groupBy({
        by: ['productId'],
        where: { order: { sellerId, status: 'COMPLETED' } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    const productIds = topProductsRaw.map((x) => x.productId);
    const products = await this.prisma.product.findMany({
      where: { productId: { in: productIds } },
    });
    const topProducts = topProductsRaw.map((item) => {
      const product = products.find((p) => p.productId === item.productId);
      return {
        productId: item.productId,
        name: product?.name,
        soldQuantity: item._sum.quantity ?? 0,
      };
    });

    return {
      statistics: {
        totalProducts,
        availableProducts,
        outOfStockProducts,
        totalOrders,
        waitingOrders,
        shippingOrders,
        completedOrders,
        totalRevenue: revenueResult._sum.totalAmount ?? BigInt(0),
      },
      wallet,
      recentOrders,
      orderStatusSummary: orderStatusCounts,
      revenueChart,
      orderChart,
      topProducts,
    };
  }

  async getSellerProducts(
    sellerId: number,
    page = 1,
    limit = 10,
    keyword?: string,
    categoryId?: number,
    status?: ProductStatus,
  ) {
    const where = {
      sellerId,
      deletedAt: null,
      ...(keyword && {
        name: { contains: keyword, mode: 'insensitive' as const },
      }),
      ...(categoryId && { categoryId }),
      ...(status && { status }),
    };
    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { category: true, images: true },
      }),
      this.prisma.product.count({ where }),
    ]);
    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSellerOrders(
    sellerId: number,
    page = 1,
    limit = 10,
    status?: OrderStatus,
    keyword?: string,
  ) {
    const where = {
      sellerId,
      ...(status && { status }),
      ...(keyword && {
        OR: [
          { receiverName: { contains: keyword, mode: 'insensitive' as const } },
          { receiverPhone: { contains: keyword } },
        ],
      }),
    };
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          buyer: { include: { user: true } },
          orderItems: { include: { product: { include: { images: true } } } },
          shipment: true,
          payments: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);
    const statistics = await this.prisma.order.groupBy({
      by: ['status'],
      where: { sellerId },
      _count: true,
    });
    return {
      items,
      statistics,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSellerSettings(sellerId: number) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { sellerId },
      include: {
        user: {
          select: {
            userId: true,
            nickname: true,
            email: true,
            phone: true,
            role: true,
            status: true,
          },
        },
        bankAccounts: { orderBy: { isPrimary: 'desc' } },
        wallet: true,
      },
    });
    if (!seller) throw new NotFoundException('Người bán không tồn tại');
    return seller;
  }

  async updateSellerSettings(sellerId: number, dto: UpdateSellerSettingsDto) {
    await this.getSellerSettings(sellerId);

    return this.prisma.sellerProfile.update({
      where: { sellerId },
      data: {
        ...(dto.storeName !== undefined && { storeName: dto.storeName }),
        ...(dto.storeDescription !== undefined && {
          storeDescription: dto.storeDescription,
        }),
      },
      include: {
        user: {
          select: {
            userId: true,
            nickname: true,
            email: true,
            phone: true,
            role: true,
            status: true,
          },
        },
        bankAccounts: { orderBy: { isPrimary: 'desc' } },
        wallet: true,
      },
    });
  }

  async sellerWithdraw(sellerId: number, dto: SellerWithdrawDto) {
    const MIN_WITHDRAWAL = BigInt(10_000);
    const amount = BigInt(dto.amount);

    if (amount < MIN_WITHDRAWAL) {
      throw new BadRequestException('Số tiền rút tối thiểu là 10.000₫');
    }

    const bankAccount = await this.prisma.sellerBankAccount.findUnique({
      where: { bankAccountId: dto.bankAccountId },
    });
    if (!bankAccount || bankAccount.sellerId !== sellerId) {
      throw new ForbiddenException('Tài khoản ngân hàng không hợp lệ');
    }

    const pendingWithdrawal = await this.prisma.withdrawalRequest.findFirst({
      where: {
        sellerId,
        status: { in: ['PENDING', 'PROCESSING'] },
      },
    });
    if (pendingWithdrawal) {
      throw new ConflictException(
        'Bạn đang có yêu cầu rút tiền đang được xử lý. Vui lòng chờ hoàn tất trước khi tạo yêu cầu mới.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const wallets = await tx.$queryRaw<
        { available_balance: bigint; withdrawing_balance: bigint }[]
      >`
        SELECT available_balance, withdrawing_balance
        FROM seller_wallets
        WHERE seller_id = ${sellerId}
        FOR UPDATE
      `;

      if (!wallets.length) {
        throw new NotFoundException('Ví người bán không tồn tại');
      }

      const availableBefore = wallets[0].available_balance;
      const withdrawingBefore = wallets[0].withdrawing_balance;

      if (availableBefore < amount) {
        throw new BadRequestException(
          `Số dư khả dụng không đủ. Hiện có: ${availableBefore.toLocaleString('vi-VN')}₫`,
        );
      }

      const withdrawal = await tx.withdrawalRequest.create({
        data: {
          sellerId,
          bankAccountId: dto.bankAccountId,
          amount,
          status: 'PENDING',
        },
      });

      await tx.sellerWallet.update({
        where: { sellerId },
        data: {
          availableBalance: { decrement: amount },
          withdrawingBalance: { increment: amount },
        },
      });

      const idempotencyKey = `withdraw_${withdrawal.withdrawalId}`;
      const journal = await tx.walletJournal.create({
        data: {
          sellerId,
          txnType: 'WITHDRAWAL_REQUESTED',
          totalAmount: amount,
          idempotencyKey,
          refWithdrawalId: withdrawal.withdrawalId,
          notes: `Yêu cầu rút tiền đến ${bankAccount.bankName} - ${bankAccount.accountNumber}`,
        },
      });

      await tx.walletTransaction.createMany({
        data: [
          {
            txnType: 'WITHDRAWAL_REQUESTED',
            sellerId,
            journalId: journal.journalId,
            affectedBalance: 'AVAILABLE',
            delta: -amount,
            balanceBefore: availableBefore,
            balanceAfter: availableBefore - amount,
            refWithdrawalId: withdrawal.withdrawalId,
          },
          {
            txnType: 'WITHDRAWAL_REQUESTED',
            sellerId,
            journalId: journal.journalId,
            affectedBalance: 'WITHDRAWING',
            delta: amount,
            balanceBefore: withdrawingBefore,
            balanceAfter: withdrawingBefore + amount,
            refWithdrawalId: withdrawal.withdrawalId,
          },
        ],
      });

      return withdrawal;
    });
  }

  async addSellerBankAccount(
    sellerId: number,
    dto: CreateSellerBankAccountDto,
  ) {
    // Kiểm tra seller tồn tại
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { sellerId },
    });
    if (!seller) throw new NotFoundException('Người bán không tồn tại');

    const existingCount = await this.prisma.sellerBankAccount.count({
      where: { sellerId },
    });

    const shouldBePrimary = dto.isPrimary || existingCount === 0;

    if (shouldBePrimary && existingCount > 0) {
      await this.prisma.sellerBankAccount.updateMany({
        where: { sellerId },
        data: { isPrimary: false },
      });
    }

    return this.prisma.sellerBankAccount.create({
      data: {
        sellerId,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        accountName: dto.accountName,
        isPrimary: shouldBePrimary,
      },
    });
  }

  async updateSellerBankAccount(
    sellerId: number,
    bankAccountId: number,
    dto: UpdateSellerBankAccountDto,
  ) {
    const account = await this.prisma.sellerBankAccount.findUnique({
      where: { bankAccountId },
    });

    if (!account || account.sellerId !== sellerId) {
      throw new ForbiddenException('Không có quyền chỉnh sửa tài khoản này');
    }

    if (dto.isPrimary === false && account.isPrimary) {
      const count = await this.prisma.sellerBankAccount.count({
        where: { sellerId },
      });
      if (count === 1) {
        throw new BadRequestException(
          'Không thể bỏ mặc định tài khoản ngân hàng duy nhất',
        );
      }
    }

    if (dto.isPrimary === true && !account.isPrimary) {
      await this.prisma.sellerBankAccount.updateMany({
        where: { sellerId, bankAccountId: { not: bankAccountId } },
        data: { isPrimary: false },
      });
    }

    return this.prisma.sellerBankAccount.update({
      where: { bankAccountId },
      data: {
        ...(dto.bankName !== undefined && { bankName: dto.bankName }),
        ...(dto.accountNumber !== undefined && {
          accountNumber: dto.accountNumber,
        }),
        ...(dto.accountName !== undefined && { accountName: dto.accountName }),
        ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
      },
    });
  }

  async deleteSellerBankAccount(sellerId: number, bankAccountId: number) {
    const account = await this.prisma.sellerBankAccount.findUnique({
      where: { bankAccountId },
    });

    if (!account || account.sellerId !== sellerId) {
      throw new ForbiddenException('Không có quyền xóa tài khoản này');
    }

    const activeWithdrawal = await this.prisma.withdrawalRequest.findFirst({
      where: {
        bankAccountId,
        status: { in: ['PENDING', 'PROCESSING'] },
      },
    });
    if (activeWithdrawal) {
      throw new ConflictException(
        'Không thể xóa tài khoản đang có yêu cầu rút tiền đang xử lý',
      );
    }

    if (account.isPrimary) {
      const count = await this.prisma.sellerBankAccount.count({
        where: { sellerId },
      });
      if (count > 1) {
        throw new BadRequestException(
          'Vui lòng đặt tài khoản khác làm mặc định trước khi xóa tài khoản này',
        );
      }
    }

    await this.prisma.sellerBankAccount.delete({
      where: { bankAccountId },
    });

    return { message: 'Xóa tài khoản ngân hàng thành công' };
  }
}
