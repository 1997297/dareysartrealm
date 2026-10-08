'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Eye, Layers } from 'lucide-react';
import { Artwork } from '@/types/artwork';
import { ArtworkStatusBadge } from './ArtworkStatusBadge';
import { ArtworkViewer } from './ArtworkViewer';
import { useSavedArtworks } from '@/hooks/useSavedArtworks';
import { cn, formatDimensions, formatPrice } from '@/lib/utils';

interface ArtworkCardProps {
  artwork: Artwork;
  variant?: 'standard' | 'editorial' | 'compact' | 'grid';
  priority?: boolean;
  className?: string;
  showPrice?: boolean;
  showSave?: boolean;
}

export function ArtworkCard({
  artwork,
  variant = 'standard',
  priority = false,
  className,
  showPrice = true,
  showSave = true,
}: ArtworkCardProps) {
  const { isSaved, toggleSave, isMounted } = useSavedArtworks();
  const saved = isMounted && isSaved(artwork.slug);

  const [viewerOpen, setViewerOpen] = useState(false);
  const galleryImages = artwork.images && artwork.images.length > 0 ? artwork.images : [artwork.coverImage];

  const aspectClasses: Record<string, string> = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
    panoramic: 'aspect-[16/9]',
  };

  const isEditorial = variant === 'editorial';
  const isCompact = variant === 'compact';

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(artwork.slug);
  };

  const hasConfirmedDimensions = Boolean(artwork.width && artwork.height && artwork.width > 0 && artwork.height > 0);
  const hasConfirmedMedium = Boolean(artwork.medium && artwork.medium.trim() !== '');

  return (
    <>
      <article
        className={cn('group relative flex flex-col w-full', className)}
        data-cursor="VIEW"
      >
        <Link
          href={`/artworks/${artwork.slug}`}
          className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
          aria-label={`View artwork: ${artwork.title}${artwork.year ? ` (${artwork.year})` : ''}`}
        >
          {/* Artwork Image Container with Natural Proportions & Sensible Max Height */}
          <div
            className={cn(
              'relative w-full overflow-hidden bg-canvas-muted/40 transition-all duration-500 ease-out border border-canvas-border/80 rounded-xl',
              aspectClasses[artwork.orientation] || 'aspect-[4/5]',
              'max-h-[320px] sm:max-h-[380px] lg:max-h-[420px]',
              'group-hover:border-charcoal/40 group-hover:shadow-gallery'
            )}
          >
            <Image
              src={artwork.coverImage?.url || '/artworks/pic1.jpeg'}
              alt={artwork.coverImage?.alt || `${artwork.title} by Darey`}
              fill
              sizes="(max-width: 360px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />

            {/* Badges in Top-Left Corner: Status, Curatorial Designation, and Views Count */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1.5 pointer-events-none items-start">
              <ArtworkStatusBadge status={artwork.status} />

              {/* Multi-Perspective Views Badge */}
              {galleryImages.length > 1 && (
                <span className="px-2 py-0.5 bg-charcoal/85 text-canvas text-[0.625rem] tracking-gallery uppercase font-mono rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>{galleryImages.length} Views</span>
                </span>
              )}

              {/* CMS-Ready: Piece of the Month */}
              {artwork.isPieceOfTheMonth && (
                <span className="px-2 py-0.5 bg-charcoal text-canvas text-[0.625rem] tracking-gallery uppercase font-medium rounded-md shadow-xs backdrop-blur-xs">
                  Piece of the Month
                </span>
              )}

              {/* CMS-Ready: Curatorial Badge / Featured */}
              {!artwork.isPieceOfTheMonth && artwork.curatorialBadge && (
                <span className="px-2 py-0.5 bg-canvas/90 text-charcoal border border-canvas-border text-[0.625rem] tracking-gallery uppercase font-medium rounded-md shadow-2xs backdrop-blur-xs">
                  {artwork.curatorialBadge}
                </span>
              )}
            </div>

            {/* Save / Bookmark Button */}
            {showSave && (
              <button
                type="button"
                onClick={handleSaveClick}
                className={cn(
                  'absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 p-2 rounded-full transition-all duration-300',
                  'bg-canvas/80 backdrop-blur-md border border-canvas-border/80',
                  'hover:bg-canvas hover:border-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal',
                  saved
                    ? 'text-charcoal bg-canvas border-charcoal opacity-100 shadow-sm'
                    : 'text-charcoal-muted opacity-80 sm:opacity-0 group-hover:opacity-100'
                )}
                aria-label={saved ? `Remove ${artwork.title} from saved works` : `Save ${artwork.title}`}
                title={saved ? 'Remove from saved collection' : 'Save to your collection'}
              >
                <Bookmark
                  className={cn(
                    'h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300',
                    saved && 'fill-charcoal scale-110'
                  )}
                />
              </button>
            )}

            {/* Overlay "VIEW WORK" & "QUICK INSPECT" prompts on hover for desktop */}
            <div className="absolute inset-0 bg-charcoal/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-2 p-3 pointer-events-none">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-canvas/95 text-charcoal font-sans text-[0.6875rem] tracking-gallery uppercase shadow-md border border-canvas-border/80 font-medium rounded-md pointer-events-auto">
                View Work
              </span>
              {galleryImages.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setViewerOpen(true);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-charcoal text-canvas font-sans text-[0.6875rem] tracking-gallery uppercase shadow-md border border-charcoal font-medium rounded-md pointer-events-auto hover:bg-black transition-colors"
                  title={`Inspect all ${galleryImages.length} pictures in fullscreen viewer`}
                >
                  <Eye className="h-3 w-3" />
                  <span>{galleryImages.length} Pics</span>
                </button>
              )}
            </div>

            {/* Dynamic accent color subtle indicator */}
            {artwork.accentColor && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundColor: artwork.accentColor }}
              />
            )}
          </div>

        {/* Artwork Metadata Plaque */}
        <div className="mt-3 flex flex-col justify-between gap-1 w-full">
          <div className="flex items-baseline justify-between gap-2">
            <h3
              className={cn(
                'font-display text-charcoal font-normal transition-colors duration-300 group-hover:text-charcoal-muted line-clamp-1',
                isEditorial ? 'text-lg sm:text-xl' : isCompact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'
              )}
            >
              {artwork.title}
            </h3>
            {artwork.year ? (
              <span className="font-mono text-[0.6875rem] text-charcoal-subtle tracking-gallery shrink-0">
                {artwork.year}
              </span>
            ) : null}
          </div>

          {/* Confirmed Medium (omitted gracefully if unknown) */}
          {hasConfirmedMedium && (
            <p className="font-sans text-[0.6875rem] sm:text-xs text-charcoal-muted line-clamp-1 font-light tracking-wide">
              {artwork.medium}
            </p>
          )}

          {/* Dimensions & Price row */}
          <div className="mt-1 flex items-center justify-between text-xs text-charcoal-subtle pt-1 border-t border-canvas-border/40">
            {hasConfirmedDimensions ? (
              <span className="tracking-gallery font-mono text-[0.6875rem]">
                {formatDimensions(artwork.width, artwork.height, artwork.depth)}
              </span>
            ) : (
              <span className="text-[0.6875rem] text-charcoal-subtle tracking-gallery">
                Original Artwork
              </span>
            )}

            {/* Restrained price or provenance */}
            {artwork.status === 'collected' || artwork.status === 'sold' ? (
              <span className="text-[0.6875rem] tracking-gallery uppercase text-charcoal-subtle italic">
                {artwork.provenance || 'Private Collection'}
              </span>
            ) : artwork.status === 'commissioned' ? (
              <span className="text-[0.6875rem] tracking-gallery uppercase text-charcoal-subtle italic">
                Private Commission
              </span>
            ) : artwork.isPriceOnRequest || !artwork.price || artwork.price <= 0 ? (
              <span className="text-[0.6875rem] tracking-gallery uppercase text-charcoal-subtle font-medium">
                Price on Request
              </span>
            ) : showPrice ? (
              <span className="font-sans text-xs sm:text-sm font-medium text-charcoal tracking-wide">
                {formatPrice(artwork.price, artwork.currency)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>

    {viewerOpen && (
      <ArtworkViewer
        isOpen={viewerOpen}
        images={galleryImages}
        artworkTitle={artwork.title}
        onClose={() => setViewerOpen(false)}
      />
    )}
  </>
  );
}
