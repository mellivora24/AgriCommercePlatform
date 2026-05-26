import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './routes';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';
import { RoleGuard } from './guards/role.guard';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout';
import { ProductsListPage } from '@/features/products/presentation/pages/ProductsListPage';
import { LoginPage } from '@/features/auth/presentation/pages/LoginPage';
import { RegisterPage } from '@/features/auth/presentation/pages/RegisterPage';
import { CartPage } from '@/features/cart/presentation/pages/CartPage';
import { CheckoutPage } from '@/features/orders/presentation/pages/CheckoutPage';
import { OrdersListPage } from '@/features/orders/presentation/pages/OrdersListPage';
import { OrderDetailPage } from '@/features/orders/presentation/pages/OrderDetailPage';

export const Router: React.FC = () => (
  <BrowserRouter>
    <Routes>
      {/* App Layout Routes */}
      <Route element={<AppLayout />}>
        <Route path={ROUTES.HOME} element={<ProductsListPage />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsListPage />} />
        <Route path={ROUTES.CART} element={<CartPage />} />
        <Route path={ROUTES.CHECKOUT} element={<AuthGuard><CheckoutPage /></AuthGuard>} />
        <Route path={ROUTES.ORDERS} element={<AuthGuard><OrdersListPage /></AuthGuard>} />
        <Route path={`${ROUTES.ORDERS}/:orderId`} element={<AuthGuard><OrderDetailPage /></AuthGuard>} />
        <Route path={ROUTES.PROFILE} element={<AuthGuard><div className="max-w-7xl mx-auto px-4 py-8">Profile Page (TODO)</div></AuthGuard>} />
      </Route>

      {/* Auth Layout Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<GuestGuard><LoginPage /></GuestGuard>} />
        <Route path={ROUTES.REGISTER} element={<GuestGuard><RegisterPage /></GuestGuard>} />
      </Route>

      {/* Dashboard Layout Routes */}
      <Route element={<DashboardLayout />}>
        <Route path={ROUTES.SELLER_DASHBOARD} element={<RoleGuard allowedRoles={['seller']}><div>Seller Dashboard (TODO)</div></RoleGuard>} />
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<RoleGuard allowedRoles={['admin']}><div>Admin Dashboard (TODO)</div></RoleGuard>} />
      </Route>

      {/* 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<div className="p-8 text-center">Page not found</div>} />
    </Routes>
  </BrowserRouter>
);
