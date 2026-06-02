import { useState } from "react";
import { useAdminProducts } from "@/features/admin/presentation/hooks/useAdmin";
import ProductDetailModal from "@/features/admin/presentation/components/products/ProductDetailModal";
import type { AdminProduct } from "@/features/admin/domain/entities/admin.entity";
import type { AdminProductListQuery } from "@/features/admin/data/dtos/admin.dto";

const fmt = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n,
  );
const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(d);

const productStatusCfg: Record<string, { label: string; cls: string }> = {
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

export default function AdminProductListPage() {
  const [query, setQuery] = useState<AdminProductListQuery>({
    page: 1,
    limit: 20,
  });
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(
    null,
  );

  const { data, isLoading, refetch } = useAdminProducts({
    ...query,
    search: search || undefined,
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {data ? `${data.meta.total.toLocaleString("vi-VN")} sản phẩm` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setQuery((q) => ({ ...q, page: 1 }));
            }}
            placeholder="Tìm tên sản phẩm..."
            className="w-full bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-500 rounded-xl px-3 py-2.5 pl-9 text-sm focus:outline-none focus:border-zinc-400 transition-colors shadow-sm"
          />
        </div>
        <select
          onChange={(e) =>
            setQuery((q) => ({
              ...q,
              status: (e.target.value as any) || undefined,
              page: 1,
            }))
          }
          className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(productStatusCfg).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            setQuery((q) => ({ ...q, limit: Number(e.target.value), page: 1 }))
          }
          className="bg-white border border-zinc-200 text-zinc-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 shadow-sm"
        >
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
          <option value={100}>100 / trang</option>
        </select>
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Cửa hàng
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Đã bán
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-zinc-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-16 text-center text-zinc-500 text-sm"
                  >
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                data?.data.map((product) => {
                  const st = productStatusCfg[product.status];
                  return (
                    <tr
                      key={product.productId}
                      onClick={() => setSelectedProduct(product)}
                      className="hover:bg-zinc-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0">
                            {product.images[0] ? (
                              <img
                                src={product.images[0].imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-zinc-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-zinc-500">
                              #{product.productId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-zinc-700">
                          {product.seller.storeName}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-zinc-600">
                          {product.category?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-zinc-900">
                          {fmt(product.price)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm text-zinc-600">
                          {product.soldCount.toLocaleString("vi-VN")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${st?.cls ?? "bg-zinc-100 text-zinc-700 border-zinc-200"}`}
                        >
                          {st?.label ?? product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500">
                          {fmtDate(product.createdAt)}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 bg-zinc-50">
            <p className="text-xs text-zinc-500">
              Trang {data.meta.page} / {data.meta.totalPages} ·{" "}
              {data.meta.total.toLocaleString("vi-VN")} sản phẩm
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))
                }
                disabled={(query.page ?? 1) === 1}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                ← Trước
              </button>
              {Array.from({ length: Math.min(data.meta.totalPages, 5) }).map(
                (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setQuery((q) => ({ ...q, page: p }))}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        (query.page ?? 1) === p
                          ? "bg-indigo-600 text-white"
                          : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      {p}
                    </button>
                  );
                },
              )}
              <button
                onClick={() =>
                  setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))
                }
                disabled={(query.page ?? 1) === data.meta.totalPages}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg disabled:opacity-30 transition-colors"
              >
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>

      <ProductDetailModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onDeleted={() => {
          setSelectedProduct(null);
          refetch();
        }}
      />
    </div>
  );
}
