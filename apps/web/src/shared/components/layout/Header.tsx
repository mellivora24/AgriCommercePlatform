import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, LogOut, ChevronDown, Leaf } from 'lucide-react';

import { ROUTES } from '@/core/router/routes';
import { useAuthStore, useCartStore, useUIStore } from '@/core/store';
import { useSearchProducts } from '@/features/products/presentation/hooks/useProducts';
import { useGetCart } from '@/features/cart/presentation/hooks/useCart';
import { formatCurrency } from '@/shared/utils';

export const Header: React.FC = () => {
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const guestItems = useCartStore((state) => state.guestItems);
  const { clearCart } = useCartStore();
  const { setCartDrawerOpen } = useUIStore();
  const { data: cartData } = useGetCart();

  const totalCount = isAuthenticated
    ? (cartData?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0)
    : guestItems.reduce((s, i) => s + i.quantity, 0);
  const navigate = useNavigate();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Reset search on route change
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch("");
      setDebouncedSearch("");
      setSearchFocused(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: searchData, isLoading: isSearchLoading } =
    useSearchProducts(debouncedSearch);

  const handleLogout = () => {
    clearCart();
    clearAuth();
    setUserMenuOpen(false);
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setDebouncedSearch("");
    setSearchFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
    setSearch("");
    setDebouncedSearch("");
    setSearchFocused(false);
  };

  const showDropdown = searchFocused && debouncedSearch.length > 0;

  const dropdownItems = searchData?.items?.slice(0, 5) ?? [];

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="px-8">
          <div className="flex h-16 items-center gap-4">
            {/* Logo */}
            <Link
              to={ROUTES.HOME_PAGE}
              className="group flex flex-shrink-0 items-center gap-2.5"
            >
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-md shadow-green-200 transition-shadow duration-300 group-hover:shadow-green-300">
                <Leaf className="absolute -right-1 -top-1 h-5 w-5 rotate-12 text-white/20" />
                <span className="relative z-10 text-sm font-black tracking-tight text-white">
                  FA
                </span>
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
              <div ref={searchRef} className="relative w-full max-w-lg">
                <div
                  className={`
                    flex items-center overflow-hidden rounded-full border bg-gray-50
                    transition-all duration-300
                    ${
                      searchFocused
                        ? "border-green-400 bg-white shadow-md shadow-green-100 ring-2 ring-green-100"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <Search
                    className={`ml-3 h-4 w-4 flex-shrink-0 transition-colors duration-200 ${
                      searchFocused ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Tìm kiếm rau củ, trái cây..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none"
                  />
                  {search && (
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleSearch}
                      className="mr-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-green-600"
                    >
                      Tìm
                    </button>
                  )}
                </div>

                {/* Search Dropdown */}
                {showDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 z-50">
                    {isSearchLoading ? (
                      <div className="flex items-center justify-center py-6 text-sm text-gray-400">
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
                        Đang tìm kiếm...
                      </div>
                    ) : dropdownItems.length === 0 ? (
                      <div className="py-6 text-center text-sm text-gray-400">
                        Không tìm thấy sản phẩm nào
                      </div>
                    ) : (
                      <>
                        <ul>
                          {dropdownItems.map((product) => (
                            <li key={product.productId}>
                              <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() =>
                                  handleProductClick(product.productId)
                                }
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-green-50"
                              >
                                <img
                                  src={
                                    product.images?.[0]?.imageUrl ||
                                    "/placeholder.png"
                                  }
                                  alt={product.name}
                                  className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-gray-800">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {product.seller.storeName}
                                  </p>
                                </div>
                                <span className="flex-shrink-0 text-sm font-semibold text-red-500">
                                  {formatCurrency(Number(product.price))}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>

                        {(searchData?.total ?? 0) > 5 && (
                          <button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={handleSearch}
                            className="flex w-full items-center justify-center gap-1 border-t border-gray-50 py-2.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50"
                          >
                            <Search className="h-3.5 w-3.5" />
                            Xem tất cả {searchData?.total} kết quả
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-shrink-0 items-center gap-2">
              {/* Cart */}
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(ROUTES.CART);
                  } else {
                    setCartDrawerOpen(true);
                  }
                }}
                className="group relative"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-all duration-200 hover:border-green-300 hover:bg-green-50 hover:text-green-700">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                {totalCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white shadow-md shadow-green-300 ring-2 ring-white">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-all duration-200 hover:border-green-300 hover:bg-green-50"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-600 text-xs font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <span className="hidden max-w-[80px] truncate font-medium sm:block">
                      {user?.name}
                    </span>
                    <ChevronDown
                      className={`hidden h-3 w-3 text-gray-400 transition-transform duration-200 sm:block ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60">
                      <div className="border-b border-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400">
                          Đã đăng nhập với
                        </p>
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {user?.name}
                        </p>
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
