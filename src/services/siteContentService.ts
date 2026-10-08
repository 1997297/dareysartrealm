import {
  HeroConfig,
  HomePageContentConfig,
  AboutPageConfig,
  ContactPageConfig,
  GeneralSiteConfig,
} from '@/types/siteContent';
import {
  INITIAL_HERO_CONFIG,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_ABOUT_CONFIG,
  INITIAL_CONTACT_CONFIG,
  INITIAL_GENERAL_CONFIG,
} from '@/data/initialContent';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

const CMS_STORAGE_KEYS = {
  HOMEPAGE: 'artrealm_cms_homepage_config',
  ABOUT: 'artrealm_cms_about_config',
  CONTACT: 'artrealm_cms_contact_config',
  GENERAL: 'artrealm_cms_general_config',
};

export const siteContentService = {
  // ----------------------------------------------------------------------------
  // HOMEPAGE & HERO CONFIGURATION
  // ----------------------------------------------------------------------------

  /**
   * Retrieves the full HomePage content & section configuration.
   * Priority:
   * 1. Supabase public.site_settings row (key = 'homepage')
   * 2. Local storage fallback (offline/development)
   * 3. INITIAL_HOMEPAGE_CONFIG approved initial content
   */
  async getHomePageConfig(): Promise<HomePageContentConfig> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'homepage')
          .maybeSingle();

        if (!error && data && data.value) {
          const raw = data.value as unknown as HomePageContentConfig;
          return {
            ...INITIAL_HOMEPAGE_CONFIG,
            ...raw,
            hero: {
              ...INITIAL_HOMEPAGE_CONFIG.hero,
              ...(raw.hero || {}),
            },
            manifesto: {
              ...INITIAL_HOMEPAGE_CONFIG.manifesto,
              ...(raw.manifesto || {}),
            },
          };
        }
      } catch (err) {
        console.error('[Production Data Error] Failed to fetch homepage CMS settings:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = safeLocalStorage.getItem<HomePageContentConfig | null>(
        CMS_STORAGE_KEYS.HOMEPAGE,
        null
      );
      if (stored) return { ...INITIAL_HOMEPAGE_CONFIG, ...stored };
    }

    return INITIAL_HOMEPAGE_CONFIG;
  },

  /**
   * Updates HomePage configuration in Supabase site_settings.
   */
  async updateHomePageConfig(
    updates: Partial<HomePageContentConfig>
  ): Promise<HomePageContentConfig> {
    const current = await this.getHomePageConfig();
    const updated: HomePageContentConfig = {
      ...current,
      ...updates,
      hero: {
        ...current.hero,
        ...(updates.hero || {}),
      },
      manifesto: {
        ...current.manifesto,
        ...(updates.manifesto || {}),
      },
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: userAuth } = await supabase.auth.getUser();

      const { error } = await supabase.from('site_settings').upsert({
        key: 'homepage',
        value: updated as unknown as Record<string, unknown>,
        description: 'Homepage section and editorial layout configuration',
        updated_by: userAuth.user?.id || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save homepage settings: ${error.message}`);
      }
    }

    if (typeof window !== 'undefined') {
      safeLocalStorage.setItem(CMS_STORAGE_KEYS.HOMEPAGE, updated);
    }

    return updated;
  },

  /**
   * Retrieves active Hero configuration.
   */
  async getHeroConfig(): Promise<HeroConfig> {
    const homeConfig = await this.getHomePageConfig();
    return homeConfig.hero || INITIAL_HERO_CONFIG;
  },

  /**
   * Updates Hero configuration specifically.
   */
  async updateHeroConfig(updates: Partial<HeroConfig>): Promise<HeroConfig> {
    const currentHome = await this.getHomePageConfig();
    const updatedHero: HeroConfig = {
      ...currentHome.hero,
      ...updates,
    };

    await this.updateHomePageConfig({
      ...currentHome,
      hero: updatedHero,
    });

    return updatedHero;
  },

  /**
   * Updates Manifesto configuration specifically.
   */
  async updateManifestoConfig(updates: Partial<ManifestoSectionConfig>): Promise<ManifestoSectionConfig> {
    const currentHome = await this.getHomePageConfig();
    const updatedManifesto: ManifestoSectionConfig = {
      ...currentHome.manifesto,
      ...updates,
    };

    await this.updateHomePageConfig({
      ...currentHome,
      manifesto: updatedManifesto,
    });

    return updatedManifesto;
  },

  /**
   * Resets Hero configuration to initial approved project content.
   */
  async resetHeroConfig(): Promise<HeroConfig> {
    await this.updateHeroConfig(INITIAL_HERO_CONFIG);
    return INITIAL_HERO_CONFIG;
  },

  // ----------------------------------------------------------------------------
  // ABOUT PAGE CONFIGURATION
  // ----------------------------------------------------------------------------

  async getAboutConfig(): Promise<AboutPageConfig> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'about')
          .maybeSingle();

        if (!error && data && data.value) {
          return {
            ...INITIAL_ABOUT_CONFIG,
            ...(data.value as unknown as Partial<AboutPageConfig>),
          };
        }
      } catch (err) {
        console.error('[Production Data Error] Failed to fetch about CMS settings:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = safeLocalStorage.getItem<AboutPageConfig | null>(
        CMS_STORAGE_KEYS.ABOUT,
        null
      );
      if (stored) return { ...INITIAL_ABOUT_CONFIG, ...stored };
    }

    return INITIAL_ABOUT_CONFIG;
  },

  async updateAboutConfig(updates: Partial<AboutPageConfig>): Promise<AboutPageConfig> {
    const current = await this.getAboutConfig();
    const updated: AboutPageConfig = {
      ...current,
      ...updates,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: userAuth } = await supabase.auth.getUser();

      const { error } = await supabase.from('site_settings').upsert({
        key: 'about',
        value: updated as unknown as Record<string, unknown>,
        description: 'About page artist dossier and philosophy',
        updated_by: userAuth.user?.id || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save about settings: ${error.message}`);
      }
    }

    if (typeof window !== 'undefined') {
      safeLocalStorage.setItem(CMS_STORAGE_KEYS.ABOUT, updated);
    }

    return updated;
  },

  // ----------------------------------------------------------------------------
  // CONTACT PAGE CONFIGURATION
  // ----------------------------------------------------------------------------

  async getContactConfig(): Promise<ContactPageConfig> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'contact')
          .maybeSingle();

        if (!error && data && data.value) {
          return {
            ...INITIAL_CONTACT_CONFIG,
            ...(data.value as unknown as Partial<ContactPageConfig>),
          };
        }
      } catch (err) {
        console.error('[Production Data Error] Failed to fetch contact CMS settings:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = safeLocalStorage.getItem<ContactPageConfig | null>(
        CMS_STORAGE_KEYS.CONTACT,
        null
      );
      if (stored) return { ...INITIAL_CONTACT_CONFIG, ...stored };
    }

    return INITIAL_CONTACT_CONFIG;
  },

  async updateContactConfig(updates: Partial<ContactPageConfig>): Promise<ContactPageConfig> {
    const current = await this.getContactConfig();
    const updated: ContactPageConfig = {
      ...current,
      ...updates,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: userAuth } = await supabase.auth.getUser();

      const { error } = await supabase.from('site_settings').upsert({
        key: 'contact',
        value: updated as unknown as Record<string, unknown>,
        description: 'Studio contact logistics, hours, and social connections',
        updated_by: userAuth.user?.id || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save contact settings: ${error.message}`);
      }
    }

    if (typeof window !== 'undefined') {
      safeLocalStorage.setItem(CMS_STORAGE_KEYS.CONTACT, updated);
    }

    return updated;
  },

  // ----------------------------------------------------------------------------
  // GENERAL SITE SETTINGS
  // ----------------------------------------------------------------------------

  async getGeneralConfig(): Promise<GeneralSiteConfig> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'general')
          .maybeSingle();

        if (!error && data && data.value) {
          return {
            ...INITIAL_GENERAL_CONFIG,
            ...(data.value as unknown as Partial<GeneralSiteConfig>),
          };
        }
      } catch (err) {
        console.error('[Production Data Error] Failed to fetch general CMS settings:', err);
      }
    }

    if (typeof window !== 'undefined') {
      const stored = safeLocalStorage.getItem<GeneralSiteConfig | null>(
        CMS_STORAGE_KEYS.GENERAL,
        null
      );
      if (stored) return { ...INITIAL_GENERAL_CONFIG, ...stored };
    }

    return INITIAL_GENERAL_CONFIG;
  },

  async updateGeneralConfig(updates: Partial<GeneralSiteConfig>): Promise<GeneralSiteConfig> {
    const current = await this.getGeneralConfig();
    const updated: GeneralSiteConfig = {
      ...current,
      ...updates,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data: userAuth } = await supabase.auth.getUser();

      const { error } = await supabase.from('site_settings').upsert({
        key: 'general',
        value: updated as unknown as Record<string, unknown>,
        description: 'General website settings and defaults',
        updated_by: userAuth.user?.id || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw new Error(`Failed to save general settings: ${error.message}`);
      }
    }

    if (typeof window !== 'undefined') {
      safeLocalStorage.setItem(CMS_STORAGE_KEYS.GENERAL, updated);
    }

    return updated;
  },
};
