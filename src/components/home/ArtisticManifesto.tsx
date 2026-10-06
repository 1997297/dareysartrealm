'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { fadeUp, fadeIn } from '@/lib/motion';

export function ArtisticManifesto() {
  return (
    <Section background="subtle" spacing="lg" className="border-y border-canvas-border">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Big Typography Manifesto */}
          <div className="lg:col-span-8">
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
                Every canvas begins where verbal explanation fails. My work is not an intellectual puzzle waiting to be decoded; it is an intimate physical encounter with pigment, rhythm, and raw vulnerability.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <span className="font-display italic text-2xl text-charcoal">Darey</span>
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                  STUDIO PRACTICE
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Tactile Artwork Fragment */}
          <div className="lg:col-span-4 relative">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              custom={{ delay: 0.3 }}
              className="relative mx-auto max-w-sm lg:max-w-none"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-canvas-muted shadow-gallery border border-canvas-border rounded-2xl">
                <Image
                  src="/artworks/pic5.jpeg"
                  alt="Textural pigment and figurative study by Darey"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Plaque Annotation — small metadata stays uppercase */}
              <div className="mt-4 flex items-center justify-between text-xs text-charcoal-subtle">
                <span className="gallery-plaque text-[0.625rem]">
                  FIG 01. Material dialogue
                </span>
                <span className="font-mono text-[0.625rem]">
                  Pigment &bull; Canvas
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
