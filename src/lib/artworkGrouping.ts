import { Artwork, ArtworkOrientation } from '@/types/artwork';

export interface OrientationGroup {
  orientation: ArtworkOrientation;
  label: string;
  artworks: Artwork[];
}

/**
 * Normalizes and categorizes artworks by their visual orientation
 * (portrait, landscape, square/panoramic).
 */
export function getArtworkOrientationCategory(artwork: Artwork): 'portrait' | 'landscape' | 'square' {
  if (artwork.orientation === 'portrait') return 'portrait';
  if (artwork.orientation === 'landscape' || artwork.orientation === 'panoramic') return 'landscape';
  if (artwork.orientation === 'square') return 'square';

  // Fallback to dimensions check if orientation flag isn't set
  if (artwork.width && artwork.height) {
    const ratio = artwork.width / artwork.height;
    if (ratio < 0.9) return 'portrait';
    if (ratio > 1.1) return 'landscape';
    return 'square';
  }

  return 'portrait';
}

/**
 * Groups a sequence of artworks into contiguous or orientation-compatible groups.
 * By grouping compatible orientations together, tall portraits sit with tall portraits (3 columns),
 * wide landscapes sit with wide landscapes (2 columns), and squares sit with squares (3-4 columns).
 * This eliminates empty gaps, irregular step-stair cliffs, and awkward mixed heights.
 */
export function groupArtworksByOrientation(artworks: Artwork[]): OrientationGroup[] {
  if (!artworks || artworks.length === 0) return [];

  const portraitArtworks: Artwork[] = [];
  const squareArtworks: Artwork[] = [];
  const landscapeArtworks: Artwork[] = [];

  for (const art of artworks) {
    const cat = getArtworkOrientationCategory(art);
    if (cat === 'portrait') portraitArtworks.push(art);
    else if (cat === 'square') squareArtworks.push(art);
    else landscapeArtworks.push(art);
  }

  const groups: OrientationGroup[] = [];

  if (portraitArtworks.length > 0) {
    groups.push({
      orientation: 'portrait',
      label: 'Vertical & Portrait Studies',
      artworks: portraitArtworks,
    });
  }

  if (squareArtworks.length > 0) {
    groups.push({
      orientation: 'square',
      label: 'Square Canvases & Balanced Panels',
      artworks: squareArtworks,
    });
  }

  if (landscapeArtworks.length > 0) {
    groups.push({
      orientation: 'landscape',
      label: 'Horizontal & Monumental Panoramas',
      artworks: landscapeArtworks,
    });
  }

  return groups;
}

