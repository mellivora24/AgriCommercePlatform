import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import { CartDto } from './dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(buyerId: number) {
    let cart = await this.prisma.cart.findUnique({
      where: { buyerId },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                images: true,
                seller: { select: { storeName: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { buyerId },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: true,
                  seller: { select: { storeName: true } },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  // Map về shape mà frontend expect
  private formatCart(cart: Awaited<ReturnType<typeof this.getOrCreateCart>>) {
    return {
      cartId: cart.cartId,
      items: cart.cartItems.map((item) => ({
        itemId: item.cartItemId, // ← frontend dùng itemId
        productId: item.productId,
        quantity: item.quantity,
        product: {
          productId: item.product.productId,
          name: item.product.name,
          price: item.product.price,
          stockQuantity: item.product.stockQuantity,
          images: item.product.images,
          seller: item.product.seller,
        },
      })),
    };
  }

  async getCart(buyerId: number) {
    const cart = await this.getOrCreateCart(buyerId);
    return this.formatCart(cart);
  }

  async addToCart(buyerId: number, dto: CartDto) {
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
      await this.prisma.cartItem.update({
        where: { cartItemId: existingItem.cartItemId },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.cartId,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    const updated = await this.getOrCreateCart(buyerId);
    return this.formatCart(updated);
  }

  async updateCartItem(buyerId: number, dto: CartDto) {
    // dto.productId ở đây thực ra là productId, tìm item qua cartId + productId
    const cart = await this.getOrCreateCart(buyerId);

    const item = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.cartId, productId: dto.productId },
      },
    });

    if (!item) throw new NotFoundException('Không tìm thấy mục');

    if (dto.quantity <= 0) {
      await this.prisma.cartItem.delete({
        where: { cartItemId: item.cartItemId },
      });
    } else {
      await this.prisma.cartItem.update({
        where: { cartItemId: item.cartItemId },
        data: { quantity: dto.quantity },
      });
    }

    const updated = await this.getOrCreateCart(buyerId);
    return this.formatCart(updated);
  }

  async removeFromCart(buyerId: number, itemId: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { cartItemId: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.buyerId !== buyerId)
      throw new NotFoundException('Không tìm thấy mục');

    await this.prisma.cartItem.delete({
      where: { cartItemId: itemId },
    });

    const updated = await this.getOrCreateCart(buyerId);
    return this.formatCart(updated);
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
    const total = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    return { cartId: cart.cartId, itemCount: items.length, total };
  }

  async getProductForCart(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { productId },
      include: { images: true, seller: { select: { storeName: true } } },
    });
    if (!product || product.status !== 'AVAILABLE')
      throw new BadRequestException('Sản phẩm không sẵn có');
    return { product, message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' };
  }
}
