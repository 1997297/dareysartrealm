import { MOCK_SERVICES } from '@/data/mockServices';
import { Service, ServiceProcessStep, ServiceFAQ } from '@/types/service';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { ServiceRow } from '@/types/supabase';
import { isDevMockEnabled } from './artworkService';

const SERVICES_STORAGE_KEY = 'artrealm_cms_services';

function mapRowToService(row: ServiceRow): Service {
  return {
    id: row.id,
    number: `0${row.sort_order || 1}`,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    coverImage: {
      url: row.cover_image_url || '/artworks/pic5.jpeg',
      alt: row.cover_image_alt || row.title,
    },
    pricingStructure: row.pricing_structure ?? undefined,
    typicalTimeline: row.typical_timeline ?? undefined,
    features: row.features || [],
    process: (Array.isArray(row.process) ? row.process : []) as unknown as ServiceProcessStep[],
  };
}

function getStoredServices(): Service[] {
  if (typeof window !== 'undefined') {
    const stored = safeLocalStorage.getItem<Service[] | null>(SERVICES_STORAGE_KEY, null);
    if (stored && stored.length > 0) return stored;
  }
  return MOCK_SERVICES;
}

function setStoredServices(services: Service[]): void {
  if (typeof window !== 'undefined') {
    safeLocalStorage.setItem(SERVICES_STORAGE_KEY, services);
  }
}

export const serviceService = {
  /**
   * Retrieves all studio services.
   * Priority:
   * 1. Supabase public.services table
   * 2. Local storage / MOCK_SERVICES initial approved disciplines
   */
  async getAll(options?: { includeUnpublished?: boolean }): Promise<Service[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        let query = supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!options?.includeUnpublished) {
          query = query.eq('publication_status', 'published');
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapRowToService);
        }
        if (error) {
          console.error('[Production Data Error] Supabase services query failed:', error.message);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase services exception:', err);
      }
    }

    const list = getStoredServices();
    return list;
  },

  /**
   * Retrieves a single service by slug.
   */
  async getBySlug(slug: string): Promise<Service | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (!error && data) {
          return mapRowToService(data);
        }
      } catch (err) {
        console.error('[Production Data Error] Supabase getBySlug error:', err);
      }
    }

    const list = getStoredServices();
    return list.find((s) => s.slug === slug) || null;
  },

  /**
   * Retrieves featured services for homepage preview.
   */
  async getFeatured(): Promise<Service[]> {
    const all = await this.getAll();
    return all.slice(0, 4);
  },

  /**
   * Creates a new service offering in the database.
   */
  async create(serviceData: Omit<Service, 'id'>): Promise<Service> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('services')
        .insert({
          slug: serviceData.slug,
          title: serviceData.title,
          short_description: serviceData.shortDescription,
          description: serviceData.description || serviceData.shortDescription,
          cover_image_url: serviceData.coverImage?.url || null,
          cover_image_alt: serviceData.coverImage?.alt || serviceData.title,
          pricing_structure: serviceData.pricingStructure || null,
          typical_timeline: serviceData.typicalTimeline || null,
          features: serviceData.features || [],
          process: (serviceData.process || []) as unknown as Record<string, unknown>[],
          sort_order: parseInt(serviceData.number || '1', 10) || 1,
          publication_status: 'published',
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create service: ${error.message}`);
      }
      return mapRowToService(data);
    }

    const list = getStoredServices();
    const newService: Service = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    const updated = [...list, newService];
    setStoredServices(updated);
    return newService;
  },

  /**
   * Updates an existing service offering.
   */
  async update(id: string, updates: Partial<Service>): Promise<Service | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const payload: Record<string, unknown> = {};

      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.shortDescription !== undefined) payload.short_description = updates.shortDescription;
      if (updates.description !== undefined) payload.description = updates.description;
      if (updates.pricingStructure !== undefined) payload.pricing_structure = updates.pricingStructure;
      if (updates.typicalTimeline !== undefined) payload.typical_timeline = updates.typicalTimeline;
      if (updates.features !== undefined) payload.features = updates.features;
      if (updates.process !== undefined) payload.process = updates.process;
      if (updates.coverImage?.url !== undefined) {
        payload.cover_image_url = updates.coverImage.url;
        payload.cover_image_alt = updates.coverImage.alt || updates.title || '';
      }
      if (updates.number !== undefined) payload.sort_order = parseInt(updates.number, 10) || 1;

      const { data, error } = await supabase
        .from('services')
        .update(payload)
        .or(`id.eq.${id},slug.eq.${id}`)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update service: ${error.message}`);
      }
      return data ? mapRowToService(data) : null;
    }

    const list = getStoredServices();
    const index = list.findIndex((s) => s.id === id || s.slug === id);
    if (index === -1) return null;

    const updated: Service = {
      ...list[index],
      ...updates,
    };
    list[index] = updated;
    setStoredServices(list);
    return updated;
  },

  /**
   * Deletes a service offering.
   */
  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase
        .from('services')
        .delete()
        .or(`id.eq.${id},slug.eq.${id}`);

      if (error) {
        throw new Error(`Failed to delete service: ${error.message}`);
      }
      return true;
    }

    const list = getStoredServices();
    const filtered = list.filter((s) => s.id !== id && s.slug !== id);
    setStoredServices(filtered);
    return true;
  },
};
