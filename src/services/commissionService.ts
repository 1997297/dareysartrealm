import { CommissionFormData, CommissionSubmissionResult } from '@/types/commission';
import {
  CollectorCommission,
  CommissionTrackingStage,
  CommissionProgressImage,
} from '@/types/collector';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_MOCK_COMMISSIONS } from '@/data/mockCollectorData';

function getStoredCommissions(): CollectorCommission[] {
  return safeLocalStorage.getItem<CollectorCommission[]>(
    STORAGE_KEYS.COMMISSIONS,
    INITIAL_MOCK_COMMISSIONS
  );
}

function setStoredCommissions(commissions: CollectorCommission[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.COMMISSIONS, commissions);
}

export const commissionService = {
  /**
   * Retrieves all commissions
   */
  async getAll(): Promise<CollectorCommission[]> {
    return Promise.resolve(getStoredCommissions());
  },

  /**
   * Retrieves a commission by ID
   */
  async getById(id: string): Promise<CollectorCommission | null> {
    const list = getStoredCommissions();
    const item = list.find((c) => c.id === id);
    return Promise.resolve(item || null);
  },

  /**
   * Submits a public commission request with simulated studio intake latency
   */
  async submitCommission(
    formData: CommissionFormData
  ): Promise<CommissionSubmissionResult> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `COM-DEV-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const newCommission: CollectorCommission = {
      id: referenceId,
      title: `Bespoke Commission: ${formData.artworkType || 'Original Canvas'}`,
      artworkType: formData.artworkType || 'Mixed Media',
      currentStage: 'CONSULTATION',
      stageIndex: 1,
      createdAt: timestamp,
      estimatedCompletion: formData.targetDate || formData.targetTimeline || '8–10 weeks',
      brief: formData.narrative || 'Custom bespoke artistic collaboration.',
      dimensions: formData.preferredSize || 'Custom scale',
      budget: formData.budgetRange || 'To be quoted',
      timeline: formData.targetDate || formData.targetTimeline || 'Flexible',
      paymentSummary: {
        quotedAmount: 0,
        depositPaid: false,
        balanceRemaining: 0,
        currency: 'USD',
      },
      nextStep: 'Studio review and preliminary proportion sketches in preparation.',
      progressImages: [],
    };

    const current = getStoredCommissions();
    setStoredCommissions([newCommission, ...current]);

    return {
      success: true,
      referenceId,
      timestamp,
      estimatedContactWindow: '24–48 hours',
    };
  },

  /**
   * Updates commission pipeline stage (Kanban moves)
   */
  async updateStage(
    id: string,
    currentStage: CommissionTrackingStage,
    stageIndex: number,
    nextStep?: string
  ): Promise<CollectorCommission | null> {
    const list = getStoredCommissions();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: CollectorCommission = {
      ...list[index],
      currentStage,
      stageIndex,
      nextStep: nextStep || list[index].nextStep,
    };
    list[index] = updated;
    setStoredCommissions(list);
    return Promise.resolve(updated);
  },

  /**
   * Updates quote and payment details
   */
  async updateQuote(
    id: string,
    quotedAmount: number,
    depositPaid: boolean,
    balanceRemaining: number,
    currency: string = 'USD'
  ): Promise<CollectorCommission | null> {
    const list = getStoredCommissions();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: CollectorCommission = {
      ...list[index],
      paymentSummary: {
        quotedAmount,
        depositPaid,
        balanceRemaining,
        currency,
      },
    };
    list[index] = updated;
    setStoredCommissions(list);
    return Promise.resolve(updated);
  },

  /**
   * Adds a work-in-progress progress photo record
   */
  async addProgressImage(
    id: string,
    image: Omit<CommissionProgressImage, 'id'>
  ): Promise<CollectorCommission | null> {
    const list = getStoredCommissions();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const newImage: CommissionProgressImage = {
      ...image,
      id: `wip-${Date.now()}`,
    };

    const updated: CollectorCommission = {
      ...list[index],
      progressImages: [...list[index].progressImages, newImage],
    };
    list[index] = updated;
    setStoredCommissions(list);
    return Promise.resolve(updated);
  },
};
