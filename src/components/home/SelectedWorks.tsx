'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Artwork } from '@/types/artwork';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ArtworkStatusBadge } from '@/components/artwork/ArtworkStatusBadge';
import { fadeUp } from '@/lib/motion';
import { cn, getScrollingArtworkHref, getArtworkTitle } from '@/lib/utils';

interface SelectedWorksProps {
  artworks: Artwork[];
}

export function SelectedWorks({ artworks }: SelectedWorksProps) {
  const railRef = useRef<HTMLDivElement>(null);

  if (!artworks || artworks.length === 0) {
    return (
      <Section id="selected-works" spacing="lg">
        <Container size="wide">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-4xl sm:text-5xl text-charcoal font-normal leading-tight">
              Selected Works
            </h2>
            <Button
              href="/artworks"
              variant="outline"
              size="sm"
              className="rounded-full px-5 py-2.5 text-xs font-medium tracking-gallery hover:bg-charcoal hover:text-canvas hover:border-charcoal shadow-xs transition-all"
            >
              View Artworks &rarr;
            </Button>
          </div>
          <div className="py-20 text-center border border-dashed border-canvas-border p-12 rounded-2xl">
            <p className="font-display text-2xl text-charcoal mb-2">
              The walls are being curated.
            </p>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto mb-6">
              New artworks are being prepared in the studio. Inquire directly for private viewings.
            </p>
            <Button href="/contact" variant="outline">
              Contact Studio
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section id="selected-works" spacing="lg" className="bg-canvas overflow-hidden">
      <Container size="wide">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-10 flex items-end justify-between"
        >
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal font-normal leading-tight">
            Selected Works
          </h2>
          <Button
            href="/artworks"
            variant="outline"
            size="sm"
            className="rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-xs font-medium tracking-gallery hover:bg-charcoal hover:text-canvas hover:border-charcoal shadow-xs transition-all shrink-0"
          >
            View Artworks &rarr;
          </Button>
        </motion.div>
      </Container>

      {/* Infinite continuous horizontal marquee rail — scrolls non-stop to the left, pauses on hover */}
      <div
        className="w-full overflow-hidden select-none py-2"
        role="region"
        aria-label="Selected artworks continuous marquee"
      >
        <div className="animate-marquee-infinite gap-6 sm:gap-8 px-4">
          {/* First loop track */}
          {artworks.map((artwork) => {
            const href = getScrollingArtworkHref(artwork);
            const displayTitle = getArtworkTitle(artwork.title);
            const hasCollection = Boolean(artwork.collection?.slug);
            const secondaryInfo = artwork.medium
              ? (artwork.year ? `${artwork.year} · ${artwork.medium.split(',')[0].trim()}` : artwork.medium.split(',')[0].trim())
              : artwork.year
              ? `${artwork.year}`
              : null;

            return (
              <div
                key={`track1-${artwork.id}`}
                className="shrink-0 w-[240px] sm:w-[270px] md:w-[300px]"
              >
                <Link
                  href={href}
                  className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal rounded-xl"
                  data-cursor="VIEW"
                  aria-label={`View ${displayTitle} in ${artwork.collection?.title || 'artworks'}`}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-canvas-muted border border-canvas-border shadow-subtle group-hover:shadow-gallery transition-shadow duration-500">
                    <Image
                      src={artwork.coverImage.url}
                      alt={artwork.coverImage.alt || displayTitle}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                    />
                    {/* Restrained desktop hover cue */}
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="gallery-plaque text-[0.625rem] tracking-[0.2em] text-canvas bg-charcoal/85 px-3 py-1.5 rounded-full backdrop-blur-xs uppercase font-medium shadow-xs">
                        {hasCollection ? 'View Collection' : 'Browse Artworks'}
                      </span>
                    </div>
                  </div>

                  {/* Always-visible title & confirmed secondary info beneath image */}
                  <div className="mt-3 px-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm sm:text-base text-charcoal font-normal leading-tight truncate group-hover:text-charcoal-muted transition-colors">
                        {displayTitle}
                      </p>
                      <ArtworkStatusBadge
                        status={artwork.status}
                        className="text-[0.5rem] px-1.5 py-0.5 shrink-0 mt-0.5"
                      />
                    </div>
                    {secondaryInfo ? (
                      <p className="gallery-plaque text-[0.625rem] text-charcoal-subtle mt-1 truncate">
                        {secondaryInfo}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Duplicate track for seamless infinite marquee loop */}
          {artworks.map((artwork) => {
            const href = getScrollingArtworkHref(artwork);
            const displayTitle = getArtworkTitle(artwork.title);
            const hasCollection = Boolean(artwork.collection?.slug);
            const secondaryInfo = artwork.medium
              ? (artwork.year ? `${artwork.year} · ${artwork.medium.split(',')[0].trim()}` : artwork.medium.split(',')[0].trim())
              : artwork.year
              ? `${artwork.year}`
              : null;

            return (
              <div
                key={`track2-${artwork.id}`}
                className="shrink-0 w-[240px] sm:w-[270px] md:w-[300px]"
                aria-hidden="true"
              >
                <Link
                  href={href}
                  tabIndex={-1}
                  className="group block focus:outline-none rounded-xl"
                  data-cursor="VIEW"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-canvas-muted border border-canvas-border shadow-subtle group-hover:shadow-gallery transition-shadow duration-500">
                    <Image
                      src={artwork.coverImage.url}
                      alt={artwork.coverImage.alt || displayTitle}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                    />
                    {/* Restrained desktop hover cue */}
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="gallery-plaque text-[0.625rem] tracking-[0.2em] text-canvas bg-charcoal/85 px-3 py-1.5 rounded-full backdrop-blur-xs uppercase font-medium shadow-xs">
                        {hasCollection ? 'View Collection' : 'Browse Artworks'}
                      </span>
                    </div>
                  </div>

                  {/* Always-visible title & confirmed secondary info beneath image */}
                  <div className="mt-3 px-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-display text-sm sm:text-base text-charcoal font-normal leading-tight truncate group-hover:text-charcoal-muted transition-colors">
                        {displayTitle}
                      </p>
                      <ArtworkStatusBadge
                        status={artwork.status}
                        className="text-[0.5rem] px-1.5 py-0.5 shrink-0 mt-0.5"
                      />
                    </div>
                    {secondaryInfo ? (
                      <p className="gallery-plaque text-[0.625rem] text-charcoal-subtle mt-1 truncate">
                        {secondaryInfo}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
