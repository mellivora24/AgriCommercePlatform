export interface SellerBankAccount {
  id: number;
  sellerId: number;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfile {
  id: number;
  userId: number;
  storeName: string;
  storeDescription: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logo?: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface SellerWallet {
  id: number;
  sellerId: number;
  balance: number;
  pendingBalance: number;
  totalEarnings: number;
  totalWithdrawals: number;
  updatedAt: string;
}

export interface CreateSellerProfileRequest {
  storeName: string;
  storeDescription: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface UpdateSellerProfileRequest {
  storeName?: string;
  storeDescription?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  logo?: string;
}

export interface CreateBankAccountRequest {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  accountType: 'checking' | 'savings';
}

export interface UpdateBankAccountRequest {
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
  bankName?: string;
  isDefault?: boolean;
}
