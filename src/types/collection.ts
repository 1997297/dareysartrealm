export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  year?: number;
  statement: string;
  description: string;
  coverImage: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  accentColor?: string;
  artworkCount: number;
  featured?: boolean;
  artworkIds?: string[];
  visibility?: 'published' | 'draft' | 'archived';
  displayOrder?: number;
  updatedAt?: string;
  createdAt?: string;
}
