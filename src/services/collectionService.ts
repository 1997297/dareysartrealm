import { MOCK_COLLECTIONS } from '@/data/mockCollections';
import { INITIAL_COLLECTIONS, INITIAL_FEATURED_COLLECTION } from '@/data/initialContent';
import { Collection } from '@/types/collection';
import { Artwork } from '@/types/artwork';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { CollectionRow } from '@/types/supabase';
import { artworkService, isDevMockEnabled } from './artworkService';

function getStoredCollections(): Collection[] {
  if (!isDevMockEnabled()) {
    return [];
  }
  const stored = safeLocalStorage.getItem<Collection[] | null>(STORAGE_KEYS.STUDIO_COLLECTIONS, null);
  if (!stored) {
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_COLLECTIONS, MOCK_COLLECTIONS);
    return MOCK_COLLECTIONS;
  }
  return stored;
}

function setStoredCollections(collections: Collection[]): void {
  if (isDevMockEnabled()) {
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_COLLECTIONS, collections);
  }
}

function mapRowToCollection(row: CollectionRow, count: number = 0): Collection {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    year: row.year ?? undefined,
    statement: row.statement,
    description: row.description,
    coverImage: {
      url: row.cover_image_url || '/artworks/pic1.jpeg',
      alt: row.cover_image_alt || row.title,
      width: 1200,
      height: 900,
    },
    accentColor: row.accent_color ?? undefined,
    artworkCount: count,
    featured: row.featured,
    visibility: row.publication_status,
    displayOrder: row.sort_order,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  };
}

export const collectionService = {
  /**
   * Retrieves all collections.
   * In production, queries Supabase strictly. If unconfigured or failed, fails safely and returns [].
   * In development, mock fallback is only available if NEXT_PUBLIC_ENABLE_DEV_MOCK_DATA === 'true'.
   */
  async getAll(options?: { includeUnpublished?: boolean }): Promise<Collection[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase
          .from('collections')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!options?.includeUnpublished) {
          query = query.eq('publication_status', 'published');
        }

        const { data: cols, error: colError } = await query;

        if (!colError && cols) {
          // Fetch counts from artwork_collections
          const { data: links } = await supabase
            .from('artwork_collections')
            .select('collection_id');

          const countMap: Record<string, number> = {};
          if (links) {
            links.forEach((l) => {
              countMap[l.collection_id] = (countMap[l.collection_id] || 0) + 1;
            });
          }

          return cols.map((c) => mapRowToCollection(c, countMap[c.id] || 0));
        }

        if (colError) {
          console.error('[Production Data Error] Supabase collections query failed:', colError.message);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase collections threw exception:', err);
      }
    } else {
      if (!isDevMockEnabled()) {
        console.error(
          '[Production Configuration Error] Supabase is not configured. Collection mock fallback is strictly disabled in production.'
        );
      }
    }

    if (isDevMockEnabled()) {
      return getStoredCollections();
    }
    return INITIAL_COLLECTIONS;
  },

  /**
   * Retrieves the primary featured collection for homepage exhibition.
   * Completely data-driven: Priority 1: featured=true, Priority 2: first published, Priority 3: null.
   */
  async getFeaturedCollection(): Promise<Collection | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('featured', true)
          .eq('publication_status', 'published')
          .order('sort_order', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return mapRowToCollection(data);
        }

        // If no collection is marked featured, get the first published collection
        const { data: firstPub, error: firstError } = await supabase
          .from('collections')
          .select('*')
          .eq('publication_status', 'published')
          .order('sort_order', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (!firstError && firstPub) {
          return mapRowToCollection(firstPub);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase featured collection query failed:', err);
      }
    }

    if (isDevMockEnabled()) {
      const collections = getStoredCollections();
      const featured = collections.find((col) => col.featured && col.visibility === 'published') || collections[0] || null;
      return featured;
    }
    return INITIAL_FEATURED_COLLECTION;
  },

  /**
   * Retrieves a collection by its unique slug
   */
  async getBySlug(slug: string, options?: { allowDraft?: boolean }): Promise<Collection | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase
          .from('collections')
          .select('*')
          .eq('slug', slug);

        if (!options?.allowDraft) {
          query = query.eq('publication_status', 'published');
        }

        const { data, error } = await query.maybeSingle();

        if (!error && data) {
          const { count } = await supabase
            .from('artwork_collections')
            .select('*', { count: 'exact', head: true })
            .eq('collection_id', data.id);

          return mapRowToCollection(data, count || 0);
        }
        if (error) {
          console.error(`[Production Data Error] getBySlug('${slug}') failed:`, error.message);
        }
      } catch (err) {
        console.error(`[Production Data Error] getBySlug('${slug}') threw exception:`, err);
      }
    }

    if (isDevMockEnabled()) {
      const collections = getStoredCollections();
      const collection = collections.find((col) => col.slug === slug);
      if (collection && (!options?.allowDraft && collection.visibility !== 'published')) {
        return null;
      }
      return collection || null;
    }
    return INITIAL_COLLECTIONS.find((col) => col.slug === slug) || null;
  },

  /**
   * Retrieves a collection by database ID
   */
  async getById(id: string): Promise<Collection | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (!error && data) {
          return mapRowToCollection(data);
        }
        return null;
      } catch (err) {
        console.error(`[Production Data Error] getById('${id}') failed:`, err);
        return null;
      }
    }

    if (isDevMockEnabled()) {
      const collections = getStoredCollections();
      const collection = collections.find((col) => col.id === id);
      return collection || null;
    }
    return null;
  },

  /**
   * Retrieves all published artworks belonging to a collection
   */
  async getArtworks(collectionSlug: string): Promise<Artwork[]> {
    if (isSupabaseConfigured()) {
      try {
        const col = await this.getBySlug(collectionSlug);
        if (!col) return [];

        const supabase = createClient();
        const { data: links, error: linkError } = await supabase
          .from('artwork_collections')
          .select('artwork_id, sort_order')
          .eq('collection_id', col.id)
          .order('sort_order', { ascending: true });

        if (!linkError && links && links.length > 0) {
          const artworkIds = links.map((l) => l.artwork_id);
          const allWorks = await artworkService.getAll();
          return allWorks.filter((w) => artworkIds.includes(w.id));
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase collection artworks query failed:', err);
      }
    }

    const allArtworks = await artworkService.getAll();
    return allArtworks.filter((art) => art.collection?.slug === collectionSlug);
  },

  /**
   * Creates a new collection in the database.
   * Throws descriptive errors if unique constraints fail.
   */
  async create(data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collection> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: inserted, error } = await supabase
        .from('collections')
        .insert({
          slug: data.slug,
          title: data.title,
          subtitle: data.subtitle || null,
          statement: data.statement,
          description: data.description,
          year: data.year ?? null,
          cover_image_url: data.coverImage?.url || null,
          cover_image_alt: data.coverImage?.alt || data.title,
          accent_color: data.accentColor || null,
          featured: data.featured || false,
          publication_status: data.visibility || 'draft',
          sort_order: data.displayOrder || 0,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505' && (error.message.includes('slug') || error.message.includes('collections_slug_key'))) {
          throw new Error(`A collection with URL slug "${data.slug}" already exists. Please choose a different title or slug.`);
        }
        throw new Error(`Collection creation failed: ${error.message}`);
      }

      if (inserted) {
        return mapRowToCollection(inserted);
      }
      throw new Error('Collection creation failed: no record returned.');
    }

    if (!isDevMockEnabled()) {
      throw new Error('Supabase is not configured. Database operations are unavailable in production.');
    }

    const collections = getStoredCollections();
    const now = new Date().toISOString();
    const newCollection: Collection = {
      ...data,
      id: `col-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newCollection, ...collections];
    setStoredCollections(updated);
    return newCollection;
  },

  /**
   * Updates an existing collection in the database
   */
  async update(id: string, updates: Partial<Collection>): Promise<Collection | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const payload: Record<string, unknown> = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.subtitle !== undefined) payload.subtitle = updates.subtitle;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.statement !== undefined) payload.statement = updates.statement;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.year !== undefined) payload.year = updates.year;
      if (updates.featured !== undefined) payload.featured = updates.featured;
      if (updates.visibility !== undefined) payload.publication_status = updates.visibility;
      if (updates.displayOrder !== undefined) payload.sort_order = updates.displayOrder;
      if (updates.coverImage?.url !== undefined) {
        payload.cover_image_url = updates.coverImage.url;
        payload.cover_image_alt = updates.coverImage.alt || updates.title || '';
      }
      if (updates.accentColor !== undefined) payload.accent_color = updates.accentColor;

      const { data, error } = await supabase
        .from('collections')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505' && (error.message.includes('slug') || error.message.includes('collections_slug_key'))) {
          throw new Error(`A collection with URL slug "${updates.slug}" already exists. Please choose a different title or slug.`);
        }
        throw new Error(`Collection update failed: ${error.message}`);
      }

      if (data) {
        return mapRowToCollection(data);
      }
      return null;
    }

    if (!isDevMockEnabled()) {
      throw new Error('Supabase is not configured. Database operations are unavailable in production.');
    }

    const collections = getStoredCollections();
    const index = collections.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const updatedCollection: Collection = {
      ...collections[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updatedList = [...collections];
    updatedList[index] = updatedCollection;
    setStoredCollections(updatedList);
    return updatedCollection;
  },

  /**
   * Deletes a collection
   */
  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Collection deletion failed: ${error.message}`);
      }
      return true;
    }

    if (!isDevMockEnabled()) {
      throw new Error('Supabase is not configured. Database operations are unavailable in production.');
    }

    const collections = getStoredCollections();
    const filtered = collections.filter((c) => c.id !== id);
    setStoredCollections(filtered);
    return true;
  },

  /**
   * Searches published collections by query string
   */
  async search(query: string): Promise<Collection[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const all = await this.getAll();
    return all.filter(
      (c) =>
        (c.visibility === 'published' || !c.visibility) &&
        (c.title.toLowerCase().includes(q) ||
          (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
          c.statement.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q))
    );
  },
};
