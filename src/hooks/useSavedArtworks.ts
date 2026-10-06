'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'artrealm_saved_artworks';
const EVENT_NAME = 'artrealm-saved-change';

export function useSavedArtworks() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Sync state from localStorage
  const syncFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedSlugs(parsed);
          return;
        }
      }
      setSavedSlugs([]);
    } catch {
      setSavedSlugs([]);
    }
  }, []);

  // Initial mount load
  useEffect(() => {
    setIsMounted(true);
    syncFromStorage();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        syncFromStorage();
      }
    };

    const handleCustomChange = () => {
      syncFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(EVENT_NAME, handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(EVENT_NAME, handleCustomChange);
    };
  }, [syncFromStorage]);

  // Save an artwork slug
  const saveArtwork = useCallback((slug: string) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(slug)) {
        const updated = [...list, slug];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setSavedSlugs(updated);
        window.dispatchEvent(new Event(EVENT_NAME));
      }
    } catch (err) {
      console.error('Error saving artwork to local storage', err);
    }
  }, []);

  // Unsave an artwork slug
  const unsaveArtwork = useCallback((slug: string) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const updated = list.filter((s) => s !== slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedSlugs(updated);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (err) {
      console.error('Error removing artwork from local storage', err);
    }
  }, []);

  // Toggle save
  const toggleSave = useCallback((slug: string) => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (list.includes(slug)) {
        unsaveArtwork(slug);
      } else {
        saveArtwork(slug);
      }
    } catch (err) {
      console.error('Error toggling artwork in local storage', err);
    }
  }, [saveArtwork, unsaveArtwork]);

  // Check if saved
  const isSaved = useCallback((slug: string) => {
    return savedSlugs.includes(slug);
  }, [savedSlugs]);

  // Clear all saved
  const clearSaved = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSavedSlugs([]);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (err) {
      console.error('Error clearing saved artworks', err);
    }
  }, []);

  return {
    savedSlugs: isMounted ? savedSlugs : [],
    savedCount: isMounted ? savedSlugs.length : 0,
    isSaved: isMounted ? isSaved : () => false,
    saveArtwork,
    unsaveArtwork,
    toggleSave,
    clearSaved,
    isMounted,
  };
}
