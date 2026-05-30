import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/core/router/routes';

export const SellerPendingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Đăng ký thành công!
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Tài khoản Người Bán của bạn đã được ghi nhận.
          </p>
        </div>

        {/* Notice box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-left space-y-2">
          <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Đang chờ phê duyệt
          </p>
          <p className="text-sm text-amber-700 leading-relaxed">
            Yêu cầu của bạn sẽ được{' '}
            <span className="font-semibold">ADMIN hệ thống</span> xét duyệt
            trong vòng{' '}
            <span className="font-semibold">3 ngày làm việc</span>. Chúng tôi
            sẽ thông báo kết quả qua email đã đăng ký.
          </p>
        </div>

        {/* Steps */}
        <ol className="text-left space-y-3">
          {[
            'Hệ thống ghi nhận yêu cầu đăng ký của bạn',
            'ADMIN xem xét và xác minh thông tin',
            'Bạn nhận email thông báo kết quả duyệt',
            'Đăng nhập và bắt đầu bán hàng',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="text-sm text-gray-600">{step}</span>
            </li>
          ))}
        </ol>

        {/* CTA */}
        <Link
          to={ROUTES.LOGIN}
          className="block w-full py-2.5 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Quay lại trang đăng nhập
        </Link>
      </div>
    </div>
  );
};
