import React, { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { useListCategories } from "@/features/categories/presentation/hooks/useCategories";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/features/products/presentation/hooks/useProducts";
import type { SellerProduct } from "@/features/sellers/domain/entities/seller.entity";
import type { ProductStatus } from "@/core/types/enum";

interface Props {
  isOpen: boolean;
  mode: "create" | "edit";
  product?: SellerProduct;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SellerProductFormModal: React.FC<Props> = ({
  mode,
  product,
  onClose,
  isOpen,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    stockQuantity: product?.stockQuantity?.toString() ?? "",
    status: (product?.status ?? "PENDING") as ProductStatus,
    categoryId: product?.categoryId?.toString() ?? "",
  });

  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map((img) => img.imageUrl).filter(Boolean) ?? [""],
  );

  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: categories, isLoading: isCategoriesLoading } =
    useListCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const isLoading =
    createProduct.isPending ||
    updateProduct.isPending ||
    deleteProduct.isPending;

  // Nếu là edit và trạng thái là PENDING thì không cho chỉnh sửa
  const isPending = mode === "edit" && product?.status === "PENDING";

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  };

  const handleAddImage = () => {
    setImageUrls((prev) => [...prev, ""]);
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPayload = () => {
    const validImages = imageUrls
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ({ imageUrl: url }));

    return {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stockQuantity: form.stockQuantity
        ? parseInt(form.stockQuantity, 10)
        : undefined,
      categoryId: form.categoryId ? parseInt(form.categoryId, 10) : undefined,
      status: form.status,
      images: validImages.length > 0 ? validImages : undefined,
    };
  };

  const handleSubmit = async () => {
    const payload = buildPayload();
    try {
      if (mode === "create") {
        await createProduct.mutateAsync(payload);
      } else if (product?.productId) {
        await updateProduct.mutateAsync({ id: product.productId, payload });
      }
      onSuccess?.();
      onClose();
    } catch {
      // error handled by mutation state
    }
  };

  const handleDelete = async () => {
    if (!product?.productId) return;
    try {
      await deleteProduct.mutateAsync(product.productId);
      onSuccess?.();
      onClose();
    } catch {
      // error handled by mutation state
    }
  };

  const getCategoryId = (cat: Record<string, unknown>) =>
    (cat?.categoryId ?? cat?.id) as number | undefined;

  const errorMessage =
    createProduct.error?.message ||
    updateProduct.error?.message ||
    deleteProduct.error?.message;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="lg">
      <div className="space-y-5 w-full max-w-lg">
        <h2 className="text-xl font-bold">
          {mode === "create" ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
        </h2>

        {isPending && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm px-3 py-2 rounded-lg">
            Sản phẩm đang chờ duyệt, không thể chỉnh sửa.
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          {/* Multi-image input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Ảnh sản phẩm
              </label>
              {!isPending && (
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Thêm ảnh
                </button>
              )}
            </div>

            <div className="space-y-2">
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    value={url}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 text-sm"
                    disabled={isPending}
                  />
                  {url ? (
                    <img
                      src={url}
                      alt={`preview ${index + 1}`}
                      className="w-10 h-10 object-cover rounded border flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded border flex-shrink-0" />
                  )}
                  {imageUrls.length > 1 && !isPending && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-gray-400 hover:text-red-500 flex-shrink-0 mt-2"
                      title="Xoá ảnh này"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
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
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Mô tả sản phẩm"
              disabled={isPending}
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
                disabled={isPending}
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
                disabled={isPending}
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
                disabled={isCategoriesLoading || isPending}
              >
                <option value="">
                  {isCategoriesLoading ? "Đang tải..." : "Chọn danh mục"}
                </option>
                {categories?.map((category) => {
                  const catId = getCategoryId(
                    category as unknown as Record<string, unknown>,
                  );
                  if (catId == null) return null;
                  return (
                    <option key={catId} value={catId.toString()}>
                      {
                        (category as unknown as Record<string, unknown>)
                          ?.name as string
                      }
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
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                disabled={isPending}
              >
                {isPending && <option value="PENDING">Chờ duyệt</option>}
                <option value="AVAILABLE">Đang bán</option>
                <option value="HIDDEN">Ẩn</option>
                <option value="OUT_OF_STOCK">Hết hàng</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between border-t pt-4">
          {mode === "edit" &&
            (confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">Xác nhận xoá?</span>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {deleteProduct.isPending ? "Đang xoá..." : "Xoá"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setConfirmDelete(false)}
                >
                  Không
                </Button>
              </div>
            ) : (
              <Button
                variant="danger"
                onClick={() => setConfirmDelete(true)}
                disabled={isLoading}
              >
                Xóa sản phẩm
              </Button>
            ))}
          <div className="flex gap-3 ml-auto">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading || isPending}
            >
              {isLoading
                ? "Đang lưu..."
                : mode === "create"
                  ? "Thêm sản phẩm"
                  : "Lưu thay đổi"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
