import type { ShipmentEntity } from "@/features/delivery/domain/entities/delivery.entity";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ASSIGNED:   { label: 'Chờ nhận',    className: 'bg-amber-50 text-amber-600 border border-amber-200' },
  PICKED_UP:  { label: 'Đã lấy hàng', className: 'bg-blue-50 text-blue-600 border border-blue-200' },
  DELIVERING: { label: 'Đang giao',   className: 'bg-green-50 text-green-700 border border-green-200' },
  DELIVERED:  { label: 'Đã giao',     className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  RETURNING:  { label: 'Đang hoàn',   className: 'bg-orange-50 text-orange-600 border border-orange-200' },
  RETURNED:   { label: 'Đã hoàn',     className: 'bg-gray-100 text-gray-500 border border-gray-200' },
};
 
interface Props {
  shipment: ShipmentEntity;
  onClick: (shipment: ShipmentEntity) => void;
}
 
export function ShipmentCard({ shipment, onClick }: Props) {
  const { order } = shipment;
  const status = STATUS_CONFIG[shipment.status];
 
  return (
    <div
      className="bg-white rounded-2xl border border-green-100 p-4 cursor-pointer hover:border-green-300 hover:shadow-md hover:shadow-green-100/60 transition-all active:scale-[0.99]"
      onClick={() => onClick(shipment)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 rounded-full bg-green-500" />
          <div>
            <p className="text-xs text-gray-400 font-medium">Đơn hàng</p>
            <p className="text-sm font-bold text-gray-900">#{order.orderId}</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${status.className}`}>
          {status.label}
        </span>
      </div>
 
      <div className="space-y-1 mb-3">
        <p className="text-sm font-semibold text-gray-800">{order.receiverName}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          {order.receiverPhone}
        </p>
        <p className="text-xs text-gray-400 flex items-start gap-1.5 line-clamp-1">
          <svg className="w-3 h-3 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {order.shippingAddress}
        </p>
      </div>
 
      <div className="flex justify-between items-center pt-3 border-t border-green-50">
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{order.seller.storeName}</span>
        <span className="text-sm font-bold text-green-700">
          {order.totalAmount.toLocaleString('vi-VN')}₫
        </span>
      </div>
    </div>
  );
}
