import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateSellerDto {
  @IsString()
  storeName!: string;

  @IsOptional()
  @IsString()
  storeDescription?: string;

  @IsOptional()
  @IsNumber()
  platformFeeRate?: number;
}

export class UpdateSellerDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  storeDescription?: string;

  @IsOptional()
  @IsNumber()
  platformFeeRate?: number;
}

export class CreateSellerBankAccountDto {
  @IsString()
  bankName!: string;

  @IsString()
  accountNumber!: string;

  @IsString()
  accountName!: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateSellerBankAccountDto {
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateSellerSettingsDto {
  @IsOptional()
  @IsString()
  storeName?: string;

  @IsOptional()
  @IsString()
  storeDescription?: string;
}

export class SellerWithdrawDto {
  @IsInt()
  @IsPositive()
  @Min(10_000)
  amount!: number;

  @IsInt()
  @IsPositive()
  bankAccountId!: number;
}
