import type {
  BuyerProfile,
  CreateBuyerProfileRequest,
  UpdateBuyerProfileRequest,
} from '../entities/buyer_profile.entity';

export interface IBuyerProfileRepository {
  createProfile(request: CreateBuyerProfileRequest): Promise<BuyerProfile>;
  getMyProfile(): Promise<BuyerProfile>;
  updateProfile(request: UpdateBuyerProfileRequest): Promise<BuyerProfile>;
}
