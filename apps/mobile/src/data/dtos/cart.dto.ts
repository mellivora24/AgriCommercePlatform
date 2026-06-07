export interface CartDto {
  productId: number;
  quantity: number;
}

export interface DeleteCartItemDto {
  itemId: number;
}

export interface CartItemResponseDto {
  itemId: number;
  productId: number;
  quantity: number;
  product: {
    productId: number;
    name: string;
    price: number;
    stockQuantity: number;
    images: { imageUrl: string }[];
    seller: { storeName: string } | null;
  };
}

export interface CartResponseDto {
  cartId: number;
  items: CartItemResponseDto[];
}
