import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@app-prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductImageDto,
} from './dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sellerId: number, dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        sellerId,
        name: dto.name,
        description: dto.description,
        price: BigInt(dto.price),
        stockQuantity: dto.stockQuantity,
        categoryId: dto.categoryId,
        status: 'HIDDEN',
      },
      include: { images: true },
    });
  }

  async findAll(filters?: {
    categoryId?: number;
    sellerId?: number;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await this.prisma.product.count({
      where: {
        status: 'AVAILABLE',
        categoryId: filters?.categoryId,
        sellerId: filters?.sellerId,
        deletedAt: null,
      },
    });

    const products = await this.prisma.product.findMany({
      where: {
        status: 'AVAILABLE',
        categoryId: filters?.categoryId,
        sellerId: filters?.sellerId,
        deletedAt: null,
      },
      include: {
        images: true,
        seller: {
          select: {
            sellerId: true,
            userId: true,
            storeName: true,
            storeDescription: true,
            platformFeeRate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        category: {
          select: {
            categoryId: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      items: products.map((p) => ({
        productId: p.productId,
        name: p.name,
        description: p.description,
        price: p.price.toString(),
        images: p.images.map((img) => ({
          imageUrl: img.imageUrl,
        })),
        category: {
          categoryId: p.category?.categoryId,
          name: p.category?.name,
          description: p.category?.description,
          createdAt: p.category?.createdAt,
          updatedAt: p.category?.updatedAt,
        },
        categoryId: p.categoryId,
        sellerId: p.sellerId,
        seller: {
          sellerId: p.seller.sellerId,
          userId: p.seller.userId,
          storeName: p.seller.storeName,
          storeDescription: p.seller.storeDescription,
          platformFeeRate: p.seller.platformFeeRate,
          createdAt: p.seller.createdAt,
          updatedAt: p.seller.updatedAt,
        },
        stockQuantity: p.stockQuantity,
        status: p.status,
        rating: 0,
        reviews: 0,
        sku: `SKU-${p.productId}`,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { productId: id, deletedAt: null },
      include: { images: true, seller: true, category: true },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    return product;
  }

  async update(id: number, sellerId: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (product.sellerId !== sellerId)
      throw new ForbiddenException('Không có quyền');

    return this.prisma.product.update({
      where: { productId: id },
      data: {
        ...dto,
        price: dto.price ? BigInt(dto.price) : undefined,
      },
      include: { images: true },
    });
  }

  async updateStatus(
    id: number,
    sellerId: number,
    status: 'HIDDEN' | 'AVAILABLE' | 'OUT_OF_STOCK',
  ) {
    const product = await this.findOne(id);
    if (product.sellerId !== sellerId)
      throw new ForbiddenException('Không có quyền');

    return this.prisma.product.update({
      where: { productId: id },
      data: { status },
    });
  }

  async addImage(id: number, sellerId: number, dto: CreateProductImageDto) {
    const product = await this.findOne(id);
    if (product.sellerId !== sellerId)
      throw new ForbiddenException('Không có quyền');

    return this.prisma.productImage.create({
      data: {
        productId: id,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async removeImage(imageId: number, sellerId: number) {
    const image = await this.prisma.productImage.findUnique({
      where: { imageId },
      include: { product: true },
    });
    if (!image) throw new NotFoundException('Ảnh không tồn tại');
    if (image.product.sellerId !== sellerId)
      throw new ForbiddenException('Không có quyền');

    return this.prisma.productImage.delete({
      where: { imageId },
    });
  }

  async remove(id: number, sellerId: number) {
    const product = await this.findOne(id);
    if (product.sellerId !== sellerId)
      throw new ForbiddenException('Không có quyền');

    return this.prisma.product.update({
      where: { productId: id },
      data: { deletedAt: new Date() },
    });
  }

  async getSellerProducts(sellerId: number) {
    return this.prisma.product.findMany({
      where: { sellerId, deletedAt: null },
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchProducts(query: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const total = await this.prisma.product.count({
      where: {
        status: 'AVAILABLE',
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
    });

    const products = await this.prisma.product.findMany({
      where: {
        status: 'AVAILABLE',
        deletedAt: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        images: true,
        seller: {
          select: {
            sellerId: true,
            userId: true,
            storeName: true,
            storeDescription: true,
            platformFeeRate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        category: {
          select: {
            categoryId: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return {
      items: products.map((p) => ({
        productId: p.productId,
        name: p.name,
        description: p.description,
        price: p.price.toString(),
        images: p.images.map((img) => ({
          imageUrl: img.imageUrl,
        })),
        category: {
          categoryId: p.category?.categoryId,
          name: p.category?.name,
          description: p.category?.description,
          createdAt: p.category?.createdAt,
          updatedAt: p.category?.updatedAt,
        },
        categoryId: p.categoryId,
        sellerId: p.sellerId,
        seller: {
          sellerId: p.seller.sellerId,
          userId: p.seller.userId,
          storeName: p.seller.storeName,
          storeDescription: p.seller.storeDescription,
          platformFeeRate: p.seller.platformFeeRate,
          createdAt: p.seller.createdAt,
          updatedAt: p.seller.updatedAt,
        },
        stockQuantity: p.stockQuantity,
        status: p.status,
        rating: 0,
        reviews: 0,
        sku: `SKU-${p.productId}`,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      total,
      page,
      limit,
    };
  }
}
