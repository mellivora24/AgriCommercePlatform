import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(buyerId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { buyerId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { buyerId },
        include: { cartItems: { include: { product: true } } },
      });
    }

    return cart;
  }

  async addToCart(buyerId: number, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({
      where: { productId: dto.productId },
    });
    if (!product || product.status !== 'AVAILABLE')
      throw new BadRequestException('Sản phẩm không sẵn có');

    const cart = await this.getOrCreateCart(buyerId);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.cartId, productId: dto.productId },
      },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { cartItemId: existingItem.cartItemId },
        data: { quantity: existingItem.quantity + dto.quantity },
        include: { product: true },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.cartId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
      include: { product: true },
    });
  }

  async getCart(buyerId: number) {
    return this.getOrCreateCart(buyerId);
  }

  async updateCartItem(
    buyerId: number,
    itemId: number,
    dto: UpdateCartItemDto,
  ) {
    const item = await this.prisma.cartItem.findUnique({
      where: { cartItemId: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.buyerId !== buyerId)
      throw new NotFoundException('Không tìm thấy mục');

    if (dto.quantity <= 0) {
      return this.prisma.cartItem.delete({
        where: { cartItemId: itemId },
      });
    }

    return this.prisma.cartItem.update({
      where: { cartItemId: itemId },
      data: { quantity: dto.quantity },
      include: { product: true },
    });
  }

  async removeFromCart(buyerId: number, itemId: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { cartItemId: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.buyerId !== buyerId)
      throw new NotFoundException('Không tìm thấy mục');

    return this.prisma.cartItem.delete({
      where: { cartItemId: itemId },
    });
  }

  async clearCart(buyerId: number) {
    const cart = await this.getOrCreateCart(buyerId);
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.cartId },
    });
    return { message: 'Giỏ hàng đã được xóa' };
  }

  async getCartTotal(buyerId: number) {
    const cart = await this.getOrCreateCart(buyerId);
    const items = cart.cartItems || [];

    let total = 0;
    items.forEach((item) => {
      total += Number(item.product.price) * item.quantity;
    });

    return {
      cartId: cart.cartId,
      itemCount: items.length,
      total,
      items,
    };
  }

  async getProductForCart(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { productId },
      include: { images: true, seller: { select: { storeName: true } } },
    });

    if (!product || product.status !== 'AVAILABLE')
      throw new BadRequestException('Sản phẩm không sẵn có');

    return {
      product,
      message: 'Sản phẩm sẵn có. Vui lòng đăng nhập để thêm vào giỏ hàng hoặc tiếp tục mua hàng với guest',
    };
  }
}
