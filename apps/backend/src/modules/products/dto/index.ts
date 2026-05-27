import { IsString, IsOptional, IsNumber, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  @Min(0)
  price!: bigint | number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: bigint | number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}

export class CreateProductImageDto {
  @IsString()
  imageUrl!: string;
}
