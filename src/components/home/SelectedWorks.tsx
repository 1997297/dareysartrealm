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

      {/* Horizontal scroll rail — full bleed, no max-width constraint */}
      <div
        ref={railRef}
        className={cn(
          'flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth',
          'px-5 sm:px-8 md:px-12 lg:px-16',
          '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
          'pb-4' // breathing room for shadow
        )}
        role="region"
        aria-label="Selected artworks horizontal rail"
      >
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            custom={{ delay: 0.08 * index }}
            className="shrink-0 w-[220px] sm:w-[240px] md:w-[260px]"
          >
            <Link
              href={`/artworks/${artwork.slug}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal rounded-xl"
              data-cursor="VIEW"
              aria-label={`View ${artwork.title}`}
            >
              {/* Square thumbnail — consistent equal frames */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-canvas-muted border border-canvas-border shadow-subtle group-hover:shadow-gallery transition-shadow duration-500">
                <Image
                  src={artwork.coverImage.url}
                  alt={artwork.coverImage.alt || artwork.title}
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                />
              </div>

              {/* Metadata + status badge below image */}
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
                <p className="gallery-plaque text-[0.625rem] text-charcoal-subtle mt-1">
                  {artwork.year}
                  {artwork.medium && ` · ${artwork.medium.split(',')[0]}`}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Terminal card: see more */}
        <div className="shrink-0 w-[220px] sm:w-[240px] md:w-[260px] flex items-center justify-center">
          <Link
            href="/artworks"
            className="group flex flex-col items-center justify-center gap-3 aspect-square w-full rounded-xl border border-dashed border-canvas-border hover:border-charcoal/30 bg-canvas-subtle hover:bg-canvas-muted transition-all duration-300 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
          >
            <span className="font-display text-3xl text-charcoal/40 group-hover:text-charcoal transition-colors">
              &rarr;
            </span>
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle group-hover:text-charcoal transition-colors">
              View all works
            </span>
          </Link>
        </div>
      </div>
    </Section>
  );
}
