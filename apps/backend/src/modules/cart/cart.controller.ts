import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { CartService } from './cart.service';
import { CartDto, DeleteCartItemDto } from './dto';

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

  @Post()
  async addToCart(@Request() req: any, @Body() dto: CartDto) {
    const user: AuthUser | undefined = req.user;
    if (!user) {
      return this.service.getProductForCart(dto.productId);
    }
    return this.service.addToCart(user.buyerId!, dto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateItem(@CurrentUser() user: AuthUser, @Body() dto: CartDto) {
    return this.service.updateCartItem(user.buyerId!, dto);
  }

  @Delete('items')
  @UseGuards(JwtAuthGuard)
  removeItem(@CurrentUser() user: AuthUser, @Body() dto: DeleteCartItemDto) {
    return this.service.removeFromCart(user.buyerId!, dto.itemId);
  }
}
