import { Module } from '@nestjs/common';

import { AuthController } from '@module/auth/auth.controller';
import { AuthService } from '@module/auth/auth.service';
import { UsersModule } from '@module/users/users.module';
import { PrismaModule } from '@app-prisma/prisma.module';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
