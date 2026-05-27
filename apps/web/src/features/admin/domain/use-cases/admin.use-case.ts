import type { UserListResponse, SellerListResponse, PlatformStats, SellerStats } from '../entities/admin.entity';
import type { IAdminRepository } from '../repositories/admin.repository';

export interface GetUsersUseCase {
  execute(page: number, limit: number, role?: string, status?: string): Promise<UserListResponse>;
}

export interface GetSellersUseCase {
  execute(page: number, limit: number, status?: string): Promise<SellerListResponse>;
}

export interface ApproveSellerUseCase {
  execute(sellerId: number): Promise<void>;
}

export interface RejectSellerUseCase {
  execute(sellerId: number): Promise<void>;
}

export interface GetPlatformStatsUseCase {
  execute(): Promise<PlatformStats>;
}

export interface GetSellerStatsUseCase {
  execute(sellerId: number): Promise<SellerStats>;
}

export const createGetUsersUseCase = (repository: IAdminRepository): GetUsersUseCase => ({
  execute: (page, limit, role, status) => repository.getUsers(page, limit, role, status),
});

export const createGetSellersUseCase = (repository: IAdminRepository): GetSellersUseCase => ({
  execute: (page, limit, status) => repository.getSellers(page, limit, status),
});

export const createApproveSellerUseCase = (repository: IAdminRepository): ApproveSellerUseCase => ({
  execute: (sellerId) => repository.approveSeller(sellerId),
});

export const createRejectSellerUseCase = (repository: IAdminRepository): RejectSellerUseCase => ({
  execute: (sellerId) => repository.rejectSeller(sellerId),
});

export const createGetPlatformStatsUseCase = (repository: IAdminRepository): GetPlatformStatsUseCase => ({
  execute: () => repository.getPlatformStats(),
});

export const createGetSellerStatsUseCase = (repository: IAdminRepository): GetSellerStatsUseCase => ({
  execute: (sellerId) => repository.getSellerStats(sellerId),
});
