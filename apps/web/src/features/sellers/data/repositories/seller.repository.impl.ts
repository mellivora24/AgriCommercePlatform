import type { ISellerRepository } from "../../domain/repositories/seller.repository";
import type { SellerApi } from "@/features/sellers/data/api/seller.api";

export const createSellerRepository = (
  sellersApi: SellerApi,
): ISellerRepository => ({
  // Placeholder implementation for the Seller Repository
});
