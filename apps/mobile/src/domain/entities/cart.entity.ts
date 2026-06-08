export interface CartItem {
  itemId: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  stockQuantity: number;
  image?: string;
  storeName?: string;
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
}
