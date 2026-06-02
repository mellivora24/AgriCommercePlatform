import type {
  BankAccount,
  CreateBankAccountInput,
  SellerDashboard,
  SellerOrderList,
  SellerOrdersFilter,
  SellerProductList,
  SellerProductsFilter,
  SellerSettings,
  SellerWithdrawal,
  SellerWithdrawInput,
  UpdateBankAccountInput,
  UpdateSellerSettingsInput,
} from '@/features/sellers/domain/entities/seller.entity';

export interface ISellerRepository {
  getDashboard(): Promise<SellerDashboard>;
  getProducts(filter: SellerProductsFilter): Promise<SellerProductList>;
  getOrders(filter: SellerOrdersFilter): Promise<SellerOrderList>;
  getSettings(): Promise<SellerSettings>;
  updateSettings(data: UpdateSellerSettingsInput): Promise<SellerSettings>;
  withdraw(data: SellerWithdrawInput): Promise<SellerWithdrawal>;
  addBankAccount(data: CreateBankAccountInput): Promise<BankAccount>;
  updateBankAccount(bankAccountId: number, data: UpdateBankAccountInput): Promise<BankAccount>;
  deleteBankAccount(bankAccountId: number): Promise<{ message: string }>;
}
