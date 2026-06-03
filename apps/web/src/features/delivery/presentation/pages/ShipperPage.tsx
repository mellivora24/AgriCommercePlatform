import { useDelivery } from "@/features/delivery/presentation/hooks/useDelivery";
import { ShipmentCard } from "@/features/delivery/presentation/components/ShipmentCard";
import { ShipmentDetailModal } from "@/features/delivery/presentation/components/ShipmentDetailModal";
import type { ShipmentTab } from "@/features/delivery/domain/entities/delivery.entity";

const TABS: { key: ShipmentTab; label: string; count?: number }[] = [
  { key: "pending", label: "Chờ giao" },
  { key: "active", label: "Đang giao" },
  { key: "done", label: "Đã giao" },
];

export default function ShipperPage() {
  const {
    tab,
    page,
    setPage,
    handleTabChange,
    selectedShipment,
    setSelectedShipment,
    shipmentsQuery,
    acceptMutation,
    updateStatusMutation,
  } = useDelivery();

  const { data, isLoading, isError } = shipmentsQuery;

  return (
    <div className="min-h-screen bg-green-50/40">
      <header className="bg-white border-b border-green-100 px-4 py-4 sticky top-0 z-20 shadow-sm shadow-green-100/50">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">
              Quản lý giao hàng
            </h1>
            {data && (
              <p className="text-xs text-green-600 font-medium">
                {data.meta.total} đơn hàng
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-green-100 sticky top-[65px] z-10">
        <div className="max-w-xl mx-auto flex">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all border-b-2 ${
                tab === t.key
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-3 max-w-xl mx-auto pb-8">
        {isLoading && (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Đang tải...</p>
          </div>
        )}
        {isError && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-sm text-red-500 font-medium">Có lỗi xảy ra</p>
            <p className="text-xs text-gray-400 mt-1">Vui lòng thử lại sau</p>
          </div>
        )}
        {!isLoading && !isError && data?.items.length === 0 && (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Không có đơn hàng nào
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {tab === "pending"
                ? "Chưa có đơn chờ giao"
                : tab === "active"
                  ? "Bạn chưa nhận đơn nào"
                  : "Chưa có đơn hoàn thành"}
            </p>
          </div>
        )}
        {data?.items.map((shipment) => (
          <ShipmentCard
            key={shipment.shipmentId}
            shipment={shipment}
            onClick={setSelectedShipment}
          />
        ))}

        {data && data.meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm rounded-xl border border-green-200 text-green-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
            >
              Trước
            </button>
            <span className="px-3 py-2 text-sm text-gray-500 font-medium">
              {page} / {data.meta.totalPages}
            </span>
            <button
              disabled={page === data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm rounded-xl border border-green-200 text-green-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-50 transition-colors"
            >
              Sau
            </button>
          </div>
        )}
      </div>

      {selectedShipment && (
        <ShipmentDetailModal
          shipment={selectedShipment}
          tab={tab}
          isAccepting={acceptMutation.isPending}
          isUpdating={updateStatusMutation.isPending}
          onAccept={(id) => acceptMutation.mutate(id)}
          onUpdateStatus={(id, status) =>
            updateStatusMutation.mutate({ id, status })
          }
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  );
}
