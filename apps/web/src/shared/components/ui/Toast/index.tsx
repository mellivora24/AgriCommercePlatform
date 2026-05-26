import toast from 'react-hot-toast';

interface ToastProps {
  type: 'success' | 'error' | 'loading';
  message: string;
  duration?: number;
}

export const showToast = ({
  type,
  message,
  duration = 3000,
}: ToastProps) => {
  switch (type) {
    case 'success':
      toast.success(message, { duration });
      break;
    case 'error':
      toast.error(message, { duration });
      break;
    case 'loading':
      toast.loading(message);
      break;
  }
};

export const Toast = {
  success: (message: string, duration?: number) =>
    showToast({ type: 'success', message, duration }),
  error: (message: string, duration?: number) =>
    showToast({ type: 'error', message, duration }),
  loading: (message: string) =>
    showToast({ type: 'loading', message }),
};
