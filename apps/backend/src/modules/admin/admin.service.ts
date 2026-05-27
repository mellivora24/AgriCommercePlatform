import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(filters?: { role?: string; status?: string }) {
    return this.prisma.user.findMany({
      where: {
        role: filters?.role as any,
        status: filters?.status as any,
      },
      include: {
        buyerProfile: true,
        sellerProfile: true,
        shipperProfile: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserDetails(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
      include: {
        buyerProfile: true,
        sellerProfile: { include: { products: true, bankAccounts: true } },
        shipperProfile: true,
        adminProfile: true,
      },
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    return user;
  }

  async getAllSellers(filters?: { status?: string }) {
    return this.prisma.sellerProfile.findMany({
      where: {
        status: filters?.status as any,
      },
      include: {
        user: true,
        products: true,
        wallet: true,
      },
      orderBy: { createdAt: 'desc' },
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

  async suspendUser(userId: number) {
    return this.prisma.user.update({
      where: { userId },
      data: { status: 'SUSPENDED' },
    });
  }

  async banUser(userId: number) {
    return this.prisma.user.update({
      where: { userId },
      data: { status: 'BANNED' },
    });
  }

  async getAllOrders(filters?: { status?: string; sellerId?: number }) {
    return this.prisma.order.findMany({
      where: {
        status: filters?.status as any,
        sellerId: filters?.sellerId,
      },
      include: {
        buyer: { select: { fullName: true } },
        seller: { select: { storeName: true } },
        orderItems: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderDetails(orderId: number) {
    return this.prisma.order.findUnique({
      where: { orderId },
      include: {
        buyer: true,
        seller: true,
        orderItems: { include: { product: true } },
        payments: true,
        shipment: true,
        returnRequests: true,
      },
    });
  }

  async getWithdrawalRequests(filters?: { status?: string }) {
    return this.prisma.withdrawalRequest.findMany({
      where: { status: filters?.status as any },
      include: { seller: { select: { storeName: true } }, bankAccount: true },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async getPlatformStats() {
    const totalUsers = await this.prisma.user.count();
    const totalSellers = await this.prisma.sellerProfile.count();
    const totalOrders = await this.prisma.order.count();
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
    });

    const recentOrders = await this.prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    const pendingSellers = await this.prisma.sellerProfile.count({
      where: { status: 'PENDING' },
    });

    return {
      totalUsers,
      totalSellers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingSellers,
      recentOrders,
    };
  }

  async getSellerStats(sellerId: number) {
    const orders = await this.prisma.order.findMany({
      where: { sellerId },
    });

    const products = await this.prisma.product.findMany({
      where: { sellerId },
    });

    return {
      totalOrders: orders.length,
      totalProducts: products.length,
      completedOrders: orders.filter((o) => o.status === 'COMPLETED').length,
      revenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
    };
  }

  async createAdmin(userId: number, role: string) {
    return this.prisma.adminProfile.create({
      data: {
        userId,
        role: role as any,
      },
    });
  }
}
