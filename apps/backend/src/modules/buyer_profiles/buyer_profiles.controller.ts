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
import { BuyerProfilesService } from './buyer_profiles.service';
import { CreateBuyerProfileDto, UpdateBuyerProfileDto } from './dto';

@Controller('buyer-profiles')
export class BuyerProfilesController {
  constructor(private readonly service: BuyerProfilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateBuyerProfileDto,
  ) {
    return this.service.createBuyerProfile(user.userId, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@CurrentUser() user: AuthUser) {
    return this.service.getBuyerProfileByUserId(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.service.getBuyerProfile(id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateBuyerProfileDto,
  ) {
    return this.service.updateBuyerProfile(user.buyerId!, dto);
  }

  @Get('me/orders')
  @UseGuards(JwtAuthGuard)
  getMyOrders(@CurrentUser() user: AuthUser) {
    return this.service.getOrderHistory(user.buyerId!);
  }

  @Get(':id/orders')
  @UseGuards(JwtAuthGuard)
  getOrderHistory(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOrderHistory(id);
  }
}
