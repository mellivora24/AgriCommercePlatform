import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from '@app-prisma/prisma.service';
import { UsersMapper } from '@module/users/users.mapper';
import { UserRegisterDto } from '@module/auth/dto/register.dto';
import { UpdateUsersProfileDto } from '@module/users/dto/update-users-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: UserRegisterDto) {
    const hashedPassword = await hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash: hashedPassword,
        role: 'BUYER',
        status: 'ACTIVE',
      },
    });

    if (!user) {
      throw new NotFoundException(`Lỗi khi tạo người dùng: ${dto.email}`);
    }

    return UsersMapper.toResponse(user);
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { userId: id },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng: ${id}`);
    }

    return UsersMapper.toResponse(user);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng: ${email}`);
    }

    return UsersMapper.toResponse(user);
  }

  async findByPhone(phone: string) {
    const user = await this.prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng: ${phone}`);
    }

    return UsersMapper.toResponse(user);
  }

  async updateProfile(id: number, dto: UpdateUsersProfileDto) {
    const user = await this.prisma.user.update({
      where: { userId: id },
      data: {
        email: dto.email,
        phone: dto.phone,
      },
    });

    return UsersMapper.toResponse(user);
  }

  async deleteUser(id: number) {
    await this.prisma.user.delete({
      where: { userId: id },
    });
  }
}
