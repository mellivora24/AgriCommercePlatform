import { IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  method!: 'ONLINE' | 'COD';
}

export class ConfirmPaymentDto {
  @IsString()
  transactionId!: string;

  @IsOptional()
  @IsString()
  providerTransactionId?: string;
}
