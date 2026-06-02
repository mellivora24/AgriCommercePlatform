import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsNumber,
  IsPositive,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  OrderStatus,
  ProductStatus,
  AccountStatus,
  UserRole,
  SellerStatus,
  WithdrawalStatus,
} from '@prisma/client';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class AdminUserListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(AccountStatus)
  status?: AccountStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

export class AdminStoreListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(SellerStatus)
  status?: SellerStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

export class AdminStoreProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

export class AdminStoreOrderQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

export class AdminStoreWithdrawalQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(WithdrawalStatus)
  status?: WithdrawalStatus;
}

export class AdminProductListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;
}

export class RejectSellerDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class SuspendUserDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BanUserDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ApproveWithdrawalDto {}

export class RejectWithdrawalDto {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class UpdateStoreFeeDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Max(100)
  platformFeeRate!: number;
}

export class CreateAdminDto {
  @IsString()
  role!: 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'FINANCE_ADMIN';
}

export class AdminNoteDto {
  @IsString()
  note!: string;
}
