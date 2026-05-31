import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useProducts, useSearchProducts } from "@/features/products/presentation/hooks/useProducts";
import { usePagination } from "@/shared/hooks/usePagination";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Pagination } from "@/shared/components/ui/Pagination";
import { formatCurrency } from "@/shared/utils";
import { useCartStore } from "@/core/store";
import { useToast } from "@/shared/hooks";
import type { ProductListResponse } from "@/features/products/domain/entities/product.entity";

const PAGE_SIZE = 8;

interface ProductsListPageProps {
  externalData?: ProductListResponse;
  isExternalLoading?: boolean;
  onPageChange?: (page: number) => void;
}

export const ProductsListPage: React.FC<ProductsListPageProps> = ({
  externalData,
  isExternalLoading,
  onPageChange: externalOnPageChange,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentPage, onPageChange } = usePagination();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const searchQuery = searchParams.get("search") ?? "";

  const isExternal = externalData !== undefined;

  const { data: fetchedData, isLoading: isFetchedLoading } = useProducts(
    isExternal ? 1 : currentPage,
    PAGE_SIZE,
    isExternal ? undefined : categoryId ? Number(categoryId) : undefined,
  );

  const { data: searchData, isLoading: isSearchLoading } = useSearchProducts(
    searchQuery,
    currentPage,
  );

  const data = isExternal ? externalData : searchQuery ? searchData : fetchedData;
  const isLoading = isExternal
    ? (isExternalLoading ?? false)
    : searchQuery
    ? isSearchLoading
    : isFetchedLoading;

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const { addItem } = useCartStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.productId,
      sellerId: product.sellerId,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.imageUrl || "/placeholder.png",
      sku: product.sku,
    });
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`);
  };

  const handlePageChange = (page: number) => {
    if (isExternal && externalOnPageChange) {
      externalOnPageChange(page);
    } else {
      onPageChange(page);
    }
  };

  const activePage = isExternal ? (externalData?.page ?? 1) : currentPage;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!isExternal && (
        <h1 className="text-3xl font-bold mb-8">
          {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : "Sản phẩm"}
        </h1>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <Skeleton height={200} className="mb-4" />
              <Skeleton height={20} className="mb-2" />
              <Skeleton height={16} />
            </div>
          ))}
        </div>
      ) : !data?.items?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-5xl mb-4">🌿</span>
          <p className="text-lg font-medium">Không tìm thấy sản phẩm nào</p>
          <p className="text-sm mt-1">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data.items.map((product) => (
              <div
                key={product.productId}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product.productId)}
              >
                <div className="relative">
                  <img
                    src={product.images?.[0]?.imageUrl || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.stockQuantity === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Hết hàng</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.seller.storeName}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(Number(product.price))}
                    </span>
                    <span className="text-sm text-yellow-500">⭐ {product.rating ?? "—"}</span>
                  </div>

                  <div className="mb-3 p-2 rounded bg-gray-50">
                    {product.stockQuantity === 0 ? (
                      <p className="text-sm text-red-600 font-semibold">Hết hàng</p>
                    ) : product.stockQuantity < 5 ? (
                      <p className="text-sm text-orange-600 font-semibold">
                        Chỉ còn {product.stockQuantity}
                      </p>
                    ) : (
                      <p className="text-sm text-green-600 font-semibold">
                        Còn {product.stockQuantity} sản phẩm
                      </p>
                    )}
                  </div>

                  <Button
                    fullWidth
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stockQuantity === 0}
                  >
                    {product.stockQuantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={activePage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
