import {
  Post,
  Body,
  Controller,
  Request,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';

import { AuthUser } from '@module/auth/types/auth.type';
import { CurrentUser } from '@common/decorator';
import { AuthService } from '@module/auth/auth.service';
import { JwtAuthGuard } from '@module/auth/guards/jwt-auth.guard';

import { UserLoginDto } from '@module/auth/dto/login.dto';
import { UserRegisterDto } from '@module/auth/dto/register.dto';
import { ChangePasswordDto } from '@module/auth/dto/change-password.dto';
import { ForgotPasswordDto } from '@module/auth/dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: UserRegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: UserLoginDto) {
    return this.authService.login(dto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user.email, dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    if (dto.email) {
      this.authService.forgotPassword(dto);
    } else if (dto.phone) {
      this.authService.forgotPassword(dto);
    } else {
      throw new BadRequestException('Email hoặc số điện thoại là bắt buộc');
    }

    return {
      message:
        'Nếu thông tin hợp lệ, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu qua email hoặc SMS',
    };
  }
}
