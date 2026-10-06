'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { Artwork } from '@/types/artwork';
import { Button } from '@/components/ui/Button';
import { formatDimensions, formatPrice } from '@/lib/utils';

interface ArtworkEnquiryModalProps {
  isOpen: boolean;
  artwork: Artwork;
  onClose: () => void;
}

export function ArtworkEnquiryModal({ isOpen, artwork, onClose }: ArtworkEnquiryModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState(
    `Hello Darey, I am interested in "${artwork.title}" (${artwork.artworkId}) and would like to learn more about its provenance, framing, and delivery options.`
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSubmitted(false);
      setIsSubmitting(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-xl bg-canvas border border-canvas-border shadow-2xl rounded-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-canvas-border bg-canvas-paper">
          <div>
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle tracking-gallery uppercase">
              STUDIO ENQUIRY
            </span>
            <h2 id="enquiry-modal-title" className="font-display text-xl text-charcoal">
              Ask About This Artwork
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-charcoal-muted hover:text-charcoal transition-colors rounded-full hover:bg-canvas-muted"
            aria-label="Close enquiry modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="py-8 text-center flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 text-charcoal mb-4 stroke-1" />
              <span className="gallery-plaque text-xs text-charcoal-subtle uppercase mb-2">
                TRANSMISSION RECEIVED
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-charcoal mb-4">
                YOUR MESSAGE HAS ENTERED THE ARTREALM.
              </h3>
              <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-md mx-auto mb-8 font-light">
                Darey&apos;s studio has received your direct enquiry regarding{' '}
                <strong className="font-medium text-charcoal">&ldquo;{artwork.title}&rdquo;</strong>{' '}
                ({artwork.artworkId}). You will receive a response within 24 to 48 hours.
              </p>
              <Button onClick={onClose} variant="primary" size="md">
                Return to Artwork
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Auto-attached Artwork Context Plaque */}
              <div className="flex items-center gap-4 p-3 bg-canvas-subtle border border-canvas-border rounded-sm">
                <div className="relative h-16 w-16 flex-shrink-0 bg-canvas-muted overflow-hidden border border-canvas-border">
                  <Image
                    src={artwork.coverImage.url}
                    alt={artwork.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[0.625rem] text-charcoal-subtle uppercase tracking-wider block">
                    REF: {artwork.artworkId}
                  </span>
                  <h4 className="font-display text-base text-charcoal truncate">
                    {artwork.title} ({artwork.year})
                  </h4>
                  <p className="font-sans text-xs text-charcoal-muted truncate">
                    {artwork.medium} â€¢ {formatDimensions(artwork.width, artwork.height)}
                  </p>
                  {artwork.price && artwork.status === 'available' && (
                    <span className="font-sans text-xs font-medium text-charcoal">
                      {formatPrice(artwork.price, artwork.currency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-name" className="block text-xs font-sans text-charcoal-muted mb-1.5 uppercase tracking-gallery">
                    Your Name *
                  </label>
                  <input
                    id="enquiry-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adeola Cole"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-email" className="block text-xs font-sans text-charcoal-muted mb-1.5 uppercase tracking-gallery">
                    Email Address *
                  </label>
                  <input
                    id="enquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@example.com"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-phone" className="block text-xs font-sans text-charcoal-muted mb-1.5 uppercase tracking-gallery">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    id="enquiry-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 ... or +44 ..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="enquiry-country" className="block text-xs font-sans text-charcoal-muted mb-1.5 uppercase tracking-gallery">
                    City / Country (Optional)
                  </label>
                  <input
                    id="enquiry-country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Country or City"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enquiry-message" className="block text-xs font-sans text-charcoal-muted mb-1.5 uppercase tracking-gallery">
                  Message to the Studio *
                </label>
                <textarea
                  id="enquiry-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-charcoal-subtle font-light">
                  Protected & confidential enquiry
                </span>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Send Enquiry
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
