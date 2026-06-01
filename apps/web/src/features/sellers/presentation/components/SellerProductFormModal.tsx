import React, { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useListCategories } from "@/features/categories/presentation/hooks/useCategories";
import type { SellerProduct } from "@/features/sellers/domain/entities/seller.entity";
import type { ProductStatus } from "@/core/types/enum";

interface Props {
  isOpen: boolean;
  mode: "create" | "edit";
  product?: SellerProduct;
  onClose: () => void;
}

export const SellerProductFormModal: React.FC<Props> = ({
  mode,
  product,
  onClose,
  isOpen,
}) => {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    stockQuantity: product?.stockQuantity?.toString() ?? "",
    status: (product?.status ?? "AVAILABLE") as ProductStatus,
    categoryId: product?.categoryId?.toString() ?? "",
    imageUrl: product?.images?.[0]?.imageUrl ?? "",
  });

  const { data: categories, isLoading: isCategoriesLoading } =
    useListCategories();

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity, 10),
      categoryId: parseInt(form.categoryId, 10),
    };
    if (mode === "create") {
      console.log("Create product:", payload);
    } else {
      console.log("Update product:", product?.productId, payload);
    }
    onClose();
  };

  const handleDelete = () => {
    console.log("Delete product:", product?.productId);
    onClose();
  };

  // Resolve category id field safely — entity may use 'id' or 'categoryId'
  const getCategoryId = (cat: Record<string, unknown>) =>
    (cat?.categoryId ?? cat?.id) as number | undefined;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="lg">
      <div className="space-y-5 w-full max-w-lg">
        <h2 className="text-xl font-bold">
          {mode === "create" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
        </h2>

        <div className="space-y-4">
          {/* Image URL input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh sản phẩm (URL)
            </label>
            <div className="flex gap-3 items-start">
              <Input
                value={form.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="w-14 h-14 object-cover rounded border flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-14 h-14 bg-gray-100 rounded border flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-400 text-center leading-tight">
                    No Image
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên sản phẩm
            </label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả sản phẩm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VNĐ)
              </label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tồn kho
              </label>
              <Input
                type="number"
                value={form.stockQuantity}
                onChange={(e) => handleChange("stockQuantity", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                value={form.categoryId}
                onChange={(e) => handleChange("categoryId", e.target.value)}
                disabled={isCategoriesLoading}
              >
                <option value="">
                  {isCategoriesLoading ? "Đang tải..." : "Chọn danh mục"}
                </option>
                {categories?.map((category) => {
                  const catId = getCategoryId(
                    category as unknown as Record<string, unknown>
                  );
                  if (catId == null) return null;
                  return (
                    <option key={catId} value={catId.toString()}>
                      {(category as unknown as Record<string, unknown>)?.name as string}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="AVAILABLE">Đang bán</option>
                <option value="HIDDEN">Ẩn</option>
                <option value="OUT_OF_STOCK">Hết hàng</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t pt-4">
          {mode === "edit" && (
            <Button variant="danger" onClick={handleDelete}>
              Xóa sản phẩm
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {mode === "create" ? "Thêm sản phẩm" : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
