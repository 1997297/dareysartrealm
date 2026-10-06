'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Palette, Layers, Eye } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <Container size="wide">
        {/* Exhibition Plaque Header */}
        <div className="border-b border-canvas-border pb-12 mb-16">
          <div className="max-w-3xl">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
              THE ARTIST &amp; THE STUDIO
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-charcoal font-normal tracking-tight leading-[1.04]">
              Art that provokes feeling before understanding.
            </h1>
            <p className="mt-8 text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
              Darey&apos;s Artrealm is the independent creative universe of contemporary artist Darey. A sanctuary where original paintings, architectural interventions, and bespoke commissions are crafted to explore human presence, tactile memory, and raw materiality.
            </p>
          </div>
        </div>

        {/* Hero Studio Diptych Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 items-stretch">
          <div className="md:col-span-7 relative min-h-[380px] sm:min-h-[480px] bg-canvas-muted overflow-hidden border border-canvas-border shadow-subtle rounded-2xl">
            <Image
              src="/artworks/hero.jpeg"
              alt="Darey in studio with monumental canvas"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="md:col-span-5 flex flex-col justify-between p-8 sm:p-10 bg-canvas-subtle border border-canvas-border rounded-2xl space-y-6">
            <div>
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-2">
                STUDIO ETHOS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-medium leading-tight mb-4">
                The Alchemy of Texture
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
                Rather than treating painting as a flat illusion, Darey approaches the canvas as a sculptural plane. Layers of pumice, charcoal, raw umber, and oil are applied with deliberate force using heavy steel palette knives.
              </p>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed mt-3">
                The resulting surfaces catch ambient light differently from every perspective, allowing the artwork to transform throughout the day as natural illumination moves across the room.
              </p>
            </div>

            <div className="pt-6 border-t border-canvas-border">
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-subtle block mb-1">
                PRACTICE MEDIUMS
              </span>
              <p className="font-serif italic text-sm text-charcoal">
                Oil on Belgian Linen &bull; Mineral Pigments &bull; Heavy Impasto &bull; Architectural Finishes &bull; Hand-gilded Leaf
              </p>
            </div>
          </div>
        </div>

        {/* Pillars of Artistic Inquiry */}
        <div className="py-16 border-t border-canvas-border mb-20">
          <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
            ARTISTIC PHILOSOPHY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal mb-12">
            Pillars of the Creative Universe
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-canvas border border-canvas-border rounded-2xl space-y-4 shadow-subtle">
              <span className="font-mono text-xs font-semibold text-charcoal block">01 / PRESENCE</span>
              <h3 className="font-display text-xl text-charcoal font-medium">
                Human Stories &amp; Contemplation
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
                Investigating brotherhood, quiet reflection, and human connection. Each figurative work avoids sentimental realism in favor of deep psychological resonance and raw spiritual dignity.
              </p>
            </div>

            <div className="p-8 bg-canvas border border-canvas-border rounded-2xl space-y-4 shadow-subtle">
              <span className="font-mono text-xs font-semibold text-charcoal block">02 / MATERIALITY</span>
              <h3 className="font-display text-xl text-charcoal font-medium">
                Tactile Geological Grounding
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
                Earth pigments, stone grounds, and pulverized minerals are bonded with traditional oils. The physical weight of the paint creates an undeniable physical presence in contemporary spaces.
              </p>
            </div>

            <div className="p-8 bg-canvas border border-canvas-border rounded-2xl space-y-4 shadow-subtle">
              <span className="font-mono text-xs font-semibold text-charcoal block">03 / SPATIAL SYNTHESIS</span>
              <h3 className="font-display text-xl text-charcoal font-medium">
                Dialogue with Architecture
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
                Art does not exist in a vacuum. Darey’s creations are conceived with modern interiors in mind—complementing natural timber, polished concrete, stone masonry, and high architectural ceilings.
              </p>
            </div>
          </div>
        </div>

        {/* Exhibition & Archival Integrity Section */}
        <div className="p-8 sm:p-12 bg-canvas-subtle border border-canvas-border rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          <div className="lg:col-span-8 space-y-4">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
              COLLECTOR STANDARDS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-normal">
              Provenance &amp; Archival Integrity
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
              Every original artwork acquired from Darey&apos;s Artrealm is entered into the studio’s permanent archival register. Collectors receive a physical, hand-signed Certificate of Authenticity embossed with the studio seal, verifying its one-of-one status and archival longevity.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/authenticity"
                className="text-xs font-sans font-medium uppercase tracking-gallery text-charcoal hover:underline inline-flex items-center gap-1.5"
              >
                <span>Read Authenticity Standards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/terms"
                className="text-xs font-sans font-medium uppercase tracking-gallery text-charcoal hover:underline inline-flex items-center gap-1.5"
              >
                <span>View Provenance Terms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Button href="/artworks" variant="primary" size="lg">
              Explore Available Works
            </Button>
          </div>
        </div>

        {/* Studio Consultation CTA */}
        <div className="text-center max-w-xl mx-auto space-y-6 pt-12">
          <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
            PRIVATE INQUIRIES
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
            Commission or Inquire
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
            Interested in acquiring a piece, arranging a private studio viewing, or collaborating on a bespoke architectural commission?
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Button href="/commission" variant="primary">
              Begin a Commission
            </Button>
            <Button href="/contact" variant="secondary">
              Contact the Studio
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
