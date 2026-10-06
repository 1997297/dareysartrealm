'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Artwork } from '@/types/artwork';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { Button } from '@/components/ui/Button';
import { fadeUp } from '@/lib/motion';

interface CollectedWorksProps {
  collectedArtworks: Artwork[];
}

export function CollectedWorks({ collectedArtworks }: CollectedWorksProps) {
  if (!collectedArtworks || collectedArtworks.length === 0) return null;

  return (
    <Section background="subtle" spacing="lg" className="border-t border-canvas-border">
      <Container size="wide">
        <SectionHeading
          title="Found their homes."
          subtitle="Past creations now residing in private and corporate collections globally. A testament to enduring dialogues between art and collector."
          align="between"
          action={
            <Button href="/artworks?status=sold" variant="editorial" className="text-sm">
              Explore Collected Works &rarr;
            </Button>
          }
        />

        {/* 2-3 Column Editorial Showcase of Sold Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {collectedArtworks.map((artwork, index) => (
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
              <a
                href={`/artworks/${artwork.slug}`}
                className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-muted block"
                data-cursor="VIEW"
              >
                <img
                  src={artwork.coverImage.url}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-charcoal/90 text-canvas text-[0.625rem] tracking-gallery uppercase font-semibold rounded-md backdrop-blur-xs">
                  Collected
                </span>
              </a>

              {/* Well-arranged Info Block */}
              <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                {/* Title & Year */}
                <div className="border-b border-canvas-border/80 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-2xl text-charcoal font-normal leading-tight group-hover:text-charcoal-muted transition-colors">
                      {artwork.title}
                    </h3>
                    <span className="font-mono text-xs text-charcoal-subtle px-2 py-0.5 rounded bg-canvas-muted shrink-0">
                      {artwork.year}
                    </span>
                  </div>
                  {artwork.collection && (
                    <p className="gallery-plaque text-[0.6rem] text-charcoal-subtle mt-1">
                      Series: {artwork.collection.title}
                    </p>
                  )}
                </div>

                {/* Structured Specs Grid: Medium & Size */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle shrink-0">
                      Medium
                    </span>
                    <span className="text-charcoal font-light text-right leading-snug">
                      {artwork.medium}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1 border-t border-canvas-border/50">
                    <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle shrink-0">
                      Dimensions
                    </span>
                    <span className="font-mono text-charcoal text-[0.6875rem]">
                      {artwork.width} &times; {artwork.height} cm
                    </span>
                  </div>
                </div>

                {/* Provenance & Acquisition Details Plaque */}
                <div className="mt-2 pt-3 border-t border-canvas-border/80 bg-canvas-subtle -mx-6 -mb-6 p-4 px-6 flex items-center justify-between text-xs">
                  <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                    Acquisition Record
                  </span>
                  <span className="font-serif italic text-charcoal text-xs font-medium">
                    {artwork.provenance || 'Private Collection'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
