import { StudioMediaAsset, MediaCategory } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_STUDIO_MEDIA } from '@/data/mockStudioData';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { MediaAssetRow } from '@/types/supabase';
import { isDevMockEnabled } from './artworkService';

function getStoredMedia(): StudioMediaAsset[] {
  if (!isDevMockEnabled()) {
    return [];
  }
  return safeLocalStorage.getItem<StudioMediaAsset[]>(
    STORAGE_KEYS.STUDIO_MEDIA,
    INITIAL_STUDIO_MEDIA
  );
}

function setStoredMedia(media: StudioMediaAsset[]): void {
  if (isDevMockEnabled()) {
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_MEDIA, media);
  }
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
        if (error) {
          console.error('[Production Data Error] Supabase media fetch failed:', error.message);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase media fetch threw exception:', err);
      }
    } else {
      if (!isDevMockEnabled()) {
        console.error(
          '[Production Configuration Error] Supabase is not configured. Media mock fallback is strictly disabled in production.'
        );
      }
    }

    if (isDevMockEnabled()) {
      return getStoredMedia();
    }
    return INITIAL_STUDIO_MEDIA;
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
        return null;
      } catch (err) {
        console.error(`[Production Data Error] getById('${id}') failed:`, err);
        return null;
      }
    }

    if (isDevMockEnabled()) {
      const list = getStoredMedia();
      return list.find((m) => m.id === id) || null;
    }
    return INITIAL_STUDIO_MEDIA.find((m) => m.id === id) || null;
  },

  /**
   * Uploads a real file to Supabase Storage and records metadata in media_assets.
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

      // 3. Resolve Public URL (only for public bucket)
      let publicUrl: string | null = null;
      if (bucket === 'artworks-public') {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(storagePath);
        publicUrl = publicUrlData.publicUrl;
      }

      // 4. Insert row into public.media_assets
      const { data: userAuth } = await supabase.auth.getUser();

      const { data: row, error: dbError } = await supabase
        .from('media_assets')
        .insert({
          storage_bucket: bucket,
          storage_path: storagePath,
          public_url: publicUrl,
          title: options.title || file.name,
          filename: file.name,
          mime_type: file.type,
          file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          width: options.width ?? null,
          height: options.height ?? null,
          category,
          alt_text: options.altText || options.title || file.name,
          caption: options.caption || null,
          uploaded_by: userAuth.user?.id || null,
        })
        .select()
        .single();

      if (dbError || !row) {
        // Rollback storage file on metadata failure
        await supabase.storage.from(bucket).remove([storagePath]);
        throw new Error(`Failed to save media metadata: ${dbError?.message}`);
      }

      return mapRowToStudioAsset(row);
    }

    // Local / Dev Fallback: persist as base64 Data URL so it remains valid across page reloads
    let persistentUrl: string;
    try {
      persistentUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } catch {
      persistentUrl = URL.createObjectURL(file);
    }

    const newAsset: StudioMediaAsset = {
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: options.title || file.name,
      filename: file.name,
      url: persistentUrl,
      category,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      width: options.width || 1200,
      height: options.height || 900,
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
   * Uploads multiple media assets concurrently to storage
   */
  async uploadMultipleFiles(
    files: File[],
    options: Omit<UploadOptions, 'title'> & { titlePrefix?: string }
  ): Promise<StudioMediaAsset[]> {
    const uploadPromises = files.map((file, idx) =>
      this.uploadFile(file, {
        ...options,
        title: `${options.titlePrefix || 'Artwork Perspective'} ${idx + 1}`,
      })
    );
    return Promise.all(uploadPromises);
  },

  /**
   * Updates metadata on an asset (alt text, caption, category)
   */
  async update(id: string, updates: Partial<StudioMediaAsset>): Promise<StudioMediaAsset | null> {
    if (isSupabaseConfigured()) {
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

      if (error) {
        throw new Error(`Media metadata update failed: ${error.message}`);
      }

      if (data) {
        return mapRowToStudioAsset(data);
      }
      return null;
    }

    if (!isDevMockEnabled()) {
      throw new Error('Supabase is not configured.');
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
   * Deletes a media asset safely from database and storage.
   * Safety check: blocks deletion if the asset is actively referenced by artworks or collections.
   */
  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      // 1. Fetch asset to find storage path and URL
      const { data: asset, error: fetchErr } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchErr || !asset) {
        throw new Error('Media asset not found.');
      }

      // 2. REFERENTIAL INTEGRITY SAFETY CHECK:
      // Check if image is in active use in artwork_images or collections
      const [{ count: imgCount }, { count: colCount }] = await Promise.all([
        supabase
          .from('artwork_images')
          .select('*', { count: 'exact', head: true })
          .or(`media_asset_id.eq.${id},image_url.eq.${asset.public_url || '___none___'}`),
        supabase
          .from('collections')
          .select('*', { count: 'exact', head: true })
          .eq('cover_image_url', asset.public_url || '___none___'),
      ]);

      const totalActiveRefs = (imgCount || 0) + (colCount || 0);
      if (totalActiveRefs > 0) {
        throw new Error(
          `Cannot delete "${asset.filename}". It is currently linked to ${imgCount || 0} artwork image(s) and ${colCount || 0} collection cover(s). Please detach or replace the asset before deleting.`
        );
      }

      // 3. Remove from storage bucket
      const { error: storageErr } = await supabase.storage
        .from(asset.storage_bucket)
        .remove([asset.storage_path]);

      if (storageErr) {
        console.warn('Storage file deletion warning:', storageErr.message);
      }

      // 4. Remove database record
      const { error: dbErr } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', id);

      if (dbErr) {
        throw new Error(`Media record deletion failed: ${dbErr.message}`);
      }

      return true;
    }

    if (!isDevMockEnabled()) {
      throw new Error('Supabase is not configured.');
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
