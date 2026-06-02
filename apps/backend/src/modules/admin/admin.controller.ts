import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import {
  AdminUserListQueryDto,
  AdminStoreListQueryDto,
  AdminStoreProductQueryDto,
  AdminStoreOrderQueryDto,
  AdminStoreWithdrawalQueryDto,
  AdminProductListQueryDto,
  RejectSellerDto,
  SuspendUserDto,
  BanUserDto,
  ApproveWithdrawalDto,
  RejectWithdrawalDto,
  UpdateStoreFeeDto,
  CreateAdminDto,
} from '@module/admin/dto';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('dashboard')
  getAdminDashboard() {
    return this.service.getAdminDashboard();
  }

  @Get('stores')
  getAdminStores(@Query() query: AdminStoreListQueryDto) {
    return this.service.getAdminStores(query);
  }

  @Get('stores/:id')
  getAdminStoreDetail(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAdminStoreDetail(id);
  }

  @Get('stores/:id/products')
  getAdminStoreProducts(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AdminStoreProductQueryDto,
  ) {
    return this.service.getAdminStoreProducts(id, query);
  }

  @Get('stores/:id/orders')
  getAdminStoreOrders(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AdminStoreOrderQueryDto,
  ) {
    return this.service.getAdminStoreOrders(id, query);
  }

  @Get('stores/:id/withdrawals')
  getAdminStoreWithdrawals(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: AdminStoreWithdrawalQueryDto,
  ) {
    return this.service.getAdminStoreWithdrawals(id, query);
  }

  @Post('stores/:id/approve')
  @HttpCode(HttpStatus.OK)
  approveSeller(@Param('id', ParseIntPipe) id: number) {
    return this.service.approveSeller(id);
  }

  @Post('stores/:id/reject')
  @HttpCode(HttpStatus.OK)
  rejectSeller(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RejectSellerDto,
  ) {
    return this.service.rejectSeller(id, body.reason);
  }

  @Post('stores/:id/suspend')
  @HttpCode(HttpStatus.OK)
  suspendSeller(@Param('id', ParseIntPipe) id: number) {
    return this.service.suspendSeller(id);
  }

  @Patch('stores/:id/fee')
  updateStoreFee(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStoreFeeDto,
  ) {
    return this.service.updateStoreFee(id, body);
  }

  @Get('products')
  getAdminProducts(@Query() query: AdminProductListQueryDto) {
    return this.service.getAdminProducts(query);
  }

  @Get('products/:id')
  getAdminProductDetail(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAdminProductDetail(id);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteProduct(id);
  }

  @Get('users')
  getAdminUsers(@Query() query: AdminUserListQueryDto) {
    return this.service.getAdminUsers(query);
  }

  @Get('users/:id')
  getAdminUserDetail(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAdminUserDetail(id);
  }

  @Post('users/:id/suspend')
  @HttpCode(HttpStatus.OK)
  suspendUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SuspendUserDto,
  ) {
    return this.service.suspendUser(id, body.reason);
  }

  @Post('users/:id/ban')
  @HttpCode(HttpStatus.OK)
  banUser(@Param('id', ParseIntPipe) id: number, @Body() body: BanUserDto) {
    return this.service.banUser(id, body.reason);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteUser(id);
  }

  @Post('withdrawals/:id/approve')
  @HttpCode(HttpStatus.OK)
  approveWithdrawal(
    @Param('id', ParseIntPipe) id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: ApproveWithdrawalDto,
  ) {
    return this.service.approveWithdrawal(id);
  }

  @Post('withdrawals/:id/reject')
  @HttpCode(HttpStatus.OK)
  rejectWithdrawal(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RejectWithdrawalDto,
  ) {
    return this.service.rejectWithdrawal(id, body.reason);
  }

  @Post('users/:userId/make-admin')
  createAdmin(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CreateAdminDto,
  ) {
    return this.service.createAdmin(userId, body.role);
  }
}
