import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section background="canvas" spacing="xl" className="min-h-[80vh] flex items-center justify-center">
      <Container size="narrow" className="text-center">
        <span className="gallery-plaque text-xs text-charcoal-subtle block mb-4">
          CATALOGUE ERROR 404
        </span>
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-charcoal mb-6">
          THE CANVAS IS BLANK.
        </h1>
        <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed max-w-md mx-auto mb-10">
          The artwork or gallery room you are looking for does not exist or has been relocated to another exhibition.
        </p>
        <div className="flex justify-center gap-4">
          <Button href="/" variant="primary" size="lg">
            Return to Exhibition Entry
          </Button>
          <Button href="/artworks" variant="outline" size="lg">
            Browse Artworks
          </Button>
        </div>
      </Container>
    </Section>
  );
}
