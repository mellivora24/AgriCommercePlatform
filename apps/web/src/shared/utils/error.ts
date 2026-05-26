import { AppError } from '../../core/network';

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.statusCode === 0 || error.statusCode >= 500;
  }
  return false;
};

export const is4xxError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.statusCode >= 400 && error.statusCode < 500;
  }
  return false;
};

export const isUnauthorizedError = (error: unknown): boolean => {
  if (error instanceof AppError) {
    return error.statusCode === 401;
  }
  return false;
};
