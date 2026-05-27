import { IsInt, Min, IsString, IsOptional } from 'class-validator';

export class WithdrawDto {
  @IsInt()
  @Min(1)
  bankAccountId!: number;

  @IsInt()
  @Min(1000)
  amount!: number;
}

export class WithdrawalConfirmDto {
  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  transferReference?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;
}
