import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../../../core/store';
import { ROUTES } from '../../../core/router/routes';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const totalCount = useCartStore((state) => state.totalCount);

  const handleLogout = () => {
    clearAuth();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="font-bold text-lg text-gray-900">TMDT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to={ROUTES.PRODUCTS}
              className="text-gray-700 hover:text-red-600"
            >
              Products
            </Link>
            <Link
              to={ROUTES.ORDERS}
              className="text-gray-700 hover:text-red-600"
            >
              Orders
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to={ROUTES.CART} className="relative">
              <Button variant="ghost" size="sm">
                Cart
              </Button>
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{user?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
