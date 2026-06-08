import type {
  AdminDashboardDTO,
  AdminUserDTO,
  AdminUserDetailDTO,
  AdminStoreDTO,
  AdminStoreDetailDTO,
  AdminProductDTO,
  AdminOrderSummaryDTO,
  AdminWithdrawalDTO,
  AdminShipperStatDTO,
} from "@/features/admin/data/dtos/admin.dto";
import type {
  DashboardStats,
  AdminUser,
  Store,
  StoreDetail,
  AdminProduct,
  OrderSummary,
  WithdrawalRequest,
  ShipperStat,
} from "@/features/admin/domain/entities/admin.entity";

const n = (v: string | undefined | null): number => Number(v ?? 0);

export const adminMapper = {
  toDashboard(dto: AdminDashboardDTO): DashboardStats {
    return {
      users: dto.users,
      orders: dto.orders,
      finance: {
        totalGmv: n(dto.finance.totalGmv),
        totalPlatformFee: n(dto.finance.totalPlatformFee),
        platformWallet: dto.finance.platformWallet
          ? {
              escrowBalance: n(dto.finance.platformWallet.escrowBalance),
              revenueBalance: n(dto.finance.platformWallet.revenueBalance),
              reserveBalance: n(dto.finance.platformWallet.reserveBalance),
            }
          : null,
      },
      pending: dto.pending,
      recentOrders: dto.recentOrders.map(adminMapper.toOrderSummary),
    };
  },

  toUser(dto: AdminUserDTO): AdminUser {
    return {
      userId: dto.userId,
      email: dto.email,
      nickname: dto.nickname,
      phone: dto.phone,
      role: dto.role,
      status: dto.status,
      createdAt: new Date(dto.createdAt),
      buyerProfile: dto.buyerProfile ?? null,
      sellerProfile: dto.sellerProfile ?? null,
      shipperProfile: dto.shipperProfile ?? null,
      adminProfile: dto.adminProfile ?? null,
    };
  },

  toUserDetail(dto: AdminUserDetailDTO): AdminUser {
    return {
      userId: dto.userId,
      email: dto.email,
      nickname: dto.nickname,
      phone: dto.phone,
      role: dto.role,
      status: dto.status,
      createdAt: new Date(dto.createdAt),
      buyerProfile: dto.buyerProfile
        ? {
            fullName: dto.buyerProfile.fullName,
            avatarUrl: dto.buyerProfile.avatarUrl,
            orderCount: dto.buyerProfile._count.orders,
          }
        : null,
      sellerProfile: dto.sellerProfile
        ? {
            sellerId: dto.sellerProfile.sellerId,
            storeName: dto.sellerProfile.storeName,
            status: dto.sellerProfile.status,
            wallet: dto.sellerProfile.wallet
              ? {
                  pendingBalance: n(dto.sellerProfile.wallet.pendingBalance),
                  availableBalance: n(
                    dto.sellerProfile.wallet.availableBalance,
                  ),
                  reservedBalance: n(dto.sellerProfile.wallet.reservedBalance),
                  withdrawingBalance: n(
                    dto.sellerProfile.wallet.withdrawingBalance,
                  ),
                  onHoldBalance: n(dto.sellerProfile.wallet.onHoldBalance),
                  lifetimeEarned: n(dto.sellerProfile.wallet.lifetimeEarned),
                  lifetimeWithdrawn: n(
                    dto.sellerProfile.wallet.lifetimeWithdrawn,
                  ),
                }
              : null,
            productCount: dto.sellerProfile._count.products,
            orderCount: dto.sellerProfile._count.orders,
          }
        : null,
      shipperProfile: dto.shipperProfile ?? null,
      adminProfile: dto.adminProfile ?? null,
    };
  },

  toStore(dto: AdminStoreDTO): Store {
    return {
      sellerId: dto.sellerId,
      storeName: dto.storeName,
      storeDescription: dto.storeDescription,
      platformFeeRate: Number(dto.platformFeeRate),
      status: dto.status,
      createdAt: new Date(dto.createdAt),
      user: { ...dto.user, createdAt: new Date(dto.user.createdAt) },
      wallet: dto.wallet
        ? {
            pendingBalance: n(dto.wallet.pendingBalance),
            availableBalance: n(dto.wallet.availableBalance),
            reservedBalance: n(dto.wallet.reservedBalance),
            withdrawingBalance: n(dto.wallet.withdrawingBalance),
            onHoldBalance: n(dto.wallet.onHoldBalance),
            lifetimeEarned: n(dto.wallet.lifetimeEarned),
            lifetimeWithdrawn: n(dto.wallet.lifetimeWithdrawn),
          }
        : null,
      counts: dto._count,
      orderStats: {
        totalRevenue: n(dto.orderStats.totalRevenue),
        platformFeeEarned: n(dto.orderStats.platformFeeEarned),
        totalOrders: dto.orderStats.totalOrders,
        completedOrders: dto.orderStats.completedOrders,
        cancelledOrders: dto.orderStats.cancelledOrders,
      },
    };
  },

  toStoreDetail(dto: AdminStoreDetailDTO): StoreDetail {
    const base = adminMapper.toStore({
      ...dto,
      orderStats: {
        totalRevenue: "0",
        platformFeeEarned: "0",
        totalOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
      },
    });
    return {
      ...base,
      bankAccounts: dto.bankAccounts,
      orderSummary: {
        totalRevenue: n(dto.orderSummary.totalRevenue),
        platformFeeEarned: n(dto.orderSummary.platformFeeEarned),
        byStatus: dto.orderSummary.byStatus.map((s) => ({
          ...s,
          revenue: n(s.revenue),
        })),
      },
    };
  },

  toProduct(dto: AdminProductDTO): AdminProduct {
    return {
      productId: dto.productId,
      name: dto.name,
      description: dto.description,
      price: n(dto.price),
      stockQuantity: dto.stockQuantity,
      status: dto.status,
      createdAt: new Date(dto.createdAt),
      seller: dto.seller,
      category: dto.category,
      images: dto.images,
      soldCount: dto._count.orderItems,
    };
  },

  toOrderSummary(dto: AdminOrderSummaryDTO): OrderSummary {
    return {
      orderId: dto.orderId,
      totalAmount: n(dto.totalAmount),
      platformFee: n(dto.platformFee),
      sellerAmount: dto.sellerAmount != null ? n(dto.sellerAmount) : null,
      paymentMethod: dto.paymentMethod,
      shippingFee: n(dto.shippingFee),
      status: dto.status,
      receiverName: dto.receiverName,
      receiverPhone: dto.receiverPhone,
      shippingAddress: dto.shippingAddress,
      createdAt: new Date(dto.createdAt),
      buyer: dto.buyer,
      seller: dto.seller,
      payments: dto.payments?.map((p) => ({ ...p, amount: n(p.amount) })),
      shipment: dto.shipment,
      orderItems: dto.orderItems?.map((i) => ({
        orderItemId: i.orderItemId,
        quantity: i.quantity,
        unitPrice: n(i.unitPrice),
        product: i.product,
      })),
    };
  },

  toWithdrawal(dto: AdminWithdrawalDTO): WithdrawalRequest {
    return {
      withdrawalId: dto.withdrawalId,
      sellerId: dto.sellerId,
      amount: n(dto.amount),
      withdrawalFee: n(dto.withdrawalFee),
      netPayout: dto.netPayout != null ? n(dto.netPayout) : null,
      status: dto.status,
      transferReference: dto.transferReference,
      failureReason: dto.failureReason,
      retryCount: dto.retryCount,
      requestedAt: new Date(dto.requestedAt),
      processedAt: dto.processedAt ? new Date(dto.processedAt) : null,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
      bankAccount: dto.bankAccount,
    };
  },
  toShipperStat(dto: AdminShipperStatDTO): ShipperStat {
    return { ...dto };
  },
};
