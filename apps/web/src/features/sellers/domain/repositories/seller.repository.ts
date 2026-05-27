import type {
  SellerProfile,
  SellerWallet,
  SellerBankAccount,
  CreateSellerProfileRequest,
  UpdateSellerProfileRequest,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from '../entities/seller.entity';

export interface ISellerRepository {
  createProfile(request: CreateSellerProfileRequest): Promise<SellerProfile>;
  getProfile(sellerId: number): Promise<SellerProfile>;
  updateProfile(sellerId: number, request: UpdateSellerProfileRequest): Promise<SellerProfile>;
  getBankAccounts(sellerId: number): Promise<SellerBankAccount[]>;
  createBankAccount(sellerId: number, request: CreateBankAccountRequest): Promise<SellerBankAccount>;
  updateBankAccount(sellerId: number, accountId: number, request: UpdateBankAccountRequest): Promise<SellerBankAccount>;
  deleteBankAccount(sellerId: number, accountId: number): Promise<void>;
  getWallet(sellerId: number): Promise<SellerWallet>;
}
