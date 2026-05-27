import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import {
  CreateReturnRequestDto,
  ApproveReturnDto,
  RejectReturnDto,
} from './dto';

@Injectable()
export class ReturnsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReturnRequest(buyerId: number, dto: CreateReturnRequestDto) {
    const order = await this.prisma.order.findUnique({
      where: { orderId: dto.orderId },
      include: { buyer: true },
    });

    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    if (order.buyerId !== buyerId)
      throw new BadRequestException('Không có quyền');

    if (!['DELIVERED', 'COMPLETED'].includes(order.status))
      throw new BadRequestException('Chỉ được phép trả lại đơn hàng đã giao');

    const returnRequest = await this.prisma.returnRequest.create({
      data: {
        orderId: dto.orderId,
        buyerId,
        reason: dto.reason,
        refundAmount: dto.refundAmount ? BigInt(dto.refundAmount) : null,
      },
    });

    // Update order status
    await this.prisma.order.update({
      where: { orderId: dto.orderId },
      data: { status: 'RETURN_REQUESTED' },
    });

    return returnRequest;
  }

  async getReturnRequest(returnId: number) {
    const returnRequest = await this.prisma.returnRequest.findUnique({
      where: { returnId },
      include: { order: true, buyer: true },
    });
    if (!returnRequest)
      throw new NotFoundException('Yêu cầu trả hàng không tồn tại');
    return returnRequest;
  }

  async getBuyerReturnRequests(buyerId: number) {
    return this.prisma.returnRequest.findMany({
      where: { buyerId },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderReturnRequests(orderId: number) {
    return this.prisma.returnRequest.findMany({
      where: { orderId },
      include: { order: true, buyer: true },
    });
  }

  async approveReturnRequest(returnId: number, dto: ApproveReturnDto) {
    const returnRequest = await this.getReturnRequest(returnId);

    if (returnRequest.status !== 'REQUESTED')
      throw new BadRequestException('Chỉ có thể phê duyệt yêu cầu đang chờ');

    const refundAmount =
      dto.refundAmount ||
      Number(returnRequest.refundAmount || returnRequest.order.totalAmount);

    const updated = await this.prisma.returnRequest.update({
      where: { returnId },
      data: {
        status: 'APPROVED',
        adminNote: dto.adminNote,
        refundAmount: BigInt(refundAmount),
      },
    });

    // Update order
    await this.prisma.order.update({
      where: { orderId: returnRequest.orderId },
      data: { status: 'REFUNDED' },
    });

    // Create wallet journal for seller
    await this.prisma.walletJournal.create({
      data: {
        sellerId: returnRequest.order.sellerId,
        txnType: 'ORDER_REFUNDED',
        totalAmount: BigInt(refundAmount),
        idempotencyKey: `return_${returnId}_${Date.now()}`,
        refOrderId: returnRequest.orderId,
      },
    });

    return updated;
  }

  async rejectReturnRequest(returnId: number, dto: RejectReturnDto) {
    const returnRequest = await this.getReturnRequest(returnId);

    if (returnRequest.status !== 'REQUESTED')
      throw new BadRequestException('Chỉ có thể từ chối yêu cầu đang chờ');

    return this.prisma.returnRequest.update({
      where: { returnId },
      data: {
        status: 'REJECTED',
        adminNote: dto.adminNote,
      },
    });
  }

  async getPendingReturnRequests() {
    return this.prisma.returnRequest.findMany({
      where: { status: 'REQUESTED' },
      include: { order: true, buyer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSellerReturns(sellerId: number) {
    return this.prisma.returnRequest.findMany({
      where: { order: { sellerId } },
      include: { order: true, buyer: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
