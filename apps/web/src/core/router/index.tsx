import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { RoleGuard } from './guards/role.guard';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { HomePage } from '@/features/home/presentation/pages/HomePage';
import { ProductsListPage, ProductDetailPage } from '@/features/products/presentation/pages';
import { LoginPage } from '@/features/auth/presentation/pages/LoginPage';
import { RegisterPage } from '@/features/auth/presentation/pages/RegisterPage';
import { CartPage } from '@/features/cart/presentation/pages/CartPage';
import { CheckoutPage } from '@/features/orders/presentation/pages/CheckoutPage';
import { OrdersListPage } from '@/features/orders/presentation/pages/OrdersListPage';
import { OrderDetailPage } from '@/features/orders/presentation/pages/OrderDetailPage';
import { SellerPendingPage } from '@/features/auth/presentation/pages/SellerPendingPage';
import { SellerDashboardPage } from '@/features/sellers/presentation/pages/SellerDashboardPage';
import { SellerProductPage } from '@/features/sellers/presentation/pages/SellerProductPage';
import { SellerOrderPage } from '@/features/sellers/presentation/pages/SellerOrderPage';
import { SellerSettingPage } from '@/features/sellers/presentation/pages/SellerSettingPage';
import AdminDashboardPage from '@/features/admin/presentation/pages/AdminDashboardPage';
import AdminUserPage from '@/features/admin/presentation/pages/AdminUserPage';
import AdminStorePage from '@/features/admin/presentation/pages/AdminStorePage';
import AdminProductListPage from '@/features/admin/presentation/pages/AdminProductListPage';

export const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME_PAGE} element={<HomePage />} />
        <Route path={ROUTES.SELLER_PENDING} element={<SellerPendingPage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsListPage />} />
        <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
        <Route
          path={ROUTES.CART}
          element={<AuthGuard><CartPage /></AuthGuard>}
        />
        <Route
          path={ROUTES.CHECKOUT}
          element={<AuthGuard><CheckoutPage /></AuthGuard>}
        />
        <Route
          path={ROUTES.ORDERS}
          element={<AuthGuard><OrdersListPage /></AuthGuard>}
        />
        <Route
          path={`${ROUTES.ORDERS}/:orderId`}
          element={<AuthGuard><OrderDetailPage /></AuthGuard>}
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <AuthGuard>
              <div className="max-w-7xl mx-auto px-4 py-8">Profile Page (TODO)</div>
            </AuthGuard>
          }
        />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route
          path={ROUTES.LOGIN}
          element={<GuestGuard><LoginPage /></GuestGuard>}
        />
        <Route
          path={ROUTES.REGISTER}
          element={<GuestGuard><RegisterPage /></GuestGuard>}
        />
      </Route>

      {/* Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        <Route
          path={ROUTES.SELLER_DASHBOARD}
          element={<RoleGuard allowedRoles={['SELLER']}><SellerDashboardPage /></RoleGuard>}
        />
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboardPage /></RoleGuard>}
        />
        <Route
          path={ROUTES.SELLER_PRODUCTS}
          element={<RoleGuard allowedRoles={['SELLER']}><SellerProductPage /></RoleGuard>}
        />
        <Route
          path={ROUTES.SELLER_ORDERS}
          element={<RoleGuard allowedRoles={['SELLER']}><SellerOrderPage /></RoleGuard>}
        />
        <Route
          path={ROUTES.SELLER_STORE}
          element={<RoleGuard allowedRoles={['SELLER']}><SellerSettingPage /></RoleGuard>}
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={<RoleGuard allowedRoles={['ADMIN']}><AdminUserPage /></RoleGuard>}
        />
        <Route
          path={ROUTES.ADMIN_PRODUCTS}
          element={<RoleGuard allowedRoles={['ADMIN']}><AdminProductListPage /></RoleGuard>}
        />
        <Route
          path={ROUTES.ADMIN_STORES}
          element={<RoleGuard allowedRoles={['ADMIN']}><AdminStorePage /></RoleGuard>}
        />
        <Route
          path={ROUTES.ADMIN_USERS}
          element={<RoleGuard allowedRoles={['ADMIN']}><AdminUserPage /></RoleGuard>}
        />
      </Route>

      <Route
        path={ROUTES.NOT_FOUND}
        element={<div className="p-8 text-center">Page not found</div>}
      />
    </Routes>
  </BrowserRouter>
);
