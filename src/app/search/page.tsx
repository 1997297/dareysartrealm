'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, X, ArrowUpRight, Loader2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { ArtworkStatusBadge } from '@/components/artwork/ArtworkStatusBadge';
import { artworkService } from '@/services/artworkService';
import { collectionService } from '@/services/collectionService';
import { Artwork } from '@/types/artwork';
import { Collection } from '@/types/collection';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const hasSearched = query.trim().length > 0;
  const hasResults = artworks.length > 0 || collections.length > 0;

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 bg-canvas min-h-screen">
      {/* Search Hero */}
      <Section background="canvas" spacing="sm" className="border-b border-canvas-border pb-10">
        <Container size="wide">
          <div className="max-w-4xl">
            <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
              EXHIBITION SEARCH
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal tracking-tight uppercase leading-[0.95] mb-8">
              WHAT ARE YOU
              <br />
              LOOKING FOR?
            </h1>

            {/* Input Field */}
            <div className="relative flex items-center border-b-2 border-charcoal pb-3">
              <Search className="h-6 w-6 text-charcoal mr-4 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, medium, concept, collection..."
                className="w-full bg-transparent font-display text-2xl sm:text-3xl text-charcoal placeholder:text-charcoal-subtle/40 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1.5 text-charcoal-muted hover:text-charcoal transition-colors rounded-full"
                  aria-label="Clear search"
                >
                  <X className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Suggested Tags */}
            {!hasSearched && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-gallery text-charcoal-subtle mr-2 font-mono">
                  POPULAR QUERIES:
                </span>
                {['Echoes of Home', 'Human Stories', 'Gold Leaf', 'Harmattan', 'Atmospheric Currents', 'Impasto'].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3 py-1 bg-canvas-paper border border-canvas-border hover:border-charcoal text-xs text-charcoal rounded-sm transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Results Section */}
      <Section background="canvas" spacing="lg">
        <Container size="wide">
          {isSearching && (
            <div className="py-16 text-center flex items-center justify-center gap-2 text-charcoal-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="font-sans text-xs uppercase tracking-gallery">Searching the studio archive...</span>
            </div>
          )}

          {hasSearched && !isSearching && !hasResults && (
            <div className="py-20 text-center max-w-md mx-auto">
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
                NO CORRESPONDING WORKS
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-charcoal mb-4">
                NO WORKS FOUND FOR &ldquo;{query}&rdquo;
              </h2>
              <p className="font-sans text-sm text-charcoal-muted leading-relaxed font-light mb-8">
                Try searching for another medium, emotion, or collection title.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="px-6 py-2.5 bg-charcoal text-canvas text-xs uppercase tracking-gallery font-medium rounded-sm"
              >
                Clear Search Query
              </button>
            </div>
          )}

          {hasSearched && hasResults && (
            <div className="space-y-16">
              {/* Artworks Matches */}
              {artworks.length > 0 && (
                <div>
                  <div className="border-b border-canvas-border pb-4 mb-8 flex items-center justify-between text-xs font-sans tracking-gallery uppercase text-charcoal-subtle">
                    <span>ARTWORK RESULTS ({artworks.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                    {artworks.map((art) => (
                      <ArtworkCard key={art.id} artwork={art} variant="standard" />
                    ))}
                  </div>
                </div>
              )}

              {/* Collections Matches */}
              {collections.length > 0 && (
                <div>
                  <div className="border-b border-canvas-border pb-4 mb-8 flex items-center justify-between text-xs font-sans tracking-gallery uppercase text-charcoal-subtle">
                    <span>COLLECTION RESULTS ({collections.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.slug}`}
                        className="group flex gap-5 p-5 bg-canvas-paper border border-canvas-border hover:border-charcoal/40 transition-all rounded-sm"
                      >
                        <div className="relative h-28 w-32 flex-shrink-0 bg-canvas-muted overflow-hidden border border-canvas-border">
                          <Image
                            src={col.coverImage.url}
                            alt={col.title}
                            fill
                            sizes="128px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase block mb-1">
                              {col.subtitle || 'COLLECTION'} â€¢ {col.artworkCount} WORKS
                            </span>
                            <h3 className="font-display text-2xl text-charcoal group-hover:text-charcoal-muted truncate">
                              {col.title}
                            </h3>
                            <p className="font-serif italic text-xs text-charcoal-muted line-clamp-2 mt-1">
                              &ldquo;{col.statement}&rdquo;
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-charcoal uppercase tracking-gallery font-medium mt-3">
                            <span>Explore Series</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas pt-32 text-center">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
