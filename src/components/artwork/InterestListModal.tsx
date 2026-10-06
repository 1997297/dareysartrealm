'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, Bell } from 'lucide-react';
import { Artwork } from '@/types/artwork';
import { Button } from '@/components/ui/Button';

interface InterestListModalProps {
  isOpen: boolean;
  artwork: Artwork;
  onClose: () => void;
}

export function InterestListModal({ isOpen, artwork, onClose }: InterestListModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="interest-list-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md bg-canvas border border-canvas-border shadow-2xl rounded-2xl p-6 sm:p-8">
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
              INTEREST LOGGED
            </span>
            <h3 className="font-display text-2xl text-charcoal mb-3">
              YOU&apos;RE ON THE INTEREST LIST.
            </h3>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed mb-6 font-light">
              We&apos;ve registered your interest in &ldquo;{artwork.title}&rdquo;. If this piece is released from reserve, you will receive priority notification before any public re-listing.
            </p>
            <Button onClick={onClose} variant="primary" size="sm">
              Done
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2 text-charcoal">
              <Bell className="h-4 w-4" />
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery">
                PRIORITY NOTIFICATION
              </span>
            </div>
            <h2 id="interest-list-title" className="font-display text-2xl text-charcoal mb-2">
              Join Interest List
            </h2>
            <p className="font-sans text-xs text-charcoal-muted leading-relaxed mb-6 font-light">
              &ldquo;{artwork.title}&rdquo; is currently on reserve. Leave your details below and we will notify you if it becomes available.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="interest-name" className="block text-xs font-sans text-charcoal-muted mb-1 uppercase tracking-gallery">
                  Your Name *
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
                      Registering...
                    </span>
                  ) : (
                    'Notify Me If Available'
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
