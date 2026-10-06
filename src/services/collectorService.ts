import { Order } from '@/types/commerce';
import {
  Certificate,
  CollectorCommission,
  CollectorMessageThread,
  CollectorOverviewData,
} from '@/types/collector';
import { CollectorCRMRecord, InternalNote } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import {
  INITIAL_MOCK_ORDERS,
  INITIAL_MOCK_CERTIFICATES,
  INITIAL_MOCK_COMMISSIONS,
  INITIAL_MOCK_MESSAGES,
} from '@/data/mockCollectorData';
import { INITIAL_COLLECTORS } from '@/data/mockStudioData';

function getStoredCRMCollectors(): CollectorCRMRecord[] {
  return safeLocalStorage.getItem<CollectorCRMRecord[]>(
    STORAGE_KEYS.STUDIO_COLLECTORS,
    INITIAL_COLLECTORS
  );
}

function setStoredCRMCollectors(collectors: CollectorCRMRecord[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_COLLECTORS, collectors);
}

export const collectorService = {
  /**
   * Retrieves summary overview data for the collector private salon dashboard
   */
  async getOverview(collectorEmail?: string): Promise<CollectorOverviewData> {
    const orders = safeLocalStorage.getItem<Order[]>(
      STORAGE_KEYS.ORDERS,
      INITIAL_MOCK_ORDERS
    );
    const certificates = safeLocalStorage.getItem<Certificate[]>(
      'darey_certificates',
      INITIAL_MOCK_CERTIFICATES
    );
    const commissions = safeLocalStorage.getItem<CollectorCommission[]>(
      STORAGE_KEYS.COMMISSIONS,
      INITIAL_MOCK_COMMISSIONS
    );
    const messages = safeLocalStorage.getItem<CollectorMessageThread[]>(
      STORAGE_KEYS.MESSAGES,
      INITIAL_MOCK_MESSAGES
    );
    const savedWorks = safeLocalStorage.getItem<string[]>('darey_saved_artworks', []);

    const unreadCount = messages.filter((m) => m.unread).length;

    return Promise.resolve({
      recentOrders: orders.slice(0, 3),
      activeCommissions: commissions.filter((c) => c.currentStage !== 'DELIVERED'),
      savedCount: savedWorks.length,
      certificates: certificates.slice(0, 4),
      unreadMessagesCount: unreadCount,
    });
  },

  /**
   * Retrieves orders
   */
  async getOrders(): Promise<Order[]> {
    const orders = safeLocalStorage.getItem<Order[]>(
      STORAGE_KEYS.ORDERS,
      INITIAL_MOCK_ORDERS
    );
    return Promise.resolve(orders);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const orders = safeLocalStorage.getItem<Order[]>(
      STORAGE_KEYS.ORDERS,
      INITIAL_MOCK_ORDERS
    );
    return Promise.resolve(orders.find((o) => o.id === id) || null);
  },

  /**
   * Retrieves commissions
   */
  async getCommissions(): Promise<CollectorCommission[]> {
    const commissions = safeLocalStorage.getItem<CollectorCommission[]>(
      STORAGE_KEYS.COMMISSIONS,
      INITIAL_MOCK_COMMISSIONS
    );
    return Promise.resolve(commissions);
  },

  async getCommissionById(id: string): Promise<CollectorCommission | null> {
    const commissions = safeLocalStorage.getItem<CollectorCommission[]>(
      STORAGE_KEYS.COMMISSIONS,
      INITIAL_MOCK_COMMISSIONS
    );
    return Promise.resolve(commissions.find((c) => c.id === id) || null);
  },

  /**
   * Retrieves certificates of authenticity
   */
  async getCertificates(): Promise<Certificate[]> {
    const certs = safeLocalStorage.getItem<Certificate[]>(
      'darey_certificates',
      INITIAL_MOCK_CERTIFICATES
    );
    return Promise.resolve(certs);
  },

  async getCertificateById(id: string): Promise<Certificate | null> {
    const certs = safeLocalStorage.getItem<Certificate[]>(
      'darey_certificates',
      INITIAL_MOCK_CERTIFICATES
    );
    return Promise.resolve(certs.find((c) => c.id === id) || null);
  },

  /**
   * Retrieves message conversations
   */
  async getMessages(): Promise<CollectorMessageThread[]> {
    const messages = safeLocalStorage.getItem<CollectorMessageThread[]>(
      STORAGE_KEYS.MESSAGES,
      INITIAL_MOCK_MESSAGES
    );
    return Promise.resolve(messages);
  },

  async getMessageThread(conversationId: string): Promise<CollectorMessageThread | null> {
    const threads = safeLocalStorage.getItem<CollectorMessageThread[]>(
      STORAGE_KEYS.MESSAGES,
      INITIAL_MOCK_MESSAGES
    );
    return Promise.resolve(
      threads.find((t) => t.conversationId === conversationId || t.id === conversationId) || null
    );
  },

  /**
   * Sends a collector reply in a conversation
   */
  async sendMessage(
    conversationId: string,
    text: string,
    senderName: string = 'Elena Rostova'
  ): Promise<CollectorMessageThread | null> {
    const threads = safeLocalStorage.getItem<CollectorMessageThread[]>(
      STORAGE_KEYS.MESSAGES,
      INITIAL_MOCK_MESSAGES
    );

    const threadIndex = threads.findIndex(
      (t) => t.conversationId === conversationId || t.id === conversationId
    );
    if (threadIndex === -1) return null;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'collector' as const,
      senderName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedThread = {
      ...threads[threadIndex],
      lastMessage: text.trim(),
      updatedAt: new Date().toISOString(),
      messages: [...threads[threadIndex].messages, newMsg],
    };

    threads[threadIndex] = updatedThread;
    safeLocalStorage.setItem(STORAGE_KEYS.MESSAGES, threads);

    return Promise.resolve(updatedThread);
  },

  // ----------------------------------------------------
  // STUDIO ADMIN / CRM METHODS
  // ----------------------------------------------------

  /**
   * Retrieves all collector CRM records
   */
  async getAllCRM(): Promise<CollectorCRMRecord[]> {
    return Promise.resolve(getStoredCRMCollectors());
  },

  /**
   * Retrieves a collector CRM record by ID
   */
  async getCRMById(id: string): Promise<CollectorCRMRecord | null> {
    const list = getStoredCRMCollectors();
    const item = list.find((c) => c.id === id);
    return Promise.resolve(item || null);
  },

  /**
   * Adds an internal note to a collector record
   */
  async addCRMNote(id: string, text: string): Promise<CollectorCRMRecord | null> {
    const list = getStoredCRMCollectors();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      text,
      author: 'Darey',
      createdAt: new Date().toISOString(),
    };

    const updated: CollectorCRMRecord = {
      ...list[index],
      internalNotes: [...(list[index].internalNotes || []), newNote],
      lastInteraction: 'Just now',
    };

    list[index] = updated;
    setStoredCRMCollectors(list);
    return Promise.resolve(updated);
  },

  /**
   * Updates tags for a collector
   */
  async updateCRMTags(id: string, tags: string[]): Promise<CollectorCRMRecord | null> {
    const list = getStoredCRMCollectors();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: CollectorCRMRecord = {
      ...list[index],
      tags,
    };
    list[index] = updated;
    setStoredCRMCollectors(list);
    return Promise.resolve(updated);
  },

  /**
   * Updates status for a collector
   */
  async updateCRMStatus(
    id: string,
    status: CollectorCRMRecord['status']
  ): Promise<CollectorCRMRecord | null> {
    const list = getStoredCRMCollectors();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: CollectorCRMRecord = {
      ...list[index],
      status,
    };
    list[index] = updated;
    setStoredCRMCollectors(list);
    return Promise.resolve(updated);
  },
};
