'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, formatDimensionsWithInches } from '@/lib/utils';

export default function CartPage() {
  const { items, itemCount, subtotal, removeArtwork, clearCart, isMounted } = useCart();

  if (!isMounted) {
    return (
      <Section background="canvas" spacing="xl" className="min-h-[75vh] flex items-center justify-center pt-32">
        <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
      </Section>
    );
  }

  return (
    <div className="min-h-screen bg-canvas pt-28 pb-20">
      <Container size="wide">
        {/* Breadcrumb / Return */}
        <div className="mb-8">
          <Link
            href="/artworks"
            className="inline-flex items-center gap-2 text-xs font-medium text-charcoal-muted hover:text-charcoal transition-colors tracking-wide"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Artwork Catalogue</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="border-b border-canvas-border pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-2">
              ACQUISITION SELECTION
            </span>
            <h1 className="font-display text-4xl sm:text-5xl text-charcoal font-normal tracking-tight">
              Selected Works
            </h1>
          </div>
          {itemCount > 0 && (
            <div className="flex items-center gap-4">
              <span className="text-xs text-charcoal-muted">
                {itemCount} {itemCount === 1 ? 'original piece' : 'original pieces'}
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-charcoal-muted hover:text-rose-600 transition-colors underline underline-offset-4"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>

        {itemCount === 0 ? (
          /* Empty State */
          <div className="py-20 text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-canvas-subtle border border-canvas-border flex items-center justify-center mx-auto text-charcoal-muted shadow-subtle">
              <ShoppingBag className="w-8 h-8 stroke-1" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-3xl text-charcoal font-normal">
                Your selection is currently empty
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
                All original artworks created by Darey are one-of-a-kind originals. Explore available works in the catalogue to curate your acquisition.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Button href="/artworks" variant="primary" size="md">
                Explore Available Works
              </Button>
              <Button href="/commission" variant="secondary" size="md">
                Bespoke Commission
              </Button>
            </div>
          </div>
        ) : (
          /* Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Artwork Line Items */}
            <div className="lg:col-span-8 space-y-6">
              {items.map(({ artwork }) => (
                <div
                  key={artwork.id}
                  className="p-5 sm:p-6 bg-canvas border border-canvas-border shadow-subtle flex flex-col sm:flex-row gap-6 items-start transition-all hover:border-canvas-border/80"
                >
                  {/* Artwork Image */}
                  <Link
                    href={`/artworks/${artwork.slug}`}
                    className="relative w-full sm:w-44 h-48 sm:h-44 bg-canvas-muted rounded-none overflow-hidden shrink-0 group"
                  >
                    <Image
                      src={artwork.coverImage.url}
                      alt={artwork.coverImage.alt || artwork.title}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Artwork Details */}
                  <div className="flex-1 flex flex-col justify-between h-full w-full space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-1">
                            {artwork.year} &bull; {artwork.medium}
                          </span>
                          <Link
                            href={`/artworks/${artwork.slug}`}
                            className="font-display text-2xl text-charcoal hover:text-charcoal-muted transition-colors font-medium leading-tight"
                          >
                            {artwork.title}
                          </Link>
                        </div>
                        <p className="font-sans text-lg font-medium text-charcoal shrink-0">
                          {artwork.isPriceOnRequest || !artwork.price
                            ? 'Price on Request'
                            : formatPrice(artwork.price, artwork.currency)}
                        </p>
                      </div>

                      <p className="text-xs text-charcoal-muted mt-2">
                        Dimensions: {formatDimensionsWithInches(artwork.width, artwork.height, artwork.depth).cm} ({formatDimensionsWithInches(artwork.width, artwork.height, artwork.depth).inches})
                      </p>

                      <div className="mt-3 flex items-center gap-2 text-[0.6875rem] text-charcoal-subtle">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Original 1-of-1 Canvas &bull; Physical Certificate Included</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-canvas-border/60 flex items-center justify-between text-xs">
                      <Link
                        href={`/artworks/${artwork.slug}`}
                        className="text-charcoal-muted hover:text-charcoal transition-colors underline underline-offset-4"
                      >
                        View Exhibition Details
                      </Link>

                      <button
                        type="button"
                        onClick={() => removeArtwork(artwork.id)}
                        className="inline-flex items-center gap-1.5 text-charcoal-subtle hover:text-rose-600 transition-colors"
                        aria-label={`Remove ${artwork.title} from selection`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Guarantees Box */}
              <div className="p-6 bg-canvas-subtle border border-canvas-border space-y-4 text-xs text-charcoal-muted">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-charcoal shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-sm text-charcoal font-medium">
                      Authenticity &amp; Archival Guarantee
                    </h4>
                    <p className="font-light leading-relaxed mt-0.5">
                      Each original artwork includes a physical, signed Certificate of Authenticity with archival verification code and provenance registration in the studio ledger.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Acquisition Summary */}
            <div className="lg:col-span-4 sticky top-32">
              <div className="p-6 sm:p-8 bg-canvas-subtle border border-canvas-border shadow-subtle space-y-6">
                <div>
                  <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-1">
                    ORDER SUMMARY
                  </span>
                  <h3 className="font-display text-2xl text-charcoal font-medium">
                    Acquisition Total
                  </h3>
                </div>

                <div className="space-y-3 pt-4 border-t border-canvas-border text-xs">
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Artworks Subtotal</span>
                    <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Fine Art Insurance</span>
                    <span className="text-emerald-700 font-medium">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-charcoal-muted">
                    <span>Courier Delivery</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-canvas-border flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-charcoal-subtle block">Estimated Total</span>
                    <span className="font-display text-2xl sm:text-3xl font-medium text-charcoal">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <span className="text-[0.6875rem] text-charcoal-muted">USD</span>
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    href="/checkout"
                    variant="primary"
                    size="lg"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Acquisition</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <p className="text-[0.6875rem] text-center text-charcoal-subtle font-light">
                    Protected checkout with secure escrow and fine-art delivery arrangements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
