import type {
  SellerProfile,
  SellerWallet,
  SellerBankAccount,
  CreateSellerProfileRequest,
  UpdateSellerProfileRequest,
  CreateBankAccountRequest,
} from '../entities/seller.entity';
import type { ISellerRepository } from '../repositories/seller.repository';

export interface CreateSellerProfileUseCase {
  execute(request: CreateSellerProfileRequest): Promise<SellerProfile>;
}

export interface GetSellerProfileUseCase {
  execute(sellerId: number): Promise<SellerProfile>;
}

export interface UpdateSellerProfileUseCase {
  execute(sellerId: number, request: UpdateSellerProfileRequest): Promise<SellerProfile>;
}

export interface GetBankAccountsUseCase {
  execute(sellerId: number): Promise<SellerBankAccount[]>;
}

export interface CreateBankAccountUseCase {
  execute(sellerId: number, request: CreateBankAccountRequest): Promise<SellerBankAccount>;
}

export interface GetSellerWalletUseCase {
  execute(sellerId: number): Promise<SellerWallet>;
}

export const createCreateSellerProfileUseCase = (repository: ISellerRepository): CreateSellerProfileUseCase => ({
  execute: (request) => repository.createProfile(request),
});

export const createGetSellerProfileUseCase = (repository: ISellerRepository): GetSellerProfileUseCase => ({
  execute: (sellerId) => repository.getProfile(sellerId),
});

export const createUpdateSellerProfileUseCase = (repository: ISellerRepository): UpdateSellerProfileUseCase => ({
  execute: (sellerId, request) => repository.updateProfile(sellerId, request),
});

export const createGetBankAccountsUseCase = (repository: ISellerRepository): GetBankAccountsUseCase => ({
  execute: (sellerId) => repository.getBankAccounts(sellerId),
});

export const createCreateBankAccountUseCase = (repository: ISellerRepository): CreateBankAccountUseCase => ({
  execute: (sellerId, request) => repository.createBankAccount(sellerId, request),
});

export const createGetSellerWalletUseCase = (repository: ISellerRepository): GetSellerWalletUseCase => ({
  execute: (sellerId) => repository.getWallet(sellerId),
});
