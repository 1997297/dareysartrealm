'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ArrowUpRight, Loader2 } from 'lucide-react';
import { artworkService } from '@/services/artworkService';
import { collectionService } from '@/services/collectionService';
import { Artwork } from '@/types/artwork';
import { Collection } from '@/types/collection';
import { ArtworkStatusBadge } from '@/components/artwork/ArtworkStatusBadge';
import { formatPrice } from '@/lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus and lock scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setArtworks([]);
      setCollections([]);
    }
  }, [isOpen, onClose]);

  // Execute search as query updates
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setArtworks([]);
      setCollections([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const [artRes, colRes] = await Promise.all([
        artworkService.search(trimmed),
        collectionService.search(trimmed),
      ]);
      setArtworks(artRes);
      setCollections(colRes);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const hasSearched = query.trim().length > 0;
  const hasResults = artworks.length > 0 || collections.length > 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search the Artrealm"
      className="fixed inset-0 z-50 flex flex-col bg-canvas/98 backdrop-blur-xl animate-in fade-in duration-300"
    >
      {/* Search Header Bar */}
      <div className="w-full max-w-5xl mx-auto px-6 py-6 sm:py-8 flex items-center justify-between border-b border-canvas-border">
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-charcoal flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks, collections, mediums..."
            className="w-full bg-transparent font-display text-2xl sm:text-3xl md:text-4xl text-charcoal placeholder:text-charcoal-subtle/50 focus:outline-none tracking-tight"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1.5 text-charcoal-muted hover:text-charcoal transition-colors rounded-full"
              aria-label="Clear search input"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="ml-4 p-2.5 text-charcoal hover:text-charcoal-muted transition-colors rounded-full hover:bg-canvas-muted"
          aria-label="Close search"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Results / Suggestion Body */}
      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto px-6 py-8">
        {isSearching && (
          <div className="py-12 flex items-center justify-center text-charcoal-muted gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-sans text-xs uppercase tracking-gallery">
              Exploring the collection...
            </span>
          </div>
        )}

        {!hasSearched && (
          <div className="py-10 max-w-xl">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery block mb-3">
              SUGGESTED EXPLORATIONS
            </span>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Echoes of Home', 'Human Stories', 'Gold Leaf', 'Harmattan', 'Oil', 'Atmospheric Currents', 'Impasto'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 bg-canvas border border-canvas-border hover:border-charcoal text-xs text-charcoal rounded-full transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
            <p className="font-sans text-xs text-charcoal-muted font-light leading-relaxed">
              Search by title, medium, series, concept, or emotional theme. Press <kbd className="px-1.5 py-0.5 bg-canvas-muted rounded text-[0.625rem] border border-canvas-border">Esc</kbd> anytime to exit.
            </p>
          </div>
        )}

        {hasSearched && !isSearching && !hasResults && (
          <div className="py-16 text-center max-w-md mx-auto">
            <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
              NO MATCHES
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-charcoal mb-4">
              NO WORKS FOUND FOR &ldquo;{query}&rdquo;
            </h3>
            <p className="font-sans text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light mb-6">
              Nothing in the exhibition catalogue directly matched that term. Try searching for &ldquo;Oil&rdquo;, &ldquo;Gold Leaf&rdquo;, or &ldquo;Human Stories&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs uppercase tracking-gallery text-charcoal underline underline-offset-4 hover:text-charcoal-muted"
            >
              Clear Search
            </button>
          </div>
        )}

        {hasSearched && hasResults && (
          <div className="space-y-12 pb-12">
            {/* Artworks Matches */}
            {artworks.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-canvas-border pb-3 mb-6">
                  <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery">
                    ARTWORKS ({artworks.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {artworks.map((art) => (
                    <Link
                      key={art.id}
                      href={`/artworks/${art.slug}`}
                      onClick={onClose}
                      className="group flex gap-4 items-center p-3 bg-canvas hover:bg-canvas-paper border border-canvas-border hover:border-charcoal/40 transition-all rounded-xl"
                    >
                      <div className="relative h-20 w-16 flex-shrink-0 bg-canvas-muted overflow-hidden border border-canvas-border rounded-lg">
                        <Image
                          src={art.coverImage.url}
                          alt={art.title}
                          fill
                          sizes="80px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <ArtworkStatusBadge status={art.status} className="text-[0.5625rem] px-1.5 py-0.5" />
                        </div>
                        <h4 className="font-display text-base text-charcoal group-hover:text-charcoal-muted truncate">
                          {art.title}
                        </h4>
                        <p className="font-sans text-xs text-charcoal-muted truncate font-light">
                          {art.medium}
                        </p>
                        {art.price && art.status === 'available' && (
                          <span className="font-sans text-xs text-charcoal font-medium block mt-1">
                            {formatPrice(art.price, art.currency)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Collections Matches */}
            {collections.length > 0 && (
              <section>
                <div className="flex items-center justify-between border-b border-canvas-border pb-3 mb-6">
                  <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery">
                    COLLECTIONS ({collections.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {collections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.slug}`}
                      onClick={onClose}
                      className="group flex gap-4 items-center p-4 bg-canvas hover:bg-canvas-paper border border-canvas-border hover:border-charcoal/40 transition-all rounded-xl"
                    >
                      <div className="relative h-24 w-28 flex-shrink-0 bg-canvas-muted overflow-hidden border border-canvas-border rounded-lg">
                        <Image
                          src={col.coverImage.url}
                          alt={col.title}
                          fill
                          sizes="120px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="gallery-plaque text-[0.5625rem] text-charcoal-subtle uppercase block mb-1">
                          {col.subtitle || 'COLLECTION'} â€¢ {col.artworkCount} WORKS
                        </span>
                        <h4 className="font-display text-xl text-charcoal group-hover:text-charcoal-muted truncate">
                          {col.title}
                        </h4>
                        <p className="font-serif italic text-xs text-charcoal-muted line-clamp-2 mt-1">
                          &ldquo;{col.statement}&rdquo;
                        </p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-charcoal-muted group-hover:text-charcoal transition-colors ml-auto flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
