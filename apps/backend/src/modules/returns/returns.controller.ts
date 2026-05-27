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
import { ReturnsService } from './returns.service';
import {
  CreateReturnRequestDto,
  ApproveReturnDto,
  RejectReturnDto,
} from './dto';

@Controller('returns')
export class ReturnsController {
  constructor(private readonly service: ReturnsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createReturnRequest(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateReturnRequestDto,
  ) {
    return this.service.createReturnRequest(user.buyerId!, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getReturnRequest(@Param('id', ParseIntPipe) id: number) {
    return this.service.getReturnRequest(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getBuyerReturns(@CurrentUser() user: AuthUser) {
    return this.service.getBuyerReturnRequests(user.buyerId!);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  getOrderReturns(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.service.getOrderReturnRequests(orderId);
  }

  @Get('seller/me')
  @UseGuards(JwtAuthGuard)
  getSellerReturns(@CurrentUser() user: AuthUser) {
    return this.service.getSellerReturns(user.sellerId!);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard)
  approveReturn(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ApproveReturnDto,
  ) {
    return this.service.approveReturnRequest(id, dto);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard)
  rejectReturn(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectReturnDto,
  ) {
    return this.service.rejectReturnRequest(id, dto);
  }

  @Get('admin/pending')
  getPendingReturns() {
    return this.service.getPendingReturnRequests();
  }
}
