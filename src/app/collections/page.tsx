'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Layers, Sparkles } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { CollectionCard } from '@/components/collection/CollectionCard';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { collectionService } from '@/services/collectionService';
import { artworkService } from '@/services/artworkService';
import { MOCK_COLLECTIONS } from '@/data/mockCollections';
import { MOCK_ARTWORKS } from '@/data/mockArtworks';
import { Collection } from '@/types/collection';
import { Artwork } from '@/types/artwork';
import { cn } from '@/lib/utils';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [allArtworks, setAllArtworks] = useState<Artwork[]>(MOCK_ARTWORKS);
  const [selectedCollectionSlug, setSelectedCollectionSlug] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [cols, works] = await Promise.all([
        collectionService.getAll(),
        artworkService.getAll(),
      ]);
      setCollections(cols);
      setAllArtworks(works);
    }
    loadData();
  }, []);

  // Filter artworks by selected collection
  const displayedArtworks = useMemo(() => {
    if (selectedCollectionSlug === 'all') {
      return allArtworks;
    }
    return allArtworks.filter(
      (artwork) => artwork.collection?.slug === selectedCollectionSlug
    );
  }, [allArtworks, selectedCollectionSlug]);

  const activeCollection = useMemo(() => {
    if (selectedCollectionSlug === 'all') return null;
    return collections.find((col) => col.slug === selectedCollectionSlug) || null;
  }, [collections, selectedCollectionSlug]);

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 bg-canvas">
      {/* Editorial Collections Hero */}
      <Section background="canvas" spacing="sm" className="border-b border-canvas-border pb-10">
        <Container size="wide">
          <div className="max-w-4xl">
            <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
              CURATORIAL ANTHOLOGY &bull; STUDIO ARCHIVE
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal font-normal leading-[1.1] sm:leading-[1.06] tracking-tight">
              The bodies
              <br />
              of work
            </h1>
            <p className="mt-6 font-sans text-base sm:text-lg text-charcoal-muted font-light leading-relaxed max-w-2xl">
              Distinct conceptual series developed in Darey&apos;s studio over multi-year cycles. Each body of work investigates specific tactile earth minerals, spiritual inquiries, and cultural memory.
            </p>
          </div>
        </Container>
      </Section>

      {/* Interactive Collection Filter Navigation */}
      <Section background="paper" spacing="sm" className="border-b border-canvas-border sticky top-16 sm:top-20 z-30 backdrop-blur-md bg-canvas-paper/90 py-4">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedCollectionSlug('all')}
                className={cn(
                  'px-4 py-2 text-xs uppercase tracking-gallery font-sans rounded-full border transition-all duration-300 whitespace-nowrap',
                  selectedCollectionSlug === 'all'
                    ? 'bg-charcoal text-canvas border-charcoal shadow-sm'
                    : 'bg-canvas text-charcoal-muted border-canvas-border hover:border-charcoal hover:text-charcoal'
                )}
              >
                All Works ({allArtworks.length})
              </button>

              {collections.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedCollectionSlug(col.slug)}
                  className={cn(
                    'px-4 py-2 text-xs uppercase tracking-gallery font-sans rounded-full border transition-all duration-300 whitespace-nowrap flex items-center gap-2',
                    selectedCollectionSlug === col.slug
                      ? 'bg-charcoal text-canvas border-charcoal shadow-sm'
                      : 'bg-canvas text-charcoal-muted border-canvas-border hover:border-charcoal hover:text-charcoal'
                  )}
                >
                  {col.accentColor && (
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: col.accentColor }}
                    />
                  )}
                  <span>{col.title}</span>
                </button>
              ))}
            </div>

            {/* Inventory Status Counter */}
            <div className="text-xs text-charcoal-subtle font-mono tracking-gallery shrink-0">
              Showing {displayedArtworks.length} of {allArtworks.length} Artworks
            </div>
          </div>
        </Container>
      </Section>

      {/* Active Collection Focus Banner (if filtered) */}
      {activeCollection && (
        <Section background="canvas" spacing="sm" className="border-b border-canvas-border py-8">
          <Container size="wide">
            <div className="p-6 sm:p-8 bg-canvas-subtle border border-canvas-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery block mb-1">
                  SERIES FOCUS &bull; {activeCollection.year}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-normal">
                  {activeCollection.title}
                </h2>
                <p className="font-serif italic text-base text-charcoal-muted mt-2">
                  &ldquo;{activeCollection.statement}&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-2 line-clamp-2">
                  {activeCollection.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  href={`/collections/${activeCollection.slug}`}
                  className="px-5 py-2.5 bg-canvas border border-canvas-border hover:border-charcoal rounded-xl text-xs uppercase tracking-gallery font-sans font-medium text-charcoal transition-colors shadow-sm"
                >
                  Collection Room &rarr;
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedCollectionSlug('all')}
                  className="text-xs text-charcoal-subtle underline hover:text-charcoal transition-colors uppercase tracking-gallery"
                >
                  View All Series
                </button>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Comprehensive Artwork Grid with Title & Date */}
      <Section background="canvas" spacing="lg">
        <Container size="wide">
          {isLoading ? (
            <div className="py-24 text-center">
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery animate-pulse">
                Unveiling artworks catalogue...
              </span>
            </div>
          ) : displayedArtworks.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto">
              <p className="font-serif italic text-lg text-charcoal-muted mb-4">
                No artworks catalogued under this series currently.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCollectionSlug('all')}
                className="text-xs uppercase tracking-gallery text-charcoal underline"
              >
                Reset to All Works
              </button>
            </div>
          ) : (
            <div>
              {/* Header introducing the grid */}
              <div className="flex items-center justify-between border-b border-canvas-border pb-4 mb-10">
                <div className="flex items-center gap-3">
                  <Layers className="h-4 w-4 text-charcoal-subtle" />
                  <span className="gallery-plaque text-xs text-charcoal uppercase tracking-gallery font-medium">
                    {selectedCollectionSlug === 'all'
                      ? 'Complete Catalogue of Artworks'
                      : `${activeCollection?.title} Series`}
                  </span>
                </div>
                <span className="text-xs font-mono text-charcoal-subtle">
                  {displayedArtworks.length} {displayedArtworks.length === 1 ? 'work' : 'works'}
                </span>
              </div>

              {/* Grid of Artworks - displaying image, title, and date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
                {displayedArtworks.map((artwork, idx) => (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                    variant="standard"
                    priority={idx < 4}
                  />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Curatorial Bodies of Work Overview Cards */}
      <Section background="paper" spacing="lg" className="border-t border-canvas-border">
        <Container size="wide">
          <div className="mb-10 max-w-2xl">
            <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-2">
              Curatorial Overview
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
              Explore by series
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light mt-2">
              Delve into the narrative background, material research, and thematic inquiries of each individual collection room.
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {collections.map((col, idx) => (
              <CollectionCard
                key={col.id}
                collection={col}
                priority={idx === 0}
                variant={idx === 0 ? 'featured' : 'standard'}
              />
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
