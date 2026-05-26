import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { useRegister } from '../hooks/useAuth';
import { ROUTES } from '../../../../core/router/routes';
import {
  registerSchema,
  type RegisterFormData,
} from '../../domain/validators/auth.validator';
import { useToast } from '../../../../shared/hooks';

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
      onError: (error: any) => {
        toast.error(error.message || 'Registration failed');
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">
          Join us to start shopping
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          {...formRegister('name')}
          error={errors.name?.message}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          {...formRegister('email')}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...formRegister('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          {...formRegister('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button fullWidth isLoading={isPending} type="submit">
          Create Account
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-red-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
