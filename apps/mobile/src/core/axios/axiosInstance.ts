import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/core/constants/env';
import { useAuthStore } from '@/core/store';

export type AppErrorResponse = {
	statusCode?: number;
	message?: string;
	error?: string;
};

export class AppError extends Error {
	readonly statusCode: number;
	readonly error?: string;

	constructor(statusCode: number, message: string, error?: string) {
		super(message);
		this.name = 'AppError';
		this.statusCode = statusCode;
		this.error = error;
	}
}

const createAxiosInstance = (): AxiosInstance => {
	const instance = axios.create({
		baseURL: ENV.API_URL,
		timeout: 30000,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
		const accessToken = useAuthStore.getState().accessToken;

		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	});

	instance.interceptors.response.use(
		(response) => response,
		(error: AxiosError<AppErrorResponse>) => {
			if (error.response?.status === 401) {
				useAuthStore.getState().clearAuth();
			}

			const message = error.response?.data?.message || error.message || 'An error occurred';

			throw new AppError(error.response?.status || 500, message, error.response?.data?.error);
		},
	);

	return instance;
};

export const axiosInstance = createAxiosInstance();

