'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { Artwork } from '@/types/artwork';
import { ArtworkStatusBadge } from './ArtworkStatusBadge';
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

  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
    panoramic: 'aspect-[21/9]',
  };

  const isEditorial = variant === 'editorial';
  const isCompact = variant === 'compact';

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(artwork.slug);
  };

  return (
    <article
      className={cn('group relative flex flex-col', className)}
      data-cursor="VIEW"
    >
      <Link
        href={`/artworks/${artwork.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
        aria-label={`View artwork: ${artwork.title} (${artwork.year})`}
      >
        {/* Artwork Image Container */}
        <div
          className={cn(
            'relative w-full overflow-hidden bg-canvas-muted/40 transition-all duration-700 ease-out border border-canvas-border/80 rounded-xl',
            aspectClasses[artwork.orientation] || 'aspect-[4/5]',
            'group-hover:border-charcoal/40 group-hover:shadow-gallery'
          )}
        >
          <Image
            src={artwork.coverImage.url}
            alt={artwork.coverImage.alt || `${artwork.title} by Darey`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />

          {/* Status Badge in Corner */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 pointer-events-none">
            <ArtworkStatusBadge status={artwork.status} />
          </div>

          {/* Save / Bookmark Button */}
          {showSave && (
            <button
              type="button"
              onClick={handleSaveClick}
              className={cn(
                'absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full transition-all duration-300',
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

          {/* Overlay "VIEW WORK" prompt on hover for desktop */}
          <div className="absolute inset-0 bg-charcoal/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
            <span className="hidden sm:inline-block px-3.5 py-1.5 bg-canvas/95 text-charcoal font-sans text-xs tracking-gallery uppercase shadow-md border border-canvas-border/80 font-medium rounded-lg">
              View Work
            </span>
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
        <div className="mt-4 flex flex-col justify-between gap-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3
              className={cn(
                'font-display text-charcoal font-normal transition-colors duration-300 group-hover:text-charcoal-muted',
                isEditorial ? 'text-2xl sm:text-3xl' : isCompact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
              )}
            >
              {artwork.title}
            </h3>
            <span className="font-sans text-xs text-charcoal-subtle tracking-gallery px-2 py-0.5 rounded-md bg-canvas-muted/60 border border-canvas-border/60 shrink-0 font-medium">
              {artwork.year}
            </span>
          </div>

          {/* Medium and dimensions */}
          <p className="font-sans text-xs text-charcoal-muted line-clamp-1 font-light tracking-wide">
            {artwork.medium}
          </p>

          <div className="mt-1 flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="tracking-gallery font-mono text-[0.6875rem]">
              {formatDimensions(artwork.width, artwork.height, artwork.depth)}
            </span>

            {/* Restrained price or provenance */}
            {artwork.status === 'sold' ? (
              <span className="text-[0.6875rem] tracking-gallery uppercase text-charcoal-subtle italic">
                {artwork.provenance || 'Private Collection'}
              </span>
            ) : artwork.status === 'commissioned' ? (
              <span className="text-[0.6875rem] tracking-gallery uppercase text-charcoal-subtle italic">
                Private Commission
              </span>
            ) : artwork.price && showPrice ? (
              <span className="font-sans text-xs font-medium text-charcoal tracking-wide">
                {formatPrice(artwork.price, artwork.currency)}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
