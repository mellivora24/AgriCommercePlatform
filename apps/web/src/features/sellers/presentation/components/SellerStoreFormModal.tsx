import React, { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useUpdateSellerSettings } from "@/features/sellers/presentation/hooks/useSeller";

interface Props {
  isOpen: boolean;
  storeName: string;
  storeDescription: string;
  onClose: () => void;
}

export const SellerStoreFormModal: React.FC<Props> = ({
  isOpen,
  storeName,
  storeDescription,
  onClose,
}) => {
  const [form, setForm] = useState({ storeName, storeDescription });

  const { mutate: updateSettings, isPending } = useUpdateSellerSettings();

  const handleSubmit = () => {
    updateSettings(
      {
        storeName: form.storeName,
        storeDescription: form.storeDescription,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className="space-y-5 w-full max-w-md">
        <h2 className="text-xl font-bold">Chỉnh sửa thông tin cửa hàng</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên cửa hàng
            </label>
            <Input
              value={form.storeName}
              onChange={(e) =>
                setForm((f) => ({ ...f, storeName: e.target.value }))
              }
              placeholder="Tên cửa hàng"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả cửa hàng
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={4}
              value={form.storeDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, storeDescription: e.target.value }))
              }
              placeholder="Mô tả cửa hàng của bạn"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end border-t pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
