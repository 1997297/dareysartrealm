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
import { cn } from '@/lib/utils';

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
            <Button href="/artworks" variant="editorial" className="text-sm">
              View All &rarr;
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
          <Button href="/artworks" variant="editorial" className="text-sm shrink-0">
            View All &rarr;
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
          {artworks.map((artwork) => (
            <div
              key={`track1-${artwork.id}`}
              className="shrink-0 w-[240px] sm:w-[270px] md:w-[300px]"
            >
              <Link
                href={`/artworks/${artwork.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal rounded-xl"
                data-cursor="VIEW"
                aria-label={`View ${artwork.title}`}
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-canvas-muted border border-canvas-border shadow-subtle group-hover:shadow-gallery transition-shadow duration-500">
                  <Image
                    src={artwork.coverImage.url}
                    alt={artwork.coverImage.alt || artwork.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                  />
                </div>

                <div className="mt-3 px-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-base text-charcoal font-normal leading-tight truncate group-hover:text-charcoal-muted transition-colors">
                      {artwork.title}
                    </p>
                    <ArtworkStatusBadge
                      status={artwork.status}
                      className="text-[0.5rem] px-1.5 py-0.5 shrink-0 mt-0.5"
                    />
                  </div>
                  <p className="gallery-plaque text-[0.625rem] text-charcoal-subtle mt-1 truncate">
                    {artwork.year}
                    {artwork.medium && ` · ${artwork.medium.split(',')[0]}`}
                  </p>
                </div>
              </Link>
            </div>
          ))}

          {/* Duplicate track for seamless infinite marquee loop */}
          {artworks.map((artwork) => (
            <div
              key={`track2-${artwork.id}`}
              className="shrink-0 w-[240px] sm:w-[270px] md:w-[300px]"
              aria-hidden="true"
            >
              <Link
                href={`/artworks/${artwork.slug}`}
                tabIndex={-1}
                className="group block focus:outline-none rounded-xl"
                data-cursor="VIEW"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-canvas-muted border border-canvas-border shadow-subtle group-hover:shadow-gallery transition-shadow duration-500">
                  <Image
                    src={artwork.coverImage.url}
                    alt={artwork.coverImage.alt || artwork.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                  />
                </div>

                <div className="mt-3 px-0.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-base text-charcoal font-normal leading-tight truncate group-hover:text-charcoal-muted transition-colors">
                      {artwork.title}
                    </p>
                    <ArtworkStatusBadge
                      status={artwork.status}
                      className="text-[0.5rem] px-1.5 py-0.5 shrink-0 mt-0.5"
                    />
                  </div>
                  <p className="gallery-plaque text-[0.625rem] text-charcoal-subtle mt-1 truncate">
                    {artwork.year}
                    {artwork.medium && ` · ${artwork.medium.split(',')[0]}`}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
