export interface CartDto {
  productId: number;
  quantity: number;
}

export interface DeleteCartItemDto {
  productId: number;
}

export interface CartItemDto {
  productId: number;
  sellerId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface CartResponseDto {
  items: CartItemDto[];
  totalItems: number;
  subtotal: number;
}
export interface CartDto {
  productId: number;
  quantity: number;
}

export interface DeleteCartItemDto {
  productId: number;
}

export interface CartItemDto {
  productId: number;
  sellerId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

export interface CartResponseDto {
  items: CartItemDto[];
  totalItems: number;
  subtotal: number;
}
