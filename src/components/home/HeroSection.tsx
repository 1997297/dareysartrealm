'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Artwork } from '@/types/artwork';
import { Button } from '@/components/ui/Button';
import { fadeUp, fadeIn } from '@/lib/motion';

interface HeroSectionProps {
  heroArtwork?: Artwork | null;
}

export function HeroSection({ heroArtwork }: HeroSectionProps) {
  const imageUrl = heroArtwork?.coverImage?.url || '/artworks/hero.jpeg';
  const imageAlt = heroArtwork?.coverImage?.alt || heroArtwork?.title || "Darey's Artrealm - Contemporary Fine Art Atelier";

  return (
    <section className="relative min-h-[90vh] min-h-[90dvh] sm:min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 md:pt-36 pb-10 sm:pb-16 overflow-hidden bg-charcoal">
      {/* Full-Bleed Painting Artwork Background */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.03] transition-transform duration-1000 ease-out"
        />
        {/* Directional overlay: strong on left (text side), fades toward right (artwork side) */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 sm:via-stone-950/55 to-stone-950/20 sm:to-stone-950/10" />
        {/* Bottom vignette for base legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-[94rem] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-18 my-auto">
        <div className="max-w-2xl xl:max-w-3xl flex flex-col justify-center pt-2 sm:pt-4 lg:pt-0">

          {/* Display headline — Fraunces editorial serif with balanced line height */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={{ delay: 0.2 }}
            className="font-display text-4xl xs:text-[2.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.25rem] text-canvas font-normal leading-[1.08] sm:leading-[1.06] tracking-tight"
          >
            Welcome to
            <br />
            <span className="italic font-light text-canvas/90">Darey&apos;s Artrealm.</span>
          </motion.h1>

          {/* Editorial Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={{ delay: 0.35 }}
            className="mt-4 sm:mt-8 max-w-lg text-sm sm:text-base md:text-lg text-canvas/80 font-light leading-relaxed drop-shadow-sm"
          >
            Original artworks, monumental commissions, and tactile expressions
            crafted by Darey. An exploration of African memory, perseverance,
            and human emotion.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={{ delay: 0.45 }}
            className="mt-6 sm:mt-10 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-6"
          >
            <Button
              href="#selected-works"
              variant="secondary"
              size="lg"
              className="bg-canvas text-charcoal hover:bg-canvas-subtle rounded-xl font-medium border-none shadow-gallery text-center justify-center"
            >
              Explore the Artrealm
            </Button>
            <Button
              href="/commission"
              variant="outline"
              size="lg"
              className="text-canvas border-canvas/40 hover:border-canvas hover:bg-canvas/10 rounded-xl text-center justify-center"
            >
              Commission a piece
            </Button>
          </motion.div>

          {/* Micro Details — small metadata stays uppercase at this scale */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={{ delay: 0.6 }}
            className="mt-12 sm:mt-16 pt-6 border-t border-canvas/20 grid grid-cols-2 gap-4 max-w-md text-xs"
          >
            <div>
              <span className="gallery-plaque text-[0.625rem] text-canvas/50">
                EXHIBITION STATUS
              </span>
              <p className="font-sans font-medium text-canvas mt-1">
                2026 Collection available
              </p>
            </div>
            <div>
              <span className="gallery-plaque text-[0.625rem] text-canvas/50">
                LOCATION &amp; DISPATCH
              </span>
              <p className="font-sans font-medium text-canvas mt-1">
                Artist Studio &bull; Worldwide shipping
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={{ delay: 0.8 }}
        className="relative z-10 mx-auto flex flex-col items-center gap-2 pt-8 text-canvas/60"
      >
        <span className="gallery-plaque text-[0.625rem] tracking-[0.25em] text-canvas/60">
          SCROLL TO EXPLORE
        </span>
        <div className="w-[1px] h-8 bg-canvas/30 animate-pulse" />
      </motion.div>
    </section>
  );
}
