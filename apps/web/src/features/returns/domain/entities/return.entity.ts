export type ReturnStatus = 'pending' | 'approved' | 'rejected' | 'shipped' | 'received' | 'completed' | 'cancelled';
export type ReturnReason = 'defective' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'other';

export interface ReturnItem {
  productId: string;
  name: string;
  quantity: number;
  reason: ReturnReason;
}

export interface Return {
  id: string;
  orderId: string;
  returnNumber: string;
  items: ReturnItem[];
  status: ReturnStatus;
  reason: ReturnReason;
  description: string;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReturnListResponse {
  items: Return[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateReturnRequest {
  orderId: string;
  items: ReturnItem[];
  description: string;
}
