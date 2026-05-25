import { Module } from '@nestjs/common';

import { PrismaModule } from '@app-prisma/prisma.module';
import { UsersService } from '@module/users/users.service';
import { UsersController } from '@module/users/users.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
