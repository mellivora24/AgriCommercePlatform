import type { IBuyerProfileRepository } from '../../domain/repositories/buyer_profile.repository';
import type { BuyerProfilesApi } from '../api/buyer_profile.api';

export const createBuyerProfileRepository = (
  buyerProfilesApi: BuyerProfilesApi
): IBuyerProfileRepository => ({
  createProfile: (request) => buyerProfilesApi.createProfile(request),
  getMyProfile: () => buyerProfilesApi.getMyProfile(),
  updateProfile: (request) => buyerProfilesApi.updateProfile(request),
});
