import { CollectorReview, ReviewStatus } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_REVIEWS } from '@/data/mockStudioData';

function getStoredReviews(): CollectorReview[] {
  return safeLocalStorage.getItem<CollectorReview[]>(
    STORAGE_KEYS.STUDIO_REVIEWS,
    INITIAL_REVIEWS
  );
}

function setStoredReviews(reviews: CollectorReview[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_REVIEWS, reviews);
}

export const reviewService = {
  /**
   * Retrieves all collector reviews
   */
  async getAll(): Promise<CollectorReview[]> {
    return Promise.resolve(getStoredReviews());
  },

  /**
   * Retrieves public approved featured reviews
   */
  async getFeatured(): Promise<CollectorReview[]> {
    const list = getStoredReviews();
    return Promise.resolve(list.filter((r) => r.status === 'approved' && r.featured));
  },

  /**
   * Updates status of review (approved, hidden, pending)
   */
  async updateStatus(id: string, status: ReviewStatus): Promise<CollectorReview | null> {
    const list = getStoredReviews();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: CollectorReview = {
      ...list[index],
      status,
    };
    list[index] = updated;
    setStoredReviews(list);
    return Promise.resolve(updated);
  },

  /**
   * Toggles featured spotlight status
   */
  async toggleFeatured(id: string): Promise<CollectorReview | null> {
    const list = getStoredReviews();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: CollectorReview = {
      ...list[index],
      featured: !list[index].featured,
    };
    list[index] = updated;
    setStoredReviews(list);
    return Promise.resolve(updated);
  },

  /**
   * Deletes a review
   */
  async delete(id: string): Promise<boolean> {
    const list = getStoredReviews();
    const filtered = list.filter((r) => r.id !== id);
    setStoredReviews(filtered);
    return Promise.resolve(true);
  },
};
