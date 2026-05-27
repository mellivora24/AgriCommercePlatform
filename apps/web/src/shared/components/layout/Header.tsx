import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Search, LogOut, ChevronDown, Leaf } from 'lucide-react';

import { ROUTES } from '@/core/router/routes';
import { useAuthStore, useCartStore, useUIStore } from '@/core/store';

export const Header: React.FC = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const totalCount = useCartStore((state) => state.totalCount);

  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [searchFocused, setSearchFocused] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="px-8">
          <div className="flex h-16 items-center gap-4">

            {/* Sidebar Toggle */}
            {/* <button
              onClick={toggleSidebar}
              className="group flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
              aria-label="Toggle sidebar"
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </span>
            </button> */}

            {/* Logo */}
            <Link to={ROUTES.GUEST_HOME} className="group flex flex-shrink-0 items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-md shadow-green-200 transition-shadow duration-300 group-hover:shadow-green-300">
                <Leaf className="absolute -right-1 -top-1 h-5 w-5 rotate-12 text-white/20" />
                <span className="relative z-10 text-sm font-black tracking-tight text-white">FA</span>
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-green-600">
                  Fresh Agriculture
                </span>
                <span className="text-[13px] font-bold leading-none text-gray-800">
                  Nông sản sạch
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex flex-1 justify-center px-4">
              <div
                className={`
                  relative flex w-full max-w-lg items-center overflow-hidden rounded-full border bg-gray-50
                  transition-all duration-300
                  ${searchFocused
                    ? 'border-green-400 bg-white shadow-md shadow-green-100 ring-2 ring-green-100'
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                  <Search
                    className={`ml-3 h-4 w-4 flex-shrink-0 transition-colors duration-200 ${
                      searchFocused ? 'text-green-500' : 'text-gray-400'
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm rau củ, trái cây..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  {searchFocused && (
                    <button className="mr-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-green-600">
                      Tìm
                    </button>
                  )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-shrink-0 items-center gap-2">

              {/* Cart */}
              <Link to={ROUTES.CART} className="group relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                {totalCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white shadow-md shadow-green-300 ring-2 ring-white">
                    {totalCount > 99 ? '99+' : totalCount}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-all duration-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-xs font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <span className="hidden max-w-[80px] truncate font-medium sm:block">
                      {user?.name}
                    </span>
                    <ChevronDown className={`hidden h-3 w-3 text-gray-400 transition-transform duration-200 sm:block ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60">
                      <div className="border-b border-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400">Đã đăng nhập với</p>
                        <p className="truncate text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-400">Tài khoản</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to={ROUTES.LOGIN}>
                    <button className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900">
                      Đăng nhập
                    </button>
                  </Link>
                  <Link to={ROUTES.REGISTER}>
                    <button className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-green-200 transition-all duration-200 hover:shadow-green-300 hover:brightness-105 active:scale-95">
                      Đăng ký
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
