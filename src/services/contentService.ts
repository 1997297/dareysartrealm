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
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { siteContentService } from './siteContentService';

export const contentService = {
  /**
   * Homepage CMS
   */
  async getHomepage(): Promise<CMSHomepageContent> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'cms_homepage')
          .maybeSingle();

        if (!error && data && data.value) {
          return {
            ...INITIAL_CMS_HOMEPAGE,
            ...(data.value as unknown as Partial<CMSHomepageContent>),
          };
        }
      } catch (err) {
        console.error('[Production Data Error] Failed to get CMS homepage:', err);
      }
    }

    const data = safeLocalStorage.getItem<CMSHomepageContent>(
      STORAGE_KEYS.STUDIO_CMS_HOMEPAGE,
      INITIAL_CMS_HOMEPAGE
    );
    return data;
  },

  async updateHomepage(updates: Partial<CMSHomepageContent>): Promise<CMSHomepageContent> {
    const current = await this.getHomepage();
    const updated: CMSHomepageContent = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: userAuth } = await supabase.auth.getUser();

      const { error } = await supabase.from('site_settings').upsert({
        key: 'cms_homepage',
        value: updated as unknown as Record<string, unknown>,
        description: 'Homepage editorial text and narrative copy',
        updated_by: userAuth.user?.id || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save homepage editorial copy: ${error.message}`);
      }
    }

    // Also sync with siteContentService
    if (updates.heroHeading || updates.heroSupportingText) {
      await siteContentService.updateHeroConfig({
        headline: updates.heroHeading || current.heroHeading,
        subtitle: updates.heroSupportingText || current.heroSupportingText,
      });
    }

    if (updates.manifestoStackedImages) {
      await siteContentService.updateManifestoConfig({
        stackedArtworkImages: updates.manifestoStackedImages,
      });
    }

    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_CMS_HOMEPAGE, updated);
    return updated;
  },

  /**
   * About CMS
   */
  async getAbout(): Promise<CMSAboutContent> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'cms_about')
          .maybeSingle();

        if (!error && data && data.value) {
          return {
            ...INITIAL_CMS_ABOUT,
            ...(data.value as unknown as Partial<CMSAboutContent>),
          };
        }
      } catch (err) {
        console.error('[Production Data Error] Failed to get CMS about:', err);
      }
    }

    const data = safeLocalStorage.getItem<CMSAboutContent>(
      STORAGE_KEYS.STUDIO_CMS_ABOUT,
      INITIAL_CMS_ABOUT
    );
    return data;
  },

  async updateAbout(updates: Partial<CMSAboutContent>): Promise<CMSAboutContent> {
    const current = await this.getAbout();
    const updated: CMSAboutContent = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: userAuth } = await supabase.auth.getUser();

      const { error } = await supabase.from('site_settings').upsert({
        key: 'cms_about',
        value: updated as unknown as Record<string, unknown>,
        description: 'About page curatorial copy and philosophy',
        updated_by: userAuth.user?.id || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save about copy: ${error.message}`);
      }
    }

    // Also sync with siteContentService
    await siteContentService.updateAboutConfig({
      artistBiography: updated.artistBiography,
      curatorialStatement: updated.curatorialStatement,
      studioPhilosophy: updated.studioPhilosophy,
      processNarrative: updated.processNarrative,
      portraitImageUrl: updated.portraitImageUrl,
    });

    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_CMS_ABOUT, updated);
    return updated;
  },

  /**
   * Contact CMS
   */
  async getContact(): Promise<CMSContactContent> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'cms_contact')
          .maybeSingle();

        if (!error && data && data.value) {
          return {
            ...INITIAL_CMS_CONTACT,
            ...(data.value as unknown as Partial<CMSContactContent>),
          };
        }
      } catch (err) {
        console.error('[Production Data Error] Failed to get CMS contact:', err);
      }
    }

    const data = safeLocalStorage.getItem<CMSContactContent>(
      STORAGE_KEYS.STUDIO_CMS_CONTACT,
      INITIAL_CMS_CONTACT
    );
    return data;
  },

  async updateContact(updates: Partial<CMSContactContent>): Promise<CMSContactContent> {
    const current = await this.getContact();
    const updated: CMSContactContent = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: userAuth } = await supabase.auth.getUser();

      const { error } = await supabase.from('site_settings').upsert({
        key: 'cms_contact',
        value: updated as unknown as Record<string, unknown>,
        description: 'Contact and atelier logistics copy',
        updated_by: userAuth.user?.id || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save contact copy: ${error.message}`);
      }
    }

    // Also sync with siteContentService
    await siteContentService.updateContactConfig({
      studioEmail: updated.studioEmail,
      pressEmail: updated.pressEmail,
      telephone: updated.telephone,
      whatsapp: updated.whatsapp,
      locationNote: updated.locationNote,
      hoursNote: updated.hoursNote,
    });

    safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_CMS_CONTACT, updated);
    return updated;
  },
};
