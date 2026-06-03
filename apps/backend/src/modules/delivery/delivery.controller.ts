import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { DeliveryService } from './delivery.service';
import { GetShipmentsQueryDto, UpdateShipmentStatusDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly service: DeliveryService) {}

  private requireShipper(user: AuthUser): number {
    if (user.role !== 'SHIPPER' || !user.shipperId) {
      console.log('Unauthorized access attempt by user:', user);
      throw new ForbiddenException('Chỉ shipper mới được truy cập');
    }
    return Number(user.shipperId);
  }

  @Get('shipments')
  getShipments(
    @CurrentUser() user: AuthUser,
    @Query() query: GetShipmentsQueryDto,
  ) {
    const shipperId = this.requireShipper(user);
    return this.service.getShipments(shipperId, query);
  }

  @Get('shipments/:id')
  getShipmentDetail(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const shipperId = this.requireShipper(user);
    return this.service.getShipmentDetail(shipperId, id);
  }

  @Post('shipments/:id/accept')
  acceptShipment(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const shipperId = this.requireShipper(user);
    return this.service.acceptShipment(shipperId, id);
  }

  @Patch('shipments/:id/status')
  updateShipmentStatus(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShipmentStatusDto,
  ) {
    const shipperId = this.requireShipper(user);
    return this.service.updateShipmentStatus(shipperId, id, dto.status);
  }
}
