import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { WithdrawDto, WithdrawalConfirmDto } from './dto';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getSellerWallet(sellerId: number) {
    const wallet = await this.prisma.sellerWallet.findUnique({
      where: { sellerId },
    });
    if (!wallet) throw new NotFoundException('Ví không tồn tại');
    return wallet;
  }

  async requestWithdrawal(sellerId: number, dto: WithdrawDto) {
    const wallet = await this.getSellerWallet(sellerId);

    if (wallet.availableBalance < dto.amount)
      throw new BadRequestException('Số dư không đủ');

    const bankAccount = await this.prisma.sellerBankAccount.findUnique({
      where: { bankAccountId: dto.bankAccountId },
    });

    if (!bankAccount || bankAccount.sellerId !== sellerId)
      throw new NotFoundException('Tài khoản ngân hàng không tồn tại');

    const WITHDRAWAL_FEE = Math.ceil(dto.amount * 0.01); // 1% fee

    const withdrawal = await this.prisma.withdrawalRequest.create({
      data: {
        sellerId,
        bankAccountId: dto.bankAccountId,
        amount: BigInt(dto.amount),
        withdrawalFee: BigInt(WITHDRAWAL_FEE),
        status: 'PENDING',
      },
      include: { seller: true, bankAccount: true },
    });

    // Update wallet - deduct from available
    await this.prisma.sellerWallet.update({
      where: { sellerId },
      data: {
        availableBalance: wallet.availableBalance - BigInt(dto.amount),
        withdrawingBalance: wallet.withdrawingBalance + BigInt(dto.amount),
      },
    });

    return withdrawal;
  }

  async getWithdrawalRequests(sellerId: number) {
    return this.prisma.withdrawalRequest.findMany({
      where: { sellerId },
      include: { bankAccount: true },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async getWithdrawalRequest(withdrawalId: number) {
    const withdrawal = await this.prisma.withdrawalRequest.findUnique({
      where: { withdrawalId },
      include: { bankAccount: true },
    });
    if (!withdrawal)
      throw new NotFoundException('Yêu cầu rút tiền không tồn tại');
    return withdrawal;
  }

  async confirmWithdrawal(withdrawalId: number, dto: WithdrawalConfirmDto) {
    const withdrawal = await this.getWithdrawalRequest(withdrawalId);

    if (withdrawal.status !== 'PENDING')
      throw new BadRequestException('Chỉ có thể xác nhận yêu cầu đang chờ');

    return this.prisma.withdrawalRequest.update({
      where: { withdrawalId },
      data: {
        status: dto.status as any,
        transferReference: dto.transferReference,
        failureReason: dto.failureReason,
        processedAt: new Date(),
        ...(dto.status === 'COMPLETED' && { completedAt: new Date() }),
      },
    });
  }

  async getWalletJournals(sellerId: number) {
    return this.prisma.walletJournal.findMany({
      where: { sellerId },
      include: { refOrder: true, refWithdrawal: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWalletTransactions(sellerId: number) {
    return this.prisma.walletTransaction.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async releaseOrderPayment(orderId: number, sellerId: number) {
    const order = await this.prisma.order.findUnique({
      where: { orderId },
    });

    if (!order || order.sellerId !== sellerId)
      throw new BadRequestException('Đơn hàng không tồn tại');

    const wallet = await this.getSellerWallet(sellerId);

    // Move from pending to available
    const releaseAmount = Number(order.totalAmount);

    const journal = await this.prisma.walletJournal.create({
      data: {
        sellerId,
        txnType: 'ORDER_RELEASED',
        totalAmount: BigInt(releaseAmount),
        idempotencyKey: `order_${orderId}_released`,
        refOrderId: orderId,
      },
    });

    await this.prisma.walletTransaction.create({
      data: {
        txnType: 'ORDER_RELEASED',
        sellerId,
        journalId: journal.journalId,
        affectedBalance: 'AVAILABLE',
        delta: BigInt(releaseAmount),
        balanceBefore: wallet.availableBalance,
        balanceAfter: wallet.availableBalance + BigInt(releaseAmount),
        refOrderId: orderId,
      },
    });

    return this.prisma.sellerWallet.update({
      where: { sellerId },
      data: {
        pendingBalance: Math.max(
          Number(wallet.pendingBalance - BigInt(releaseAmount)),
          0,
        ),
        availableBalance: wallet.availableBalance + BigInt(releaseAmount),
        lifetimeEarned: wallet.lifetimeEarned + BigInt(releaseAmount),
      },
    });
  }

  async getPlatformWallet() {
    return this.prisma.platformWallet.findUnique({
      where: { walletId: 1 },
    });
  }
}
