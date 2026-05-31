import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { SellersService } from './sellers.service';
import {
  CreateSellerDto,
  UpdateSellerDto,
  CreateSellerBankAccountDto,
  UpdateSellerBankAccountDto,
} from './dto';

@Controller('sellers')
export class SellersController {
  constructor(private readonly service: SellersService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  createProfile(@CurrentUser() user: AuthUser, @Body() dto: CreateSellerDto) {
    return this.service.createSellerProfile(user.userId, dto);
  }

  @Get(':sellerId')
  getProfile(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.service.getSellerProfile(sellerId);
  }

  @Put(':sellerId')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @Body() dto: UpdateSellerDto,
  ) {
    return this.service.updateSellerProfile(sellerId, dto);
  }

  @Post(':sellerId/bank-accounts')
  @UseGuards(JwtAuthGuard)
  createBankAccount(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @Body() dto: CreateSellerBankAccountDto,
  ) {
    return this.service.createBankAccount(sellerId, dto);
  }

  @Get(':sellerId/bank-accounts')
  getBankAccounts(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.service.getBankAccounts(sellerId);
  }

  @Put(':sellerId/bank-accounts/:accountId')
  @UseGuards(JwtAuthGuard)
  updateBankAccount(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body() dto: UpdateSellerBankAccountDto,
  ) {
    return this.service.updateBankAccount(accountId, sellerId, dto);
  }

  @Delete(':sellerId/bank-accounts/:accountId')
  @UseGuards(JwtAuthGuard)
  deleteBankAccount(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @Param('accountId', ParseIntPipe) accountId: number,
  ) {
    return this.service.deleteBankAccount(accountId, sellerId);
  }

  @Get(':sellerId/wallet')
  getWallet(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.service.getSellerWallet(sellerId);
  }

  @Post(':sellerId/approve')
  approve(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.service.approveSeller(sellerId);
  }

  @Post(':sellerId/reject')
  reject(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.service.rejectSeller(sellerId);
  }

  @Post(':sellerId/suspend')
  suspend(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.service.suspendSeller(sellerId);
  }
}
