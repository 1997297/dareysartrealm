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

export type PublicationStatus = 'draft' | 'published' | 'archived';
export type AvailabilityStatus = 'available' | 'reserved' | 'collected' | 'commissioned' | 'draft' | 'sold';
export type ArtworkOrientation = 'portrait' | 'landscape' | 'square' | 'panoramic';
export type ImageRole = 'primary' | 'detail' | 'texture' | 'angle' | 'framed' | 'interior' | 'process' | 'other';
export type StorageBucket = 'artworks-public' | 'artworks-private';
export type MediaCategory = 'artwork' | 'studio' | 'portrait' | 'service' | 'commission' | 'website';

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

      collections: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          statement: string;
          description: string;
          year: number | null;
          cover_image_url: string | null;
          cover_image_alt: string | null;
          accent_color: string | null;
          featured: boolean;
          publication_status: PublicationStatus;
          sort_order: number;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          statement?: string;
          description?: string;
          year?: number | null;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          accent_color?: string | null;
          featured?: boolean;
          publication_status?: PublicationStatus;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          statement?: string;
          description?: string;
          year?: number | null;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          accent_color?: string | null;
          featured?: boolean;
          publication_status?: PublicationStatus;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          archived_at?: string | null;
        };
        Relationships: [];
      };

      artworks: {
        Row: {
          id: string;
          artwork_code: string;
          slug: string;
          title: string;
          year: number;
          medium: string;
          description: string;
          story: string | null;
          artist_note: string | null;
          availability_note: string | null;
          provenance: string | null;
          width: number;
          height: number;
          depth: number | null;
          dimension_unit: string;
          orientation: ArtworkOrientation;
          price: number | null;
          currency: string;
          is_price_on_request: boolean;
          availability_status: AvailabilityStatus;
          publication_status: PublicationStatus;
          featured: boolean;
          is_piece_of_the_month: boolean;
          accent_color: string | null;
          tags: string[];
          sort_order: number;
          seo_title: string | null;
          seo_description: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          published_at: string | null;
          archived_at: string | null;
        };
        Insert: {
          id?: string;
          artwork_code?: string;
          slug: string;
          title: string;
          year: number;
          medium: string;
          description?: string;
          story?: string | null;
          artist_note?: string | null;
          availability_note?: string | null;
          provenance?: string | null;
          width: number;
          height: number;
          depth?: number | null;
          dimension_unit?: string;
          orientation: ArtworkOrientation;
          price?: number | null;
          currency?: string;
          is_price_on_request?: boolean;
          availability_status?: AvailabilityStatus;
          publication_status?: PublicationStatus;
          featured?: boolean;
          is_piece_of_the_month?: boolean;
          accent_color?: string | null;
          tags?: string[];
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          archived_at?: string | null;
        };
        Update: {
          id?: string;
          artwork_code?: string;
          slug?: string;
          title?: string;
          year?: number;
          medium?: string;
          description?: string;
          story?: string | null;
          artist_note?: string | null;
          availability_note?: string | null;
          provenance?: string | null;
          width?: number;
          height?: number;
          depth?: number | null;
          dimension_unit?: string;
          orientation?: ArtworkOrientation;
          price?: number | null;
          currency?: string;
          is_price_on_request?: boolean;
          availability_status?: AvailabilityStatus;
          publication_status?: PublicationStatus;
          featured?: boolean;
          is_piece_of_the_month?: boolean;
          accent_color?: string | null;
          tags?: string[];
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
          archived_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'artworks_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      artwork_collections: {
        Row: {
          artwork_id: string;
          collection_id: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          artwork_id: string;
          collection_id: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          artwork_id?: string;
          collection_id?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'artwork_collections_artwork_id_fkey';
            columns: ['artwork_id'];
            isOneToOne: false;
            referencedRelation: 'artworks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'artwork_collections_collection_id_fkey';
            columns: ['collection_id'];
            isOneToOne: false;
            referencedRelation: 'collections';
            referencedColumns: ['id'];
          }
        ];
      };

      media_assets: {
        Row: {
          id: string;
          storage_bucket: StorageBucket;
          storage_path: string;
          public_url: string | null;
          title: string;
          filename: string;
          mime_type: string;
          file_size: number;
          width: number | null;
          height: number | null;
          category: MediaCategory;
          alt_text: string;
          caption: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          storage_bucket: StorageBucket;
          storage_path: string;
          public_url?: string | null;
          title: string;
          filename: string;
          mime_type: string;
          file_size?: number;
          width?: number | null;
          height?: number | null;
          category?: MediaCategory;
          alt_text?: string;
          caption?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          storage_bucket?: StorageBucket;
          storage_path?: string;
          public_url?: string | null;
          title?: string;
          filename?: string;
          mime_type?: string;
          file_size?: number;
          width?: number | null;
          height?: number | null;
          category?: MediaCategory;
          alt_text?: string;
          caption?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'media_assets_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      artwork_images: {
        Row: {
          id: string;
          artwork_id: string;
          media_asset_id: string | null;
          image_url: string;
          image_role: ImageRole;
          is_cover: boolean;
          sort_order: number;
          alt_text: string;
          caption: string | null;
          width: number | null;
          height: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          artwork_id: string;
          media_asset_id?: string | null;
          image_url: string;
          image_role?: ImageRole;
          is_cover?: boolean;
          sort_order?: number;
          alt_text?: string;
          caption?: string | null;
          width?: number | null;
          height?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artwork_id?: string;
          media_asset_id?: string | null;
          image_url?: string;
          image_role?: ImageRole;
          is_cover?: boolean;
          sort_order?: number;
          alt_text?: string;
          caption?: string | null;
          width?: number | null;
          height?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'artwork_images_artwork_id_fkey';
            columns: ['artwork_id'];
            isOneToOne: false;
            referencedRelation: 'artworks';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'artwork_images_media_asset_id_fkey';
            columns: ['media_asset_id'];
            isOneToOne: false;
            referencedRelation: 'media_assets';
            referencedColumns: ['id'];
          }
        ];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          description?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'site_settings_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };

      services: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          cover_image_url: string | null;
          cover_image_alt: string | null;
          pricing_structure: string | null;
          typical_timeline: string | null;
          features: string[];
          process: Json;
          sort_order: number;
          publication_status: PublicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          short_description?: string;
          description?: string;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          pricing_structure?: string | null;
          typical_timeline?: string | null;
          features?: string[];
          process?: Json;
          sort_order?: number;
          publication_status?: PublicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          short_description?: string;
          description?: string;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          pricing_structure?: string | null;
          typical_timeline?: string | null;
          features?: string[];
          process?: Json;
          sort_order?: number;
          publication_status?: PublicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
      generate_artwork_code: {
        Args: Record<PropertyKey, never>;
        Returns: string;
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

export type CollectionRow = Database['public']['Tables']['collections']['Row'];
export type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
export type CollectionUpdate = Database['public']['Tables']['collections']['Update'];

export type ArtworkRow = Database['public']['Tables']['artworks']['Row'];
export type ArtworkInsert = Database['public']['Tables']['artworks']['Insert'];
export type ArtworkUpdate = Database['public']['Tables']['artworks']['Update'];

export type ArtworkImageRow = Database['public']['Tables']['artwork_images']['Row'];
export type ArtworkImageInsert = Database['public']['Tables']['artwork_images']['Insert'];
export type ArtworkImageUpdate = Database['public']['Tables']['artwork_images']['Update'];

export type MediaAssetRow = Database['public']['Tables']['media_assets']['Row'];
export type MediaAssetInsert = Database['public']['Tables']['media_assets']['Insert'];
export type MediaAssetUpdate = Database['public']['Tables']['media_assets']['Update'];

export type SiteSettingRow = Database['public']['Tables']['site_settings']['Row'];
export type SiteSettingInsert = Database['public']['Tables']['site_settings']['Insert'];
export type SiteSettingUpdate = Database['public']['Tables']['site_settings']['Update'];

export type ServiceRow = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

