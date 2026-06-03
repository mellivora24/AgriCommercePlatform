import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ShipmentStatus } from '@prisma/client';

export const SHIPPER_ALLOWED_STATUSES = [
  ShipmentStatus.PICKED_UP,
  ShipmentStatus.DELIVERING,
  ShipmentStatus.DELIVERED,
  ShipmentStatus.RETURNING,
  ShipmentStatus.RETURNED,
] as const;

export type ShipperAllowedStatus = (typeof SHIPPER_ALLOWED_STATUSES)[number];

export class UpdateShipmentStatusDto {
  @IsEnum(SHIPPER_ALLOWED_STATUSES, {
    message: `status phải là một trong: ${SHIPPER_ALLOWED_STATUSES.join(', ')}`,
  })
  status!: ShipperAllowedStatus;
}

export class GetShipmentsQueryDto {
  @IsEnum(['pending', 'active', 'done'])
  tab!: 'pending' | 'active' | 'done';

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
