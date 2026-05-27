import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useRegister } from '@/features/auth/presentation/hooks/useAuth';
import { ROUTES } from '@/core/router/routes';
import {
  registerSchema,
  type RegisterFormData,
} from '@/features/auth/domain/validators/auth.validator';
import { useToast } from '@/shared/hooks';

export const RegisterPage: React.FC = () => {
  const toast = useToast();
  const { mutate: register, isPending } = useRegister();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data, {
      onError: (error: Error) => {
        toast.error(error.message || 'Registration failed');
        console.error('Registration failed:', error);
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tạo Tài Khoản
        </h1>
        <p className="text-gray-600">
          Tham gia cùng chúng tôi để bắt đầu mua sắm tuyệt vời!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Họ và Tên"
          placeholder="John Doe"
          {...formRegister('name')}
          error={errors.name?.message}
        />

        <Input
          label="Địa chỉ Email"
          type="email"
          placeholder="you@example.com"
          {...formRegister('email')}
          error={errors.email?.message}
        />

        <Input
          label="Mật khẩu"
          type="password"
          placeholder="••••••••"
          {...formRegister('password')}
          error={errors.password?.message}
        />

        <Input
          label="Xác nhận Mật khẩu"
          type="password"
          placeholder="••••••••"
          {...formRegister('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button fullWidth isLoading={isPending} type="submit">
          Tạo Tài Khoản
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Đã có tài khoản?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-green-600 hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
