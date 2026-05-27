import {
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @IsString()
  shippingAddress!: string;

  @IsString()
  receiverName!: string;

  @IsString()
  receiverPhone!: string;

  @IsOptional()
  @IsInt()
  sellerId?: number;
}

export class UpdateOrderStatusDto {
  @IsString()
  status!: string;
}
