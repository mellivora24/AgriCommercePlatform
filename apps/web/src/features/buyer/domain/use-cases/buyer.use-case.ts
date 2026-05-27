import type {
  BuyerProfile,
  CreateBuyerProfileRequest,
  UpdateBuyerProfileRequest,
} from '../entities/buyer.entity';
import type { IBuyerProfileRepository } from '../repositories/buyer.repository';

export interface CreateBuyerProfileUseCase {
  execute(request: CreateBuyerProfileRequest): Promise<BuyerProfile>;
}

export interface GetMyBuyerProfileUseCase {
  execute(): Promise<BuyerProfile>;
}

export interface UpdateBuyerProfileUseCase {
  execute(request: UpdateBuyerProfileRequest): Promise<BuyerProfile>;
}

export const createCreateBuyerProfileUseCase = (
  repository: IBuyerProfileRepository
): CreateBuyerProfileUseCase => ({
  execute: (request) => repository.createProfile(request),
});

export const createGetMyBuyerProfileUseCase = (
  repository: IBuyerProfileRepository
): GetMyBuyerProfileUseCase => ({
  execute: () => repository.getMyProfile(),
});

export const createUpdateBuyerProfileUseCase = (
  repository: IBuyerProfileRepository
): UpdateBuyerProfileUseCase => ({
  execute: (request) => repository.updateProfile(request),
});
