import { EnquiryThread, EnquiryMessage, EnquiryStatus, InternalNote } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_ENQUIRY_THREADS } from '@/data/mockStudioData';

function getStoredEnquiries(): EnquiryThread[] {
  return safeLocalStorage.getItem<EnquiryThread[]>(
    STORAGE_KEYS.STUDIO_ENQUIRIES,
    INITIAL_ENQUIRY_THREADS
  );
}

function setStoredEnquiries(threads: EnquiryThread[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_ENQUIRIES, threads);
}

export const enquiryService = {
  /**
   * Retrieves all enquiry threads
   */
  async getAll(): Promise<EnquiryThread[]> {
    return Promise.resolve(getStoredEnquiries());
  },

  /**
   * Retrieves an enquiry thread by ID
   */
  async getById(id: string): Promise<EnquiryThread | null> {
    const list = getStoredEnquiries();
    const item = list.find((t) => t.id === id);
    return Promise.resolve(item || null);
  },

  /**
   * Sends a reply to an enquiry thread from Darey
   */
  async reply(threadId: string, replyText: string): Promise<EnquiryThread | null> {
    const list = getStoredEnquiries();
    const index = list.findIndex((t) => t.id === threadId);
    if (index === -1) return Promise.resolve(null);

    const now = new Date().toISOString();
    const newMessage: EnquiryMessage = {
      id: `msg-${Date.now()}`,
      sender: 'darey',
      senderName: 'Darey',
      senderEmail: 'studio@dareysartrealm.com',
      message: replyText,
      timestamp: now,
    };

    const updatedThread: EnquiryThread = {
      ...list[index],
      status: 'responded',
      unread: false,
      lastMessage: replyText,
      lastMessageTime: 'Just now',
      messages: [...list[index].messages, newMessage],
    };

    list[index] = updatedThread;
    setStoredEnquiries(list);
    return Promise.resolve(updatedThread);
  },

  /**
   * Updates enquiry status
   */
  async updateStatus(threadId: string, status: EnquiryStatus): Promise<EnquiryThread | null> {
    const list = getStoredEnquiries();
    const index = list.findIndex((t) => t.id === threadId);
    if (index === -1) return Promise.resolve(null);

    const updatedThread: EnquiryThread = {
      ...list[index],
      status,
      unread: status === 'unread' ? true : list[index].unread,
    };

    list[index] = updatedThread;
    setStoredEnquiries(list);
    return Promise.resolve(updatedThread);
  },

  /**
   * Adds an internal note to an enquiry thread
   */
  async addInternalNote(threadId: string, text: string): Promise<EnquiryThread | null> {
    const list = getStoredEnquiries();
    const index = list.findIndex((t) => t.id === threadId);
    if (index === -1) return Promise.resolve(null);

    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      text,
      author: 'Darey',
      createdAt: new Date().toISOString(),
    };

    const updatedThread: EnquiryThread = {
      ...list[index],
      internalNotes: [...(list[index].internalNotes || []), newNote],
    };

    list[index] = updatedThread;
    setStoredEnquiries(list);
    return Promise.resolve(updatedThread);
  },

  /**
   * Marks a thread as read or unread
   */
  async toggleRead(threadId: string, read: boolean): Promise<EnquiryThread | null> {
    const list = getStoredEnquiries();
    const index = list.findIndex((t) => t.id === threadId);
    if (index === -1) return Promise.resolve(null);

    const updatedThread: EnquiryThread = {
      ...list[index],
      unread: !read,
    };

    list[index] = updatedThread;
    setStoredEnquiries(list);
    return Promise.resolve(updatedThread);
  },
};
