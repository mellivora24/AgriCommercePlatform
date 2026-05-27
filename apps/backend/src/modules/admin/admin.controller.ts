import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('users')
  getAllUsers(@Query('role') role?: string, @Query('status') status?: string) {
    return this.service.getAllUsers({ role, status });
  }

  @Get('users/:id')
  getUserDetails(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUserDetails(id);
  }

  @Get('sellers')
  getAllSellers(@Query('status') status?: string) {
    return this.service.getAllSellers({ status });
  }

  @Post('sellers/:id/approve')
  approveSeller(@Param('id', ParseIntPipe) id: number) {
    return this.service.approveSeller(id);
  }

  @Post('sellers/:id/reject')
  rejectSeller(@Param('id', ParseIntPipe) id: number) {
    return this.service.rejectSeller(id);
  }

  @Post('users/:id/suspend')
  suspendUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.suspendUser(id);
  }

  @Post('users/:id/ban')
  banUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.banUser(id);
  }

  @Get('orders')
  getAllOrders(
    @Query('status') status?: string,
    @Query('sellerId') sellerId?: string,
  ) {
    return this.service.getAllOrders({
      status,
      sellerId: sellerId ? parseInt(sellerId) : undefined,
    });
  }

  @Get('orders/:id')
  getOrderDetails(@Param('id', ParseIntPipe) id: number) {
    return this.service.getOrderDetails(id);
  }

  @Get('withdrawals')
  getWithdrawals(@Query('status') status?: string) {
    return this.service.getWithdrawalRequests({ status });
  }

  @Get('stats')
  getPlatformStats() {
    return this.service.getPlatformStats();
  }

  @Get('sellers/:id/stats')
  getSellerStats(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSellerStats(id);
  }

  @Post(':userId/admins')
  createAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { role: string },
  ) {
    return this.service.createAdmin(userId, body.role);
  }
}
