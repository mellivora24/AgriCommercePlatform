import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderDto) {
    return this.service.createOrder(user.buyerId!, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOrder(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOrder(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getBuyerOrders(@CurrentUser() user: AuthUser) {
    return this.service.getOrdersByBuyer(user.buyerId!);
  }

  @Get('seller/me')
  @UseGuards(JwtAuthGuard)
  getSellerOrders(@CurrentUser() user: AuthUser) {
    return this.service.getOrdersBySeller(user.sellerId!);
  }

  @Get('seller/stats')
  @UseGuards(JwtAuthGuard)
  getStats(@CurrentUser() user: AuthUser) {
    return this.service.getOrderStats(user.sellerId!);
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
}
