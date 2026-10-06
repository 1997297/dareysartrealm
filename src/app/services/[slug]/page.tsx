'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Clock, DollarSign, Sparkles, HelpCircle } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ServiceQuoteModal } from '@/components/services/ServiceQuoteModal';
import { MOCK_SERVICES } from '@/data/mockServices';
import { Service } from '@/types/service';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = MOCK_SERVICES.find((s) => s.slug === params.slug);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 flex items-center justify-center">
        <Container size="narrow" className="text-center space-y-6">
          <span className="gallery-plaque text-xs text-charcoal-subtle block">
            SERVICE DIRECTORY
          </span>
          <h1 className="font-display text-4xl text-charcoal font-normal">
            Service Practice Not Found
          </h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto font-light">
            The studio service practice you are looking for does not exist or has been updated.
          </p>
          <Button href="/services" variant="primary">
            &larr; Return to Studio Services
          </Button>
        </Container>
      </div>
    );
  }

  // Other services for bottom discovery
  const otherServices = MOCK_SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <Container size="wide">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-medium text-charcoal-muted hover:text-charcoal transition-colors tracking-wide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Services</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="border-b border-canvas-border pb-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Text Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-charcoal">
                  PRACTICE {service.number}
                </span>
                <span className="text-charcoal-border">&bull;</span>
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                  STUDIO PRACTICE
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal leading-tight tracking-tight">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
                {service.description || service.shortDescription}
              </p>

              {/* Fast Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-canvas-border/70 text-xs">
                {service.typicalTimeline && (
                  <div className="p-4 bg-canvas-subtle border border-canvas-border space-y-1">
                    <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-subtle flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-charcoal" />
                      Typical Timeline
                    </span>
                    <p className="font-medium text-charcoal">{service.typicalTimeline}</p>
                  </div>
                )}

                {service.pricingStructure && (
                  <div className="p-4 bg-canvas-subtle border border-canvas-border space-y-1">
                    <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-subtle flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-charcoal" />
                      Pricing Structure
                    </span>
                    <p className="font-medium text-charcoal">{service.pricingStructure}</p>
                  </div>
                )}
              </div>

              {/* CTA Action Bar */}
              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setQuoteModalOpen(true)}
                >
                  Request a Quote / Consultation
                </Button>

                {service.slug === 'original-artwork' && (
                  <Button href="/artworks" variant="secondary" size="lg">
                    Browse Available Artworks
                  </Button>
                )}

                {service.slug === 'custom-commissions' && (
                  <Button href="/commission" variant="secondary" size="lg">
                    Begin Commission Brief &rarr;
                  </Button>
                )}
              </div>
            </div>

            {/* Right: Large Photography Display */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-canvas-muted border border-canvas-border shadow-subtle rounded-2xl">
                <Image
                  src={service.coverImage.url}
                  alt={service.coverImage.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features & Guarantees */}
        {service.features && service.features.length > 0 && (
          <div className="py-12 border-b border-canvas-border">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
              STANDARDS &amp; DELIVERABLES
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-medium mb-8">
              Key Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-canvas-subtle border border-canvas-border flex items-start gap-3.5 rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4 text-charcoal shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-charcoal font-light leading-relaxed">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process Flow */}
        {service.process && service.process.length > 0 && (
          <div className="py-16 border-b border-canvas-border">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
              METHODOLOGY &amp; PROGRESSION
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-medium mb-10">
              The Creative Process
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((step) => (
                <div
                  key={step.step}
                  className="p-6 bg-canvas border border-canvas-border flex flex-col justify-between space-y-4 rounded-xl"
                >
                  <div>
                    <span className="font-mono text-2xl font-semibold text-charcoal block mb-3">
                      {step.step}
                    </span>
                    <h3 className="font-serif text-lg text-charcoal font-medium mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-charcoal-muted font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {service.faq && service.faq.length > 0 && (
          <div className="py-16 border-b border-canvas-border">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
              COLLECTOR GUIDANCE
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-medium mb-8">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.faq.map((item, idx) => (
                <div key={idx} className="p-6 bg-canvas-subtle border border-canvas-border space-y-2 rounded-xl">
                  <h4 className="font-serif text-base text-charcoal font-medium">
                    {item.question}
                  </h4>
                  <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation: Other Services */}
        <div className="pt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-2xl text-charcoal font-medium">
              Explore Other Studio Disciplines
            </h3>
            <Link
              href="/services"
              className="text-xs font-sans font-medium uppercase tracking-gallery text-charcoal hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherServices.slice(0, 4).map((other) => (
              <Link
                key={other.id}
                href={`/services/${other.slug}`}
                className="group p-5 bg-canvas border border-canvas-border hover:border-charcoal/40 transition-all rounded-xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-canvas-muted mb-4 rounded-lg">
                  <Image
                    src={other.coverImage.url}
                    alt={other.coverImage.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="font-mono text-xs text-charcoal-subtle block mb-1">
                  {other.number}
                </span>
                <h4 className="font-serif text-base text-charcoal font-medium group-hover:text-charcoal-muted transition-colors">
                  {other.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </Container>

      {/* Quote Modal */}
      <ServiceQuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        service={service}
        allServices={MOCK_SERVICES}
      />
    </div>
  );
}
