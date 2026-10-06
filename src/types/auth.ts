import { ShippingAddress } from './commerce';

export type UserRole = 'collector' | 'admin';

export interface CollectorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: UserRole;
  phone?: string;
  country?: string;
  city?: string;
  preferredContactMethod?: 'email' | 'whatsapp' | 'phone';
  defaultAddress?: Partial<ShippingAddress>;
  createdAt: string;
}

export interface AuthState {
  user: CollectorUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}
