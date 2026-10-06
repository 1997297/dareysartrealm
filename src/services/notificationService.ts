import { StudioNotification } from '@/types/studio';
import { safeLocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { INITIAL_STUDIO_NOTIFICATIONS } from '@/data/mockStudioData';

function getStoredNotifications(): StudioNotification[] {
  return safeLocalStorage.getItem<StudioNotification[]>(
    STORAGE_KEYS.STUDIO_NOTIFICATIONS,
    INITIAL_STUDIO_NOTIFICATIONS
  );
}

function setStoredNotifications(notifs: StudioNotification[]): void {
  safeLocalStorage.setItem(STORAGE_KEYS.STUDIO_NOTIFICATIONS, notifs);
}

export const notificationService = {
  /**
   * Retrieves all notifications
   */
  async getAll(): Promise<StudioNotification[]> {
    return Promise.resolve(getStoredNotifications());
  },

  /**
   * Retrieves unread count
   */
  async getUnreadCount(): Promise<number> {
    const list = getStoredNotifications();
    return Promise.resolve(list.filter((n) => !n.read).length);
  },

  /**
   * Marks a notification as read
   */
  async markRead(id: string): Promise<StudioNotification | null> {
    const list = getStoredNotifications();
    const index = list.findIndex((n) => n.id === id);
    if (index === -1) return Promise.resolve(null);

    const updated: StudioNotification = {
      ...list[index],
      read: true,
    };
    list[index] = updated;
    setStoredNotifications(list);
    return Promise.resolve(updated);
  },

  /**
   * Marks all notifications as read
   */
  async markAllRead(): Promise<boolean> {
    const list = getStoredNotifications();
    const updated = list.map((n) => ({ ...n, read: true }));
    setStoredNotifications(updated);
    return Promise.resolve(true);
  },

  /**
   * Deletes a notification
   */
  async delete(id: string): Promise<boolean> {
    const list = getStoredNotifications();
    const filtered = list.filter((n) => n.id !== id);
    setStoredNotifications(filtered);
    return Promise.resolve(true);
  },
};
