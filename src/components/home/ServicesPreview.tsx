'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ServicePreview } from '@/types/service';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { fadeUp } from '@/lib/motion';

interface ServicesPreviewProps {
  services: ServicePreview[];
}

export function ServicesPreview({ services }: ServicesPreviewProps) {
  return (
    <Section background="canvas" spacing="lg" className="border-t border-canvas-border">
      <Container size="wide">
        <SectionHeading
          title="Studio services"
          subtitle="From ready original canvases to monumental architectural murals and bespoke wall finishes for contemporary environments."
          align="between"
          action={
            <Button href="/services" variant="editorial" className="text-sm">
              Explore all services &rarr;
            </Button>
          }
        />

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={{ delay: 0.1 * index }}
              className="group flex flex-col justify-between h-full bg-canvas-paper border border-canvas-border p-6 transition-all duration-500 hover:border-charcoal/40 hover:shadow-subtle rounded-2xl"
            >
              <div>
                {/* Top Number */}
                <div className="flex items-center justify-between border-b border-canvas-border pb-4 mb-5">
                  <span className="font-mono text-sm font-semibold text-charcoal">
                    {service.number}
                  </span>
                  <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                    PRACTICE
                  </span>
                </div>

                {/* Service Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-muted mb-5 rounded-xl">
                  <Image
                    src={service.coverImage.url}
                    alt={service.coverImage.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                  />
                </div>

                {/* Title & Description */}
                <h3 className="font-display text-xl text-charcoal font-normal mb-2 transition-colors group-hover:text-charcoal-muted">
                  {service.title}
                </h3>
                <p className="text-xs text-charcoal-muted font-light leading-relaxed mb-6">
                  {service.shortDescription}
                </p>
              </div>

              {/* Bottom Action Link */}
              <div className="pt-4 border-t border-canvas-border">
                <Link
                  href={service.ctaHref || `/services/${service.slug}`}
                  className="inline-flex items-center text-xs font-sans font-medium uppercase tracking-gallery text-charcoal hover:underline"
                >
                  {service.ctaLabel || 'Learn More'} &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
