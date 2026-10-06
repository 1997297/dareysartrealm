import { StudioMediaAsset, MediaCategory } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_STUDIO_MEDIA } from '@/data/mockStudioData';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { MediaAssetRow } from '@/types/supabase';

function getStoredMedia(): StudioMediaAsset[] {
  return safeLocalStorage.getItem<StudioMediaAsset[]>(
    STORAGE_KEYS.STUDIO_MEDIA,
    INITIAL_STUDIO_MEDIA
  );
}

function setStoredMedia(media: StudioMediaAsset[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_MEDIA, media);
}

function mapRowToStudioAsset(row: MediaAssetRow): StudioMediaAsset {
  return {
    id: row.id,
    title: row.title,
    filename: row.filename,
    url: row.public_url || '',
    category: row.category as MediaCategory,
    fileSize: row.file_size,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    mimeType: row.mime_type,
    altText: row.alt_text,
    caption: row.caption ?? undefined,
    uploadedAt: row.created_at,
    usageCount: 0,
    usageReferences: [],
  };
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_PUBLIC_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export interface UploadOptions {
  title: string;
  category?: MediaCategory;
  altText?: string;
  caption?: string;
  bucket?: 'artworks-public' | 'artworks-private';
  width?: number;
  height?: number;
}

export const mediaService = {
  /**
   * Retrieves all media assets from Supabase or local storage fallback
   */
  async getAll(): Promise<StudioMediaAsset[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('media_assets')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(mapRowToStudioAsset);
        }
      } catch (err) {
        console.warn('Supabase media fetch failed, using fallback:', err);
      }
    }
    return getStoredMedia();
  },

  /**
   * Retrieves a single media asset by ID
   */
  async getById(id: string): Promise<StudioMediaAsset | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('media_assets')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapRowToStudioAsset(data);
        }
      } catch (err) {
        console.warn('Supabase getById failed, using fallback:', err);
      }
    }
    const list = getStoredMedia();
    return list.find((m) => m.id === id) || null;
  },

  /**
   * Uploads a real file to Supabase Storage and records metadata in media_assets.
   * If unconfigured, falls back to local storage simulation.
   */
  async uploadFile(
    file: File,
    options: UploadOptions
  ): Promise<StudioMediaAsset> {
    // 1. Validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(`Unsupported image type (${file.type}). Allowed: JPG, PNG, WebP, AVIF.`);
    }
    if (file.size > MAX_PUBLIC_FILE_SIZE) {
      throw new Error(`File exceeds maximum size of 15MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
    }

    const bucket = options.bucket || 'artworks-public';
    const category = options.category || 'artwork';
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${category}/${Date.now()}-${sanitizedName}`;

    if (isSupabaseConfigured()) {
      const supabase = createClient();

      // 2. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // 3. Resolve Public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(storagePath);
      const publicUrl = publicUrlData.publicUrl;

      // 4. Insert row into public.media_assets
      const { data: insertedRow, error: insertError } = await supabase
        .from('media_assets')
        .insert({
          storage_bucket: bucket,
          storage_path: storagePath,
          public_url: publicUrl,
          title: options.title || file.name,
          filename: file.name,
          mime_type: file.type,
          file_size: file.size,
          width: options.width ?? null,
          height: options.height ?? null,
          category,
          alt_text: options.altText || options.title || '',
          caption: options.caption || null,
        })
        .select()
        .single();

      if (insertError || !insertedRow) {
        // Rollback uploaded storage object on metadata failure
        await supabase.storage.from(bucket).remove([storagePath]);
        throw new Error(`Failed to save media metadata: ${insertError?.message}`);
      }

      return mapRowToStudioAsset(insertedRow);
    }

    // Fallback: Local simulation when Supabase is not configured
    const localUrl = URL.createObjectURL(file);
    const newAsset: StudioMediaAsset = {
      id: `med-${Date.now()}`,
      title: options.title || file.name,
      filename: file.name,
      url: localUrl,
      category,
      fileSize: file.size,
      width: options.width,
      height: options.height,
      mimeType: file.type,
      altText: options.altText || options.title || '',
      caption: options.caption,
      uploadedAt: new Date().toISOString(),
      usageCount: 0,
      usageReferences: [],
    };
    const list = getStoredMedia();
    setStoredMedia([newAsset, ...list]);
    return newAsset;
  },

  /**
   * Legacy / simulated upload for backwards compatibility with existing UI components
   */
  async upload(
    assetData: Omit<StudioMediaAsset, 'id' | 'uploadedAt' | 'usageCount'>
  ): Promise<StudioMediaAsset> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('media_assets')
          .insert({
            storage_bucket: 'artworks-public',
            storage_path: `legacy/${Date.now()}-${assetData.filename}`,
            public_url: assetData.url,
            title: assetData.title,
            filename: assetData.filename,
            mime_type: assetData.mimeType,
            file_size: assetData.fileSize,
            width: assetData.width ?? null,
            height: assetData.height ?? null,
            category: assetData.category,
            alt_text: assetData.altText,
            caption: assetData.caption || null,
          })
          .select()
          .single();

        if (!error && data) {
          return mapRowToStudioAsset(data);
        }
      } catch (err) {
        console.warn('Supabase upload record failed, using fallback:', err);
      }
    }

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
    return newAsset;
  },

  /**
   * Updates metadata on an asset (alt text, caption, category)
   */
  async update(id: string, updates: Partial<StudioMediaAsset>): Promise<StudioMediaAsset | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const payload: Record<string, unknown> = {};
        if (updates.title !== undefined) payload.title = updates.title;
        if (updates.altText !== undefined) payload.alt_text = updates.altText;
        if (updates.caption !== undefined) payload.caption = updates.caption;
        if (updates.category !== undefined) payload.category = updates.category;

        const { data, error } = await supabase
          .from('media_assets')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (!error && data) {
          return mapRowToStudioAsset(data);
        }
      } catch (err) {
        console.warn('Supabase media update failed, using fallback:', err);
      }
    }

    const list = getStoredMedia();
    const index = list.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const updated: StudioMediaAsset = {
      ...list[index],
      ...updates,
    };
    list[index] = updated;
    setStoredMedia(list);
    return updated;
  },

  /**
   * Deletes a media asset safely from database and storage
   */
  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        // Fetch to find storage path
        const { data: asset } = await supabase
          .from('media_assets')
          .select('*')
          .eq('id', id)
          .single();

        if (asset) {
          // Remove from storage bucket
          await supabase.storage
            .from(asset.storage_bucket)
            .remove([asset.storage_path]);

          // Remove database record
          const { error } = await supabase
            .from('media_assets')
            .delete()
            .eq('id', id);

          return !error;
        }
      } catch (err) {
        console.warn('Supabase media delete failed, using fallback:', err);
      }
    }

    const list = getStoredMedia();
    const filtered = list.filter((m) => m.id !== id);
    setStoredMedia(filtered);
    return true;
  },

  /**
   * Filters media by category
   */
  async filterByCategory(category: MediaCategory | 'all'): Promise<StudioMediaAsset[]> {
    const list = await this.getAll();
    if (category === 'all') return list;
    return list.filter((m) => m.category === category);
  },
};
