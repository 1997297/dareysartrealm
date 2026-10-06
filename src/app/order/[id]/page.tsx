'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Check,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  FileText,
  User,
  Package,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/commerce';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice, formatDimensionsWithInches } from '@/lib/utils';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { isAuthenticated, user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      setIsLoading(true);
      const data = await orderService.getById(orderId);
      setOrder(data);
      setIsLoading(false);
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-canvas text-charcoal pt-36 pb-20">
        <Container size="editorial" className="text-center space-y-6">
          <h1 className="font-serif text-4xl text-charcoal font-light">
            Acquisition Record Not Found
          </h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto font-light leading-relaxed">
            We could not find an acquisition with reference number &ldquo;{orderId}&rdquo;.
          </p>
          <div className="pt-2">
            <Button href="/artworks" variant="primary" size="md">
              Return to Gallery Catalogue
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  const primaryArtwork = order.items[0]?.artwork;

  return (
    <div className="min-h-screen bg-canvas text-charcoal pt-24 pb-20 md:pt-32 md:pb-28">
      {/* 1. HERO STATEMENT */}
      <section className="relative border-b border-canvas-border pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />

        <Container size="editorial" className="text-center relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-charcoal text-canvas flex items-center justify-center mx-auto shadow-md">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-gallery font-semibold text-accent block">
              Acquisition Confirmed
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-charcoal tracking-tight">
              It’s yours.
            </h1>
            <p className="text-base sm:text-lg text-charcoal-muted max-w-md mx-auto font-light leading-relaxed">
              This one-of-a-kind original work has been permanently reserved and removed from the public gallery catalogue.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 px-4 py-2 bg-canvas-subtle border border-canvas-border rounded-sm text-xs font-mono">
            <span className="text-charcoal-muted uppercase">Reference:</span>
            <span className="font-semibold text-charcoal tracking-wider">{order.id}</span>
          </div>
        </Container>
      </section>

      {/* 2. LARGE ARTWORK PRESENTATION & ACQUISITION PLAQUE */}
      <section className="py-16 md:py-24 border-b border-canvas-border bg-canvas-subtle/30">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Artwork Image */}
            <div className="lg:col-span-7">
              {primaryArtwork && (
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-canvas-border bg-canvas shadow-xl">
                  <Image
                    src={primaryArtwork.coverImage.url}
                    alt={primaryArtwork.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-4 left-4 bg-charcoal/90 text-canvas backdrop-blur-xs text-[10px] uppercase tracking-gallery font-medium px-3 py-1 rounded-xs">
                    Collected • {order.collector.firstName} {order.collector.lastName}
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Plaque Details */}
            <div className="lg:col-span-5 space-y-6">
              {primaryArtwork && (
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-gallery text-accent font-semibold block">
                    Original Artwork
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-medium">
                    {primaryArtwork.title}
                  </h2>
                  <p className="text-sm text-charcoal-muted font-light">
                    {primaryArtwork.medium}, {primaryArtwork.year}
                  </p>
                  <p className="text-xs text-charcoal-muted">
                    {formatDimensionsWithInches(primaryArtwork.width, primaryArtwork.height).cm}
                  </p>
                </div>
              )}

              {/* Acquisition Details Summary */}
              <div className="p-5 bg-canvas border border-canvas-border rounded-sm space-y-3 text-xs">
                <div className="flex justify-between items-center text-charcoal-muted">
                  <span>Collector:</span>
                  <span className="font-medium text-charcoal">
                    {order.collector.firstName} {order.collector.lastName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-charcoal-muted">
                  <span>Acquisition Date:</span>
                  <span className="font-medium text-charcoal">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-charcoal-muted">
                  <span>Settlement Status:</span>
                  <span className="font-medium text-accent">Simulated Paid</span>
                </div>
                <div className="flex justify-between items-center text-charcoal-muted">
                  <span>Total Amount:</span>
                  <span className="font-serif text-lg font-medium text-charcoal">
                    {formatPrice(order.totalAmount, order.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-charcoal-muted">
                  <span>Delivery Destination:</span>
                  <span className="font-medium text-charcoal">
                    {order.shippingAddress.city}, {order.shippingAddress.country}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  href={`/account/orders/${order.id}`}
                  variant="primary"
                  size="md"
                  className="flex items-center justify-center gap-1.5"
                >
                  <span>Track Acquisition</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  href="/account/certificates"
                  variant="outline"
                  size="md"
                  className="flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Certificate of Authenticity</span>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. NEXT STEPS TIMELINE */}
      <section className="py-16 md:py-24 border-b border-canvas-border bg-canvas">
        <Container size="default">
          <div className="max-w-xl mx-auto text-center mb-16">
            <span className="text-xs uppercase tracking-gallery font-semibold text-accent block mb-2">
              Provenance & Preparation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light">
              What Happens Next
            </h2>
            <p className="text-xs text-charcoal-muted mt-2 font-light">
              Darey and the studio management ensure the highest preservation standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-canvas-subtle border border-canvas-border rounded-sm space-y-2">
              <span className="font-serif text-2xl text-accent font-light">01</span>
              <h3 className="font-serif text-lg text-charcoal font-medium">Studio Conditioning</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                The canvas undergoes final surface inspection, archival varnish verification, and photography archiving.
              </p>
            </div>

            <div className="p-6 bg-canvas-subtle border border-canvas-border rounded-sm space-y-2">
              <span className="font-serif text-2xl text-accent font-light">02</span>
              <h3 className="font-serif text-lg text-charcoal font-medium">Wax-Sealed Provenance</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                A physical Certificate of Authenticity is printed on heavyweight cotton rag and sealed with Darey’s wax stamp.
              </p>
            </div>

            <div className="p-6 bg-canvas-subtle border border-canvas-border rounded-sm space-y-2">
              <span className="font-serif text-2xl text-accent font-light">03</span>
              <h3 className="font-serif text-lg text-charcoal font-medium">Museum Crating</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                Secured within custom-built solid timber crates with vibration absorption and moisture barriers.
              </p>
            </div>

            <div className="p-6 bg-canvas-subtle border border-canvas-border rounded-sm space-y-2">
              <span className="font-serif text-2xl text-accent font-light">04</span>
              <h3 className="font-serif text-lg text-charcoal font-medium">Insured Delivery</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                Dispatched via specialized fine art transport with real-time tracking and white-glove uncrating handover.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. POST-PURCHASE COLLECTOR INVITATION (If guest checkout) */}
      {!isAuthenticated && (
        <section className="py-16 bg-canvas-subtle">
          <Container size="editorial" className="text-center space-y-4">
            <span className="text-xs uppercase tracking-gallery font-semibold text-accent block">
              Private Collection Space
            </span>
            <h2 className="font-serif text-3xl text-charcoal font-light">
              Create Your Collector Account
            </h2>
            <p className="text-sm text-charcoal-muted max-w-md mx-auto font-light leading-relaxed">
              Consolidate your acquired pieces, view high-resolution Certificates of Authenticity, and track future commissions in one private sanctuary.
            </p>
            <div className="pt-2">
              <Button href="/register" variant="primary" size="md">
                Register Collector Profile
              </Button>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
