import type { AxiosInstance } from 'axios';
import type {
  BuyerProfile,
  CreateBuyerProfileRequest,
  UpdateBuyerProfileRequest,
} from '../../domain/entities/buyer.entity';

export const createBuyerProfilesApi = (axiosInstance: AxiosInstance) => ({
  createProfile: async (request: CreateBuyerProfileRequest) => {
    const { data } = await axiosInstance.post('/buyer-profiles', request);
    return data as BuyerProfile;
  },

  getMyProfile: async () => {
    const { data } = await axiosInstance.get('/buyer-profiles/me');
    return data as BuyerProfile;
  },

  updateProfile: async (request: UpdateBuyerProfileRequest) => {
    const { data } = await axiosInstance.put('/buyer-profiles/me', request);
    return data as BuyerProfile;
  },
});

export type BuyerProfilesApi = ReturnType<typeof createBuyerProfilesApi>;
