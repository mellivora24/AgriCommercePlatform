import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useLogin } from '@/features/auth/presentation/hooks/useAuth';
import { ROUTES } from '@/core/router/routes';
import {
  loginSchema,
  type LoginFormData,
} from '@/features/auth/domain/validators/auth.validator';
import { useToast } from '@/shared/hooks';

export const LoginPage: React.FC = () => {
  const toast = useToast();
  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error: Error) => {
        toast.error(error.message || 'Login failed');
        console.error('Login failed:', error);
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng trở lại!
        </h1>
        <p className="text-gray-600">
          Đăng nhập vào tài khoản của bạn để tiếp tục
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Địa chỉ Email"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        <Button fullWidth isLoading={isPending} type="submit">
          Đăng nhập
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Chưa có tài khoản?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-green-600 hover:underline"
          >
            Tạo tài khoản
          </Link>
        </p>
      </div>
    </div>
  );
};
