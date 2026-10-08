'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, FileText, Palette, Paintbrush } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ServiceQuoteModal } from '@/components/services/ServiceQuoteModal';
import { serviceService } from '@/services/serviceService';
import { MOCK_SERVICES } from '@/data/mockServices';
import { Service } from '@/types/service';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<Service | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await serviceService.getAll();
        if (data && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        console.error('Error fetching live services:', err);
      }
    }
    fetchServices();
  }, []);

  const handleOpenQuote = (service?: Service) => {
    setSelectedServiceForQuote(service || services[0] || MOCK_SERVICES[1]);
    setQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <Container size="wide">
        {/* Page Hero Header */}
        <div className="border-b border-canvas-border pb-12 mb-16">
          <div className="max-w-3xl">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-2">
              ATELIER &amp; ARCHITECTURAL PRACTICE
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal tracking-tight">
              Studio Services
            </h1>
            <p className="mt-6 text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
              From gallery-curated original canvases to monumental architectural murals, bespoke tactile wall finishes, and master-crafted house painting. Darey brings an uncompromising artistic eye to private residences, cultural institutions, and commercial spaces.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleOpenQuote(services[1] || services[0])}
              >
                Get a Quote
              </Button>
              <Button href="/artworks" variant="secondary" size="md">
                View Artworks
              </Button>
            </div>
          </div>
        </div>

        {/* Services Master Grid */}
        <div className="space-y-16">
          <div className="flex items-center justify-between border-b border-canvas-border pb-4">
            <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle">
              DISCIPLINES &amp; ENGAGEMENTS
            </span>
            <span className="text-xs text-charcoal-muted">
              {services.length} Practice Disciplines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group bg-canvas border border-canvas-border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-charcoal/40 hover:shadow-subtle rounded-2xl"
              >
                <div>
                  {/* Top Bar with Number */}
                  <div className="flex items-center justify-between border-b border-canvas-border pb-4 mb-6">
                    <span className="font-mono text-sm font-semibold text-charcoal">
                      {service.number}
                    </span>
                  </div>

                  {/* Image */}
                  <Link
                    href={`/services/${service.slug}`}
                    className="relative aspect-[4/3] w-full block overflow-hidden bg-canvas-muted mb-6 rounded-xl"
                  >
                    <Image
                      src={service.coverImage.url}
                      alt={service.coverImage.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-artistic group-hover:scale-105"
                    />
                  </Link>

                  {/* Title & Short Description */}
                  <Link href={`/services/${service.slug}`}>
                    <h2 className="font-display text-2xl text-charcoal font-medium mb-3 group-hover:text-charcoal-muted transition-colors leading-tight">
                      {service.title}
                    </h2>
                  </Link>
                  <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>

                  {/* Features List */}
                  {service.features && (
                    <ul className="space-y-2 mb-6 pt-4 border-t border-canvas-border/60 text-xs text-charcoal-muted font-light">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-charcoal shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 border-t border-canvas-border flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-sans font-medium uppercase tracking-gallery text-charcoal hover:underline inline-flex items-center gap-1.5"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleOpenQuote(service)}
                    className="text-xs font-medium px-4 py-2 bg-canvas-subtle hover:bg-charcoal hover:text-canvas text-charcoal border border-canvas-border transition-colors w-full sm:w-auto text-center rounded-full"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Philosophy & Craft Standards */}
        <div className="mt-24 pt-16 border-t border-canvas-border grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-3">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
              MATERIAL PURITY
            </span>
            <h3 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              Fine-Art Grade Chemistry
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
              Whether priming a bespoke portrait on Belgian linen or coating a residential living room, we select only archival-grade pigments, lightfast binders, and non-toxic architectural formulations.
            </p>
          </div>

          <div className="space-y-3">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
              ARCHITECTURAL HARMONY
            </span>
            <h3 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              Conceived in Context
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
              Every brush stroke, mural contour, and surface texture is considered against diurnal sunlight, ambient lighting schemes, ceiling heights, and surrounding interior materials.
            </p>
          </div>

          <div className="space-y-3">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
              DEDICATED DIALOGUE
            </span>
            <h3 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              Direct Artist Collaboration
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
              You collaborate directly with Darey throughout the creative consultation, ensuring complete alignment of vision, milestone transparency, and flawless execution.
            </p>
          </div>
        </div>
      </Container>

      {/* Global Interactive Quote Modal */}
      <ServiceQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        service={selectedServiceForQuote}
        allServices={MOCK_SERVICES}
      />
    </div>
  );
}
