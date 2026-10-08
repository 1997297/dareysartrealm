'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { fadeUp, fadeIn } from '@/lib/motion';

export function CommissionCTA() {
  return (
    <Section background="subtle" spacing="xl" className="border-t border-canvas-border relative overflow-hidden">
      <Container size="wide">
        <div className="relative bg-charcoal text-canvas px-5 py-12 xs:px-6 xs:py-14 sm:px-12 sm:py-20 lg:p-24 overflow-hidden shadow-gallery-lg rounded-2xl sm:rounded-3xl">
          {/* Subtle Background Studio Texture Layer */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
            <Image
              src="/artworks/pic1.jpeg"
              alt="Raw studio materials and canvas texture by Darey"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative z-10 max-w-3xl">
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-canvas font-normal leading-[1.12] sm:leading-[1.08] tracking-tight"
            >
              Your idea. <br />
              <span className="italic font-light text-canvas/90">My canvas.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={{ delay: 0.2 }}
              className="mt-4 sm:mt-8 text-sm sm:text-lg md:text-xl text-canvas/80 font-light leading-relaxed max-w-xl"
            >
              Let&apos;s create something that doesn&apos;t exist yet. Whether you are an individual collector seeking a deeply personal heirloom or an architect designing an extraordinary space.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={{ delay: 0.3 }}
              className="mt-8 sm:mt-12 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 sm:gap-6"
            >
              <Button
                href="/commission"
                variant="secondary"
                size="lg"
                className="bg-canvas text-charcoal hover:bg-canvas-subtle border-none text-center justify-center"
              >
                Create a Piece
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                className="text-canvas border-canvas/40 hover:border-canvas hover:bg-canvas/10 text-center justify-center"
              >
                Contact Studio
              </Button>
            </motion.div>

            {/* Commission Process Preview Badges */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={{ delay: 0.4 }}
              className="mt-16 pt-8 border-t border-canvas/20 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs text-canvas/70"
            >
              <div>
                <span className="font-mono text-[0.625rem] text-canvas/50 block mb-1">01</span>
                <span className="font-medium tracking-wide">Tell me your vision</span>
              </div>
              <div>
                <span className="font-mono text-[0.625rem] text-canvas/50 block mb-1">02</span>
                <span className="font-medium tracking-wide">Concept &amp; swatches</span>
              </div>
              <div>
                <span className="font-mono text-[0.625rem] text-canvas/50 block mb-1">03</span>
                <span className="font-medium tracking-wide">Studio creation</span>
              </div>
              <div>
                <span className="font-mono text-[0.625rem] text-canvas/50 block mb-1">04</span>
                <span className="font-medium tracking-wide">Provenance &amp; delivery</span>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
