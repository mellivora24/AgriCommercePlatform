import type {
  BuyerProfile,
  CreateBuyerProfileRequest,
  UpdateBuyerProfileRequest,
} from '../entities/buyer.entity';

export interface IBuyerProfileRepository {
  createProfile(request: CreateBuyerProfileRequest): Promise<BuyerProfile>;
  getMyProfile(): Promise<BuyerProfile>;
  updateProfile(request: UpdateBuyerProfileRequest): Promise<BuyerProfile>;
}
