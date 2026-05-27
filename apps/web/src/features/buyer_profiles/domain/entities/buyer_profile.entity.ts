export interface BuyerProfile {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBuyerProfileRequest {
  firstName?: string;
  lastName?: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode?: string;
  dateOfBirth?: string;
}

export interface UpdateBuyerProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: string;
}
