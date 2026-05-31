import { axiosInstance } from '@/core/network';
import type { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO } from '@/features/auth/data/dtos/auth.dto';

export const authApi = {
  login: async (credentials: LoginRequestDTO): Promise<AuthResponseDTO> => {
    const response = await axiosInstance.post<AuthResponseDTO>(
      '/auth/login',
      credentials,
    );
    return response.data;
  },

  register: async (
    data: RegisterRequestDTO,
  ): Promise<AuthResponseDTO> => {
    const response = await axiosInstance.post<AuthResponseDTO>(
      '/auth/register',
      data,
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get(
      '/auth/me',
    );
    return response.data;
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<AuthResponseDTO> => {
    const response = await axiosInstance.post<AuthResponseDTO>(
      '/auth/refresh',
      { refreshToken },
    );
    return response.data;
  },
};
