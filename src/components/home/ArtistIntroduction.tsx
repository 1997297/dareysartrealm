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
                  alt="Darey artwork — mixed media canvas"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              {/* Offset: small portrait of Darey */}
              <div className="absolute -bottom-8 -right-6 w-1/2 aspect-square overflow-hidden bg-canvas border border-canvas-border hidden sm:block shadow-gallery rounded-xl">
                <Image
                  src="/artworks/hero.jpeg"
                  alt="Darey at work in the studio"
                  fill
                  sizes="25vw"
                  className="object-cover object-top"
                />
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
