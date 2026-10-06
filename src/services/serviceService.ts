import { MOCK_SERVICES } from '@/data/mockServices';
import { Service } from '@/types/service';

export const serviceService = {
  /**
   * Retrieves all studio services
   */
  async getAll(): Promise<Service[]> {
    return Promise.resolve([...MOCK_SERVICES]);
  },

  /**
   * Retrieves a single service by slug
   */
  async getBySlug(slug: string): Promise<Service | null> {
    const service = MOCK_SERVICES.find((s) => s.slug === slug);
    return Promise.resolve(service || null);
  },

  /**
   * Retrieves featured services for preview
   */
  async getFeatured(): Promise<Service[]> {
    return Promise.resolve(MOCK_SERVICES.slice(0, 4));
  },
};
