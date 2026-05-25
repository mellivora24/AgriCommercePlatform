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

    const user = await this.usersService.createUser(dto);
    return user;
  }

  async login(dto: UserLoginDto) {
    let user;
    if (dto.email) {
      user = await this.usersService.findByEmail(dto.email);
    } else if (dto.phone) {
      user = await this.usersService.findByPhone(dto.phone);
    } else {
      throw new BadRequestException('Email hoặc số điện thoại là bắt buộc');
    }

    const hashedPassword = user.passwordHash;

    const isPasswordValid = await bcrypt.compare(dto.password, hashedPassword);

    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu không đúng');
    }

    return {
      userId: user.userId,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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
