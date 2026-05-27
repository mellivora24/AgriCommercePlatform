import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateShipmentDto {
  @IsOptional()
  @IsInt()
  shipperId?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  trackingCode?: string;
}
