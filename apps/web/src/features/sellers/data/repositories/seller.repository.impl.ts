import type {
  BankAccount,
  SellerDashboard,
  SellerOrderList,
  SellerOrdersFilter,
  SellerProductList,
  SellerProductsFilter,
  SellerSettings,
  SellerWithdrawal,
} from '@/features/sellers/domain/entities/seller.entity';
import type { ISellerRepository } from '@/features/sellers/domain/repositories/seller.repository';
import { sellerApi } from '@/features/sellers/data/api/seller.api';
import {
  mapBankAccount,
  mapDashboard,
  mapOrders,
  mapProducts,
  mapSettings,
  mapWithdrawal,
} from '../mappers/seller.mapper';
import type {
  CreateSellerBankAccountDto,
  SellerWithdrawDto,
  UpdateSellerBankAccountDto,
  UpdateSellerSettingsDto,
} from '@/features/sellers/data/dtos/seller.dto';

export class SellerRepositoryImpl implements ISellerRepository {
  async getDashboard(): Promise<SellerDashboard> {
    const dto = await sellerApi.getDashboard();
    return mapDashboard(dto);
  }

  async getProducts(filter: SellerProductsFilter): Promise<SellerProductList> {
    const dto = await sellerApi.getProducts(filter);
    return mapProducts(dto);
  }

  async getOrders(filter: SellerOrdersFilter): Promise<SellerOrderList> {
    const dto = await sellerApi.getOrders(filter);
    return mapOrders(dto);
  }

  async getSettings(): Promise<SellerSettings> {
    const dto = await sellerApi.getSettings();
    return mapSettings(dto);
  }

  async updateSettings(data: UpdateSellerSettingsDto): Promise<SellerSettings> {
    const dto = await sellerApi.updateSettings(data);
    return mapSettings(dto);
  }

  async withdraw(data: SellerWithdrawDto): Promise<SellerWithdrawal> {
    const dto = await sellerApi.withdraw(data);
    return mapWithdrawal(dto);
  }

  async addBankAccount(data: CreateSellerBankAccountDto): Promise<BankAccount> {
    const dto = await sellerApi.addBankAccount(data);
    return mapBankAccount(dto);
  }

  async updateBankAccount(bankAccountId: number, data: UpdateSellerBankAccountDto): Promise<BankAccount> {
    const dto = await sellerApi.updateBankAccount(bankAccountId, data);
    return mapBankAccount(dto);
  }

  async deleteBankAccount(bankAccountId: number): Promise<{ message: string }> {
    return sellerApi.deleteBankAccount(bankAccountId);
  }
}
