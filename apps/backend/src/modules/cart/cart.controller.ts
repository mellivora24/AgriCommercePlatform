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
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getCart(@CurrentUser() user: AuthUser) {
    return this.service.getCart(user.buyerId!);
  }

  @Get('total')
  @UseGuards(JwtAuthGuard)
  getTotal(@CurrentUser() user: AuthUser) {
    return this.service.getCartTotal(user.buyerId!);
  }

  @Post('items')
  async addToCart(@Request() req: any, @Body() dto: AddToCartDto) {
    const user: AuthUser | undefined = req.user;
    // Cho phép guest users thêm vào giỏ hàng
    // Nếu user chưa đăng nhập, frontend sẽ lưu ở localStorage
    // Nếu user đã đăng nhập, lưu vào database
    if (!user) {
      // Guest user - trả về product info cho frontend xử lý
      return this.service.getProductForCart(dto.productId);
    }
    return this.service.addToCart(user.buyerId!, dto);
  }

  @Put('items/:itemId')
  @UseGuards(JwtAuthGuard)
  updateItem(
    @CurrentUser() user: AuthUser,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.service.updateCartItem(user.buyerId!, itemId, dto);
  }

  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard)
  removeItem(
    @CurrentUser() user: AuthUser,
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.service.removeFromCart(user.buyerId!, itemId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  clearCart(@CurrentUser() user: AuthUser) {
    return this.service.clearCart(user.buyerId!);
  }
}
