import { IsString, IsOptional } from 'class-validator';

export class CreateShipperProfileDto {
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateShipperStatusDto {
  @IsString()
  status!: 'WORKING' | 'ON_LEAVE';
}
