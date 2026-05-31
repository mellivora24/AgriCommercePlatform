import React, { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

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

  const handleSubmit = () => {
    console.log("Update store info:", form);
    onClose();
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả cửa hàng
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={form.storeDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, storeDescription: e.target.value }))
              }
              placeholder="Mô tả cửa hàng của bạn"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end border-t pt-4">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </Modal>
  );
};
