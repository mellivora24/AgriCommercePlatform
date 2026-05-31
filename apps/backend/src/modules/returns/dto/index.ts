import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateReturnRequestDto {
  @IsInt()
  orderId!: number;

  @IsString()
  reason!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  refundAmount?: number;
}

export class ApproveReturnDto {
  @IsOptional()
  @IsString()
  adminNote?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  refundAmount?: number;
}

export class RejectReturnDto {
  @IsOptional()
  @IsString()
  adminNote?: string;
}
