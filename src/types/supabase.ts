export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'collector' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type PreferredContactMethod = 'email' | 'whatsapp' | 'phone';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          display_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          status: UserStatus;
          country: string | null;
          city: string | null;
          preferred_contact_method: PreferredContactMethod | null;
          address_line1: string | null;
          state_region: string | null;
          postal_code: string | null;
          delivery_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          display_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          country?: string | null;
          city?: string | null;
          preferred_contact_method?: PreferredContactMethod | null;
          address_line1?: string | null;
          state_region?: string | null;
          postal_code?: string | null;
          delivery_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          display_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          status?: UserStatus;
          country?: string | null;
          city?: string | null;
          preferred_contact_method?: PreferredContactMethod | null;
          address_line1?: string | null;
          state_region?: string | null;
          postal_code?: string | null;
          delivery_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type ProfileRow = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
