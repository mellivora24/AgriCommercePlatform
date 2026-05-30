import { IsString, IsInt, Min, IsIn } from 'class-validator';

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
