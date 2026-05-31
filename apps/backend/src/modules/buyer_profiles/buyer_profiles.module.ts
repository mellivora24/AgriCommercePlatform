import { Module } from '@nestjs/common';
import { BuyerProfilesService } from './buyer_profiles.service';
import { BuyerProfilesController } from './buyer_profiles.controller';
import { PrismaModule } from '@app-prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BuyerProfilesController],
  providers: [BuyerProfilesService],
  exports: [BuyerProfilesService],
})
export class BuyerProfilesModule {}
