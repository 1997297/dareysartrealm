'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  ArrowLeft,
  Maximize2,
  Bookmark,
  Share2,
  Check,
  Eye,
  Sparkles,
  ArrowRight,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ArtworkStatusBadge } from '@/components/artwork/ArtworkStatusBadge';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { ArtworkViewer } from '@/components/artwork/ArtworkViewer';
import { ViewInSpaceModal } from '@/components/artwork/ViewInSpaceModal';
import { ArtworkEnquiryModal } from '@/components/artwork/ArtworkEnquiryModal';
import { InterestListModal } from '@/components/artwork/InterestListModal';
import { QuickInterestModal } from '@/components/artwork/QuickInterestModal';
import { artworkService } from '@/services/artworkService';
import { Artwork } from '@/types/artwork';
import { useSavedArtworks } from '@/hooks/useSavedArtworks';
import { formatDimensionsWithInches, formatPrice, cn } from '@/lib/utils';

export default function ArtworkDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [relatedArtworks, setRelatedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Modals state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerInitialIndex, setViewerInitialIndex] = useState(0);
  const [viewInSpaceOpen, setViewInSpaceOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [interestListOpen, setInterestListOpen] = useState(false);
  const [quickInterestOpen, setQuickInterestOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Saved persistence hook
  const { isSaved, toggleSave, isMounted } = useSavedArtworks();
  const saved = isMounted && artwork ? isSaved(artwork.slug) : false;

  useEffect(() => {
    async function loadArtworkData() {
      setIsLoading(true);
      const data = await artworkService.getBySlug(slug);
      if (!data) {
        setIsLoading(false);
        setArtwork(null);
        return;
      }
      setArtwork(data);
      const related = await artworkService.getRelated(data.id, 3);
      setRelatedArtworks(related);
      setIsLoading(false);
    }
    if (slug) {
      loadArtworkData();
    }
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const openViewerAt = (index: number) => {
    setViewerInitialIndex(index);
    setViewerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas pt-36 text-center">
        <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery animate-pulse">
          Preparing exhibition room...
        </span>
      </div>
    );
  }

  if (!artwork) {
    return (
      <Section background="canvas" spacing="xl" className="min-h-[80vh] flex items-center justify-center pt-28">
        <Container size="narrow" className="text-center">
          <span className="gallery-plaque text-xs text-charcoal-subtle block mb-4">
            Catalogue record unlisted
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal mb-6">
            The canvas is unlisted.
          </h1>
          <p className="text-base text-charcoal-muted font-light leading-relaxed max-w-md mx-auto mb-10">
            The artwork you requested could not be located in Darey&apos;s current exhibition catalogue.
          </p>
          <Button href="/artworks" variant="primary" size="lg">
            Return to Catalogue
          </Button>
        </Container>
      </Section>
    );
  }

  const dimensions = formatDimensionsWithInches(artwork.width, artwork.height, artwork.depth);
  const galleryImages = artwork.images && artwork.images.length > 0 ? artwork.images : [artwork.coverImage];

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 bg-canvas">
      {/* Top Breadcrumb Navigation & Share / Save Utilities */}
      <div className="border-b border-canvas-border py-4">
        <Container size="wide">
          <div className="flex items-center justify-between text-xs font-sans tracking-gallery uppercase text-charcoal-muted">
            <Link
              href="/artworks"
              className="group inline-flex items-center gap-2 hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Catalogue</span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Share button */}
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 hover:text-charcoal transition-colors"
                title="Copy artwork link"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>

              {/* Bookmark Save button */}
              <button
                type="button"
                onClick={() => toggleSave(artwork.slug)}
                className={cn(
                  'inline-flex items-center gap-1.5 transition-colors',
                  saved ? 'text-charcoal font-medium' : 'hover:text-charcoal'
                )}
                title={saved ? 'Remove from saved' : 'Save artwork'}
              >
                <Bookmark className={cn('h-3.5 w-3.5', saved && 'fill-charcoal')} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Art-First Exhibition Hero: Commanding Painting Display */}
      <section className="py-8 sm:py-12 lg:py-16 bg-canvas border-b border-canvas-border">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left 7/12: Complete, Uncropped Artwork Canvas */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div
                className="group relative w-full flex items-center justify-center p-4 sm:p-8 bg-canvas-paper border border-canvas-border/80 shadow-gallery rounded-2xl cursor-zoom-in"
                onClick={() => openViewerAt(selectedImageIndex)}
                title="Click to inspect in fullscreen"
              >
                {/* Status Badge in Corner */}
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <ArtworkStatusBadge status={artwork.status} />
                </div>

                {/* Fullscreen Trigger Overlay Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openViewerAt(selectedImageIndex);
                  }}
                  className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-canvas/80 backdrop-blur-md text-charcoal hover:bg-canvas transition-all shadow-sm border border-canvas-border"
                  title="Inspect Fullscreen"
                  aria-label="Inspect Fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>

                {/* Primary Artwork Image with object-contain to strictly prevent cropping */}
                <div className="relative max-h-[75vh] w-full flex items-center justify-center">
                  <Image
                    src={galleryImages[selectedImageIndex]?.url || artwork.coverImage.url}
                    alt={galleryImages[selectedImageIndex]?.alt || artwork.title}
                    width={galleryImages[selectedImageIndex]?.width || 1400}
                    height={galleryImages[selectedImageIndex]?.height || 1800}
                    priority
                    className="max-h-[72vh] w-auto h-auto object-contain mx-auto transition-transform duration-700 group-hover:scale-[1.015]"
                  />
                </div>

                {/* Subtitle Prompt Bar */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-1.5 px-3 py-1 bg-charcoal/80 text-canvas text-[0.625rem] tracking-gallery uppercase rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-3 w-3" />
                  <span>Click image to inspect in full resolution</span>
                </div>
              </div>

              {/* Multiple Gallery Image Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="mt-4 flex items-center gap-3 overflow-x-auto max-w-full pb-2 scrollbar-none">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={cn(
                        'relative h-16 w-20 flex-shrink-0 overflow-hidden border rounded-lg transition-all',
                        selectedImageIndex === idx
                          ? 'border-charcoal ring-2 ring-charcoal/20 opacity-100'
                          : 'border-canvas-border opacity-60 hover:opacity-100'
                      )}
                      aria-label={`Switch to image view ${idx + 1}`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || `View ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right 5/12: Gallery Plaque Metadata & Status-Specific Actions */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              {/* Plaque Heading */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[0.6875rem] text-charcoal-subtle uppercase tracking-wider">
                    ARCHIVE ID: {artwork.artworkId}
                  </span>
                  {artwork.collection && (
                    <>
                      <span className="text-canvas-border text-xs">â€¢</span>
                      <Link
                        href={`/collections/${artwork.collection.slug}`}
                        className="gallery-plaque text-[0.625rem] text-charcoal-muted uppercase hover:text-charcoal transition-colors tracking-gallery"
                      >
                        {artwork.collection.title}
                      </Link>
                    </>
                  )}
                </div>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-charcoal font-normal leading-[1.12] sm:leading-[1.08] tracking-tight">
                  {artwork.title}
                </h1>
                <p className="font-sans text-sm text-charcoal-subtle tracking-gallery mt-2">
                  Darey, {artwork.year}
                </p>
              </div>

              {/* Gallery Plaque Technical Specifications */}
              <div className="p-6 bg-canvas-paper border border-canvas-border space-y-4 rounded-sm">
                <div className="border-b border-canvas-border pb-3">
                  <span className="text-[0.625rem] font-sans uppercase tracking-gallery text-charcoal-subtle block mb-1">
                    Medium & Technique
                  </span>
                  <p className="text-sm font-sans text-charcoal font-medium">
                    {artwork.medium}
                  </p>
                </div>

                <div className="border-b border-canvas-border pb-3">
                  <span className="text-[0.625rem] font-sans uppercase tracking-gallery text-charcoal-subtle block mb-1">
                    Dimensions & Scale
                  </span>
                  <p className="text-sm font-sans text-charcoal">
                    {dimensions.cm}
                    <span className="text-charcoal-subtle text-xs ml-2">({dimensions.inches})</span>
                  </p>
                  <span className="text-[0.6875rem] text-charcoal-subtle capitalize block mt-0.5">
                    {artwork.orientation} orientation
                  </span>
                </div>

                {/* Status & Price Row */}
                <div>
                  <span className="text-[0.625rem] font-sans uppercase tracking-gallery text-charcoal-subtle block mb-1">
                    Status & Valuation
                  </span>
                  <div className="flex items-center justify-between">
                    <ArtworkStatusBadge status={artwork.status} />

                    {artwork.status === 'sold' ? (
                      <span className="text-xs font-serif italic text-charcoal-muted">
                        {artwork.provenance || 'Private Collection'}
                      </span>
                    ) : artwork.status === 'commissioned' ? (
                      <span className="text-xs font-serif italic text-charcoal-muted">
                        Private Commission
                      </span>
                    ) : artwork.price ? (
                      <span className="font-display text-2xl text-charcoal font-normal">
                        {formatPrice(artwork.price, artwork.currency)}
                      </span>
                    ) : (
                      <span className="text-xs text-charcoal-muted font-sans">Price on Enquiry</span>
                    )}
                  </div>

                  {artwork.availabilityNote && (
                    <p className="mt-2 text-xs text-charcoal-muted font-light italic">
                      {artwork.availabilityNote}
                    </p>
                  )}
                </div>
              </div>

              {/* Curatorial Synopsis */}
              <p className="font-serif italic text-lg text-charcoal-muted font-light leading-relaxed">
                &ldquo;{artwork.description}&rdquo;
              </p>

              {/* Status-Specific Action Controls */}
              <div className="space-y-3 pt-2">
                {/* 1. AVAILABLE STATUS */}
                {artwork.status === 'available' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        href="/cart"
                        variant="primary"
                        size="lg"
                        className="w-full justify-center"
                        title="Acquisition flow will be completed in Phase 4"
                      >
                        Acquire This Piece
                      </Button>
                      <Button
                        onClick={() => setEnquiryOpen(true)}
                        variant="outline"
                        size="lg"
                        className="w-full justify-center"
                      >
                        Ask About This Work
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setQuickInterestOpen(true)}
                        className="flex-1 py-2.5 px-3 border border-canvas-border hover:border-charcoal text-xs text-charcoal tracking-gallery uppercase rounded-sm transition-colors text-center font-medium"
                      >
                        I&apos;m Interested
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewInSpaceOpen(true)}
                        className="flex-1 py-2.5 px-3 border border-canvas-border hover:border-charcoal text-xs text-charcoal tracking-gallery uppercase rounded-sm transition-colors text-center font-medium flex items-center justify-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View in Space</span>
                      </button>
                    </div>
                  </>
                )}

                {/* 2. RESERVED STATUS */}
                {artwork.status === 'reserved' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        onClick={() => setInterestListOpen(true)}
                        variant="primary"
                        size="lg"
                        className="w-full justify-center"
                      >
                        Join Interest List
                      </Button>
                      <Button
                        onClick={() => setEnquiryOpen(true)}
                        variant="outline"
                        size="lg"
                        className="w-full justify-center"
                      >
                        Ask About This Work
                      </Button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewInSpaceOpen(true)}
                      className="w-full py-2.5 border border-canvas-border hover:border-charcoal text-xs text-charcoal tracking-gallery uppercase rounded-sm transition-colors text-center font-medium flex items-center justify-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View in Your Space</span>
                    </button>
                  </>
                )}

                {/* 3. SOLD / COLLECTED STATUS */}
                {artwork.status === 'sold' && (
                  <>
                    <div className="p-4 bg-canvas-subtle border border-canvas-border text-xs text-charcoal-muted leading-relaxed rounded-xl mb-2">
                      <p className="font-serif italic text-charcoal mb-1">
                        This original artwork has found its home.
                      </p>
                      <p className="font-light">
                        Darey accepts commissions for collectors seeking works of related palette, spirit, and scale.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        href="/commission"
                        variant="primary"
                        size="lg"
                        className="w-full justify-center"
                      >
                        Commission Similar
                      </Button>
                      <Button
                        onClick={() => setEnquiryOpen(true)}
                        variant="outline"
                        size="lg"
                        className="w-full justify-center"
                      >
                        Ask About This Work
                      </Button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewInSpaceOpen(true)}
                      className="w-full py-2.5 border border-canvas-border hover:border-charcoal text-xs text-charcoal tracking-gallery uppercase rounded-xl transition-colors text-center font-medium flex items-center justify-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View in Space Prototype</span>
                    </button>
                  </>
                )}

                {/* 4. COMMISSIONED STATUS */}
                {artwork.status === 'commissioned' && (
                  <>
                    <div className="p-4 bg-canvas-subtle border border-canvas-border text-xs text-charcoal-muted leading-relaxed rounded-sm mb-2">
                      <p className="font-serif italic text-charcoal mb-1">
                        Bespoke studio creation.
                      </p>
                      <p className="font-light">
                        This piece was custom-created for a private architectural commission. You may commission your own tailored artwork directly.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        href="/commission"
                        variant="primary"
                        size="lg"
                        className="w-full justify-center"
                      >
                        Commission Your Own
                      </Button>
                      <Button
                        onClick={() => setEnquiryOpen(true)}
                        variant="outline"
                        size="lg"
                        className="w-full justify-center"
                      >
                        Ask About This Work
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Editorial Story Section: "THE STORY BEHIND THE WORK" */}
      {artwork.story && (
        <Section background="paper" spacing="lg" className="border-b border-canvas-border">
          <Container size="editorial">
            <div className="max-w-3xl mx-auto">
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3 text-center sm:text-left">
                Studio Notes &amp; Narrative
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal leading-[1.12] sm:leading-[1.08] tracking-tight mb-8 text-center sm:text-left">
                The story behind the work
              </h2>

              <blockquote className="font-serif italic text-xl sm:text-2xl text-charcoal font-light leading-relaxed border-l-2 border-charcoal/30 pl-6 my-8">
                &ldquo;{artwork.story}&rdquo;
              </blockquote>

              <div className="font-sans text-sm sm:text-base text-charcoal-muted leading-relaxed font-light space-y-4">
                <p>
                  Each stroke in &ldquo;{artwork.title}&rdquo; is informed by physical contact with organic matter. 
                  The pigments are ground and blended by hand in the studio, celebrating the natural imperfections and raw vitality of West African soil, ash, and minerals.
                </p>
                <p>
                  The work exists not merely as an image, but as a textured artifact recording the artist&apos;s relationship to environment, lineage, and emotional memory.
                </p>
              </div>

              {/* Tags / Keywords Plaque */}
              {artwork.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-canvas-border flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-gallery text-charcoal-subtle mr-2 font-mono">
                    INDEXED MOTIFS:
                  </span>
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[0.6875rem] font-sans bg-canvas border border-canvas-border text-charcoal-muted rounded-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}

      {/* Multiple Gallery Views / In Situ Inspection */}
      {galleryImages.length > 1 && (
        <Section background="canvas" spacing="lg" className="border-b border-canvas-border">
          <Container size="wide">
            <div className="mb-10 text-center sm:text-left">
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-2">
                DETAILED INSPECTION
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-charcoal font-normal">
                Perspectives & In Situ Placement
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {galleryImages.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="group relative aspect-[4/3] bg-canvas-paper border border-canvas-border overflow-hidden rounded-sm cursor-zoom-in"
                  onClick={() => openViewerAt(idx)}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `${artwork.title} perspective ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-canvas/95 text-charcoal text-xs font-sans tracking-gallery uppercase shadow">
                      Inspect View
                    </span>
                  </div>
                  {img.type && (
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-charcoal/80 text-canvas text-[0.625rem] tracking-gallery uppercase backdrop-blur-sm rounded-sm">
                      {img.type}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Related Artworks: "CONTINUE EXPLORING" */}
      {relatedArtworks.length > 0 && (
        <Section background="canvas" spacing="xl">
          <Container size="wide">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-canvas-border pb-6 mb-10 gap-4">
              <div>
                <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-2">
                  Curatorial Pairings
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-charcoal font-normal">
                  Continue exploring
                </h2>
              </div>
              <Link
                href="/artworks"
                className="group inline-flex items-center gap-1.5 text-xs font-sans text-charcoal tracking-gallery uppercase font-medium hover:text-charcoal-muted"
              >
                <span>View Full Catalogue</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {relatedArtworks.map((related) => (
                <ArtworkCard key={related.id} artwork={related} variant="standard" />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Modals & Overlays */}
      <ArtworkViewer
        isOpen={viewerOpen}
        images={galleryImages}
        initialIndex={viewerInitialIndex}
        artworkTitle={artwork.title}
        onClose={() => setViewerOpen(false)}
      />

      <ViewInSpaceModal
        isOpen={viewInSpaceOpen}
        artwork={artwork}
        onClose={() => setViewInSpaceOpen(false)}
      />

      <ArtworkEnquiryModal
        isOpen={enquiryOpen}
        artwork={artwork}
        onClose={() => setEnquiryOpen(false)}
      />

      <InterestListModal
        isOpen={interestListOpen}
        artwork={artwork}
        onClose={() => setInterestListOpen(false)}
      />

      <QuickInterestModal
        isOpen={quickInterestOpen}
        artwork={artwork}
        onClose={() => setQuickInterestOpen(false)}
      />
    </div>
  );
}
