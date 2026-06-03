import { Alert } from 'react-native';

export const useToast = () => ({
  success: (message: string) => Alert.alert('Thông báo', message),
  error: (message: string) => Alert.alert('Lỗi', message),
});
