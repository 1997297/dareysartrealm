import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

export function formatDimensions(
  width: number,
  height: number,
  depth?: number,
  unit: string = 'cm'
): string {
  if (depth && depth > 0) {
    return `${width} × ${height} × ${depth} ${unit}`;
  }
  return `${width} × ${height} ${unit}`;
}

export function formatDimensionsWithInches(
  widthCm: number,
  heightCm: number,
  depthCm?: number
): { cm: string; inches: string } {
  const toInches = (cm: number) => (cm * 0.393701).toFixed(1);

  const cmStr = depthCm && depthCm > 0
    ? `${widthCm} × ${heightCm} × ${depthCm} cm`
    : `${widthCm} × ${heightCm} cm`;

  const inStr = depthCm && depthCm > 0
    ? `${toInches(widthCm)} × ${toInches(heightCm)} × ${toInches(depthCm)} in`
    : `${toInches(widthCm)} × ${toInches(heightCm)} in`;

  return { cm: cmStr, inches: inStr };
}

/**
 * Smart destination hierarchy for artwork links:
 * Priority 1: /artworks/[slug] if valid slug exists
 * Priority 2: /collections/[slug] if part of valid collection
 * Priority 3: /artworks safe fallback
 */
export function getArtworkHref(
  artwork?: { slug?: string; collection?: { slug?: string } | null } | null
): string {
  if (artwork?.slug && artwork.slug.trim() !== '') {
    return `/artworks/${encodeURIComponent(artwork.slug)}`;
  }
  if (artwork?.collection?.slug && artwork.collection.slug.trim() !== '') {
    return `/collections/${encodeURIComponent(artwork.collection.slug)}`;
  }
  return '/artworks';
}

/**
 * Resolves artwork title with neutral fallback for unconfirmed studio works
 */
export function getArtworkTitle(title?: string | null): string {
  if (title && title.trim() !== '') {
    return title.trim();
  }
  return 'Untitled';
}

/**
 * Resolves destination link for scrolling artworks:
 * Priority 1: /collections/[slug] if the artwork belongs to a collection
 * Priority 2: /artworks safe fallback
 */
export function getScrollingArtworkHref(
  artwork?: { collection?: { slug?: string } | null; slug?: string } | null
): string {
  if (artwork?.collection?.slug && artwork.collection.slug.trim() !== '') {
    return `/collections/${encodeURIComponent(artwork.collection.slug)}`;
  }
  return '/artworks';
}
