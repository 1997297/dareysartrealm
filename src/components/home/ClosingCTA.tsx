'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { fadeUp } from '@/lib/motion';

export function ClosingCTA() {
  return (
    <Section background="canvas" spacing="xl" className="border-t border-canvas-border text-center">
      <Container size="editorial">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <h2 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-charcoal font-normal leading-[1.12] sm:leading-[1.08] tracking-tight">
            There&apos;s always <br />
            room for <br />
            <span className="italic font-light text-charcoal/85">another story.</span>
          </h2>

          <p className="mt-6 sm:mt-8 text-sm sm:text-base md:text-lg text-charcoal-muted font-light leading-relaxed max-w-xl mx-auto">
            Whether inquiring about an existing original, requesting an authenticity inquiry, or commissioning a tailored piece for your sanctuary.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 sm:gap-6">
            <Button href="/commission" variant="primary" size="lg" className="text-center justify-center">
              Start yours
            </Button>
            <Button href="/contact" variant="outline" size="lg" className="text-center justify-center">
              Contact the studio
            </Button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
