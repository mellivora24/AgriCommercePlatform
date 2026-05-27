import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorator';
import { AuthUser } from '@module/auth/types/auth.type';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  CreateProductImageDto,
} from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateProductDto) {
    return this.service.create(user.sellerId!, dto);
  }

  @Get()
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('sellerId') sellerId?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.service.findAll({
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      sellerId: sellerId ? parseInt(sellerId) : undefined,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    if (!query) return { items: [], total: 0, page: 1, limit: 20 };
    return this.service.searchProducts(query, parseInt(page), parseInt(limit));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.service.update(id, user.sellerId!, dto);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: 'HIDDEN' | 'AVAILABLE' | 'OUT_OF_STOCK' },
  ) {
    return this.service.updateStatus(id, user.sellerId!, body.status);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  addImage(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductImageDto,
  ) {
    return this.service.addImage(id, user.sellerId!, dto);
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard)
  removeImage(
    @CurrentUser() user: AuthUser,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.service.removeImage(imageId, user.sellerId!);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id, user.sellerId!);
  }

  @Get('seller/me')
  @UseGuards(JwtAuthGuard)
  getMyProducts(@CurrentUser() user: AuthUser) {
    return this.service.getSellerProducts(user.sellerId!);
  }
}
