import React, { useState } from "react";
import { useSellerProducts } from "../hooks/useSeller";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Pagination } from "@/shared/components/ui/Pagination";
import { formatCurrency, formatDate } from "@/shared/utils/format";
import { SellerProductFormModal } from "@/features/sellers/presentation/components/SellerProductFormModal";
import { SellerProductDetailModal } from "@/features/sellers/presentation/components/SellerProductDetailModal";
import type {
  SellerProduct,
  SellerProductsFilter,
} from "@/features/sellers/domain/entities/seller.entity";
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

const STATUS_TABS: { label: string; value: ProductStatus | undefined }[] = [
  { label: "Tất cả", value: undefined },
  { label: "Đang bán", value: "AVAILABLE" },
  { label: "Đã ẩn", value: "HIDDEN" },
  { label: "Hết hàng", value: "OUT_OF_STOCK" },
];

export const SellerProductPage: React.FC = () => {
  const [filter, setFilter] = useState<SellerProductsFilter>({
    page: 1,
    limit: 10,
  });
  const [keyword, setKeyword] = useState("");
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(
    null,
  );
  const [viewingProduct, setViewingProduct] = useState<SellerProduct | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, isLoading, error } = useSellerProducts(filter);

  const handleSearch = () => {
    setFilter((f) => ({ ...f, keyword, page: 1 }));
  };

  const handleStatusTab = (status: ProductStatus | undefined) => {
    setFilter((f) => ({ ...f, status, page: 1 }));
  };

  const handlePage = (page: number) => {
    setFilter((f) => ({ ...f, page }));
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center py-12">
        <p className="mb-4 text-red-600">Không thể tải danh sách sản phẩm</p>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sản phẩm của tôi</h1>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + Thêm sản phẩm
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch}>Tìm</Button>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        {STATUS_TABS.map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => handleStatusTab(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter.status === tab.value
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Không có sản phẩm nào
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="border-b text-left text-gray-500">
                  <th className="px-4 py-3">Sản phẩm</th>
                  <th className="px-4 py-3">Danh mục</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Tồn kho</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Ngày tạo</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((product) => {
                  const image = product.images?.[0]?.imageUrl;
                  return (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className="w-12 h-12 rounded object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p
                              className="font-semibold truncate max-w-[200px] cursor-pointer hover:text-blue-600"
                              onClick={() => setViewingProduct(product)}
                            >
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              ID: {product.productId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.category.name}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            product.stockQuantity === 0
                              ? "text-red-500 font-semibold"
                              : ""
                          }
                        >
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={productStatusVariant[product.status]}>
                          {productStatusLabel[product.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          Chỉnh sửa
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePage}
              />
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <SellerProductFormModal
          isOpen={showCreateModal}
          mode="create"
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {editingProduct && (
        <SellerProductFormModal
          isOpen={Boolean(editingProduct)}
          mode="edit"
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {viewingProduct && (
        <SellerProductDetailModal
          isOpen={Boolean(viewingProduct)}
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onEdit={() => {
            setEditingProduct(viewingProduct);
            setViewingProduct(null);
          }}
        />
      )}
    </div>
  );
};
