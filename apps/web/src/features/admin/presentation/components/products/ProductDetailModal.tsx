import { useState } from "react";
import BaseModal from "@/features/admin/presentation/components/BaseModal";
import DeleteProductModal from "@/features/admin/presentation/components/products/DeleteProductModal";
import type { AdminProduct } from "@/features/admin/domain/entities/admin.entity";

interface Props {
  open: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onDeleted?: () => void;
}

const statusLabel: Record<string, { label: string; cls: string }> = {
  AVAILABLE: {
    label: "Đang bán",
    cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  HIDDEN: {
    label: "Đã ẩn",
    cls: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
  OUT_OF_STOCK: {
    label: "Hết hàng",
    cls: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  PENDING: {
    label: "Chờ duyệt",
    cls: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );

export default function ProductDetailModal({
  open,
  product,
  onClose,
  onDeleted,
}: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  if (!product) return null;
  const st = statusLabel[product.status] ?? {
    label: product.status,
    cls: "bg-zinc-100 text-zinc-600 border-zinc-200",
  };

  return (
    <>
      <BaseModal
        open={open}
        onClose={onClose}
        title="Chi tiết sản phẩm"
        subtitle={`#${product.productId}`}
        size="lg"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDeleteOpen(true)}
              className="px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors"
            >
              Xóa sản phẩm
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-lg transition-colors"
            >
              Đóng
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            {product.images.length > 0 ? (
              <>
                <div className="aspect-square rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200">
                  <img
                    src={product.images[imgIdx]?.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {product.images.map((img, i) => (
                      <button
                        key={img.imageId}
                        onClick={() => setImgIdx(i)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? "border-indigo-500" : "border-zinc-200 hover:border-zinc-300"}`}
                      >
                        <img
                          src={img.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${st.cls}`}
                >
                  {st.label}
                </span>
              </div>
              <h3 className="text-base font-semibold text-zinc-900 leading-snug">
                {product.name}
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Giá bán</span>
                <span className="text-base font-bold text-emerald-600">
                  {fmt(product.price)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Tồn kho</span>
                <span className="text-sm text-zinc-800">
                  {product.stockQuantity ?? "Không giới hạn"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Đã bán</span>
                <span className="text-sm text-zinc-800">
                  {product.soldCount.toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Danh mục</span>
                <span className="text-sm text-zinc-800">
                  {product.category?.name ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Cửa hàng</span>
                <span className="text-sm text-indigo-600">
                  {product.seller.storeName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Ngày tạo</span>
                <span className="text-sm text-zinc-500">
                  {new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "medium",
                  }).format(product.createdAt)}
                </span>
              </div>
            </div>

            {product.description && (
              <div>
                <p className="text-xs text-zinc-500 mb-1.5">Mô tả</p>
                <p className="text-sm text-zinc-600 leading-relaxed line-clamp-5">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </BaseModal>

      <DeleteProductModal
        open={deleteOpen}
        product={product}
        onClose={() => setDeleteOpen(false)}
        onSuccess={() => {
          setDeleteOpen(false);
          onClose();
          onDeleted?.();
        }}
      />
    </>
  );
}
