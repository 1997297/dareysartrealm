'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDimensionsWithInches } from '@/lib/utils';

export const CartDrawer: React.FC = () => {
  const { items, itemCount, subtotal, isCartOpen, closeCart, removeArtwork, isMounted } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            role="dialog"
            aria-modal="true"
            aria-label="Your Acquisition Selection"
            className="relative z-10 w-full max-w-md bg-canvas border-l border-canvas-border shadow-2xl flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-canvas-border flex items-center justify-between bg-canvas-subtle/50">
              <div>
                <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                  Private Acquisition
                </span>
                <h2 className="font-serif text-2xl text-charcoal font-medium">
                  Your Selection
                </h2>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-canvas-muted transition-colors"
                aria-label="Close selection drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {!isMounted || itemCount === 0 ? (
                /* Empty State */
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-canvas-subtle border border-canvas-border flex items-center justify-center mx-auto text-charcoal-muted">
                    <ShoppingBag className="w-7 h-7 stroke-1" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl text-charcoal font-light">
                      Your selection is empty.
                    </h3>
                    <p className="text-xs text-charcoal-muted max-w-xs mx-auto font-light leading-relaxed">
                      Original artworks acquired from the gallery are one-of-a-kind. Explore available pieces to begin your acquisition.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      href="/artworks"
                      onClick={closeCart}
                      variant="primary"
                      size="md"
                    >
                      Explore Available Artworks
                    </Button>
                  </div>
                </div>
              ) : (
                /* Items List */
                <div className="space-y-4 divide-y divide-canvas-border">
                  {items.map(({ artwork }) => (
                    <div key={artwork.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                      {/* Thumbnail */}
                      <Link
                        href={`/artworks/${artwork.slug}`}
                        onClick={closeCart}
                        className="relative w-24 h-28 bg-canvas-subtle border border-canvas-border rounded-xl overflow-hidden shrink-0 group"
                      >
                        <Image
                          src={artwork.coverImage.url}
                          alt={artwork.coverImage.alt || artwork.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Metadata */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/artworks/${artwork.slug}`}
                            onClick={closeCart}
                            className="font-serif text-lg text-charcoal hover:text-accent transition-colors truncate block"
                          >
                            {artwork.title}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeArtwork(artwork.id)}
                            className="text-charcoal-muted hover:text-red-600 transition-colors p-1"
                            title="Remove from selection"
                            aria-label={`Remove ${artwork.title} from selection`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-charcoal-muted truncate font-light">
                          {artwork.medium}
                        </p>
                        <p className="text-[11px] text-charcoal-muted/80">
                          {formatDimensionsWithInches(artwork.width, artwork.height).cm}
                        </p>

                        <div className="pt-2 flex items-center justify-between">
                          <span className="font-serif text-base font-medium text-charcoal">
                            {formatPrice(artwork.price || 0, artwork.currency)}
                          </span>
                          <span className="text-[10px] uppercase tracking-gallery px-2 py-0.5 bg-canvas-muted text-charcoal rounded-xs font-medium">
                            Unique Original
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & CTAs */}
            {isMounted && itemCount > 0 && (
              <div className="border-t border-canvas-border p-5 sm:p-6 bg-canvas-subtle/50 space-y-4 pb-safe">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-charcoal-muted uppercase tracking-gallery">
                    <span>Acquisition Subtotal</span>
                    <span className="font-serif text-xl font-medium text-charcoal">
                      {formatPrice(subtotal, items[0]?.artwork.currency || 'USD')}
                    </span>
                  </div>
                  <p className="text-[11px] text-charcoal-muted font-light leading-relaxed">
                    Custom crating, provenance certificate, and insured white-glove transport confirmed during checkout.
                  </p>
                </div>

                <div className="space-y-2 pt-1 pb-2">
                  <Button
                    href="/checkout"
                    onClick={closeCart}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center flex items-center gap-2"
                  >
                    <span>Proceed to Acquire</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <Button
                    href="/cart"
                    onClick={closeCart}
                    variant="outline"
                    size="md"
                    className="w-full justify-center"
                  >
                    View Full Selection
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
