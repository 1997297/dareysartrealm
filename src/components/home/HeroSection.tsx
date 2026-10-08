'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Artwork } from '@/types/artwork';
import { HeroConfig } from '@/types/siteContent';
import { Button } from '@/components/ui/Button';
import { fadeUp, fadeIn } from '@/lib/motion';

interface HeroSectionProps {
  heroArtwork?: Artwork | null;
  heroConfig?: HeroConfig;
}

export function HeroSection({ heroArtwork, heroConfig }: HeroSectionProps) {
  // Priority 1: CMS-configured background URL
  // Priority 2: Real published hero artwork cover
  // Priority 3: Approved original hero artwork (/artworks/hero.jpeg)
  const imageUrl =
    heroConfig?.backgroundImageUrl ||
    heroConfig?.imageUrl ||
    heroArtwork?.coverImage?.url ||
    '/artworks/hero.jpeg';
  const imageAlt =
    heroArtwork?.coverImage?.alt ||
    heroArtwork?.title ||
    "Echoes of Home - Monumental Studio Masterwork by Darey";

  const headline = heroConfig?.headline;
  const subheadline = heroConfig?.subheadline;
  const primaryCtaText = heroConfig?.primaryCtaText || "Explore the Artrealm";
  const primaryCtaHref = heroConfig?.primaryCtaHref || "#selected-works";
  const secondaryCtaText = heroConfig?.secondaryCtaText || "Create a Piece";
  const secondaryCtaHref = heroConfig?.secondaryCtaHref || "/commission";

  return (
    <section className="relative min-h-[90vh] min-h-[90dvh] sm:min-h-screen w-full flex flex-col justify-center items-center pt-24 sm:pt-28 md:pt-36 pb-12 sm:pb-20 overflow-hidden bg-charcoal">
      {/* Background: Restored Original Monumental Artwork with Refined Subtle Frosted Glass Effect */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.03] filter blur-[2px] sm:blur-[3px] brightness-[0.80] contrast-[1.06] transition-transform duration-1000 ease-out"
        />
        {/* Optical Frosted Glass Diffusion Pane - Subtle & refined */}
        <div className="absolute inset-0 backdrop-blur-[2px] sm:backdrop-blur-[3px] bg-charcoal/25 pointer-events-none" />

        {/* Balanced centered scrim for maximum text contrast across the centered composition */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-950/45 to-stone-950/80 pointer-events-none" />

        {/* Subtle radial focus on the central content */}
        <div className="absolute inset-0 bg-radial-[at_center] from-stone-950/30 via-stone-950/50 to-stone-950/75 pointer-events-none" />

        {/* Subtle frosted glass ambient surface sheen */}
        <div className="absolute inset-0 bg-gradient-to-b from-canvas/5 via-transparent to-stone-950/40 pointer-events-none" />
      </div>

      {/* Hero Content — Centralized Composition */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-10 lg:px-14 my-auto flex flex-col items-center text-center">
        <div className="w-full max-w-3xl flex flex-col items-center justify-center text-center pt-2 sm:pt-4">

          {/* Display headline — Editorial serif with complementary brush script continuation */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={{ delay: 0.2 }}
            className="font-display text-4xl xs:text-[2.65rem] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.25rem] text-canvas font-normal leading-[1.08] sm:leading-[1.04] tracking-tight text-center"
          >
            <span className="block">Welcome to</span>
            <span className="block mt-1 sm:mt-2">
              <span className="font-display font-medium text-canvas">Darey&apos;s </span>
              <span className="font-display italic font-light text-canvas/90 tracking-tight inline-block text-[0.88em] align-baseline">
                Artrealm.
              </span>
            </span>
          </motion.h1>

          {/* Editorial Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={{ delay: 0.35 }}
            className="mt-4 sm:mt-8 max-w-xl text-sm sm:text-base md:text-lg text-canvas/80 font-light leading-relaxed drop-shadow-sm text-center mx-auto"
          >
            {subheadline || (
              <>
                Original artworks, monumental commissions, and tactile expressions
                crafted by Darey. An exploration of African memory, perseverance,
                and human emotion.
              </>
            )}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={{ delay: 0.45 }}
            className="mt-6 sm:mt-10 flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-6 w-full xs:w-auto"
          >
            <Button
              href={primaryCtaHref}
              variant="secondary"
              size="lg"
              className="bg-canvas text-charcoal hover:bg-canvas-subtle rounded-full font-medium border-none shadow-gallery text-center justify-center px-8"
            >
              {primaryCtaText}
            </Button>
            <Button
              href={secondaryCtaHref}
              variant="outline"
              size="lg"
              className="text-canvas border-canvas/40 hover:border-canvas hover:bg-canvas/10 rounded-full text-center justify-center px-8"
            >
              {secondaryCtaText}
            </Button>
          </motion.div>

          {/* Micro Details — Centralized Gallery Plaques */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            custom={{ delay: 0.6 }}
            className="mt-12 sm:mt-16 pt-6 border-t border-canvas/20 flex flex-col xs:flex-row items-center justify-center gap-6 sm:gap-12 max-w-lg mx-auto text-xs text-center"
          >
            <div>
              <span className="gallery-plaque text-[0.625rem] text-canvas/50">
                EXHIBITION STATUS
              </span>
              <p className="font-sans font-medium text-canvas mt-1">
                2026 Collection available
              </p>
            </div>
            <div className="hidden xs:block w-px h-8 bg-canvas/15" />
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
    </section>
  );
}
