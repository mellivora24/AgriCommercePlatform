import type { IBuyerProfileRepository } from '../../domain/repositories/buyer.repository';
import type { BuyerProfilesApi } from '../api/buyer.api';

export const createBuyerProfileRepository = (
  buyerProfilesApi: BuyerProfilesApi
): IBuyerProfileRepository => ({
  createProfile: (request) => buyerProfilesApi.createProfile(request),
  getMyProfile: () => buyerProfilesApi.getMyProfile(),
  updateProfile: (request) => buyerProfilesApi.updateProfile(request),
});
