import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@module/users/users.service';
import { UserLoginDto } from '@module/auth/dto/login.dto';
import { UserRegisterDto } from '@module/auth/dto/register.dto';
import { ChangePasswordDto } from '@/modules/auth/dto/change-password.dto';
import { ForgotPasswordDto } from '@module/auth/dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(dto: UserRegisterDto) {
    const existingUser = await this.usersService.findByEmailOrPhone(
      dto.email,
      dto.phone,
    );
    if (existingUser) {
      throw new BadRequestException('Email hoặc số điện thoại đã tồn tại');
    }

    const result = await this.usersService.createUser(dto);

    const accessToken = await bcrypt.hash(`${result.id}-${Date.now()}`, 10);
    const refreshToken = await bcrypt.hash(
      `${result.id}-${Date.now()}-refresh`,
      10,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        userId: result.id,
        email: result.email,
        phone: result.phone,
        role: result.role,
        status: result.account_status,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    };
  }

  async login(dto: UserLoginDto) {
    let result;
    if (dto.email) {
      result = await this.usersService.findByEmail(dto.email);
    } else if (dto.phone) {
      result = await this.usersService.findByPhone(dto.phone);
    } else {
      throw new BadRequestException('Email hoặc số điện thoại là bắt buộc');
    }

    const hashedPassword = result.passwordHash;

    const isPasswordValid = await bcrypt.compare(dto.password, hashedPassword);

    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu không đúng');
    }

    const accessToken = await bcrypt.hash(`${result.userId}-${Date.now()}`, 10);
    const refreshToken = await bcrypt.hash(
      `${result.userId}-${Date.now()}-refresh`,
      10,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        userId: result.userId,
        email: result.email,
        phone: result.phone,
        role: result.role,
        status: result.status,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }

  async changePassword(email: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findByEmail(email);

    const isOldPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.passwordHash,
    );

    if (!isOldPasswordValid) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.usersService.changePassword(user.userId, newHashedPassword);

    return { message: 'Cập nhật mật khẩu thành công' };
  }

  forgotPassword(dto: ForgotPasswordDto) {
    // let user;
    if (dto.email) {
      // user = await this.usersService.findByEmail(dto.email);
      return { message: 'Tính năng đang được phát triển' };
    } else if (dto.phone) {
      // user = await this.usersService.findByPhone(dto.phone);
      return { message: 'Tính năng đang được phát triển' };
    } else {
      throw new BadRequestException('Email hoặc số điện thoại là bắt buộc');
    }

    // TODO: Gửi email hoặc SMS để đặt lại mật khẩu
  }
}
