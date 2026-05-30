import React, { useState } from 'react';
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

// ─── Seller Approval Modal ────────────────────────────────────────────────────

interface SellerModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const SellerApprovalModal: React.FC<SellerModalProps> = ({
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />

    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-modal-in">
      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
        Lưu ý khi đăng ký tài khoản Người Bán
      </h2>
      <p className="text-gray-600 text-center text-sm leading-relaxed mb-2">
        Yêu cầu đăng ký của bạn sẽ được{' '}
        <span className="font-semibold text-gray-800">ADMIN hệ thống</span> duyệt
        trong vòng{' '}
        <span className="font-semibold text-amber-600">3 ngày làm việc</span>.
      </p>
      <p className="text-gray-600 text-center text-sm leading-relaxed mb-7">
        Hãy vui lòng chờ cho đến khi chúng tôi thông báo kết quả cho bạn qua
        email đã đăng ký.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Huỷ
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 active:scale-95 transition-all"
        >
          Tôi đã hiểu, tiếp tục
        </button>
      </div>
    </div>

    <style>{`
      @keyframes modal-in {
        from { opacity: 0; transform: scale(0.94) translateY(8px); }
        to   { opacity: 1; transform: scale(1)    translateY(0); }
      }
      .animate-modal-in { animation: modal-in 0.22s ease-out; }
    `}</style>
  </div>
);

// ─── Role Selector Button ─────────────────────────────────────────────────────

interface RoleButtonProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description: string;
}

const RoleButton: React.FC<RoleButtonProps> = ({
  selected,
  onClick,
  icon,
  label,
  description,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 text-center
      transition-all duration-200 cursor-pointer
      ${
        selected
          ? 'border-green-500 bg-green-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
      }
    `}
  >
    <span
      className={`text-2xl transition-transform duration-200 ${selected ? 'scale-110' : ''}`}
    >
      {icon}
    </span>
    <span
      className={`text-sm font-semibold ${selected ? 'text-green-700' : 'text-gray-700'}`}
    >
      {label}
    </span>
    <span className="text-xs text-gray-500 leading-snug">{description}</span>
    {selected && (
      <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-green-600 font-medium">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
        Đã chọn
      </span>
    )}
  </button>
);

// ─── Register Page ────────────────────────────────────────────────────────────

export const RegisterPage: React.FC = () => {
  const toast = useToast();
  const { mutate: register, isPending } = useRegister();

  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'SELLER' | null>(
    null,
  );
  const [showSellerModal, setShowSellerModal] = useState(false);
  // Holds submitted form data while waiting for seller modal confirmation
  const [pendingData, setPendingData] = useState<RegisterFormData | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleRoleSelect = (role: 'BUYER' | 'SELLER') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const submitRegistration = (data: RegisterFormData) => {
    register(data, {
      onError: (error: Error) => {
        toast.error(error.message || 'Đăng ký thất bại');
        console.error('Registration failed:', error);
      },
    });
  };

  const onSubmit = (data: RegisterFormData) => {
    if (data.role === 'SELLER') {
      setPendingData(data);
      setShowSellerModal(true);
    } else {
      submitRegistration(data);
    }
  };

  const handleSellerConfirm = () => {
    setShowSellerModal(false);
    if (pendingData) {
      submitRegistration(pendingData);
      setPendingData(null);
    }
  };

  const handleSellerCancel = () => {
    setShowSellerModal(false);
    setPendingData(null);
  };

  return (
    <>
      {showSellerModal && (
        <SellerApprovalModal
          onConfirm={handleSellerConfirm}
          onCancel={handleSellerCancel}
        />
      )}

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
          {/* Role selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bạn muốn tạo tài khoản với tư cách
            </label>
            <div className="flex gap-3">
              <RoleButton
                selected={selectedRole === 'BUYER'}
                onClick={() => handleRoleSelect('BUYER')}
                icon="🛒"
                label="Người Mua"
                description="Khám phá & mua sắm sản phẩm"
              />
              <RoleButton
                selected={selectedRole === 'SELLER'}
                onClick={() => handleRoleSelect('SELLER')}
                icon="🏪"
                label="Người Bán"
                description="Đăng bán & quản lý gian hàng"
              />
            </div>
            {/* Hidden input to register role with react-hook-form */}
            <input type="hidden" {...formRegister('role')} />
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">
                Vui lòng chọn loại tài khoản
              </p>
            )}
          </div>

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
            {selectedRole === 'SELLER'
              ? 'Tạo tài khoản Người Bán'
              : selectedRole === 'BUYER'
                ? 'Tạo tài khoản Người Mua'
                : 'Tạo tài khoản'}
          </Button>
        </form>

        <div className="text-center text-sm space-y-4">
          <p className="text-gray-600">
            Đã có tài khoản?{' '}
            <Link to={ROUTES.LOGIN} className="text-green-600 hover:underline">
              Đăng nhập
            </Link>
          </p>

          <div className="flex items-center gap-3 text-gray-400">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs">hoặc</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <p className="text-gray-600">
            <Link to={ROUTES.HOME_PAGE} className="text-green-600 hover:underline">
              Tiếp tục với tư cách khách
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
