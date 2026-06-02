import {
  IsString,
  IsInt,
  Min,
  IsIn,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsIn(['ONLINE', 'COD'])
  paymentMethod!: 'ONLINE' | 'COD';

  @IsString()
  shippingAddress!: string;

  @IsString()
  receiverName!: string;

  @IsString()
  receiverPhone!: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  status!: string;
}

export class GetSellerOrdersDto {
  @IsOptional()
  @IsIn([
    'PENDING_PAYMENT',
    'PAID',
    'WAITING_SELLER_CONFIRMATION',
    'SELLER_CONFIRMED',
    'SHIPPING',
    'DELIVERED',
    'COMPLETED',
    'CANCELLED',
    'RETURN_REQUESTED',
    'REFUNDED',
  ])
  status?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
