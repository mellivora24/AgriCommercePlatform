import {
  Controller,
  Get,
  Put,
  UseGuards,
  Body,
  Delete,
  Post,
} from '@nestjs/common';

import { AuthUser } from '@module/auth/types/auth.type';
import { CurrentUser } from '@common/decorator';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';
import { UsersService } from '@module/users/users.service';
import { UpdateUsersProfileDto } from './dto/update-users-profile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.findById(user.userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() updateUsersProfileDto: UpdateUsersProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, updateUsersProfileDto);
  }

  @Delete('profile')
  @UseGuards(JwtAuthGuard)
  async deleteProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.deleteUser(user.userId);
  }

  @Post('apply-seller')
  @UseGuards(JwtAuthGuard)
  async applySeller(@CurrentUser() user: AuthUser) {
    return this.usersService.applySeller(user.userId);
  }
}
