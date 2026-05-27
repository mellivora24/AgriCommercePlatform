import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import {
  CreateSellerDto,
  UpdateSellerDto,
  CreateSellerBankAccountDto,
  UpdateSellerBankAccountDto,
} from './dto';

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
}
