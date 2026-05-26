import { useCallback } from 'react';
import { Toast } from '../components/ui/Toast';

export const useToast = () => {
  return {
    success: useCallback(
      (message: string) => Toast.success(message),
      [],
    ),
    error: useCallback(
      (message: string) => Toast.error(message),
      [],
    ),
    loading: useCallback(
      (message: string) => Toast.loading(message),
      [],
    ),
  };
};
