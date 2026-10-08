'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { fadeUp, imageReveal } from '@/lib/motion';

export function ArtistIntroduction() {
  return (
    <Section background="canvas" spacing="lg" className="border-t border-canvas-border">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Artwork Imagery (reversed hierarchy) */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <motion.div
              variants={imageReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Primary: large artwork canvas */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-canvas-muted shadow-gallery border border-canvas-border rounded-2xl">
                <Image
                  src="/artworks/pic3.jpeg"
                  alt="Darey artwork, mixed media canvas"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Offset: portrait of Darey with frosted glass effect and natural shoulder width */}
              <div className="absolute -bottom-6 -right-4 sm:-bottom-7 sm:-right-5 w-[46%] sm:w-[48%] aspect-[4/5] overflow-hidden bg-white/60 backdrop-blur-lg border border-white/60 shadow-gallery rounded-xl hidden sm:flex items-end justify-center">
                {/* Subtle light ambient wash letting the canvas behind show through */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/35 to-white/20 pointer-events-none" />
                <div className="relative w-full h-full">
                  <Image
                    src="/artist-portrait-transparent.png"
                    alt="Portrait of Darey"
                    fill
                    sizes="22vw"
                    className="object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Statement, Biography & Personal Mark */}
          <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-8">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal leading-[1.14] sm:leading-[1.1] tracking-tight"
            >
              I&apos;m Darey.
              <br />
              <span className="italic font-light text-charcoal/85">
                I make things that speak without words.
              </span>
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={{ delay: 0.2 }}
              className="mt-8 space-y-4 text-charcoal-muted font-light leading-relaxed text-base sm:text-lg max-w-xl"
            >
              <p>
                Working from the studio, my practice bridges contemporary figurative expression with deep textural exploration. Layering rich oils, raw pigments, and sculpted impasto, each work is an exploration of form, light, and human presence.
              </p>
              <p>
                Every stroke is an unfiltered dialogue between intuition and materiality, crafted not merely to hang on a wall, but to anchor the spirit of the space it inhabits.
              </p>
            </motion.div>

            {/* Signature & Personal Touch */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={{ delay: 0.3 }}
              className="mt-8 pt-6 border-t border-canvas-border flex items-center justify-between max-w-xl"
            >
              <div className="flex flex-col">
                <span className="font-display italic text-3xl sm:text-4xl text-charcoal font-normal">
                  Darey
                </span>
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle mt-1">
                  ARTIST &bull; FOUNDER OF ARTREALM
                </span>
              </div>

              <Button href="/about" variant="editorial" className="text-sm">
                Meet Darey &rarr;
              </Button>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
