'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { collectionService } from '@/services/collectionService';
import { Collection } from '@/types/collection';
import { Artwork } from '@/types/artwork';

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCollectionData() {
      setIsLoading(true);
      const col = await collectionService.getBySlug(slug);
      if (!col || (col.visibility && col.visibility !== 'published')) {
        setIsLoading(false);
        setCollection(null);
        return;
      }
      setCollection(col);
      const works = await collectionService.getArtworks(slug);
      setArtworks(works);
      setIsLoading(false);
    }
    if (slug) {
      loadCollectionData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas pt-36 text-center">
        <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery animate-pulse">
          Opening collection room...
        </span>
      </div>
    );
  }

  if (!collection) {
    return (
      <Section background="canvas" spacing="xl" className="min-h-[80vh] flex items-center justify-center pt-28">
        <Container size="narrow" className="text-center">
          <span className="gallery-plaque text-xs text-charcoal-subtle block mb-4">
            Collection record unlisted
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal mb-6">
            The series is unlisted.
          </h1>
          <p className="text-base text-charcoal-muted font-light leading-relaxed max-w-md mx-auto mb-10">
            The collection you are searching for is not currently in the open exhibition registry.
          </p>
          <Button href="/collections" variant="primary" size="lg">
            View All Collections
          </Button>
        </Container>
      </Section>
    );
  }

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 bg-canvas">
      {/* Back Link Breadcrumb */}
      <div className="border-b border-canvas-border py-4">
        <Container size="wide">
          <Link
            href="/collections"
            className="group inline-flex items-center gap-2 text-xs font-sans tracking-gallery uppercase text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Collections</span>
          </Link>
        </Container>
      </div>

      {/* Collection Hero Room */}
      <Section background="canvas" spacing="lg" className="border-b border-canvas-border">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left 6/12: Statement & Metadata */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery">
                  {collection.subtitle || 'BODY OF WORK'}
                </span>
                {collection.year && (
                  <>
                    <span className="text-canvas-border text-xs">â€¢</span>
                    <span className="font-sans text-xs text-charcoal-subtle tracking-gallery">
                      {collection.year}
                    </span>
                  </>
                )}
                <span className="text-canvas-border text-xs">â€¢</span>
                <span className="font-sans text-xs text-charcoal-subtle tracking-gallery">
                  {artworks.length} Works Catalogued
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal font-normal leading-[1.12] sm:leading-[1.08] tracking-tight">
                {collection.title}
              </h1>

              <blockquote className="font-serif italic text-xl sm:text-2xl text-charcoal font-light leading-relaxed border-l-2 border-charcoal/30 pl-6 my-6">
                &ldquo;{collection.statement}&rdquo;
              </blockquote>

              <p className="font-sans text-sm sm:text-base text-charcoal-muted leading-relaxed font-light">
                {collection.description}
              </p>

              {collection.accentColor && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs uppercase tracking-gallery text-charcoal-subtle">
                    Palette Accent:
                  </span>
                  <div
                    className="h-3 w-8 rounded-full border border-canvas-border"
                    style={{ backgroundColor: collection.accentColor }}
                  />
                </div>
              )}
            </div>

            {/* Right 6/12: Hero Imagery */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-canvas-paper border border-canvas-border/80 shadow-gallery rounded-2xl">
                <Image
                  src={collection.coverImage.url}
                  alt={collection.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Artworks Belonging to this Collection */}
      <Section background="canvas" spacing="xl">
        <Container size="wide">
          <div className="border-b border-canvas-border pb-6 mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-2">
                Collection Inventory
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
                Works in this series
              </h2>
            </div>
            <Link
              href="/artworks"
              className="text-xs uppercase tracking-gallery font-sans text-charcoal-muted hover:text-charcoal transition-colors underline underline-offset-4"
            >
              Browse All Artworks
            </Link>
          </div>

          {artworks.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <p className="font-serif italic text-lg text-charcoal-muted mb-6">
                Artworks from this series are currently in curatorial transition.
              </p>
              <Button href="/artworks" variant="primary" size="md">
                View Available Artworks
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} variant="standard" />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}
