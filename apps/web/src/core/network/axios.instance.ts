import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ENV, STORAGE_KEYS } from '../constants';

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
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor: handle errors
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<AppErrorResponse>) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN_KEY);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN_KEY);
        window.location.href = '/login';
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
