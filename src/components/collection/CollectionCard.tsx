'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Collection } from '@/types/collection';
import { cn } from '@/lib/utils';

interface CollectionCardProps {
  collection: Collection;
  priority?: boolean;
  className?: string;
  variant?: 'featured' | 'standard';
}

export function CollectionCard({
  collection,
  priority = false,
  className,
  variant = 'standard',
}: CollectionCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <article
      className={cn('group relative overflow-hidden bg-canvas border border-canvas-border/80 rounded-2xl transition-all duration-700 hover:border-charcoal/40 hover:shadow-gallery', className)}
      data-cursor="EXPLORE"
    >
      <Link
        href={`/collections/${collection.slug}`}
        className="block p-6 sm:p-8 lg:p-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
        aria-label={`Explore collection: ${collection.title}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Collection Metadata & Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full order-2 lg:order-1">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery">
                  {collection.subtitle || 'COLLECTION'}
                </span>
                {collection.year && (
                  <>
                    <span className="text-canvas-border text-xs">•</span>
                    <span className="font-sans text-xs text-charcoal-subtle tracking-gallery">
                      {collection.year}
                    </span>
                  </>
                )}
                <span className="text-canvas-border text-xs">•</span>
                <span className="font-sans text-xs text-charcoal-subtle tracking-gallery">
                  {collection.artworkCount} Works
                </span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal transition-colors group-hover:text-charcoal-muted leading-tight mb-4">
                {collection.title}
              </h3>

              <p className="font-serif italic text-lg sm:text-xl text-charcoal-muted font-light leading-relaxed mb-6">
                &ldquo;{collection.statement}&rdquo;
              </p>

              <p className="font-sans text-sm text-charcoal-muted font-light leading-relaxed line-clamp-3 mb-8">
                {collection.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-charcoal font-sans text-xs uppercase tracking-gallery font-medium group-hover:translate-x-1 transition-transform duration-300">
              <span>Enter Collection</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          {/* Collection Hero Image Presentation */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-canvas-muted/40 border border-canvas-border/80 rounded-xl">
              <Image
                src={collection.coverImage.url}
                alt={collection.coverImage.alt || `${collection.title} collection by Darey`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={priority}
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Dynamic accent color bar */}
              {collection.accentColor && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity rounded-b-xl"
                  style={{ backgroundColor: collection.accentColor }}
                />
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
