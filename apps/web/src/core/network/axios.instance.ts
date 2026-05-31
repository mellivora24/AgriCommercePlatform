import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ENV } from '../constants';
import { useAuthStore } from '../store';

export type AppErrorResponse = {
  statusCode: number;
  message: string;
  error?: string;
};

export class AppError extends Error {
  readonly statusCode: number;
  readonly error?: string;

  constructor(
    statusCode: number,
    message: string,
    error?: string,
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.error = error;
  }
}

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: ENV.VITE_API_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: attach token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<AppErrorResponse>) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        'An error occurred';

      const statusCode = error.response?.status || 500;

      throw new AppError(
        statusCode,
        message,
        error.response?.data?.error,
      );
    },
  );

  return instance;
};

export const axiosInstance = createAxiosInstance();
