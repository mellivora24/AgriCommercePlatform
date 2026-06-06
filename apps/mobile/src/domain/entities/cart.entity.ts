export interface CartItem {
  productId: number;
  sellerId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface CartResponse {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
}
