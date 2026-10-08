import { StudioSettingsData } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_STUDIO_SETTINGS } from '@/data/mockStudioData';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export const settingsService = {
  /**
   * Retrieves current Studio settings.
   * Priority:
   * 1. Supabase site_settings (key = 'studio_settings')
   * 2. LocalStorage / INITIAL_STUDIO_SETTINGS fallback
   */
  async getSettings(): Promise<StudioSettingsData> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'studio_settings')
          .maybeSingle();

        if (!error && data && data.value) {
          const val = data.value as unknown as Partial<StudioSettingsData>;
          return {
            ...INITIAL_STUDIO_SETTINGS,
            ...val,
            general: { ...INITIAL_STUDIO_SETTINGS.general, ...(val.general || {}) },
            artwork: { ...INITIAL_STUDIO_SETTINGS.artwork, ...(val.artwork || {}) },
            commerce: { ...INITIAL_STUDIO_SETTINGS.commerce, ...(val.commerce || {}) },
            commissions: { ...INITIAL_STUDIO_SETTINGS.commissions, ...(val.commissions || {}) },
            services: { ...INITIAL_STUDIO_SETTINGS.services, ...(val.services || {}) },
            contact: { ...INITIAL_STUDIO_SETTINGS.contact, ...(val.contact || {}) },
            notifications: { ...INITIAL_STUDIO_SETTINGS.notifications, ...(val.notifications || {}) },
          };
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase getSettings error:', err);
      }
    }

    const data = safeLocalStorage.getItem<StudioSettingsData>(
      STORAGE_KEYS.STUDIO_SETTINGS,
      INITIAL_STUDIO_SETTINGS
    );
    return data;
  },

  /**
   * Updates Studio settings in Supabase.
   */
  async updateSettings(
    updates: Partial<StudioSettingsData>
  ): Promise<StudioSettingsData> {
    const current = await this.getSettings();
    const updated: StudioSettingsData = {
      ...current,
      ...updates,
      general: { ...current.general, ...(updates.general || {}) },
      artwork: { ...current.artwork, ...(updates.artwork || {}) },
      commerce: { ...current.commerce, ...(updates.commerce || {}) },
      commissions: { ...current.commissions, ...(updates.commissions || {}) },
      services: { ...current.services, ...(updates.services || {}) },
      contact: { ...current.contact, ...(updates.contact || {}) },
      notifications: { ...current.notifications, ...(updates.notifications || {}) },
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: userAuth } = await supabase.auth.getUser();

      const { error } = await supabase.from('site_settings').upsert({
        key: 'studio_settings',
        value: updated as unknown as Record<string, unknown>,
        description: 'Studio operational settings and preferences',
        updated_by: userAuth.user?.id || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save settings: ${error.message}`);
      }
    }

    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_SETTINGS, updated);
    return updated;
  },
};
