import {
  ServiceQuoteRequestData,
  ServiceQuoteSubmissionResult,
} from '@/types/serviceRequest';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_SERVICE_REQUESTS, ServiceRequestRecord } from '@/data/mockStudioData';

function getStoredServiceRequests(): ServiceRequestRecord[] {
  return safeLocalStorage.getItem<ServiceRequestRecord[]>(
    STORAGE_KEYS.STUDIO_SERVICE_REQUESTS,
    INITIAL_SERVICE_REQUESTS
  );
}

function setStoredServiceRequests(requests: ServiceRequestRecord[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_SERVICE_REQUESTS, requests);
}

export const serviceRequestService = {
  /**
   * Retrieves all service requests
   */
  async getAll(): Promise<ServiceRequestRecord[]> {
    return Promise.resolve(getStoredServiceRequests());
  },

  /**
   * Retrieves single service request by ID
   */
  async getById(id: string): Promise<ServiceRequestRecord | null> {
    const list = getStoredServiceRequests();
    const item = list.find((r) => r.id === id);
    return Promise.resolve(item || null);
  },

  /**
   * Updates service request status
   */
  async updateStatus(
    id: string,
    status: ServiceRequestRecord['status']
  ): Promise<ServiceRequestRecord | null> {
    const list = getStoredServiceRequests();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: ServiceRequestRecord = {
      ...list[index],
      status,
    };
    list[index] = updated;
    setStoredServiceRequests(list);
    return Promise.resolve(updated);
  },

  /**
   * Adds an internal note to a service request
   */
  async addInternalNote(id: string, noteText: string): Promise<ServiceRequestRecord | null> {
    const list = getStoredServiceRequests();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: ServiceRequestRecord = {
      ...list[index],
      internalNotes: [...list[index].internalNotes, noteText],
    };
    list[index] = updated;
    setStoredServiceRequests(list);
    return Promise.resolve(updated);
  },

  /**
   * Submits a quote / consultation request for architectural or studio services
   */
  async submitQuoteRequest(
    data: ServiceQuoteRequestData
  ): Promise<ServiceQuoteSubmissionResult> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `SRV-DEV-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    const newRecord: ServiceRequestRecord = {
      id: referenceId,
      clientName: data.fullName,
      clientEmail: data.email,
      clientPhone: data.phone,
      organization: data.organization || (data.projectScope === 'commercial' ? 'Commercial Client' : undefined),
      serviceType: 'architectural_mural',
      serviceTitle: `${data.serviceTitle} Proposal`,
      location: `${data.locationCity || ''}, ${data.locationCountry || ''}`.trim() || 'Undisclosed Location',
      spaceType: data.projectScope === 'commercial' ? 'Luxury Hospitality' : 'Private Residence',
      wallDimensions: data.spaceDimensions,
      estimatedBudget: data.estimatedBudgetRange || 'To be specified',
      targetTimeline: data.targetCompletionDate || 'Flexible',
      status: 'new',
      submittedDate: timestamp,
      description: data.projectDescription,
      referenceImagesCount: data.referenceImages?.length || 0,
      internalNotes: [],
    };

    const current = getStoredServiceRequests();
    setStoredServiceRequests([newRecord, ...current]);

    return {
      success: true,
      referenceId,
      timestamp,
      estimatedContactWindow: '1â€“2 business days',
    };
  },
};
