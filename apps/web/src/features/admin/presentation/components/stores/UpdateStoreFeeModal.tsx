import { useState } from "react";
import BaseModal from "@/features/admin/presentation/components/BaseModal";
import { useUpdateStoreFee } from "@/features/admin/presentation/hooks/useAdmin";
import type { Store } from "@/features/admin/domain/entities/admin.entity";

interface Props {
  open: boolean;
  store: Store | null;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormProps {
  store: Store;
  onClose: () => void;
  onSuccess?: () => void;
}

function StoreFeeForm({ store, onClose, onSuccess }: FormProps) {
  const [value, setValue] = useState(String(store.platformFeeRate));
  const [error, setError] = useState("");

  const { mutate, isPending } = useUpdateStoreFee();

  const handleClose = () => {
    setError("");
    onClose();
  };

  const handleSave = () => {
    const num = parseFloat(value);

    if (isNaN(num) || num < 0 || num > 100) {
      setError("Phí phải là số từ 0 đến 100");
      return;
    }

    mutate(
      {
        sellerId: store.sellerId,
        body: {
          platformFeeRate: num,
        },
      },
      {
        onSuccess: () => {
          handleClose();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <>
      <div className="space-y-4">
        <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-xs text-zinc-500 mb-0.5">Mức phí hiện tại</p>
          <p className="text-lg font-semibold text-zinc-900">
            {store.platformFeeRate}%
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-600 mb-1.5">
            Mức phí mới (%)
          </label>

          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
              placeholder="0.00"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">
              %
            </span>
          </div>

          {error && (
            <p className="mt-1.5 text-xs text-red-400">
              {error}
            </p>
          )}

            <p className="mt-1.5 text-xs text-zinc-500">
            Nhập giá trị từ 0 đến 100. Áp dụng cho các đơn hàng mới.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={handleClose}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg transition-colors disabled:opacity-50"
        >
          Hủy
        </button>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {isPending && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}
          Lưu thay đổi
        </button>
      </div>
    </>
  );
}

export default function UpdateStoreFeeModal({
  open,
  store,
  onClose,
  onSuccess,
}: Props) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Cập nhật phí nền tảng"
      subtitle={store?.storeName}
      size="sm"
    >
      {store && (
        <StoreFeeForm
          key={store.sellerId}
          store={store}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </BaseModal>
  );
}
