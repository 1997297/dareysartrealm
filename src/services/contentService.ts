import {
  CMSHomepageContent,
  CMSAboutContent,
  CMSContactContent,
} from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import {
  INITIAL_CMS_HOMEPAGE,
  INITIAL_CMS_ABOUT,
  INITIAL_CMS_CONTACT,
} from '@/data/mockStudioData';

export const contentService = {
  /**
   * Homepage CMS
   */
  async getHomepage(): Promise<CMSHomepageContent> {
    const data = safeLocalStorage.getItem<CMSHomepageContent>(
      STORAGE_KEYS.STUDIO_CMS_HOMEPAGE,
      INITIAL_CMS_HOMEPAGE
    );
    return Promise.resolve(data);
  },

  async updateHomepage(updates: Partial<CMSHomepageContent>): Promise<CMSHomepageContent> {
    const current = await this.getHomepage();
    const updated: CMSHomepageContent = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_CMS_HOMEPAGE, updated);
    return Promise.resolve(updated);
  },

  /**
   * About CMS
   */
  async getAbout(): Promise<CMSAboutContent> {
    const data = safeLocalStorage.getItem<CMSAboutContent>(
      STORAGE_KEYS.STUDIO_CMS_ABOUT,
      INITIAL_CMS_ABOUT
    );
    return Promise.resolve(data);
  },

  async updateAbout(updates: Partial<CMSAboutContent>): Promise<CMSAboutContent> {
    const current = await this.getAbout();
    const updated: CMSAboutContent = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_CMS_ABOUT, updated);
    return Promise.resolve(updated);
  },

  /**
   * Contact CMS
   */
  async getContact(): Promise<CMSContactContent> {
    const data = safeLocalStorage.getItem<CMSContactContent>(
      STORAGE_KEYS.STUDIO_CMS_CONTACT,
      INITIAL_CMS_CONTACT
    );
    return Promise.resolve(data);
  },

  async updateContact(updates: Partial<CMSContactContent>): Promise<CMSContactContent> {
    const current = await this.getContact();
    const updated: CMSContactContent = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_CMS_CONTACT, updated);
    return Promise.resolve(updated);
  },
};
