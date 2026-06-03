import type {
  ShipmentEntity,
  ShipperAllowedStatus,
} from "@/features/delivery/domain/entities/delivery.entity";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ASSIGNED:   { label: 'Chờ nhận',    className: 'bg-amber-50 text-amber-600 border border-amber-200' },
  PICKED_UP:  { label: 'Đã lấy hàng', className: 'bg-blue-50 text-blue-600 border border-blue-200' },
  DELIVERING: { label: 'Đang giao',   className: 'bg-green-50 text-green-700 border border-green-200' },
  DELIVERED:  { label: 'Đã giao',     className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  RETURNING:  { label: 'Đang hoàn',   className: 'bg-orange-50 text-orange-600 border border-orange-200' },
  RETURNED:   { label: 'Đã hoàn',     className: 'bg-gray-100 text-gray-500 border border-gray-200' },
};
 
const NEXT_STATUS: Partial<Record<string, ShipperAllowedStatus>> = {
  PICKED_UP: 'DELIVERING',
  DELIVERING: 'DELIVERED',
};
 
const NEXT_STATUS_LABEL: Partial<Record<string, string>> = {
  PICKED_UP: 'Bắt đầu giao hàng',
  DELIVERING: 'Xác nhận đã giao',
};
 
interface Props {
  shipment: ShipmentEntity;
  tab: 'pending' | 'active' | 'done';
  isAccepting: boolean;
  isUpdating: boolean;
  onAccept: (id: number) => void;
  onUpdateStatus: (id: number, status: ShipperAllowedStatus) => void;
  onClose: () => void;
}
 
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs text-gray-400 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}
 
export function ShipmentDetailModal({
  shipment,
  tab,
  isAccepting,
  isUpdating,
  onAccept,
  onUpdateStatus,
  onClose,
}: Props) {
  const { order } = shipment;
  const nextStatus = NEXT_STATUS[shipment.status];
  const statusCfg = STATUS_CONFIG[shipment.status];
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-green-50 shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-medium">Chi tiết đơn hàng</p>
            <h2 className="text-base font-bold text-gray-900">#{order.orderId}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
 
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <div className="bg-green-50 rounded-2xl p-4 space-y-2.5">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Người nhận</p>
            <InfoRow label="Họ tên" value={order.receiverName} />
            <InfoRow label="Điện thoại" value={order.receiverPhone} />
            <InfoRow label="Địa chỉ" value={order.shippingAddress} />
          </div>
 
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Shop</p>
            <InfoRow label="Tên shop" value={order.seller.storeName} />
          </div>
 
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sản phẩm</p>
            <div className="space-y-2.5">
              {order.orderItems.map((item) => (
                <div key={item.orderItemId} className="flex gap-3 items-center bg-white border border-green-100 rounded-xl p-3">
                  {item.product.productImages?.[0] ? (
                    <img
                      src={item.product.productImages?.[0]?.imageUrl}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      x{item.quantity} · <span className="text-green-700 font-semibold">{item.unitPrice.toLocaleString('vi-VN')}₫</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
          <div className="bg-white border border-green-100 rounded-2xl p-4 space-y-2.5">
            <InfoRow label="Phí ship" value={`${order.shippingFee.toLocaleString('vi-VN')}₫`} />
            <InfoRow label="Thanh toán" value={order.paymentMethod === 'COD' ? 'Tiền mặt (COD)' : 'Online'} />
            <div className="flex justify-between items-center pt-2 border-t border-green-50">
              <span className="text-sm font-bold text-gray-900">Tổng tiền</span>
              <span className="text-base font-bold text-green-700">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
            </div>
          </div>
        </div>
 
        {(tab === 'pending' || (tab === 'active' && nextStatus)) && (
          <div className="px-5 py-4 border-t border-green-50 shrink-0 bg-white">
            {tab === 'pending' && (
              <button
                onClick={() => onAccept(shipment.shipmentId)}
                disabled={isAccepting}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-2xl font-bold text-sm transition-colors disabled:opacity-60 shadow-lg shadow-green-200"
              >
                {isAccepting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </span>
                ) : 'Nhận giao đơn này'}
              </button>
            )}
            {tab === 'active' && nextStatus && (
              <button
                onClick={() => onUpdateStatus(shipment.shipmentId, nextStatus)}
                disabled={isUpdating}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-2xl font-bold text-sm transition-colors disabled:opacity-60 shadow-lg shadow-green-200"
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </span>
                ) : NEXT_STATUS_LABEL[shipment.status]}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
