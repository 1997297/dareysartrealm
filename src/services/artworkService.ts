import { MOCK_ARTWORKS } from '@/data/mockArtworks';
import { Artwork, ArtworkFilters } from '@/types/artwork';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';

function getStoredArtworks(): Artwork[] {
  const stored = safeLocalStorage.getItem<Artwork[] | null>(STORAGE_KEYS.STUDIO_ARTWORKS, null);
  if (!stored || stored.length < 20 || stored.some((a) => a.coverImage?.url?.includes('unsplash'))) {
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_ARTWORKS, MOCK_ARTWORKS);
    return MOCK_ARTWORKS;
  }
  return stored;
}

function setStoredArtworks(artworks: Artwork[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_ARTWORKS, artworks);
}

export const artworkService = {
  /**
   * Retrieves all artworks with local storage persistence
   */
  async getAll(): Promise<Artwork[]> {
    return Promise.resolve(getStoredArtworks());
  },

  /**
   * Retrieves featured artworks for editorial showcase
   */
  async getFeatured(): Promise<Artwork[]> {
    const list = getStoredArtworks();
    const featured = list.filter((art) => art.featured && art.publicationStatus !== 'archived');
    return Promise.resolve(featured);
  },

  /**
   * Retrieves selected works for curated composition
   */
  async getSelected(): Promise<Artwork[]> {
    const list = getStoredArtworks();
    const selected = list
      .filter(
        (art) =>
          (art.status === 'available' || art.status === 'reserved') &&
          art.publicationStatus !== 'archived'
      )
      .slice(0, 5);
    return Promise.resolve(selected);
  },

  /**
   * Retrieves sold / collected works
   */
  async getCollected(): Promise<Artwork[]> {
    const list = getStoredArtworks();
    const collected = list.filter((art) => art.status === 'sold');
    return Promise.resolve(collected);
  },

  /**
   * Retrieves currently available works
   */
  async getAvailable(): Promise<Artwork[]> {
    const list = getStoredArtworks();
    const available = list.filter(
      (art) => art.status === 'available' && art.publicationStatus !== 'archived'
    );
    return Promise.resolve(available);
  },

  /**
   * Retrieves the primary hero artwork
   */
  async getHeroArtwork(): Promise<Artwork> {
    const list = getStoredArtworks();
    const hero = list.find((art) => art.slug === 'echoes-of-home') || list[0] || MOCK_ARTWORKS[0];
    return Promise.resolve(hero);
  },

  /**
   * Retrieves artwork by slug
   */
  async getBySlug(slug: string): Promise<Artwork | null> {
    const list = getStoredArtworks();
    const artwork = list.find((art) => art.slug === slug);
    return Promise.resolve(artwork || null);
  },

  /**
   * Retrieves artwork by ID
   */
  async getById(id: string): Promise<Artwork | null> {
    const list = getStoredArtworks();
    const artwork = list.find((art) => art.id === id || art.artworkId === id);
    return Promise.resolve(artwork || null);
  },

  /**
   * Retrieves related artworks for recommendation and detail showcase
   */
  async getRelated(artworkId: string, limit: number = 3): Promise<Artwork[]> {
    const list = getStoredArtworks();
    const current = list.find((art) => art.id === artworkId || art.artworkId === artworkId);
    if (!current) return Promise.resolve(list.slice(0, limit));

    const related = list.filter((art) => {
      if (art.id === current.id || art.artworkId === current.artworkId) return false;
      if (current.collection && art.collection?.slug === current.collection.slug) return true;
      return art.tags.some((t) => current.tags.includes(t));
    });

    if (related.length < limit) {
      const remaining = list.filter(
        (art) =>
          art.id !== current.id &&
          art.artworkId !== current.artworkId &&
          !related.some((r) => r.id === art.id)
      );
      related.push(...remaining);
    }

    return Promise.resolve(related.slice(0, limit));
  },

  /**
   * Creates a new artwork record
   */
  async create(artworkData: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>): Promise<Artwork> {
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
    return Promise.resolve(newArtwork);
  },

  /**
   * Updates an existing artwork record
   */
  async update(id: string, updates: Partial<Artwork>): Promise<Artwork | null> {
    const list = getStoredArtworks();
    const index = list.findIndex((art) => art.id === id || art.artworkId === id);
    if (index === -1) return Promise.resolve(null);

    const updatedArtwork: Artwork = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updatedList = [...list];
    updatedList[index] = updatedArtwork;
    setStoredArtworks(updatedList);
    return Promise.resolve(updatedArtwork);
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
    return Promise.resolve(!!updated);
  },

  /**
   * Deletes an artwork record
   */
  async delete(id: string): Promise<boolean> {
    const list = getStoredArtworks();
    const filtered = list.filter((art) => art.id !== id && art.artworkId !== id);
    setStoredArtworks(filtered);
    return Promise.resolve(true);
  },

  /**
   * Filters and sorts artworks based on provided criteria
   */
  async filter(filters: ArtworkFilters): Promise<Artwork[]> {
    let results = getStoredArtworks();

    if (filters.status && filters.status !== 'all') {
      results = results.filter((art) => art.status === filters.status);
    }

    if (filters.collectionSlug) {
      results = results.filter((art) => art.collection?.slug === filters.collectionSlug);
    }

    if (filters.medium) {
      const mediumQuery = filters.medium.toLowerCase();
      results = results.filter((art) => art.medium.toLowerCase().includes(mediumQuery));
    }

    if (filters.orientation && filters.orientation !== 'all') {
      results = results.filter((art) => art.orientation === filters.orientation);
    }

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

    if (filters.minPrice !== undefined) {
      results = results.filter((art) => (art.price || 0) >= (filters.minPrice || 0));
    }

    if (filters.maxPrice !== undefined) {
      results = results.filter((art) => (art.price || Infinity) <= (filters.maxPrice || Infinity));
    }

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

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          results.sort((a, b) => b.year - a.year);
          break;
        case 'price-asc':
          results.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-desc':
          results.sort((a, b) => (b.price || 0) - (a.price || 0));
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

    return Promise.resolve(results);
  },

  /**
   * Searches artworks by query string
   */
  async search(query: string): Promise<Artwork[]> {
    return this.filter({ search: query });
  },
};
