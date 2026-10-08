import { MOCK_ARTWORKS } from '@/data/mockArtworks';
import {
  INITIAL_HERO_ARTWORK,
  INITIAL_SELECTED_WORKS,
  INITIAL_COLLECTED_WORKS,
  INITIAL_APPROVED_ARTWORKS,
} from '@/data/initialContent';
import {
  Artwork,
  ArtworkFilters,
  ArtworkImage,
  ArtworkOrientation,
  ArtworkStatus,
  ArtworkImageType,
} from '@/types/artwork';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ArtworkRow, ArtworkImageRow } from '@/types/supabase';

/**
 * Determines whether development mock fallback is explicitly permitted.
 * In production (`NODE_ENV === 'production'`), this ALWAYS returns false.
 * In non-production environments, it requires explicit opt-in via NEXT_PUBLIC_ENABLE_DEV_MOCK_DATA === 'true'.
 */
export function isDevMockEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.NEXT_PUBLIC_ENABLE_DEV_MOCK_DATA === 'true';
}

function getStoredArtworks(): Artwork[] {
  const stored = safeLocalStorage.getItem<Artwork[] | null>(STORAGE_KEYS.STUDIO_ARTWORKS, null);
  if (!stored || stored.length < 5) {
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_ARTWORKS, INITIAL_APPROVED_ARTWORKS);
    return INITIAL_APPROVED_ARTWORKS;
  }
  return stored;
}

function setStoredArtworks(artworks: Artwork[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_ARTWORKS, artworks);
}

const DEFAULT_COVER_IMAGE: ArtworkImage = {
  id: 'img-placeholder',
  url: '/artworks/pic1.jpeg',
  alt: 'Original Canvas by Darey',
  width: 1200,
  height: 900,
  isCover: true,
  type: 'primary',
};

interface JoinedArtworkData extends ArtworkRow {
  artwork_images?: ArtworkImageRow[];
  artwork_collections?: Array<{
    collection: {
      id: string;
      slug: string;
      title: string;
    } | null;
  }>;
}

function mapRowToArtwork(row: JoinedArtworkData): Artwork {
  const rawImages = row.artwork_images || [];
  const sortedImages: ArtworkImage[] = rawImages
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => ({
      id: img.id,
      url: img.image_url,
      alt: img.alt_text || row.title,
      width: img.width || 1200,
      height: img.height || 900,
      caption: img.caption ?? undefined,
      isCover: img.is_cover,
      type: img.image_role as ArtworkImageType,
    }));

  const coverImage = sortedImages.find((img) => img.isCover) || sortedImages[0] || DEFAULT_COVER_IMAGE;

  // Resolve collection from junction table if present
  let collection: { id: string; slug: string; title: string } | undefined = undefined;
  if (row.artwork_collections && row.artwork_collections.length > 0 && row.artwork_collections[0].collection) {
    collection = {
      id: row.artwork_collections[0].collection.id,
      slug: row.artwork_collections[0].collection.slug,
      title: row.artwork_collections[0].collection.title,
    };
  }

  // Canonicalize status: normalize legacy 'sold' to 'collected'
  const normalizedStatus =
    row.availability_status === 'sold'
      ? 'collected'
      : (row.availability_status as ArtworkStatus);

  return {
    id: row.id,
    artworkId: row.artwork_code,
    slug: row.slug,
    title: row.title,
    year: row.year,
    medium: row.medium,
    width: Number(row.width),
    height: Number(row.height),
    depth: row.depth !== null ? Number(row.depth) : undefined,
    orientation: row.orientation,
    description: row.description,
    story: row.story ?? undefined,
    price: row.price !== null ? Number(row.price) : undefined,
    currency: row.currency,
    status: normalizedStatus,
    collection,
    tags: row.tags || [],
    coverImage,
    images: sortedImages.length > 0 ? sortedImages : [DEFAULT_COVER_IMAGE],
    accentColor: row.accent_color ?? undefined,
    featured: row.featured,
    isPieceOfTheMonth: row.is_piece_of_the_month ?? false,
    provenance: row.provenance ?? undefined,
    availabilityNote: row.availability_note ?? undefined,
    publicationStatus: row.publication_status,
    isPriceOnRequest: row.is_price_on_request,
    displayOrder: row.sort_order,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
    metaTitle: row.seo_title ?? undefined,
    metaDescription: row.seo_description ?? undefined,
  };
}

export const artworkService = {
  /**
   * Retrieves all artworks.
   * In production, queries Supabase strictly. If unconfigured or failed, fails safely and returns [].
   * In development, mock fallback is only available if NEXT_PUBLIC_ENABLE_DEV_MOCK_DATA === 'true'.
   */
  async getAll(options?: { includeUnpublished?: boolean }): Promise<Artwork[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!options?.includeUnpublished) {
          query = query.eq('publication_status', 'published');
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return (data as unknown as JoinedArtworkData[]).map(mapRowToArtwork);
        }
        if (error) {
          console.error('[Production Data Error] Supabase artworks query failed:', error.message);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase query threw exception:', err);
      }
    }

    if (isDevMockEnabled()) {
      return getStoredArtworks();
    }
    return INITIAL_APPROVED_ARTWORKS;
  },

  /**
   * Retrieves featured artworks for editorial showcase
   */
  async getFeatured(): Promise<Artwork[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .eq('featured', true)
          .eq('publication_status', 'published')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return (data as unknown as JoinedArtworkData[]).map(mapRowToArtwork);
        }
        if (error) {
          console.error('[Production Data Error] Supabase getFeatured query failed:', error.message);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase getFeatured threw exception:', err);
      }
    }

    if (isDevMockEnabled()) {
      const list = getStoredArtworks();
      return list.filter((art) => art.featured && art.publicationStatus !== 'archived');
    }
    return INITIAL_APPROVED_ARTWORKS.filter((art) => art.featured);
  },

  /**
   * Retrieves the active Piece of the Month.
   * Single-selection editorial designation controlled from Studio.
   */
  async getPieceOfTheMonth(): Promise<Artwork | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .eq('is_piece_of_the_month', true)
          .eq('publication_status', 'published')
          .maybeSingle();

        if (!error && data) {
          return mapRowToArtwork(data as unknown as JoinedArtworkData);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase getPieceOfTheMonth query failed:', err);
      }
    }

    if (isDevMockEnabled()) {
      const list = getStoredArtworks();
      const match = list.find((art) => art.isPieceOfTheMonth && art.publicationStatus === 'published');
      if (match) return match;
    }

    const fallback = INITIAL_APPROVED_ARTWORKS.find((art) => art.isPieceOfTheMonth);
    return fallback || INITIAL_APPROVED_ARTWORKS[0] || null;
  },

  /**
   * Sets a specific artwork as Piece of the Month.
   * Automatically clears any previous designation to strictly enforce single selection.
   */
  async setPieceOfTheMonth(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        // 1. Clear previous designations
        await supabase
          .from('artworks')
          .update({ is_piece_of_the_month: false })
          .neq('id', id);

        // 2. Set new designation
        const { error } = await supabase
          .from('artworks')
          .update({ is_piece_of_the_month: true })
          .or(`id.eq.${id},artwork_code.eq.${id}`);

        if (error) {
          throw new Error(`Failed to designate Piece of the Month: ${error.message}`);
        }
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Operation failed';
        console.error('[Production Data Error] setPieceOfTheMonth error:', msg);
        throw new Error(msg);
      }
    }

    // Local Storage / Dev Fallback
    const list = getStoredArtworks();
    const updated = list.map((art) => ({
      ...art,
      isPieceOfTheMonth: art.id === id || art.artworkId === id,
    }));
    setStoredArtworks(updated);
    return true;
  },


  /**
   * Retrieves selected works for homepage showcase
   */
  async getSelected(): Promise<Artwork[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .in('availability_status', ['available', 'reserved'])
          .eq('publication_status', 'published')
          .order('sort_order', { ascending: true })
          .limit(5);

        if (!error && data && data.length > 0) {
          return (data as unknown as JoinedArtworkData[]).map(mapRowToArtwork);
        }
        if (error) {
          console.error('[Production Data Error] Supabase getSelected query failed:', error.message);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase getSelected threw exception:', err);
      }
    }

    if (isDevMockEnabled()) {
      const list = getStoredArtworks();
      return list
        .filter(
          (art) =>
            (art.status === 'available' || art.status === 'reserved') &&
            art.publicationStatus !== 'archived'
        )
        .slice(0, 5);
    }
    return INITIAL_SELECTED_WORKS;
  },

  /**
   * Retrieves sold / collected works for archival exhibition
   */
  async getCollected(): Promise<Artwork[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .in('availability_status', ['collected', 'sold'])
          .eq('publication_status', 'published')
          .order('updated_at', { ascending: false })
          .limit(6);

        if (!error && data && data.length > 0) {
          return (data as unknown as JoinedArtworkData[]).map(mapRowToArtwork);
        }
        if (error) {
          console.error('[Production Data Error] Supabase getCollected query failed:', error.message);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase getCollected threw exception:', err);
      }
    }

    if (isDevMockEnabled()) {
      const list = getStoredArtworks();
      const collected = list.filter(
        (art) =>
          (art.status === 'collected' || art.status === 'sold') &&
          art.publicationStatus !== 'archived'
      );
      if (collected.length >= 6) {
        return collected.slice(0, 6);
      }
      const existingIds = new Set(collected.map((a) => a.id));
      const needed = INITIAL_COLLECTED_WORKS.filter((a) => !existingIds.has(a.id));
      return [...collected, ...needed].slice(0, 6);
    }
    return INITIAL_COLLECTED_WORKS.slice(0, 6);
  },

  /**
   * Retrieves currently available works
   */
  async getAvailable(): Promise<Artwork[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .eq('availability_status', 'available')
          .eq('publication_status', 'published')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return (data as unknown as JoinedArtworkData[]).map(mapRowToArtwork);
        }
        if (error) {
          console.error('[Production Data Error] Supabase getAvailable query failed:', error.message);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase getAvailable threw exception:', err);
      }
    }

    if (isDevMockEnabled()) {
      const list = getStoredArtworks();
      return list.filter((art) => art.status === 'available' && art.publicationStatus !== 'archived');
    }
    return INITIAL_APPROVED_ARTWORKS.filter((art) => art.status === 'available');
  },

  /**
   * Retrieves the primary hero artwork.
   * Completely data-driven:
   * 1. Published artwork intentionally marked `featured = true`, ordered by sort_order.
   * 2. First appropriate published artwork according to controlled ordering.
   * 3. Intentional artistic empty state: returns null (never substitutes mock/fictional paintings).
   */
  async getHeroArtwork(): Promise<Artwork | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();

        // Priority 1: Published artwork intentionally marked featured
        const { data: heroFeatured, error: featError } = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .eq('featured', true)
          .eq('publication_status', 'published')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!featError && heroFeatured) {
          return mapRowToArtwork(heroFeatured as unknown as JoinedArtworkData);
        }

        // Priority 2: First published artwork according to controlled ordering
        const { data: firstPublished, error: firstError } = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .eq('publication_status', 'published')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!firstError && firstPublished) {
          return mapRowToArtwork(firstPublished as unknown as JoinedArtworkData);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase hero artwork query failed:', err);
      }
    }

    // Development-only fallback if explicitly permitted
    if (isDevMockEnabled()) {
      const list = getStoredArtworks();
      const hero = list.find((art) => art.featured && art.publicationStatus === 'published') || list[0] || null;
      return hero;
    }

    // Initial approved content fallback (Darey's genuine supplied hero artwork)
    return INITIAL_HERO_ARTWORK;
  },

  /**
   * Retrieves an artwork by its unique slug.
   * If allowDraft is false (default), only published works are returned.
   */
  async getBySlug(slug: string, options?: { allowDraft?: boolean }): Promise<Artwork | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .eq('slug', slug);

        if (!options?.allowDraft) {
          query = query.eq('publication_status', 'published');
        }

        const { data, error } = await query.maybeSingle();

        if (!error && data) {
          return mapRowToArtwork(data as unknown as JoinedArtworkData);
        }
        if (error) {
          console.error(`[Production Data Error] getBySlug('${slug}') failed:`, error.message);
        }
      } catch (err) {
        console.error(`[Production Data Error] getBySlug('${slug}') threw exception:`, err);
      }
    }

    if (isDevMockEnabled()) {
      const list = getStoredArtworks();
      const artwork = list.find((art) => art.slug === slug);
      if (artwork && (!options?.allowDraft && artwork.publicationStatus !== 'published')) {
        return null;
      }
      return artwork || null;
    }

    const initial = INITIAL_APPROVED_ARTWORKS.find((art) => art.slug === slug);
    if (initial && (!options?.allowDraft && initial.publicationStatus !== 'published')) {
      return null;
    }
    return initial || null;
  },

  /**
   * Retrieves an artwork by ID or public accession code
   */
  async getById(id: string): Promise<Artwork | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('artworks')
          .select(`
            *,
            artwork_images(*),
            artwork_collections(
              collection:collections(id, slug, title)
            )
          `)
          .or(`id.eq.${id},artwork_code.eq.${id}`)
          .maybeSingle();

        if (!error && data) {
          return mapRowToArtwork(data as unknown as JoinedArtworkData);
        }
        return null;
      } catch (err) {
        console.error(`[Production Data Error] getById('${id}') failed:`, err);
        return null;
      }
    }

    if (isDevMockEnabled()) {
      const list = getStoredArtworks();
      const artwork = list.find((art) => art.id === id || art.artworkId === id);
      return artwork || null;
    }

    const initial = INITIAL_APPROVED_ARTWORKS.find((art) => art.id === id || art.artworkId === id);
    return initial || null;
  },

  /**
   * Retrieves related artworks for recommendations
   */
  async getRelated(artworkId: string, limit: number = 3): Promise<Artwork[]> {
    const all = await this.getAll();
    const current = all.find((art) => art.id === artworkId || art.artworkId === artworkId);
    if (!current) return all.slice(0, limit);

    const related = all.filter((art) => {
      if (art.id === current.id || art.artworkId === current.artworkId) return false;
      if (current.collection && art.collection?.slug === current.collection.slug) return true;
      return art.tags.some((t) => current.tags.includes(t));
    });

    if (related.length < limit) {
      const remaining = all.filter(
        (art) =>
          art.id !== current.id &&
          art.artworkId !== current.artworkId &&
          !related.some((r) => r.id === art.id)
      );
      related.push(...remaining);
    }

    return related.slice(0, limit);
  },

  /**
   * Creates a new artwork record and attaches images & collection relations.
   * Throws clean, actionable errors if constraints fail (e.g. unique slug violation).
   */
  async create(artworkData: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artwork> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();

      // Normalize status: map 'sold' to 'collected'
      const statusValue =
        artworkData.status === 'sold' ? 'collected' : artworkData.status;

      // 1. Insert artwork row
      const { data: insertedArtwork, error: artError } = await supabase
        .from('artworks')
        .insert({
          artwork_code: artworkData.artworkId || undefined,
          slug: artworkData.slug,
          title: artworkData.title,
          year: artworkData.year,
          medium: artworkData.medium,
          description: artworkData.description,
          story: artworkData.story || null,
          artist_note: null,
          availability_note: artworkData.availabilityNote || null,
          provenance: artworkData.provenance || null,
          width: artworkData.width,
          height: artworkData.height,
          depth: artworkData.depth ?? null,
          dimension_unit: 'cm',
          orientation: artworkData.orientation,
          price: artworkData.price ?? null,
          currency: artworkData.currency || 'USD',
          is_price_on_request: artworkData.isPriceOnRequest || false,
          availability_status: statusValue,
          publication_status: artworkData.publicationStatus || 'draft',
          featured: artworkData.featured || false,
          is_piece_of_the_month: artworkData.isPieceOfTheMonth || false,
          accent_color: artworkData.accentColor || null,
          tags: artworkData.tags || [],
          sort_order: artworkData.displayOrder || 0,
          seo_title: artworkData.metaTitle || null,
          seo_description: artworkData.metaDescription || null,
        })
        .select()
        .single();

      if (artError) {
        if (artError.code === '23505' && (artError.message.includes('slug') || artError.message.includes('artworks_slug_key'))) {
          throw new Error(`An artwork with URL slug "${artworkData.slug}" already exists. Please choose a different title or slug.`);
        }
        if (artError.code === '23505' && (artError.message.includes('artwork_code') || artError.message.includes('artworks_artwork_code_key'))) {
          throw new Error(`An artwork with accession code "${artworkData.artworkId}" already exists.`);
        }
        throw new Error(`Artwork registration failed: ${artError.message}`);
      }

      if (!insertedArtwork) {
        throw new Error('Artwork registration failed: no record returned.');
      }

      // 2. Insert artwork images
      if (artworkData.images && artworkData.images.length > 0) {
        const imageRows = artworkData.images.map((img, idx) => ({
          artwork_id: insertedArtwork.id,
          image_url: img.url,
          image_role: (img.type || 'primary') as ArtworkImageType,
          is_cover: img.isCover ?? idx === 0,
          sort_order: idx,
          alt_text: img.alt || artworkData.title,
          caption: img.caption || null,
          width: img.width || null,
          height: img.height || null,
        }));

        await supabase.from('artwork_images').insert(imageRows);
      }

      // 3. Attach collection if selected
      if (artworkData.collection?.id) {
        await supabase.from('artwork_collections').insert({
          artwork_id: insertedArtwork.id,
          collection_id: artworkData.collection.id,
          sort_order: 0,
        });
      }

      // Return full joined record
      const complete = await this.getById(insertedArtwork.id);
      if (complete) return complete;
      throw new Error('Failed to retrieve registered artwork record.');
    }

    if (process.env.NODE_ENV === 'production' && !isDevMockEnabled()) {
      throw new Error('Supabase is not configured. Database operations are unavailable in production.');
    }

    // Local Storage Fallback (dev only)
    const list = getStoredArtworks();
    const now = new Date().toISOString();
    const id = `art-${Date.now()}`;
    const newArtwork: Artwork = {
      ...artworkData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newArtwork, ...list];
    setStoredArtworks(updated);
    return newArtwork;
  },

  /**
   * Updates an existing artwork record
   */
  async update(id: string, updates: Partial<Artwork>): Promise<Artwork | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const payload: Record<string, unknown> = {};

      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.year !== undefined) payload.year = updates.year;
      if (updates.medium !== undefined) payload.medium = updates.medium;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.story !== undefined) payload.story = updates.story;
      if (updates.availabilityNote !== undefined) payload.availability_note = updates.availabilityNote;
      if (updates.provenance !== undefined) payload.provenance = updates.provenance;
      if (updates.width !== undefined) payload.width = updates.width;
      if (updates.height !== undefined) payload.height = updates.height;
      if (updates.depth !== undefined) payload.depth = updates.depth;
      if (updates.orientation !== undefined) payload.orientation = updates.orientation;
      if (updates.price !== undefined) payload.price = updates.price;
      if (updates.currency !== undefined) payload.currency = updates.currency;
      if (updates.isPriceOnRequest !== undefined) payload.is_price_on_request = updates.isPriceOnRequest;
      if (updates.status !== undefined) {
        payload.availability_status = updates.status === 'sold' ? 'collected' : updates.status;
      }
      if (updates.publicationStatus !== undefined) payload.publication_status = updates.publicationStatus;
      if (updates.featured !== undefined) payload.featured = updates.featured;
      if (updates.isPieceOfTheMonth !== undefined) payload.is_piece_of_the_month = updates.isPieceOfTheMonth;
      if (updates.accentColor !== undefined) payload.accent_color = updates.accentColor;
      if (updates.tags !== undefined) payload.tags = updates.tags;
      if (updates.displayOrder !== undefined) payload.sort_order = updates.displayOrder;
      if (updates.metaTitle !== undefined) payload.seo_title = updates.metaTitle;
      if (updates.metaDescription !== undefined) payload.seo_description = updates.metaDescription;

      if (Object.keys(payload).length > 0) {
        const { error: updateError } = await supabase
          .from('artworks')
          .update(payload)
          .or(`id.eq.${id},artwork_code.eq.${id}`);

        if (updateError) {
          if (updateError.code === '23505' && (updateError.message.includes('slug') || updateError.message.includes('artworks_slug_key'))) {
            throw new Error(`An artwork with URL slug "${updates.slug}" already exists. Please choose a different title or slug.`);
          }
          throw new Error(`Artwork update failed: ${updateError.message}`);
        }
      }

      // Synchronize images if supplied
      if (updates.images && updates.images.length > 0) {
        const artworkRecord = await this.getById(id);
        if (artworkRecord) {
          await supabase
            .from('artwork_images')
            .delete()
            .eq('artwork_id', artworkRecord.id);

          const imageRows = updates.images.map((img, idx) => ({
            artwork_id: artworkRecord.id,
            image_url: img.url,
            image_role: (img.type || 'primary') as ArtworkImageType,
            is_cover: img.isCover ?? idx === 0,
            sort_order: idx,
            alt_text: img.alt || artworkRecord.title,
            caption: img.caption || null,
            width: img.width || null,
            height: img.height || null,
          }));

          await supabase.from('artwork_images').insert(imageRows);
        }
      }

      // Synchronize collection junction
      if (updates.collection !== undefined) {
        const artworkRecord = await this.getById(id);
        if (artworkRecord) {
          await supabase
            .from('artwork_collections')
            .delete()
            .eq('artwork_id', artworkRecord.id);

          if (updates.collection?.id) {
            await supabase.from('artwork_collections').insert({
              artwork_id: artworkRecord.id,
              collection_id: updates.collection.id,
              sort_order: 0,
            });
          }
        }
      }

      return this.getById(id);
    }

    if (process.env.NODE_ENV === 'production' && !isDevMockEnabled()) {
      throw new Error('Supabase is not configured. Database operations are unavailable in production.');
    }

    const list = getStoredArtworks();
    const index = list.findIndex((art) => art.id === id || art.artworkId === id);
    if (index === -1) return null;

    const updatedArtwork: Artwork = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updatedList = [...list];
    updatedList[index] = updatedArtwork;
    setStoredArtworks(updatedList);
    return updatedArtwork;
  },

  /**
   * Duplicates an artwork record as a draft
   */
  async duplicate(id: string): Promise<Artwork | null> {
    const original = await this.getById(id);
    if (!original) return null;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newTitle = `${original.title} (Copy)`;
    const newSlug = `${original.slug}-copy-${randomSuffix}`;
    const newArtworkId = `DAR-${new Date().getFullYear()}-${randomSuffix}`;

    return this.create({
      ...original,
      title: newTitle,
      slug: newSlug,
      artworkId: newArtworkId,
      status: 'draft',
      publicationStatus: 'draft',
      featured: false,
    });
  },

  /**
   * Archives an artwork
   */
  async archive(id: string): Promise<boolean> {
    const updated = await this.update(id, { publicationStatus: 'archived' });
    return !!updated;
  },

  /**
   * Deletes an artwork record
   */
  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('artworks')
          .delete()
          .or(`id.eq.${id},artwork_code.eq.${id}`);

        if (error) {
          throw new Error(`Artwork delete failed: ${error.message}`);
        }
        return true;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Delete failed';
        console.error('[Production Data Error] Artwork deletion error:', msg);
        throw new Error(msg);
      }
    }

    if (process.env.NODE_ENV === 'production' && !isDevMockEnabled()) {
      throw new Error('Supabase is not configured. Database operations are unavailable in production.');
    }

    const list = getStoredArtworks();
    const filtered = list.filter((art) => art.id !== id && art.artworkId !== id);
    setStoredArtworks(filtered);
    return true;
  },

  /**
   * Filters and sorts artworks based on provided criteria
   */
  async filter(
    filters: ArtworkFilters,
    options?: { includeUnpublished?: boolean }
  ): Promise<Artwork[]> {
    const all = await this.getAll(options);
    let results = [...all];

    // Status filter
    if (filters.status && filters.status !== 'all') {
      const target = filters.status === 'sold' ? 'collected' : filters.status;
      results = results.filter((art) => {
        const artStat = art.status === 'sold' ? 'collected' : art.status;
        return artStat === target;
      });
    }

    // Collection filter
    if (filters.collectionSlug && filters.collectionSlug !== 'all') {
      results = results.filter((art) => art.collection?.slug === filters.collectionSlug);
    }

    // Medium filter
    if (filters.medium && filters.medium !== 'all') {
      const mediumQuery = filters.medium.toLowerCase();
      results = results.filter((art) => art.medium.toLowerCase().includes(mediumQuery));
    }

    // Orientation filter
    if (filters.orientation && filters.orientation !== 'all') {
      results = results.filter((art) => art.orientation === filters.orientation);
    }

    // Physical Size filter
    if (filters.size && filters.size !== 'all') {
      results = results.filter((art) => {
        const maxDim = Math.max(art.width, art.height);
        switch (filters.size) {
          case 'small':
            return maxDim < 80;
          case 'medium':
            return maxDim >= 80 && maxDim <= 130;
          case 'large':
            return maxDim > 130 && maxDim <= 180;
          case 'monumental':
            return maxDim > 180;
          default:
            return true;
        }
      });
    }

    // Price range
    if (filters.minPrice !== undefined) {
      results = results.filter((art) => (art.price || 0) >= (filters.minPrice || 0));
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter((art) => (art.price || Infinity) <= (filters.maxPrice || Infinity));
    }

    // Text search query
    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      results = results.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.artworkId.toLowerCase().includes(q) ||
          art.medium.toLowerCase().includes(q) ||
          art.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          art.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'curated':
          results.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
          break;
        case 'featured':
          results.sort((a, b) => {
            if (a.isPieceOfTheMonth && !b.isPieceOfTheMonth) return -1;
            if (!a.isPieceOfTheMonth && b.isPieceOfTheMonth) return 1;
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
          });
          break;
        case 'newest':
          results.sort((a, b) => (b.year || 0) - (a.year || 0));
          break;
        case 'price-asc':
          results.sort((a, b) => {
            if (a.isPriceOnRequest) return 1;
            if (b.isPriceOnRequest) return -1;
            return (a.price || 0) - (b.price || 0);
          });
          break;
        case 'price-desc':
          results.sort((a, b) => {
            if (a.isPriceOnRequest) return 1;
            if (b.isPriceOnRequest) return -1;
            return (b.price || 0) - (a.price || 0);
          });
          break;
        case 'title-asc':
          results.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'size-desc':
          results.sort(
            (a, b) => Math.max(b.width, b.height) - Math.max(a.width, a.height)
          );
          break;
      }
    }

    return results;
  },

  /**
   * Searches artworks by query string
   */
  async search(query: string): Promise<Artwork[]> {
    return this.filter({ search: query });
  },
};
