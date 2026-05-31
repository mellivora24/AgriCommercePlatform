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
import { WalletService } from './wallet.service';
import { WithdrawDto, WithdrawalConfirmDto } from './dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getWallet(@CurrentUser() user: AuthUser) {
    return this.service.getSellerWallet(user.sellerId!);
  }

  @Get('journals')
  @UseGuards(JwtAuthGuard)
  getJournals(@CurrentUser() user: AuthUser) {
    return this.service.getWalletJournals(user.sellerId!);
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  getTransactions(@CurrentUser() user: AuthUser) {
    return this.service.getWalletTransactions(user.sellerId!);
  }

  @Get('withdrawals')
  @UseGuards(JwtAuthGuard)
  getWithdrawals(@CurrentUser() user: AuthUser) {
    return this.service.getWithdrawalRequests(user.sellerId!);
  }

  @Get('withdrawals/:id')
  @UseGuards(JwtAuthGuard)
  getWithdrawal(@Param('id', ParseIntPipe) id: number) {
    return this.service.getWithdrawalRequest(id);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  requestWithdrawal(@CurrentUser() user: AuthUser, @Body() dto: WithdrawDto) {
    return this.service.requestWithdrawal(user.sellerId!, dto);
  }

  @Put('withdrawals/:id/confirm')
  @UseGuards(JwtAuthGuard)
  confirmWithdrawal(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: WithdrawalConfirmDto,
  ) {
    return this.service.confirmWithdrawal(id, dto);
  }

  @Post('orders/:orderId/release')
  @UseGuards(JwtAuthGuard)
  releaseOrderPayment(
    @CurrentUser() user: AuthUser,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return this.service.releaseOrderPayment(orderId, user.sellerId!);
  }

  @Get('platform/balance')
  getPlatformBalance() {
    return this.service.getPlatformWallet();
  }
}
