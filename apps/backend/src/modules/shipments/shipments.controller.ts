import {
  Controller,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { ShipmentsService } from './shipments.service';
import { UpdateShipmentDto } from './dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly service: ShipmentsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getShipment(@Param('id', ParseIntPipe) id: number) {
    return this.service.getShipment(id);
  }

  @Get('order/:orderId')
  @UseGuards(JwtAuthGuard)
  getOrderShipment(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.service.getOrderShipment(orderId);
  }

  @Get('track/:trackingCode')
  trackShipment(@Param('trackingCode') trackingCode: string) {
    return this.service.trackShipment(trackingCode);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateShipment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateShipmentDto,
  ) {
    return this.service.updateShipment(id, dto);
  }

  @Get('shipper/me')
  @UseGuards(JwtAuthGuard)
  getMyShipments(@CurrentUser() user: AuthUser) {
    return this.service.getShipperShipments(user.shipperId!);
  }

  @Put(':id/status/:status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: any,
  ) {
    return this.service.updateStatus(id, status);
  }

  @Put(':id/assign/:shipperId')
  @UseGuards(JwtAuthGuard)
  assignShipper(
    @Param('id', ParseIntPipe) id: number,
    @Param('shipperId', ParseIntPipe) shipperId: number,
  ) {
    return this.service.assignShipper(id, shipperId);
  }
}
