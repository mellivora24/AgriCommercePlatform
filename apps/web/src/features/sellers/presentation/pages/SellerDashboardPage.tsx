import React from "react";
import { useNavigate } from "react-router-dom";
import { useSellerDashboard } from "../hooks/useSeller";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import { ROUTES } from "@/core/router/routes";
import type { OrderStatus } from "@/core/types/enum";

const orderStatusVariant: Record<
  OrderStatus,
  "primary" | "secondary" | "success" | "danger" | "warning"
> = {
  PENDING_PAYMENT: "warning",
  PAID: "warning",
  WAITING_SELLER_CONFIRMATION: "warning",
  SELLER_CONFIRMED: "primary",
  SHIPPING: "secondary",
  DELIVERED: "success",
  COMPLETED: "success",
  CANCELLED: "danger",
  RETURN_REQUESTED: "danger",
  REFUNDED: "secondary",
};

const orderStatusLabel: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  WAITING_SELLER_CONFIRMATION: "Chờ xác nhận",
  SELLER_CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  RETURN_REQUESTED: "Yêu cầu hoàn trả",
  REFUNDED: "Đã hoàn tiền",
};

export const SellerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useSellerDashboard();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="mb-4 text-red-600">Không thể tải dữ liệu dashboard</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-56 animate-pulse" />
          <Skeleton className="h-10 w-32 rounded-lg animate-pulse" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-5 space-y-3">
              <Skeleton className="h-4 w-24 animate-pulse" />
              <Skeleton className="h-8 w-20 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Wallet */}
        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-32 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20 animate-pulse" />
                <Skeleton className="h-7 w-28 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Two panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-40 animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-6 w-32 animate-pulse" />
                  <Skeleton className="h-5 w-8 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-40 animate-pulse" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-6 w-6 animate-pulse" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full animate-pulse" />
                    <Skeleton className="h-3 w-24 animate-pulse" />
                  </div>
                  <Skeleton className="h-5 w-20 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent orders table */}
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-40 animate-pulse" />
            <Skeleton className="h-9 w-24 animate-pulse" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-2 border-b last:border-0">
                <Skeleton className="h-5 w-16 animate-pulse" />
                <Skeleton className="h-5 w-28 animate-pulse" />
                <Skeleton className="h-5 w-24 animate-pulse" />
                <Skeleton className="h-5 w-20 animate-pulse" />
                <Skeleton className="h-5 w-24 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { statistics, wallet, recentOrders, orderStatusSummary, topProducts } =
    data;

  const statCards = [
    {
      label: "Tổng sản phẩm",
      value: statistics.totalProducts,
      color: "text-blue-600",
    },
    {
      label: "Đang bán",
      value: statistics.availableProducts,
      color: "text-green-600",
    },
    {
      label: "Hết hàng",
      value: statistics.outOfStockProducts,
      color: "text-red-500",
    },
    {
      label: "Tổng đơn hàng",
      value: statistics.totalOrders,
      color: "text-purple-600",
    },
    {
      label: "Chờ xác nhận",
      value: statistics.waitingOrders,
      color: "text-yellow-600",
    },
    {
      label: "Đang giao",
      value: statistics.shippingOrders,
      color: "text-indigo-600",
    },
    {
      label: "Hoàn thành",
      value: statistics.completedOrders,
      color: "text-green-700",
    },
    {
      label: "Doanh thu",
      value: formatCurrency(statistics.totalRevenue),
      color: "text-red-600",
      isRevenue: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => navigate(ROUTES.SELLER_ORDERS)}>
          Xem đơn hàng
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="border rounded-lg p-5 space-y-1">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Wallet */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Ví của tôi</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Khả dụng</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(wallet.availableBalance)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Chờ xử lý</p>
            <p className="text-xl font-bold text-yellow-600">
              {formatCurrency(wallet.pendingBalance)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Đang rút</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(wallet.withdrawingBalance)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Tổng thu nhập</p>
            <p className="text-xl font-bold text-gray-800">
              {formatCurrency(wallet.lifetimeEarned)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order status summary */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tổng quan đơn hàng</h2>
          <div className="space-y-2">
            {orderStatusSummary.map((s) => (
              <div
                key={s.status}
                className="flex justify-between items-center py-1"
              >
                <Badge variant={orderStatusVariant[s.status]}>
                  {orderStatusLabel[s.status]}
                </Badge>
                <span className="font-semibold">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sản phẩm bán chạy</h2>
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div key={p.productId} className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400 w-6">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{p.name}</p>
                  <p className="text-sm text-gray-500">Đã bán: {p.totalSold}</p>
                </div>
                <span className="font-semibold text-red-600">
                  {formatCurrency(p.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Đơn hàng gần đây</h2>
          <Button onClick={() => navigate(ROUTES.SELLER_ORDERS)}>
            Xem tất cả
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4">Mã đơn</th>
                <th className="pb-3 pr-4">Người mua</th>
                <th className="pb-3 pr-4">Tổng tiền</th>
                <th className="pb-3 pr-4">Trạng thái</th>
                <th className="pb-3">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentOrders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="py-3 pr-4 font-mono">#{order.orderId}</td>
                  <td className="py-3 pr-4">{order.buyer.fullName}</td>
                  <td className="py-3 pr-4 font-semibold">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={orderStatusVariant[order.status]}>
                      {orderStatusLabel[order.status]}
                    </Badge>
                  </td>
                  <td className="py-3 text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
