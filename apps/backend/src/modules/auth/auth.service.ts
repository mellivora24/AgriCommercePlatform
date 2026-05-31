import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@module/users/users.service';
import { UserLoginDto } from '@module/auth/dto/login.dto';
import { UserRegisterDto } from '@module/auth/dto/register.dto';
import { ChangePasswordDto } from '@/modules/auth/dto/change-password.dto';
import { ForgotPasswordDto } from '@module/auth/dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error: any) {
      throw new BadRequestException(
        'Invalid or expired token: ' + error.message,
      );
    }
  }

  async register(dto: UserRegisterDto) {
    const existingUser = await this.usersService.findByEmailOrPhone(
      dto.email,
      dto.phone || '',
    );
    if (existingUser) {
      throw new BadRequestException('Email hoặc số điện thoại đã tồn tại');
    }

    const result = await this.usersService.createUser(dto);
    const { accessToken, refreshToken } = this.generateTokens(
      result.id,
      result.email,
      result.role,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
        role: result.role,
        createdAt: result.created_at,
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

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      result.passwordHash,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu không đúng');
    }

    const { accessToken, refreshToken } = this.generateTokens(
      result.userId,
      result.email,
      result.role,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: result.userId,
        email: result.email,
        name: result.email.split('@')[0],
        role: result.role,
        createdAt: result.createdAt,
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
