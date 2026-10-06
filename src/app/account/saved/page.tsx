'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, ArrowRight, Trash2, Eye } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { useSavedArtworks } from '@/hooks/useSavedArtworks';
import { useCart } from '@/contexts/CartContext';
import { artworkService } from '@/services/artworkService';
import { Artwork } from '@/types/artwork';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDimensionsWithInches } from '@/lib/utils';

export default function AccountSavedPage() {
  const { savedSlugs, unsaveArtwork, isMounted } = useSavedArtworks();
  const { addArtwork, isInCart } = useCart();

  const [savedArtworks, setSavedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      setIsLoading(true);
      const all = await artworkService.getAll();
      const matched = all.filter((art) => savedSlugs.includes(art.slug));
      setSavedArtworks(matched);
      setIsLoading(false);
    }

    if (isMounted) {
      loadSaved();
    }
  }, [savedSlugs, isMounted]);

  return (
    <AccountShell
      title="Saved Artworks"
      subtitle="Pieces you have curated for future acquisition, contemplation, or spatial consideration."
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
          </div>
        ) : savedArtworks.length === 0 ? (
          <div className="p-12 text-center bg-canvas-subtle border border-canvas-border rounded-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-canvas border border-canvas-border flex items-center justify-center mx-auto text-charcoal-muted">
              <Bookmark className="w-6 h-6 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal font-light">
              Your collection starts here.
            </h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto font-light leading-relaxed">
              Bookmark pieces in the public gallery catalogue to keep them within your private sanctuary.
            </p>
            <div className="pt-2">
              <Button href="/artworks" variant="primary" size="md">
                Explore Artworks
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {savedArtworks.map((artwork) => (
              <div
                key={artwork.id}
                className="group p-5 bg-canvas border border-canvas-border rounded-sm hover:border-charcoal/40 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <Link
                    href={`/artworks/${artwork.slug}`}
                    className="relative aspect-[4/3] rounded-xs overflow-hidden bg-canvas-subtle border border-canvas-border block"
                  >
                    <Image
                      src={artwork.coverImage.url}
                      alt={artwork.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 text-[10px] uppercase tracking-gallery px-2 py-0.5 bg-canvas/90 backdrop-blur-xs text-charcoal rounded-xs font-semibold">
                      {artwork.status}
                    </span>
                  </Link>

                  <div className="space-y-1">
                    <Link
                      href={`/artworks/${artwork.slug}`}
                      className="font-serif text-xl text-charcoal hover:text-accent transition-colors font-medium block truncate"
                    >
                      {artwork.title}
                    </Link>
                    <p className="text-xs text-charcoal-muted truncate font-light">
                      {artwork.medium}, {artwork.year}
                    </p>
                    <p className="text-[11px] text-charcoal-muted/80">
                      {formatDimensionsWithInches(artwork.width, artwork.height).cm}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-canvas-border flex items-center justify-between">
                  <span className="font-serif text-lg font-medium text-charcoal">
                    {formatPrice(artwork.price || 0, artwork.currency)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => unsaveArtwork(artwork.slug)}
                      className="text-xs text-charcoal-muted hover:text-red-600 transition-colors p-1.5"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {artwork.status === 'available' ? (
                      <Button
                        onClick={() => addArtwork(artwork)}
                        variant="primary"
                        size="sm"
                      >
                        {isInCart(artwork.id) ? 'In Selection' : 'Acquire'}
                      </Button>
                    ) : (
                      <Button
                        href={`/artworks/${artwork.slug}`}
                        variant="outline"
                        size="sm"
                      >
                        View Piece
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountShell>
  );
}
