import React, { useState } from "react";
import { useSellerSettings } from "../hooks/useSeller";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import { SellerStoreFormModal } from "@/features/sellers/presentation/components/SellerStoreFormModal";
import { SellerBankAccountModal } from "@/features/sellers/presentation/components/SellerBankAccountModal";
import type { BankAccount } from "@/features/sellers/domain/entities/seller.entity";
import type { SellerStatus } from "@/core/types/enum";

const sellerStatusVariant: Record<
  SellerStatus,
  "success" | "warning" | "danger" | "secondary"
> = {
  APPROVED: "success",
  PENDING: "warning",
  REJECTED: "danger",
  SUSPENDED: "secondary",
};

const sellerStatusLabel: Record<SellerStatus, string> = {
  APPROVED: "Đã duyệt",
  PENDING: "Chờ duyệt",
  REJECTED: "Bị từ chối",
  SUSPENDED: "Đã tạm khóa",
};

export const SellerSettingPage: React.FC = () => {
  const { data, isLoading, error } = useSellerSettings();
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);

  const handleSetPrimaryBank = (account: BankAccount) => {
    console.log("Set primary bank account:", account);
  };

  const handleDeleteBank = (account: BankAccount) => {
    console.log("Delete bank account:", account);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="mb-4 text-red-600">Không thể tải cài đặt</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Cài đặt cửa hàng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold">Thông tin cửa hàng</h2>
            <Button variant="secondary" onClick={() => setShowStoreModal(true)}>
              Chỉnh sửa
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Tên cửa hàng</span>
              <span className="font-semibold">{data.storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái</span>
              <Badge variant={sellerStatusVariant[data.status]}>
                {sellerStatusLabel[data.status]}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phí nền tảng</span>
              <span className="font-semibold">
                {(data.platformFeeRate * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ngày tham gia</span>
              <span>{formatDate(data.createdAt)}</span>
            </div>
            {data.storeDescription && (
              <div>
                <p className="text-gray-500 mb-1">Mô tả</p>
                <p className="text-gray-700">{data.storeDescription}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Thông tin tài khoản</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-semibold">{data.user.email}</span>
            </div>
            {data.user.nickname && (
              <div className="flex justify-between">
                <span className="text-gray-500">Tên hiển thị</span>
                <span className="font-semibold">{data.user.nickname}</span>
              </div>
            )}
            {data.user.phone && (
              <div className="flex justify-between">
                <span className="text-gray-500">Số điện thoại</span>
                <span className="font-semibold">{data.user.phone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Trạng thái tài khoản</span>
              <Badge
                variant={data.user.status === "ACTIVE" ? "success" : "danger"}
              >
                {data.user.status === "ACTIVE" ? "Hoạt động" : data.user.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">Ví của tôi</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Khả dụng</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(data.wallet.availableBalance)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Chờ xử lý</p>
            <p className="text-2xl font-bold text-yellow-600">
              {formatCurrency(data.wallet.pendingBalance)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Tổng thu nhập</p>
            <p className="text-2xl font-bold text-gray-800">
              {formatCurrency(data.wallet.lifetimeEarned)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Đã rút</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(data.wallet.lifetimeWithdrawn)}
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tài khoản ngân hàng</h2>
          <Button variant="primary" onClick={() => setShowBankModal(true)}>
            + Thêm tài khoản
          </Button>
        </div>

        {data.bankAccounts.length === 0 ? (
          <p className="text-center py-8 text-gray-500">
            Chưa có tài khoản ngân hàng nào
          </p>
        ) : (
          <div className="space-y-3">
            {data.bankAccounts.map((account) => (
              <div
                key={account.bankAccountId}
                className="flex items-center justify-between border rounded-lg p-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{account.bankName}</p>
                    {account.isPrimary && (
                      <Badge variant="primary">Mặc định</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {account.accountName} —{" "}
                    <span className="font-mono">{account.accountNumber}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Thêm lúc {formatDate(account.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingBank(account)}
                  >
                    Chỉnh sửa
                  </Button>
                  {!account.isPrimary && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSetPrimaryBank(account)}
                    >
                      Đặt mặc định
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteBank(account)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showStoreModal && (
        <SellerStoreFormModal
          isOpen={showStoreModal}
          storeName={data.storeName}
          storeDescription={data.storeDescription}
          onClose={() => setShowStoreModal(false)}
        />
      )}

      {showBankModal && (
        <SellerBankAccountModal
          isOpen={showBankModal}
          onClose={() => setShowBankModal(false)}
        />
      )}

      {editingBank && (
        <SellerBankAccountModal
          isOpen={!!editingBank}
          bankAccount={editingBank}
          onClose={() => setEditingBank(null)}
        />
      )}
    </div>
  );
};
