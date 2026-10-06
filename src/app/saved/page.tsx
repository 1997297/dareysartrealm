'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, ArrowRight, Trash2, Mail, CheckCircle2, Loader2, X } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { ArtworkCard } from '@/components/artwork/ArtworkCard';
import { artworkService } from '@/services/artworkService';
import { Artwork } from '@/types/artwork';
import { useSavedArtworks } from '@/hooks/useSavedArtworks';
import { formatPrice } from '@/lib/utils';

export default function SavedArtworksPage() {
  const { savedSlugs, clearSaved, isMounted } = useSavedArtworks();
  const [savedArtworks, setSavedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Enquiry for all saved works
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // Set default multi-piece message
  useEffect(() => {
    if (savedArtworks.length > 0) {
      const titles = savedArtworks.map((a) => `"${a.title}" (${a.artworkId})`).join(', ');
      setMessage(
        `Hello Darey, I have curated the following works from your collection: ${titles}. I would like to enquire about their availability, private viewing, and combined acquisition arrangements.`
      );
    }
  }, [savedArtworks]);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 bg-canvas min-h-screen">
      {/* Header Room */}
      <Section background="canvas" spacing="sm" className="border-b border-canvas-border pb-10">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
                CURATED SELECTION
              </span>
              <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-charcoal font-normal tracking-tight uppercase leading-[0.9]">
                YOUR
                <br />
                COLLECTION
              </h1>
              <p className="mt-6 font-sans text-base sm:text-lg text-charcoal-muted font-light leading-relaxed max-w-xl">
                Artworks you have saved during your visit to Darey&apos;s Artrealm. Locally preserved for your private review.
              </p>
            </div>

            {/* Quick Actions if saved items exist */}
            {savedArtworks.length > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setEnquiryModalOpen(true)}
                  variant="primary"
                  size="md"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Enquire About Saved Works
                </Button>
                <button
                  type="button"
                  onClick={clearSaved}
                  className="p-2.5 text-charcoal-subtle hover:text-charcoal border border-canvas-border hover:border-charcoal transition-colors rounded-sm"
                  title="Clear all saved artworks"
                  aria-label="Clear all saved artworks"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Main Saved Artworks Exhibition Body */}
      <Section background="canvas" spacing="lg">
        <Container size="wide">
          {!isMounted || isLoading ? (
            <div className="py-24 text-center">
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery animate-pulse">
                RETRIEVING YOUR CURATED PIECES...
              </span>
            </div>
          ) : savedArtworks.length === 0 ? (
            /* Empty State */
            <div className="py-24 text-center max-w-lg mx-auto">
              <div className="h-16 w-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-canvas-paper border border-canvas-border text-charcoal-subtle">
                <Bookmark className="h-7 w-7" />
              </div>
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-3">
                NOTHING SAVED YET
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-charcoal mb-4">
                YOUR COLLECTION STARTS HERE.
              </h2>
              <p className="font-sans text-sm text-charcoal-muted leading-relaxed font-light mb-8">
                As you explore the exhibition, save pieces that resonate with you to curate your personal viewing gallery and make collective enquiries.
              </p>
              <Button href="/artworks" variant="primary" size="lg">
                Explore Artworks
              </Button>
            </div>
          ) : (
            /* Saved Grid */
            <div>
              <div className="flex items-center justify-between border-b border-canvas-border pb-4 mb-10 text-xs text-charcoal-subtle uppercase tracking-gallery">
                <span>{savedArtworks.length} {savedArtworks.length === 1 ? 'PIECE' : 'PIECES'} SAVED</span>
                <span>SAVED TO LOCAL GALLERY REGISTRY</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
                {savedArtworks.map((art) => (
                  <ArtworkCard key={art.id} artwork={art} variant="standard" />
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Enquire About All Saved Works Modal */}
      {enquiryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="saved-enquiry-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md"
        >
          <div className="relative w-full max-w-2xl bg-canvas border border-canvas-border shadow-2xl rounded-2xl max-h-[92vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-canvas-border bg-canvas-paper">
              <div>
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery">
                  MULTI-PIECE CONSULTATION
                </span>
                <h3 id="saved-enquiry-title" className="font-display text-xl text-charcoal">
                  Enquire About Saved Artworks ({savedArtworks.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEnquiryModalOpen(false)}
                className="p-2 text-charcoal-muted hover:text-charcoal transition-colors rounded-full"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {isSubmitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-charcoal mx-auto mb-4 stroke-1" />
                  <span className="gallery-plaque text-xs text-charcoal-subtle uppercase tracking-gallery block mb-2">
                    COLLECTION ENQUIRY TRANSMITTED
                  </span>
                  <h3 className="font-display text-3xl text-charcoal mb-4">
                    YOUR CURATED ENQUIRY HAS ENTERED THE ARTREALM.
                  </h3>
                  <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-md mx-auto mb-8 font-light">
                    Darey&apos;s studio has received your collective inquiry for {savedArtworks.length} selected works. We will prepare private dossiers and availability confirmations within 24 to 48 hours.
                  </p>
                  <Button
                    onClick={() => {
                      setEnquiryModalOpen(false);
                      setIsSubmitted(false);
                    }}
                    variant="primary"
                    size="md"
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-5">
                  {/* Saved Artworks Summary Preview */}
                  <div className="p-3 bg-canvas-subtle border border-canvas-border rounded-sm">
                    <span className="text-[0.625rem] font-sans uppercase tracking-gallery text-charcoal-subtle block mb-2">
                      INCLUDED ARTWORKS:
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {savedArtworks.map((art) => (
                        <div key={art.id} className="flex items-center gap-2 pr-3 border-r border-canvas-border last:border-r-0 flex-shrink-0">
                          <div className="relative h-10 w-10 bg-canvas-muted overflow-hidden border border-canvas-border">
                            <Image src={art.coverImage.url} alt={art.title} fill sizes="40px" className="object-cover" />
                          </div>
                          <div>
                            <span className="text-xs font-display text-charcoal block truncate max-w-[120px]">
                              {art.title}
                            </span>
                            <span className="text-[0.625rem] text-charcoal-subtle font-mono block">
                              {art.artworkId}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="saved-name" className="block text-xs font-sans text-charcoal-muted mb-1 uppercase tracking-gallery">
                        Your Name *
                      </label>
                      <input
                        id="saved-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Adeola Cole"
                        className="w-full px-3.5 py-2 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="saved-email" className="block text-xs font-sans text-charcoal-muted mb-1 uppercase tracking-gallery">
                        Email Address *
                      </label>
                      <input
                        id="saved-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="collector@example.com"
                        className="w-full px-3.5 py-2 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="saved-message" className="block text-xs font-sans text-charcoal-muted mb-1 uppercase tracking-gallery">
                      Consultation Message *
                    </label>
                    <textarea
                      id="saved-message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isSubmitting}
                      className="min-w-[160px]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        'Transmit Consultation Request'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
