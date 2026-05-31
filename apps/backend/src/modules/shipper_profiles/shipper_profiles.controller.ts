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
import { ShipperProfilesService } from './shipper_profiles.service';
import { UpdateShipperStatusDto } from './dto';

@Controller('shipper-profiles')
export class ShipperProfilesController {
  constructor(private readonly service: ShipperProfilesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createProfile(@CurrentUser() user: AuthUser) {
    return this.service.createShipperProfile(user.userId);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@CurrentUser() user: AuthUser) {
    return this.service.getShipperProfileByUserId(user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.service.getShipperProfile(id);
  }

  @Put('me/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateShipperStatusDto,
  ) {
    return this.service.updateShipperStatus(user.shipperId!, dto);
  }

  @Get('me/shipments')
  @UseGuards(JwtAuthGuard)
  getMyShipments(@CurrentUser() user: AuthUser) {
    return this.service.getShipperShipments(user.shipperId!);
  }

  @Get('available/list')
  getAvailableShippers() {
    return this.service.getAvailableShippers();
  }
}
