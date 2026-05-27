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

      include: {
        images: true,
      },
    });
  }

  private mapProduct(product: any) {
    return {
      productId: product.productId,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      images: product.images.map((img: any) => ({
        imageUrl: img.imageUrl,
      })),
      category: product.category
        ? {
            categoryId: product.category.categoryId,
            name: product.category.name,
            description: product.category.description,
            createdAt: product.category.createdAt,
            updatedAt: product.category.updatedAt,
          }
        : null,
      categoryId: product.categoryId,
      sellerId: product.sellerId,
      seller: {
        sellerId: product.seller.sellerId,
        userId: product.seller.userId,
        storeName: product.seller.storeName,
        storeDescription: product.seller.storeDescription,
        platformFeeRate: product.seller.platformFeeRate,
        createdAt: product.seller.createdAt,
        updatedAt: product.seller.updatedAt,
      },
      stockQuantity: product.stockQuantity,
      status: product.status,
      rating: null,
      reviews: 0,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  async findAll(filters?: {
    categoryId?: number;
    sellerId?: number;
    query?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;

    const limit = Math.min(filters?.limit || 20, 100);

    const skip = (page - 1) * limit;

    const where = {
      status: 'AVAILABLE' as const,
      deletedAt: null,
      ...(filters?.categoryId && {
        categoryId: filters.categoryId,
      }),
      ...(filters?.sellerId && {
        sellerId: filters.sellerId,
      }),
      ...(filters?.query && {
        OR: [
          {
            name: {
              contains: filters.query,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: filters.query,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const total = await this.prisma.product.count({
      where,
    });

    const products = await this.prisma.product.findMany({
      where,
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
      items: products.map((p) => this.mapProduct(p)),
      total,
      page,
      limit,
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        productId: id,
        deletedAt: null,
      },

      include: {
        images: true,
        seller: true,
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    return product;
  }

  async update(id: number, sellerId: number, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Không có quyền');
    }

    return this.prisma.product.update({
      where: {
        productId: id,
      },

      data: {
        ...dto,

        price: dto.price ? BigInt(dto.price) : undefined,
      },

      include: {
        images: true,
      },
    });
  }

  async updateStatus(
    id: number,
    sellerId: number,
    status: 'HIDDEN' | 'AVAILABLE' | 'OUT_OF_STOCK',
  ) {
    const product = await this.findOne(id);
    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Không có quyền');
    }

    return this.prisma.product.update({
      where: {
        productId: id,
      },
      data: {
        status,
      },
    });
  }

  async addImage(id: number, sellerId: number, dto: CreateProductImageDto) {
    const product = await this.findOne(id);
    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Không có quyền');
    }

    return this.prisma.productImage.create({
      data: {
        productId: id,
        imageUrl: dto.imageUrl,
      },
    });
  }

  async removeImage(imageId: number, sellerId: number) {
    const image = await this.prisma.productImage.findUnique({
      where: {
        imageId,
      },

      include: {
        product: true,
      },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    if (image.product.sellerId !== sellerId) {
      throw new ForbiddenException('Không có quyền');
    }

    return this.prisma.productImage.delete({
      where: {
        imageId,
      },
    });
  }

  async remove(id: number, sellerId: number) {
    const product = await this.findOne(id);
    if (product.sellerId !== sellerId) {
      throw new ForbiddenException('Không có quyền');
    }

    return this.prisma.product.update({
      where: {
        productId: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getSellerProducts(sellerId: number) {
    return this.prisma.product.findMany({
      where: {
        sellerId,
        deletedAt: null,
      },
      include: {
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSimilarProducts(productName: string, limit = 10) {
    return this.prisma.product.findMany({
      where: {
        name: {
          contains: productName,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
