import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UsersService } from './users.service';
import { PrismaService } from '@app-prisma/prisma.service';
import { UsersMapper } from './users.mapper';

import { UserRegisterDto } from '@module/auth/dto/register.dto';
import { UpdateUsersProfileDto } from './dto/update-users-profile.dto';

import { UserRole, AccountStatus } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockUser = {
    userId: 1,
    email: 'test@example.com',
    phone: '+84912345678',
    passwordHash: 'hashedPassword',
    role: UserRole.BUYER,
    status: AccountStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const registerDto: UserRegisterDto = {
        email: 'newuser@example.com',
        phone: '+84987654321',
        password: 'Password@123',
      };

      mockPrismaService.user.create.mockResolvedValue(mockUser);

      jest.spyOn(UsersMapper, 'toResponse').mockReturnValue({
        id: mockUser.userId,
        email: mockUser.email,
        phone: mockUser.phone,
        role: mockUser.role,
        account_status: mockUser.status,
        created_at: mockUser.createdAt,
        updated_at: mockUser.updatedAt,
      });

      const result = await service.createUser(registerDto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          phone: registerDto.phone,
          passwordHash: expect.any(String),
          role: UserRole.BUYER,
          status: AccountStatus.ACTIVE,
        },
      });

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when create fails', async () => {
      const registerDto: UserRegisterDto = {
        email: 'newuser@example.com',
        phone: '+84987654321',
        password: 'Password@123',
      };

      mockPrismaService.user.create.mockResolvedValue(null);

      await expect(service.createUser(registerDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      jest.spyOn(UsersMapper, 'toResponse').mockReturnValue({
        id: mockUser.userId,
        email: mockUser.email,
        phone: mockUser.phone,
        role: mockUser.role,
        account_status: mockUser.status,
        created_at: mockUser.createdAt,
        updated_at: mockUser.updatedAt,
      });

      const result = await service.findById(1);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { userId: 1 },
      });

      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'test@example.com',
        },
      });

      expect(result).toEqual({
        id: mockUser.userId,
        email: mockUser.email,
        phone: mockUser.phone,
        role: mockUser.role,
        account_status: mockUser.status,
        created_at: mockUser.createdAt,
        updated_at: mockUser.updatedAt,
      });
    });

    it('should throw NotFoundException when email not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.findByEmail('notfound@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByPhone', () => {
    it('should find user by phone', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);

      const result = await service.findByPhone('+84912345678');

      expect(mockPrismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          phone: '+84912345678',
        },
      });

      expect(result).toEqual({
        id: mockUser.userId,
        email: mockUser.email,
        phone: mockUser.phone,
        role: mockUser.role,
        account_status: mockUser.status,
        created_at: mockUser.createdAt,
        updated_at: mockUser.updatedAt,
      });
    });

    it('should throw NotFoundException when phone not found', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(
        service.findByPhone('+84999999999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const updateDto: UpdateUsersProfileDto = {
        email: 'updated@example.com',
        phone: '+84911111111',
      };

      const updatedUser = {
        ...mockUser,
        ...updateDto,
      };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      jest.spyOn(UsersMapper, 'toResponse').mockReturnValue({
        id: updatedUser.userId,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        account_status: updatedUser.status,
        created_at: updatedUser.createdAt,
        updated_at: updatedUser.updatedAt,
      });

      const result = await service.updateProfile(1, updateDto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { userId: 1 },
        data: {
          email: updateDto.email,
          phone: updateDto.phone,
        },
      });

      expect(result).toBeDefined();
    });

    it('should throw when updating non-existent user', async () => {
      const updateDto: UpdateUsersProfileDto = {
        email: 'updated@example.com',
      };

      mockPrismaService.user.update.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(
        service.updateProfile(999, updateDto),
      ).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      await service.deleteUser(1);

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: {
          userId: 1,
        },
      });
    });

    it('should throw when deleting non-existent user', async () => {
      mockPrismaService.user.delete.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(service.deleteUser(999)).rejects.toThrow();
    });
  });
});
