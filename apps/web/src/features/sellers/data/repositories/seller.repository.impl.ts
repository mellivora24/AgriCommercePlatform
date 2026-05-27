
import type { ISellerRepository } from "../../domain/repositories/seller.repository";
import type { SellersApi } from "../api/seller.api";

export const createSellerRepository = (
  sellersApi: SellersApi,
): ISellerRepository => ({
  createProfile: (request) => sellersApi.createProfile(request),
  getProfile: (sellerId) => sellersApi.getProfile(sellerId),
  updateProfile: (sellerId, request) =>
    sellersApi.updateProfile(sellerId, request),
  getBankAccounts: (sellerId) => sellersApi.getBankAccounts(sellerId),
  createBankAccount: (sellerId, request) =>
    sellersApi.createBankAccount(sellerId, request),
  updateBankAccount: (sellerId, accountId, request) =>
    sellersApi.updateBankAccount(sellerId, accountId, request),
  deleteBankAccount: (sellerId, accountId) =>
    sellersApi.deleteBankAccount(sellerId, accountId),
  getWallet: (sellerId) => sellersApi.getWallet(sellerId),
});
