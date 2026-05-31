import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from './dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getPayment(@Param('id', ParseIntPipe) id: number) {
    return this.service.getPayment(id);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  getOrderPayment(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.service.getOrderPayment(orderId);
  }

  @Put(':id/confirm')
  @UseGuards(JwtAuthGuard)
  confirmPayment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConfirmPaymentDto,
  ) {
    return this.service.confirmPayment(id, dto);
  }

  @Get('order/:orderId/list')
  @UseGuards(JwtAuthGuard)
  getPaymentsByOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.service.getPaymentsByOrder(orderId);
  }

  @Put(':id/refund')
  @UseGuards(JwtAuthGuard)
  refundPayment(@Param('id', ParseIntPipe) id: number) {
    return this.service.refundPayment(id);
  }

  @Get('pending/all')
  @UseGuards(JwtAuthGuard)
  getPendingPayments() {
    return this.service.getPendingPayments();
  }

  @Get('cod/confirmation')
  @UseGuards(JwtAuthGuard)
  getCODConfirmations() {
    return this.service.getCODPaymentsForConfirmation();
  }

  @Post('webhook/:provider')
  recordPaymentEvent(@Param('provider') provider: string, @Body() body: any) {
    return this.service.recordPaymentEvent(provider, body);
  }
}
