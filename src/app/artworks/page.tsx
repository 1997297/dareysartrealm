'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, LayoutGrid, Grid2X2, X } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { FilterDrawer } from '@/components/artwork/FilterDrawer';
import { artworkService } from '@/services/artworkService';
import { INITIAL_APPROVED_ARTWORKS } from '@/data/initialContent';
import { Artwork, ArtworkFilters, ArtworkStatus } from '@/types/artwork';
import { cn } from '@/lib/utils';

function ArtworksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [allArtworks, setAllArtworks] = useState<Artwork[]>(INITIAL_APPROVED_ARTWORKS);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>(INITIAL_APPROVED_ARTWORKS);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'editorial' | 'grid'>('editorial');

  // Load view mode preference from localStorage
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('artrealm_view_mode') as 'editorial' | 'grid';
      if (savedMode === 'editorial' || savedMode === 'grid') {
        setViewMode(savedMode);
      }
    } catch {}
  }, []);

  const handleViewModeChange = (mode: 'editorial' | 'grid') => {
    setViewMode(mode);
    try {
      localStorage.setItem('artrealm_view_mode', mode);
    } catch {}
  };

  // Filter state
  const [filters, setFilters] = useState<ArtworkFilters>({
    status: (searchParams.get('status') as ArtworkStatus) || 'all',
    collectionSlug: searchParams.get('collection') || 'all',
    medium: searchParams.get('medium') || 'all',
    orientation: 'all',
    size: 'all',
    sortBy: 'curated',
  });

  // Load artworks on mount
  useEffect(() => {
    async function loadData() {
      const works = await artworkService.getAll();
      setAllArtworks(
        works.filter((w) => w.publicationStatus === 'published' || !w.publicationStatus)
      );
    }
    loadData();
  }, []);

  // Re-run filtering when filters change
  useEffect(() => {
    async function applyFilters() {
      const res = await artworkService.filter(filters);
      setFilteredArtworks(res);
    }
    applyFilters();
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.collectionSlug && filters.collectionSlug !== 'all') count++;
    if (filters.medium && filters.medium !== 'all') count++;
    if (filters.orientation && filters.orientation !== 'all') count++;
    if (filters.size && filters.size !== 'all') count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      collectionSlug: 'all',
      medium: 'all',
      orientation: 'all',
      size: 'all',
      sortBy: 'curated',
    });
    router.replace('/artworks');
  };

  // Availability stats
  const availableCount = allArtworks.filter((a) => a.status === 'available').length;
  const reservedCount = allArtworks.filter((a) => a.status === 'reserved').length;
  const collectedCount = allArtworks.filter((a) => a.status === 'sold').length;

  return (
    <div className="pt-24 sm:pt-28 md:pt-32">
      {/* Catalogue Hero & Statement */}
      <Section background="canvas" spacing="sm" className="border-b border-canvas-border pb-10">
        <Container size="wide">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
                Main Exhibition Catalogue
              </span>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-charcoal font-normal leading-[1.1] tracking-tight">
                The
                <br />
                Artworks
              </h1>
              <p className="mt-6 font-sans text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
                Original paintings, mixed-media studies and commissioned archives from Darey&apos;s Artrealm.
              </p>
            </div>

            {/* Curatorial Availability Summary Line */}
            <div className="flex flex-col items-start lg:items-end gap-1.5 text-xs text-charcoal-muted font-sans border-l lg:border-l-0 lg:border-r border-canvas-border pl-4 lg:pl-0 lg:pr-4">
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery">
                Exhibition Census
              </span>
              <p className="tracking-wide">
                <strong className="text-charcoal font-medium">{allArtworks.length}</strong> catalogued pieces
                {' · '}
                <strong className="text-charcoal font-medium">{availableCount}</strong> available
                {' · '}
                <strong className="text-charcoal font-medium">{reservedCount}</strong> reserved
                {' · '}
                <strong className="text-charcoal font-medium">{collectedCount}</strong> collected
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Discovery Toolbar: Quick Filters, Filter Drawer Trigger, View Mode & Sort */}
      <section className="sticky top-[69px] md:top-[85px] z-30 bg-canvas/95 backdrop-blur-md border-b border-canvas-border py-4">
        <Container size="wide">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Quick Status Filters */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {(
                [
                  { label: 'ALL', value: 'all' },
                  { label: 'AVAILABLE', value: 'available' },
                  { label: 'RESERVED', value: 'reserved' },
                  { label: 'COLLECTED', value: 'sold' },
                  { label: 'COMMISSIONED', value: 'commissioned' },
                ] as const
              ).map((tab) => {
                const isActive = (filters.status || 'all') === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setFilters({ ...filters, status: tab.value })}
                    className={cn(
                      'px-3 sm:px-4 py-1.5 text-xs font-sans tracking-gallery uppercase rounded-sm transition-all whitespace-nowrap',
                      isActive
                        ? 'bg-charcoal text-canvas font-medium shadow-sm'
                        : 'bg-transparent text-charcoal-muted hover:text-charcoal hover:bg-canvas-muted'
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Controls: Filter Button, Sort Selector, and View Mode Toggle */}
            <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
              {/* Filter Drawer Trigger */}
              <button
                type="button"
                onClick={() => setFilterDrawerOpen(true)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-1.5 border text-xs font-sans tracking-gallery uppercase rounded-sm transition-all',
                  activeFilterCount > 0
                    ? 'border-charcoal bg-charcoal text-canvas'
                    : 'border-canvas-border hover:border-charcoal text-charcoal bg-canvas'
                )}
                aria-label="Open advanced filter drawer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filter</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-canvas text-charcoal text-[0.625rem] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs text-charcoal-muted font-sans">
                <span className="hidden sm:inline-block uppercase tracking-gallery">Sort:</span>
                <select
                  value={filters.sortBy || 'curated'}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value as ArtworkFilters['sortBy'] })
                  }
                  className="bg-canvas border border-canvas-border px-2.5 py-1.5 text-xs text-charcoal rounded-sm focus:border-charcoal focus:outline-none uppercase tracking-gallery"
                >
                  <option value="curated">Curated</option>
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="title-asc">Title: A – Z</option>
                  <option value="size-desc">Scale: Largest</option>
                </select>
              </div>

              {/* View Mode Toggle: Curated Wall vs Balanced Grid */}
              <div className="hidden sm:flex items-center border border-canvas-border rounded-sm p-0.5 bg-canvas">
                <button
                  type="button"
                  onClick={() => handleViewModeChange('editorial')}
                  className={cn(
                    'p-1.5 rounded-sm transition-colors',
                    viewMode === 'editorial' ? 'bg-charcoal text-canvas' : 'text-charcoal-muted hover:text-charcoal'
                  )}
                  title="Curated Wall (Art-Directed Gallery Rhythm)"
                  aria-label="Curated Wall"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleViewModeChange('grid')}
                  className={cn(
                    'p-1.5 rounded-sm transition-colors',
                    viewMode === 'grid' ? 'bg-charcoal text-canvas' : 'text-charcoal-muted hover:text-charcoal'
                  )}
                  title="Balanced Grid (Uniform Discovery Grid)"
                  aria-label="Balanced Grid"
                >
                  <Grid2X2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 pt-3 flex-wrap text-xs">
              <span className="text-charcoal-subtle uppercase tracking-gallery text-[0.6875rem]">Active:</span>
              {filters.status && filters.status !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-canvas-paper border border-canvas-border text-charcoal rounded-sm">
                  Status: {filters.status.toUpperCase()}
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, status: 'all' })}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.medium && filters.medium !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-canvas-paper border border-canvas-border text-charcoal rounded-sm">
                  Medium: {filters.medium}
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, medium: 'all' })}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.collectionSlug && filters.collectionSlug !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-canvas-paper border border-canvas-border text-charcoal rounded-sm">
                  Collection: {filters.collectionSlug}
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, collectionSlug: 'all' })}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.orientation && filters.orientation !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-canvas-paper border border-canvas-border text-charcoal rounded-sm">
                  Orientation: {filters.orientation}
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, orientation: 'all' })}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.size && filters.size !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-canvas-paper border border-canvas-border text-charcoal rounded-sm">
                  Scale: {filters.size}
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, size: 'all' })}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-charcoal underline underline-offset-4 hover:text-charcoal-muted ml-2 uppercase tracking-gallery"
              >
                Clear All
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Main Artwork Gallery Exhibition */}
      <Section background="canvas" spacing="lg">
        <Container size="wide">
          {allArtworks.length === 0 ? (
            /* Curatorial Empty State when database has 0 published artworks */
            <div className="py-24 text-center max-w-lg mx-auto border border-dashed border-canvas-border p-12 rounded-2xl">
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
                Studio Practice &bull; In Preparation
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-charcoal mb-4">
                The walls are being curated.
              </h3>
              <p className="font-sans text-sm text-charcoal-muted leading-relaxed font-light mb-8">
                New original artworks are currently being prepared in Darey&apos;s studio. In the meantime, you may explore bespoke private commissions or contact the studio directly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button href="/commission" variant="primary" size="md">
                  Create a Piece
                </Button>
                <Button href="/contact" variant="outline" size="md">
                  Contact Studio
                </Button>
              </div>
            </div>
          ) : filteredArtworks.length === 0 ? (
            /* Empty Filter Results State */
            <div className="py-20 text-center max-w-lg mx-auto">
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
                Catalogue Search
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-charcoal mb-4">
                Nothing in the Artrealm matched that search.
              </h3>
              <p className="font-sans text-sm text-charcoal-muted leading-relaxed font-light mb-8">
                Try loosening your filters or resetting the exhibition criteria to view the full body of work.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-3 bg-charcoal text-canvas text-xs uppercase tracking-gallery font-medium hover:bg-charcoal-muted transition-colors rounded-full"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'editorial' ? (
            /* Curated Gallery Wall: Refined responsive grid respecting natural proportions & gallery rhythm */
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start">
              {filteredArtworks.map((artwork, idx) => {
                // Optional curatorial spotlight: Piece of the Month gets a 2-col span on medium/large screens
                const isSpotlight = Boolean(artwork.isPieceOfTheMonth && idx === 0);
                const colSpanClass = isSpotlight
                  ? 'col-span-1 min-[360px]:col-span-2 md:col-span-2'
                  : 'col-span-1';

                return (
                  <div key={artwork.id} className={colSpanClass}>
                    <ArtworkCard
                      artwork={artwork}
                      variant={isSpotlight ? 'editorial' : 'standard'}
                      priority={idx < 4}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            /* Balanced Discovery Grid: Uniform multi-column gallery layout */
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start">
              {filteredArtworks.map((artwork, idx) => (
                <div key={artwork.id} className="col-span-1">
                  <ArtworkCard
                    artwork={artwork}
                    variant="grid"
                    priority={idx < 4}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Curatorial Dialogue & Bespoke Commission CTA Section */}
          <div className="mt-20 pt-16 border-t border-canvas-border text-center max-w-2xl mx-auto">
            <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
              Bespoke Portfolios &bull; Studio Inquiries
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-charcoal mb-4">
              Seeking a bespoke commission?
            </h3>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed font-light mb-8">
              Collaborate directly with Darey to create a monumental canvas or site-specific artwork tailored to your collection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/commission" variant="primary" size="md">
                Create a Piece
              </Button>
              <Button href="/contact" variant="outline" size="md">
                Contact Studio
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Advanced Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        filters={filters}
        onFilterChange={setFilters}
        onClose={() => setFilterDrawerOpen(false)}
        onReset={handleResetFilters}
        totalResultsCount={filteredArtworks.length}
      />
    </div>
  );
}

export default function ArtworksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas pt-32 text-center">Loading exhibition...</div>}>
      <ArtworksContent />
    </Suspense>
  );
}
