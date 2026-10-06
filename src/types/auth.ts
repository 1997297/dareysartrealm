import { ShippingAddress } from './commerce';
import { ProfileRow } from './supabase';

export type UserRole = 'collector' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface CollectorUser {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  email: string;
  role?: UserRole;
  status?: UserStatus;
  avatarUrl?: string;
  phone?: string;
  country?: string;
  city?: string;
  preferredContactMethod?: 'email' | 'whatsapp' | 'phone';
  defaultAddress?: Partial<ShippingAddress>;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthState {
  user: CollectorUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isConfigured: boolean;
}

/**
 * Transforms a Supabase database ProfileRow into the application's CollectorUser model
 */
export function profileRowToCollectorUser(row: ProfileRow): CollectorUser {
  return {
    id: row.id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    displayName: row.display_name || `${row.first_name || ''} ${row.last_name || ''}`.trim(),
    email: row.email,
    role: row.role,
    status: row.status,
    avatarUrl: row.avatar_url || undefined,
    phone: row.phone || undefined,
    country: row.country || undefined,
    city: row.city || undefined,
    preferredContactMethod: row.preferred_contact_method || 'email',
    defaultAddress: {
      fullName: row.display_name || `${row.first_name || ''} ${row.last_name || ''}`.trim(),
      email: row.email,
      phone: row.phone || undefined,
      addressLine1: row.address_line1 || undefined,
      city: row.city || undefined,
      stateRegion: row.state_region || undefined,
      postalCode: row.postal_code || undefined,
      country: row.country || undefined,
      deliveryNotes: row.delivery_notes || undefined,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
