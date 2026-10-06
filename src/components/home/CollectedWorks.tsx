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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {collectedArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={{ delay: 0.15 * index }}
            >
              <ArtworkCard
                artwork={artwork}
                variant="standard"
                showPrice={false}
              />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
