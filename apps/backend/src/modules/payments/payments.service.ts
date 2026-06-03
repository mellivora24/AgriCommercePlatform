import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { ConfirmPaymentDto } from './dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPayment(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { paymentId },
      include: { order: true },
    });
    if (!payment) throw new NotFoundException('Thanh toán không tồn tại');
    return payment;
  }

  async getOrderPayment(orderId: number) {
    const payment = await this.prisma.payment.findFirst({
      where: { orderId },
      include: { order: true },
    });
    if (!payment) throw new NotFoundException('Thanh toán không tồn tại');
    return payment;
  }

  async confirmPayment(paymentId: number, dto: ConfirmPaymentDto) {
    const payment = await this.getPayment(paymentId);

    if (payment.status === 'PAID')
      throw new BadRequestException('Thanh toán đã được xác nhận');

    const updated = await this.prisma.payment.update({
      where: { paymentId },
      data: {
        status: 'PAID',
        transactionId: dto.transactionId,
      },
    });

    // Update order status
    await this.prisma.order.update({
      where: { orderId: payment.orderId },
      data: { status: 'PAID' },
    });

    // Record platform transaction
    await this.prisma.platformTransaction.create({
      data: {
        txnType: 'ESCROW_IN',
        amount: payment.amount,
        refOrderId: payment.orderId,
        idempotencyKey: `payment_${paymentId}_${Date.now()}`,
      },
    });

    // Record seller wallet journal
    const order = await this.prisma.order.findUnique({
      where: { orderId: payment.orderId },
    });

    if (!order) throw new BadRequestException('Đơn hàng không tồn tại');

    await this.prisma.walletJournal.create({
      data: {
        sellerId: order.sellerId,
        txnType: 'ORDER_PENDING',
        totalAmount: order.totalAmount,
        idempotencyKey: `order_${order.orderId}_pending`,
        refOrderId: order.orderId,
      },
    });

    return updated;
  }

  async getPaymentsByOrder(orderId: number) {
    return this.prisma.payment.findMany({
      where: { orderId },
    });
  }

  async refundPayment(paymentId: number) {
    const payment = await this.getPayment(paymentId);

    if (payment.status === 'REFUNDED')
      throw new BadRequestException('Thanh toán đã được hoàn tiền');

    return this.prisma.payment.update({
      where: { paymentId },
      data: { status: 'REFUNDED' },
    });
  }

  async recordPaymentEvent(provider: string, event: any) {
    return this.prisma.paymentProviderEvent.create({
      data: {
        provider,
        providerEventId: event.id,
        eventType: event.type,
        orderId: event.orderId,
        rawPayload: event,
      },
    });
  }

  async getPendingPayments() {
    return this.prisma.payment.findMany({
      where: { status: 'PENDING' },
      include: { order: true },
    });
  }

  async getCODPaymentsForConfirmation() {
    return this.prisma.payment.findMany({
      where: {
        method: 'COD',
        status: 'WAITING_COD_COLLECTION',
      },
      include: { order: true },
    });
  }
}
