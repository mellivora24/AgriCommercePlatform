import React from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import type { SellerProduct } from "@/features/sellers/domain/entities/seller.entity";
import type { ProductStatus } from "@/core/types/enum";

const productStatusVariant: Record<
  ProductStatus,
  "success" | "warning" | "danger"
> = {
  AVAILABLE: "success",
  HIDDEN: "warning",
  OUT_OF_STOCK: "danger",
};

const productStatusLabel: Record<ProductStatus, string> = {
  AVAILABLE: "Đang bán",
  HIDDEN: "Đã ẩn",
  OUT_OF_STOCK: "Hết hàng",
};

interface Props {
  isOpen: boolean;
  product: SellerProduct;
  onClose: () => void;
  onEdit: () => void;
}

export const SellerProductDetailModal: React.FC<Props> = ({
  product,
  onClose,
  onEdit,
}) => {
  return (
    <Modal onClose={onClose} isOpen={true}>
      <div className="space-y-5 w-full max-w-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <Badge variant={productStatusVariant[product.status]}>
            {productStatusLabel[product.status]}
          </Badge>
        </div>

        {product.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((img) => (
              <img
                key={img.imageId}
                src={img.imageUrl}
                alt={product.name}
                className="w-24 h-24 rounded object-cover flex-shrink-0"
              />
            ))}
          </div>
        )}

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Danh mục</span>
            <span className="font-medium">{product.category.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Giá bán</span>
            <span className="font-bold text-lg">
              {formatCurrency(product.price)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tồn kho</span>
            <span
              className={`font-semibold ${product.stockQuantity === 0 ? "text-red-500" : ""}`}
            >
              {product.stockQuantity}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Ngày tạo</span>
            <span>{formatDate(product.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Cập nhật</span>
            <span>{formatDate(product.updatedAt)}</span>
          </div>
        </div>

        {product.description && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Mô tả</p>
            <p className="text-sm text-gray-700">{product.description}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end border-t pt-4">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={onEdit}>
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </Modal>
  );
};
