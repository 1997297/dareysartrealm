'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Artwork } from '@/types/artwork';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

interface QuickInterestModalProps {
  isOpen: boolean;
  artwork: Artwork;
  onClose: () => void;
}

export function QuickInterestModal({ isOpen, artwork, onClose }: QuickInterestModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timeline, setTimeline] = useState('Immediate / Ready to Acquire');
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
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-interest-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md bg-canvas border border-canvas-border shadow-2xl rounded-sm p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-muted hover:text-charcoal transition-colors rounded-full hover:bg-canvas-muted"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {isSubmitted ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-charcoal mx-auto mb-4 stroke-1" />
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery block mb-2">
              COLLECTOR REGISTRATION
            </span>
            <h3 className="font-display text-2xl text-charcoal mb-3">
              INTEREST RECORDED.
            </h3>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed mb-6 font-light">
              Your serious interest in &ldquo;{artwork.title}&rdquo; ({formatPrice(artwork.price || 0, artwork.currency)}) has been prioritized by Darey&apos;s studio manager. We will connect with you via email directly.
            </p>
            <Button onClick={onClose} variant="primary" size="sm">
              Return to Gallery
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2 text-charcoal">
              <Sparkles className="h-4 w-4" />
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery">
                EXPRESS ACQUISITION INTEREST
              </span>
            </div>
            <h2 id="quick-interest-title" className="font-display text-2xl text-charcoal mb-2">
              I&apos;m Interested in This Piece
            </h2>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed mb-6 font-light">
              Indicate your intent for &ldquo;{artwork.title}&rdquo; without immediate online payment. The artist&apos;s studio will reach out with provenance details and private acquisition arrangements.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="interest-name" className="block text-xs font-sans text-charcoal-muted mb-1 uppercase tracking-gallery">
                  Collector / Client Name *
                </label>
                <input
                  id="interest-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="interest-email" className="block text-xs font-sans text-charcoal-muted mb-1 uppercase tracking-gallery">
                  Email Address *
                </label>
                <input
                  id="interest-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="interest-timeline" className="block text-xs font-sans text-charcoal-muted mb-1 uppercase tracking-gallery">
                  Acquisition Timeline
                </label>
                <select
                  id="interest-timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 bg-canvas border border-canvas-border text-sm text-charcoal focus:border-charcoal focus:outline-none"
                >
                  <option value="Immediate / Ready to Acquire">Immediate / Ready to Acquire</option>
                  <option value="Within 30 Days">Within 30 Days</option>
                  <option value="Curating a Space / Exploring Options">Curating a Space / Exploring Options</option>
                </select>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  className="w-full justify-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging Interest...
                    </span>
                  ) : (
                    'Register Acquisition Interest'
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
