import { StudioMediaAsset, MediaCategory } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_STUDIO_MEDIA } from '@/data/mockStudioData';

function getStoredMedia(): StudioMediaAsset[] {
  return safeLocalStorage.getItem<StudioMediaAsset[]>(
    STORAGE_KEYS.STUDIO_MEDIA,
    INITIAL_STUDIO_MEDIA
  );
}

function setStoredMedia(media: StudioMediaAsset[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_MEDIA, media);
}

export const mediaService = {
  /**
   * Retrieves all media assets
   */
  async getAll(): Promise<StudioMediaAsset[]> {
    return Promise.resolve(getStoredMedia());
  },

  /**
   * Retrieves a single media asset by ID
   */
  async getById(id: string): Promise<StudioMediaAsset | null> {
    const list = getStoredMedia();
    const item = list.find((m) => m.id === id);
    return Promise.resolve(item || null);
  },

  /**
   * Simulates uploading a new asset to the media library
   */
  async upload(
    assetData: Omit<StudioMediaAsset, 'id' | 'uploadedAt' | 'usageCount'>
  ): Promise<StudioMediaAsset> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const list = getStoredMedia();
    const newAsset: StudioMediaAsset = {
      ...assetData,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      usageCount: 0,
      usageReferences: [],
    };
    const updated = [newAsset, ...list];
    setStoredMedia(updated);
    return Promise.resolve(newAsset);
  },

  /**
   * Updates metadata on an asset (alt text, caption, category)
   */
  async update(id: string, updates: Partial<StudioMediaAsset>): Promise<StudioMediaAsset | null> {
    const list = getStoredMedia();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: StudioMediaAsset = {
      ...list[index],
      ...updates,
    };
    list[index] = updated;
    setStoredMedia(list);
    return Promise.resolve(updated);
  },

  /**
   * Deletes a media asset
   */
  async delete(id: string): Promise<boolean> {
    const list = getStoredMedia();
    const filtered = list.filter((m) => m.id !== id);
    setStoredMedia(filtered);
    return Promise.resolve(true);
  },

  /**
   * Filters media by category
   */
  async filterByCategory(category: MediaCategory | 'all'): Promise<StudioMediaAsset[]> {
    const list = getStoredMedia();
    if (category === 'all') return Promise.resolve(list);
    return Promise.resolve(list.filter((m) => m.category === category));
  },
};
