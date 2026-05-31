export type UserRole = 'buyer' | 'seller' | 'admin' | 'shipper';
export type UserStatus = 'active' | 'suspended' | 'banned';

export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface SellerProfile {
  id: number;
  userId: number;
  storeName: string;
  description: string;
  status: SellerStatus;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  verificationDocument?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SellerListResponse {
  items: SellerProfile[];
  total: number;
  page: number;
  limit: number;
}

export interface PlatformStats {
  totalUsers: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingSellers: number;
  suspendedUsers: number;
}

export interface SellerStats {
  totalProducts: number;
  totalOrders: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
}
