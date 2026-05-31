import { Module } from '@nestjs/common';
import { ShipperProfilesService } from './shipper_profiles.service';
import { ShipperProfilesController } from './shipper_profiles.controller';
import { PrismaModule } from '@app-prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ShipperProfilesController],
  providers: [ShipperProfilesService],
  exports: [ShipperProfilesService],
})
export class ShipperProfilesModule {}
