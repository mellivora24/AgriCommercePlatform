import {
  Controller,
  Get,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { OrderStatus, ProductStatus } from '@prisma/client';
import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(private readonly service: SellersService) {}

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  getDashboard(@CurrentUser() user: AuthUser) {
    if (user.role !== 'SELLER' || !user.sellerId) {
      throw new ForbiddenException('Chỉ người bán mới được truy cập');
    }

    return this.service.getSellerDashboard(Number(user.sellerId));
  }

  @Get('products')
  @UseGuards(JwtAuthGuard)
  getProducts(
    @CurrentUser() user: AuthUser,

    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('keyword') keyword?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: ProductStatus,
  ) {
    if (user.role !== 'SELLER' || !user.sellerId) {
      throw new ForbiddenException('Chỉ người bán mới được truy cập');
    }

    return this.service.getSellerProducts(
      user.sellerId,
      Number(page),
      Number(limit),
      keyword,
      categoryId ? Number(categoryId) : undefined,
      status,
    );
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  getOrders(
    @CurrentUser() user: AuthUser,

    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status') status?: OrderStatus,
    @Query('keyword') keyword?: string,
  ) {
    if (user.role !== 'SELLER' || !user.sellerId) {
      throw new ForbiddenException('Chỉ người bán mới được truy cập');
    }

    return this.service.getSellerOrders(
      user.sellerId,
      Number(page),
      Number(limit),
      status,
      keyword,
    );
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  getSettings(@CurrentUser() user: AuthUser) {
    if (user.role !== 'SELLER' || !user.sellerId) {
      throw new ForbiddenException('Chỉ người bán mới được truy cập');
    }

    return this.service.getSellerSettings(user.sellerId);
  }
}
