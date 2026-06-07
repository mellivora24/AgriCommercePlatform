import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { OrdersService } from './orders.service';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  GetSellerOrdersDto,
} from './dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get('seller/stats')
  @UseGuards(JwtAuthGuard)
  getStats(@CurrentUser() user: AuthUser) {
    return this.service.getOrderStats(user.sellerId!);
  }

  @Get('seller/me')
  @UseGuards(JwtAuthGuard)
  getSellerOrders(
    @CurrentUser() user: AuthUser,
    @Query() dto: GetSellerOrdersDto,
  ) {
    return this.service.getOrdersBySeller(user.sellerId!, dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.service.createOrder(user.buyerId!, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getBuyerOrders(@CurrentUser() user: AuthUser) {
    return this.service.getOrdersByBuyer(user.buyerId!);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOrder(id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.service.updateOrderStatus(id, user.sellerId!, dto);
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard)
  confirmOrder(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.confirmOrder(id, user.sellerId!);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancelOrder(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.cancelOrder(id, user.sellerId!);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  completeOrder(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    // buyer confirms they've received the goods
    return this.service.completeOrder(id, user.buyerId!);
  }
}
