import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@module/auth/guards/optional-jwt-auth.guard';
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
    if (!user.buyerId)
      throw new BadRequestException('Chỉ người mua mới có giỏ hàng');
    return this.service.getCart(user.buyerId);
  }

  @Get('total')
  @UseGuards(JwtAuthGuard)
  getTotal(@CurrentUser() user: AuthUser) {
    if (!user.buyerId)
      throw new BadRequestException('Chỉ người mua mới có giỏ hàng');
    return this.service.getCartTotal(user.buyerId);
  }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async addToCart(
    @CurrentUser() user: AuthUser | undefined,
    @Body() dto: CartDto,
  ) {
    if (!user) {
      return this.service.getProductForCart(dto.productId);
    }
    if (!user.buyerId)
      throw new BadRequestException('Chỉ người mua mới có giỏ hàng');
    return this.service.addToCart(user.buyerId, dto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateItem(@CurrentUser() user: AuthUser, @Body() dto: CartDto) {
    if (!user.buyerId)
      throw new BadRequestException('Chỉ người mua mới có giỏ hàng');
    return this.service.updateCartItem(user.buyerId, dto);
  }

  @Delete('items')
  @UseGuards(JwtAuthGuard)
  removeItem(@CurrentUser() user: AuthUser, @Body() dto: DeleteCartItemDto) {
    if (!user.buyerId)
      throw new BadRequestException('Chỉ người mua mới có giỏ hàng');
    return this.service.removeFromCart(user.buyerId, dto.itemId);
  }
}
