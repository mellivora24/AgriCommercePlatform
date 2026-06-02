import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { OrderStatus, ProductStatus } from '@prisma/client';
import { SellersService } from './sellers.service';
import {
  UpdateSellerSettingsDto,
  SellerWithdrawDto,
  CreateSellerBankAccountDto,
  UpdateSellerBankAccountDto,
} from './dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly service: SellersService) {}

  private requireSeller(user: AuthUser): number {
    if (user.role !== 'SELLER' || !user.sellerId) {
      throw new ForbiddenException('Chỉ người bán mới được truy cập');
    }
    return Number(user.sellerId);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  getDashboard(@CurrentUser() user: AuthUser) {
    return this.service.getSellerDashboard(this.requireSeller(user));
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
    return this.service.getSellerProducts(
      this.requireSeller(user),
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
    return this.service.getSellerOrders(
      this.requireSeller(user),
      Number(page),
      Number(limit),
      status,
      keyword,
    );
  }

  @Get('settings')
  @UseGuards(JwtAuthGuard)
  getSettings(@CurrentUser() user: AuthUser) {
    return this.service.getSellerSettings(this.requireSeller(user));
  }

  @Patch('settings')
  @UseGuards(JwtAuthGuard)
  updateSettings(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateSellerSettingsDto,
  ) {
    return this.service.updateSellerSettings(this.requireSeller(user), dto);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  withdraw(@CurrentUser() user: AuthUser, @Body() dto: SellerWithdrawDto) {
    return this.service.sellerWithdraw(this.requireSeller(user), dto);
  }

  @Post('bank-accounts')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  addBankAccount(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSellerBankAccountDto,
  ) {
    return this.service.addSellerBankAccount(this.requireSeller(user), dto);
  }

  @Patch('bank-accounts/:id')
  @UseGuards(JwtAuthGuard)
  updateBankAccount(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) bankAccountId: number,
    @Body() dto: UpdateSellerBankAccountDto,
  ) {
    return this.service.updateSellerBankAccount(
      this.requireSeller(user),
      bankAccountId,
      dto,
    );
  }

  @Delete('bank-accounts/:id')
  @UseGuards(JwtAuthGuard)
  deleteBankAccount(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) bankAccountId: number,
  ) {
    return this.service.deleteSellerBankAccount(
      this.requireSeller(user),
      bankAccountId,
    );
  }
}
