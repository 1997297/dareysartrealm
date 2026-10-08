'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Artwork } from '@/types/artwork';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { fadeUp } from '@/lib/motion';
import { getArtworkHref, getArtworkTitle } from '@/lib/utils';

interface CollectedWorksProps {
  collectedArtworks: Artwork[];
}

export function CollectedWorks({ collectedArtworks }: CollectedWorksProps) {
  if (!collectedArtworks || collectedArtworks.length === 0) return null;

  // Curate display to 6 collected artworks
  const displayedArtworks = collectedArtworks.slice(0, 6);

  return (
    <Section background="subtle" spacing="lg" className="border-t border-canvas-border">
      <Container size="wide">
        <SectionHeading
          title="Found their homes."
          subtitle="Past creations now residing in private and corporate collections globally. A testament to enduring dialogues between art and collector."
          align="between"
          action={
            <Button href="/artworks?status=sold" variant="editorial" className="text-sm">
              View Collected Works &rarr;
            </Button>
          }
        />

        {/* 2-3 Column Editorial Showcase of Sold Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {displayedArtworks.map((artwork, index) => {
            const href = artwork.collection?.slug
              ? `/collections/${encodeURIComponent(artwork.collection.slug)}`
              : artwork.slug
              ? `/artworks/${encodeURIComponent(artwork.slug)}`
              : '/artworks?status=sold';
            const displayTitle = getArtworkTitle(artwork.title);
            const hasCollection = Boolean(artwork.collection?.slug);

            return (
              <motion.div
                key={artwork.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={{ delay: 0.15 * index }}
                className="group flex flex-col bg-canvas border border-canvas-border rounded-2xl overflow-hidden hover:border-charcoal/40 transition-all duration-300 shadow-subtle hover:shadow-gallery"
              >
                {/* Image Frame */}
                <Link
                  href={href}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-muted block focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
                  data-cursor="VIEW"
                  aria-label={`View ${displayTitle}${artwork.collection?.title ? ` in ${artwork.collection.title}` : ''}`}
                >
                  <Image
                    src={artwork.coverImage.url}
                    alt={artwork.coverImage.alt || displayTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-charcoal/90 text-canvas text-[0.625rem] tracking-gallery uppercase font-semibold rounded-md backdrop-blur-xs">
                    Collected
                  </span>
                  {/* Subtle restrained desktop hover prompt */}
                  <div className="absolute inset-0 bg-charcoal/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="gallery-plaque text-[0.625rem] tracking-[0.2em] text-canvas bg-charcoal/85 px-3 py-1.5 rounded-full backdrop-blur-xs uppercase font-medium shadow-xs">
                      {hasCollection ? 'View Collection' : 'View Work'}
                    </span>
                  </div>
                </Link>

                {/* Well-arranged Info Block */}
                <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                  {/* Title & Year */}
                  <div className="border-b border-canvas-border/80 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display text-2xl text-charcoal font-normal leading-tight group-hover:text-charcoal-muted transition-colors">
                        <Link
                          href={href}
                          className="hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-charcoal"
                        >
                          {displayTitle}
                        </Link>
                      </h3>
                      {artwork.year ? (
                        <span className="font-mono text-xs text-charcoal-subtle px-2 py-0.5 rounded bg-canvas-muted shrink-0">
                          {artwork.year}
                        </span>
                      ) : null}
                    </div>
                    {artwork.collection && (
                      <p className="gallery-plaque text-[0.6rem] text-charcoal-subtle mt-1">
                        Series:{' '}
                        <Link
                          href={`/collections/${encodeURIComponent(artwork.collection.slug)}`}
                          className="hover:underline hover:text-charcoal transition-colors"
                        >
                          {artwork.collection.title}
                        </Link>
                      </p>
                    )}
                  </div>

                  {/* Structured Specs Grid: Medium & Size if confirmed */}
                  <div className="space-y-2 text-xs">
                    {artwork.medium ? (
                      <div className="flex items-start justify-between gap-3">
                        <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle shrink-0">
                          Medium
                        </span>
                        <span className="text-charcoal font-light text-right leading-snug">
                          {artwork.medium}
                        </span>
                      </div>
                    ) : null}

                    {artwork.width && artwork.height ? (
                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-canvas-border/50">
                        <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle shrink-0">
                          Dimensions
                        </span>
                        <span className="font-mono text-charcoal text-[0.6875rem]">
                          {artwork.width} &times; {artwork.height} cm
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3 pt-1 border-t border-canvas-border/50">
                        <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle shrink-0">
                          Portfolio Type
                        </span>
                        <span className="text-charcoal text-[0.6875rem]">
                          Original Canvas
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status & Acquisition Plaque: Real Status or Provenance */}
                  <div className="mt-2 pt-3 border-t border-canvas-border/80 bg-canvas-subtle -mx-6 -mb-6 p-4 px-6 flex items-center justify-between text-xs">
                    <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                      {artwork.provenance ? 'Provenance' : 'Status'}
                    </span>
                    <span className="font-mono tracking-wider text-[0.6875rem] uppercase text-charcoal font-medium truncate max-w-[200px]">
                      {artwork.provenance || 'Collected'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
