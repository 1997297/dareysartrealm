/**
 * SSR-safe Local and Session Storage Helpers
 */

export const STORAGE_KEYS = {
  CART: 'darey_cart',
  AUTH_USER: 'darey_auth_user',
  ORDERS: 'darey_orders',
  COMMISSIONS: 'darey_commissions',
  MESSAGES: 'darey_messages',
  LOCALLY_COLLECTED: 'darey_locally_collected_artworks',
  CHECKOUT_DRAFT: 'darey_checkout_draft',
  STUDIO_ARTWORKS: 'darey_studio_artworks',
  STUDIO_COLLECTIONS: 'darey_studio_collections',
  STUDIO_MEDIA: 'darey_studio_media',
  STUDIO_NOTIFICATIONS: 'darey_studio_notifications',
  STUDIO_ENQUIRIES: 'darey_studio_enquiries',
  STUDIO_SERVICE_REQUESTS: 'darey_studio_service_requests',
  STUDIO_COLLECTORS: 'darey_studio_collectors',
  STUDIO_REVIEWS: 'darey_studio_reviews',
  STUDIO_AUDIT: 'darey_studio_audit',
  STUDIO_SETTINGS: 'darey_studio_settings',
  STUDIO_CMS_HOMEPAGE: 'darey_cms_homepage',
  STUDIO_CMS_ABOUT: 'darey_cms_about',
  STUDIO_CMS_CONTACT: 'darey_cms_contact',
} as const;

export const safeLocalStorage = {
  getItem<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing localStorage key "${key}":`, e);
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  },
};

export const safeSessionStorage = {
  getItem<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : fallback;
    } catch (e) {
      console.warn(`Error reading sessionStorage key "${key}":`, e);
      return fallback;
    }
  },

  setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing sessionStorage key "${key}":`, e);
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing sessionStorage key "${key}":`, e);
    }
  },
};
