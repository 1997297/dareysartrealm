import { MOCK_COLLECTIONS } from '@/data/mockCollections';
import { Collection } from '@/types/collection';
import { Artwork } from '@/types/artwork';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { artworkService } from './artworkService';

function getStoredCollections(): Collection[] {
  const stored = safeLocalStorage.getItem<Collection[] | null>(STORAGE_KEYS.STUDIO_COLLECTIONS, null);
  if (!stored || stored.some((c) => c.coverImage?.url?.includes('unsplash'))) {
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_COLLECTIONS, MOCK_COLLECTIONS);
    return MOCK_COLLECTIONS;
  }
  return stored;
}

function setStoredCollections(collections: Collection[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_COLLECTIONS, collections);
}

export const collectionService = {
  /**
   * Retrieves all collections with local storage persistence
   */
  async getAll(): Promise<Collection[]> {
    return Promise.resolve(getStoredCollections());
  },

  /**
   * Retrieves the featured collection
   */
  async getFeaturedCollection(): Promise<Collection | null> {
    const collections = getStoredCollections();
    const featured = collections.find((col) => col.featured) || collections[0] || null;
    return Promise.resolve(featured);
  },

  /**
   * Retrieves collection by slug
   */
  async getBySlug(slug: string): Promise<Collection | null> {
    const collections = getStoredCollections();
    const collection = collections.find((col) => col.slug === slug);
    return Promise.resolve(collection || null);
  },

  /**
   * Retrieves collection by ID
   */
  async getById(id: string): Promise<Collection | null> {
    const collections = getStoredCollections();
    const collection = collections.find((col) => col.id === id);
    return Promise.resolve(collection || null);
  },

  /**
   * Retrieves all artworks belonging to a collection
   */
  async getArtworks(collectionSlug: string): Promise<Artwork[]> {
    const allArtworks = await artworkService.getAll();
    const artworks = allArtworks.filter((art) => art.collection?.slug === collectionSlug);
    return Promise.resolve(artworks);
  },

  /**
   * Creates a new collection
   */
  async create(data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>): Promise<Collection> {
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
    return Promise.resolve(newCollection);
  },

  /**
   * Updates an existing collection
   */
  async update(id: string, updates: Partial<Collection>): Promise<Collection | null> {
    const collections = getStoredCollections();
    const index = collections.findIndex((c) => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const updatedCollection: Collection = {
      ...collections[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updatedList = [...collections];
    updatedList[index] = updatedCollection;
    setStoredCollections(updatedList);
    return Promise.resolve(updatedCollection);
  },

  /**
   * Deletes a collection
   */
  async delete(id: string): Promise<boolean> {
    const collections = getStoredCollections();
    const filtered = collections.filter((c) => c.id !== id);
    setStoredCollections(filtered);
    return Promise.resolve(true);
  },

  /**
   * Searches collections by title, statement, or description
   */
  async search(query: string): Promise<Collection[]> {
    const q = query.trim().toLowerCase();
    if (!q) return Promise.resolve([]);

    const collections = getStoredCollections();
    const results = collections.filter(
      (col) =>
        col.title.toLowerCase().includes(q) ||
        col.statement.toLowerCase().includes(q) ||
        col.description.toLowerCase().includes(q)
    );

    return Promise.resolve(results);
  },
};
