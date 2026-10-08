'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { fadeUp, fadeIn } from '@/lib/motion';
import type { ManifestoSectionConfig } from '@/types/siteContent';

interface ArtisticManifestoProps {
  config?: ManifestoSectionConfig;
}

export function ArtisticManifesto({ config }: ArtisticManifestoProps = {}) {
  if (config && config.enabled === false) {
    return null;
  }

  // 3 stacked artwork cards (configurable via Studio CMS)
  const images =
    config?.stackedArtworkImages && config.stackedArtworkImages.length >= 3
      ? config.stackedArtworkImages
      : [
          config?.artworkImageUrl || '/artworks/pic5.jpeg',
          '/artworks/pic1.jpeg',
          '/artworks/pic7.jpeg',
        ];

  const card1 = images[0] || '/artworks/pic5.jpeg';
  const card2 = images[1] || '/artworks/pic1.jpeg';
  const card3 = images[2] || '/artworks/pic7.jpeg';

  return (
    <Section background="subtle" spacing="lg" className="border-y border-canvas-border overflow-hidden">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Big Typography Manifesto */}
          <div className="lg:col-span-7">
            <motion.blockquote
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-charcoal font-normal leading-[1.12] sm:leading-[1.1] md:leading-[1.08] tracking-tight"
            >
              Art made <br />
              <span className="italic font-light text-charcoal/85">to be felt</span> <br />
              before it is <br />
              understood.
            </motion.blockquote>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={{ delay: 0.2 }}
              className="mt-8 sm:mt-12 max-w-2xl"
            >
              <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
                {config?.narrative ||
                  'Every canvas begins where verbal explanation fails. My work is not an intellectual puzzle waiting to be decoded; it is an intimate physical encounter with pigment, rhythm, and raw vulnerability.'}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span className="font-display italic text-2xl text-charcoal">Darey</span>
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                  STUDIO PRACTICE
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Tactile Artwork Stack (Casually stacked art prints) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={{ delay: 0.3 }}
              className="relative mx-auto w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[460px]"
            >
              {/* Stack Stage Container */}
              <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] lg:h-[500px]">
                {/* CARD 3 (Back layer, farthest right, clockwise tilt) */}
                <motion.div
                  initial={{ rotate: 17, y: 0 }}
                  animate={{
                    y: [0, -4, 0],
                  }}
                  whileHover={{
                    rotate: 20,
                    y: -8,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }}
                  transition={{
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                      delay: 0.8,
                    },
                  }}
                  style={{ transformOrigin: 'bottom center' }}
                  className="absolute right-[1%] sm:right-[3%] top-[16%] sm:top-[15%] w-[64%] sm:w-[62%] aspect-[3.8/5] z-10 p-[3px] sm:p-[4px] bg-neutral-950 shadow-[0_18px_40px_-8px_rgba(0,0,0,0.55),0_4px_12px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-shadow hover:shadow-[0_24px_50px_-8px_rgba(0,0,0,0.65)] cursor-pointer"
                >
                  {/* Black Gutter & Recessed Float Reveal */}
                  <div className="w-full h-full p-[1.5px] sm:p-[2px] bg-black shadow-[inset_0_1px_4px_rgba(0,0,0,0.85)]">
                    {/* Crisp White Mat / Border */}
                    <div className="w-full h-full p-[6px] sm:p-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                      {/* Artwork Canvas */}
                      <div className="relative w-full h-full overflow-hidden bg-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]">
                        <Image
                          src={card3}
                          alt="Archival study by Darey"
                          fill
                          sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 300px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CARD 2 (Middle layer, tilted slightly clockwise) */}
                <motion.div
                  initial={{ rotate: 8, y: 0 }}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  whileHover={{
                    rotate: 11,
                    y: -10,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }}
                  transition={{
                    y: {
                      duration: 5.5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                      delay: 0.4,
                    },
                  }}
                  style={{ transformOrigin: 'bottom center' }}
                  className="absolute right-[11%] sm:right-[14%] top-[4%] sm:top-[3%] w-[64%] sm:w-[62%] aspect-[3.8/5] z-20 p-[3px] sm:p-[4px] bg-neutral-950 shadow-[0_22px_45px_-10px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.3)] ring-1 ring-white/10 transition-shadow hover:shadow-[0_28px_55px_-10px_rgba(0,0,0,0.7)] cursor-pointer"
                >
                  {/* Black Gutter & Recessed Float Reveal */}
                  <div className="w-full h-full p-[1.5px] sm:p-[2px] bg-black shadow-[inset_0_1px_4px_rgba(0,0,0,0.85)]">
                    {/* Crisp White Mat / Border */}
                    <div className="w-full h-full p-[6px] sm:p-[8px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                      {/* Artwork Canvas */}
                      <div className="relative w-full h-full overflow-hidden bg-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]">
                        <Image
                          src={card2}
                          alt="Archival study by Darey"
                          fill
                          sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 300px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* CARD 1 (Front layer, prominent focus, counter-clockwise tilt) */}
                <motion.div
                  initial={{ rotate: -6.5, y: 0 }}
                  animate={{
                    y: [0, -6, 0],
                  }}
                  whileHover={{
                    rotate: -4,
                    y: -12,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  }}
                  transition={{
                    y: {
                      duration: 5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    },
                  }}
                  style={{ transformOrigin: 'bottom center' }}
                  className="absolute left-[2%] sm:left-[4%] top-[12%] sm:top-[11%] w-[66%] sm:w-[64%] aspect-[3.8/5] z-30 p-[3.5px] sm:p-[4.5px] bg-neutral-950 shadow-[0_28px_55px_-12px_rgba(0,0,0,0.65),0_6px_16px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-shadow hover:shadow-[0_36px_65px_-12px_rgba(0,0,0,0.75)] cursor-pointer"
                >
                  {/* Black Gutter & Recessed Float Reveal */}
                  <div className="w-full h-full p-[1.5px] sm:p-[2px] bg-black shadow-[inset_0_1px_4px_rgba(0,0,0,0.85)]">
                    {/* Crisp White Mat / Border */}
                    <div className="w-full h-full p-[7px] sm:p-[9px] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
                      {/* Artwork Canvas */}
                      <div className="relative w-full h-full overflow-hidden bg-stone-900 shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)]">
                        <Image
                          src={card1}
                          alt={config?.artworkImageAlt || "Textural pigment and figurative study by Darey"}
                          fill
                          sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 320px"
                          className="object-cover"
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
