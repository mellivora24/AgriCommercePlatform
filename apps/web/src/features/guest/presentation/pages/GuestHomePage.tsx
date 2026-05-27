import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/features/products/presentation/hooks/useProducts";
import { useListCategories } from "@/features/categories/presentation/hooks/useCategories";
import { usePagination } from "@/shared/hooks/usePagination";
import { Button } from "@/shared/components/ui/Button";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { Pagination } from "@/shared/components/ui/Pagination";
import { formatCurrency } from "@/shared/utils";
import { useCartStore } from "@/core/store";
import { useToast } from "@/shared/hooks";

const PAGE_SIZE = 8;

const BANNERS = [
  {
    id: 1,
    title: "Nông sản sạch tươi ngon",
    subtitle: "Trực tiếp từ trang trại đến tay bạn",
    cta: "Khám phá ngay",
    bg: "from-green-700 to-green-500",
    image: "🌿",
    accent: "#a7f3d0",
  },
  {
    id: 2,
    title: "Rau củ hữu cơ an toàn",
    subtitle: "Không thuốc trừ sâu, không chất bảo quản",
    cta: "Mua ngay hôm nay",
    bg: "from-emerald-600 to-teal-500",
    image: "🥦",
    accent: "#6ee7b7",
  },
  {
    id: 3,
    title: "Trái cây tươi mỗi ngày",
    subtitle: "Đảm bảo chất lượng, giao hàng nhanh chóng",
    cta: "Xem sản phẩm",
    bg: "from-green-600 to-lime-500",
    image: "🍎",
    accent: "#d9f99d",
  },
];

export const GuestHomePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentPage, onPageChange } = usePagination();
  const { data, isLoading } = useProducts(currentPage, PAGE_SIZE);
  const { data: categoriesData, isLoading: isCategoriesLoading } = useListCategories();
  const { addItem } = useCartStore();
  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const [activeBanner, setActiveBanner] = useState(0);

  // Auto-slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
    toast.success(`${product.name} added to cart`);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── AUTO-SLIDING BANNER ── */}
      <div className="relative mb-10 rounded-2xl overflow-hidden shadow-lg h-64 md:h-80">
        {BANNERS.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 bg-gradient-to-r ${banner.bg} flex items-center justify-between px-10 md:px-16 transition-opacity duration-700 ${
              idx === activeBanner ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="text-white max-w-lg">
              <h2 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight drop-shadow">
                {banner.title}
              </h2>
              <p className="text-sm md:text-base mb-5 text-white/85">
                {banner.subtitle}
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-white text-green-700 font-semibold text-sm md:text-base px-5 py-2 rounded-full hover:bg-green-50 transition-colors shadow"
              >
                {banner.cta}
              </button>
            </div>
            <div className="text-8xl md:text-9xl select-none hidden md:block drop-shadow-lg">
              {banner.image}
            </div>
          </div>
        ))}

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBanner(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === activeBanner
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Danh mục sản phẩm</h2>
        {isCategoriesLoading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} height={80} className="min-w-[120px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 overflow-x-auto pb-2">
            {(categoriesData ?? []).map((category: any) => (
              <button
                key={category.categoryId}
                onClick={() => handleCategoryClick(category.categoryId)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-green-500 bg-green-50 hover:bg-green-100 hover:border-green-300 hover:shadow-md transition-all group cursor-pointer"
              >
                <span className="text-xs font-medium text-gray-700 group-hover:text-green-800 text-center leading-tight line-clamp-2">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── PRODUCTS ── */}
      <h1 className="text-2xl font-bold mb-6">Những sản phẩm mà chúng tôi cung cấp</h1>

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
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {data?.items.map((product: any) => (
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
                      <span className="text-white font-bold text-lg">
                        Hết hàng
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {product.seller.storeName}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-red-600">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-sm text-yellow-500">
                      ⭐ {product.rating}
                    </span>
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3 p-2 rounded bg-gray-50">
                    {product.stockQuantity === 0 ? (
                      <p className="text-sm text-red-600 font-semibold">
                        Hết hàng
                      </p>
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};
