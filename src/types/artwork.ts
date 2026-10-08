export type ArtworkStatus = 'available' | 'reserved' | 'collected' | 'commissioned' | 'draft' | 'sold';

export type ArtworkOrientation = 'portrait' | 'landscape' | 'square' | 'panoramic';

export type ArtworkImageType = 'primary' | 'detail' | 'texture' | 'angle' | 'framed' | 'interior';

export interface ArtworkImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  isCover?: boolean;
  type?: ArtworkImageType;
}

export interface Artwork {
  id: string;
  artworkId: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  width: number; // in cm
  height: number; // in cm
  depth?: number; // in cm
  orientation: ArtworkOrientation;
  description: string;
  story?: string;
  price?: number;
  currency: string;
  status: ArtworkStatus;
  collection?: {
    id: string;
    slug: string;
    title: string;
  };
  tags: string[];
  coverImage: ArtworkImage;
  images: ArtworkImage[];
  accentColor?: string; // Optional dominant/accent color for dynamic tinting
  featured?: boolean;
  isPieceOfTheMonth?: boolean; // Studio-curated Hot Piece / Piece of the Month
  curatorialBadge?: string; // Optional CMS badge: e.g. "Piece of the Month", "Curator's Pick"
  provenance?: string; // For sold/collected works: e.g. "Private Collection"
  availabilityNote?: string;
  publicationStatus?: 'published' | 'draft' | 'archived';
  isPriceOnRequest?: boolean;
  displayOrder?: number;
  updatedAt?: string;
  createdAt?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ArtworkFilters {
  status?: ArtworkStatus | 'all';
  collectionSlug?: string;
  medium?: string;
  orientation?: ArtworkOrientation | 'all';
  size?: 'all' | 'small' | 'medium' | 'large' | 'monumental';
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'curated' | 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'title-asc' | 'size-desc';
}
