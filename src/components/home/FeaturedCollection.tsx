'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Collection } from '@/types/collection';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { fadeUp, fadeIn, imageReveal } from '@/lib/motion';

interface FeaturedCollectionProps {
  collection: Collection;
}

export function FeaturedCollection({ collection }: FeaturedCollectionProps) {
  if (!collection) return null;

  return (
    <Section background="paper" spacing="lg" className="border-t border-canvas-border">
      <Container size="wide">
        <div className="relative overflow-hidden bg-canvas border border-canvas-border p-8 sm:p-12 lg:p-20 shadow-subtle rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Oversized Typography & Narrative */}
            <div className="lg:col-span-6 z-10">
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="gallery-plaque text-xs text-charcoal-subtle font-medium">
                  {collection.subtitle || 'COLLECTION 01'}
                </span>
                <span className="h-1 w-1 rounded-full bg-charcoal-subtle" />
                <span className="font-mono text-xs text-charcoal-subtle">
                  {collection.year || 2026}
                </span>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={{ delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-charcoal font-normal leading-[1.12] sm:leading-[1.08] tracking-tight"
              >
                {collection.title}
              </motion.h2>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={{ delay: 0.2 }}
                className="mt-6 text-xl sm:text-2xl text-charcoal/90 font-display italic font-light leading-relaxed"
              >
                &ldquo;{collection.statement}&rdquo;
              </motion.p>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={{ delay: 0.3 }}
                className="mt-4 text-sm sm:text-base text-charcoal-muted leading-relaxed font-light max-w-xl"
              >
                {collection.description}
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={{ delay: 0.4 }}
                className="mt-10 flex flex-wrap items-center gap-6"
              >
                <Button
                  href={`/collections/${collection.slug}`}
                  variant="primary"
                  size="md"
                >
                  Explore collection &rarr;
                </Button>

                <span className="text-xs text-charcoal-subtle tracking-gallery">
                  {collection.artworkCount} original works
                </span>
              </motion.div>
            </div>

            {/* Right: Immersive Collection Artwork Composition */}
            <div className="lg:col-span-6 relative">
              <motion.div
                variants={imageReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-canvas-muted shadow-gallery-lg border border-canvas-border rounded-2xl"
                data-cursor="EXPLORE"
              >
                <Link
                  href={`/collections/${collection.slug}`}
                  className="block relative w-full h-full group"
                  aria-label={`Explore collection: ${collection.title}`}
                >
                  <Image
                    src={collection.coverImage.url}
                    alt={collection.coverImage.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 ease-artistic group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors duration-500" />
                </Link>

                {/* Floating Plaque */}
                <div className="absolute bottom-6 left-6 z-10 bg-canvas/95 backdrop-blur-sm px-4 py-2 border border-canvas-border rounded-lg shadow-sm">
                  <p className="gallery-plaque text-[0.625rem] text-charcoal">
                    SERIES KEYWORK
                  </p>
                  <p className="font-display text-sm text-charcoal">
                    {collection.title} Suite
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
