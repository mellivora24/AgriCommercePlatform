import { IsInt, Min } from 'class-validator';

export class CartDto {
  @IsInt()
  productId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}
export class DeleteCartItemDto {
  @IsInt()
  @Min(1)
  itemId!: number;
}
