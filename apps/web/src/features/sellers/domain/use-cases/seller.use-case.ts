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
import type { ISellerRepository } from '@/features/sellers/domain/repositories/seller.repository';

export const GetSellerDashboardUseCase = (repository: ISellerRepository) => ({
  execute(): Promise<SellerDashboard> {
    return repository.getDashboard();
  },
});

export const GetSellerProductsUseCase = (repository: ISellerRepository) => ({
  execute(filter: SellerProductsFilter): Promise<SellerProductList> {
    return repository.getProducts(filter);
  },
});

export const GetSellerOrdersUseCase = (repository: ISellerRepository) => ({
  execute(filter: SellerOrdersFilter): Promise<SellerOrderList> {
    return repository.getOrders(filter);
  },
});

export const GetSellerSettingsUseCase = (repository: ISellerRepository) => ({
  execute(): Promise<SellerSettings> {
    return repository.getSettings();
  },
});

export const UpdateSellerSettingsUseCase = (repository: ISellerRepository) => ({
  execute(data: UpdateSellerSettingsInput): Promise<SellerSettings> {
    return repository.updateSettings(data);
  },
});

export const SellerWithdrawUseCase = (repository: ISellerRepository) => ({
  execute(data: SellerWithdrawInput): Promise<SellerWithdrawal> {
    return repository.withdraw(data);
  },
});

export const AddSellerBankAccountUseCase = (repository: ISellerRepository) => ({
  execute(data: CreateBankAccountInput): Promise<BankAccount> {
    return repository.addBankAccount(data);
  },
});

export const UpdateSellerBankAccountUseCase = (repository: ISellerRepository) => ({
  execute(bankAccountId: number, data: UpdateBankAccountInput): Promise<BankAccount> {
    return repository.updateBankAccount(bankAccountId, data);
  },
});

export const DeleteSellerBankAccountUseCase = (repository: ISellerRepository) => ({
  execute(bankAccountId: number): Promise<{ message: string }> {
    return repository.deleteBankAccount(bankAccountId);
  },
});
