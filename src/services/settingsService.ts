import { StudioSettingsData } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_STUDIO_SETTINGS } from '@/data/mockStudioData';

export const settingsService = {
  /**
   * Retrieves current Studio settings
   */
  async getSettings(): Promise<StudioSettingsData> {
    const data = safeLocalStorage.getItem<StudioSettingsData>(
      STORAGE_KEYS.STUDIO_SETTINGS,
      INITIAL_STUDIO_SETTINGS
    );
    return Promise.resolve(data);
  },

  /**
   * Updates Studio settings
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
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_SETTINGS, updated);
    return Promise.resolve(updated);
  },
};
