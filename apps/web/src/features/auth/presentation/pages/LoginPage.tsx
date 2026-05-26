import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { useLogin } from '../hooks/useAuth';
import { ROUTES } from '../../../../core/router/routes';
import {
  loginSchema,
  type LoginFormData,
} from '../../domain/validators/auth.validator';
import { useToast } from '../../../../shared/hooks';

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
      onError: (error: any) => {
        toast.error(error.message || 'Login failed');
        console.error('Login failed:', error);
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />

        <Button fullWidth isLoading={isPending} type="submit">
          Sign In
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-red-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
