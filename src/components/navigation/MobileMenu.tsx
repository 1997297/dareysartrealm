'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { NAV_ITEMS, SOCIAL_LINKS, CONTACT_INFO, SITE_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Extended navigation items for mobile
  const allNavItems = [
    ...NAV_ITEMS,
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-canvas px-6 py-8 sm:px-10 overflow-y-auto"
        >
          {/* Top Bar inside Menu */}
          <div className="flex items-center justify-between border-b border-canvas-border pb-6">
            <Link
              href="/"
              onClick={onClose}
              className="group flex items-center gap-3 focus:outline-none"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#121212] border border-charcoal/40 select-none p-1 shadow-sm">
                <Logo variant="light" size={34} />
              </div>
              <span className="font-display text-xl sm:text-2xl text-charcoal font-semibold tracking-gallery">
                {SITE_NAME}
              </span>
            </Link>

            <button
              onClick={onClose}
              className="p-2 text-charcoal hover:text-charcoal-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Primary Navigation Links */}
          <nav className="my-auto py-10 flex flex-col space-y-5">
            <p className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
              NAVIGATION
            </p>
            {allNavItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between font-display text-4xl sm:text-5xl text-charcoal hover:text-charcoal-muted tracking-tight transition-colors duration-200"
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-charcoal-subtle tracking-gallery opacity-0 group-hover:opacity-100 transition-opacity">
                    0{index + 1}
                  </span>
                </Link>
              </motion.div>
            ))}

            <div className="pt-6">
              <Button
                href="/commission"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={onClose}
              >
                Commission a Piece
              </Button>
            </div>
          </nav>

          {/* Bottom Contact / Social Info */}
          <div className="border-t border-canvas-border pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal-muted">
            <div>
              <p className="gallery-plaque mb-1 text-[0.625rem] text-charcoal-subtle">
                DIRECT INQUIRIES
              </p>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="hover:text-charcoal underline"
              >
                {CONTACT_INFO.email}
              </a>
              <p className="mt-1 text-charcoal-subtle">{CONTACT_INFO.location}</p>
            </div>

            <div>
              <p className="gallery-plaque mb-1 text-[0.625rem] text-charcoal-subtle">
                FOLLOW THE JOURNEY
              </p>
              <div className="flex flex-wrap gap-4 pt-1">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.platform}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-charcoal"
                  >
                    <span>{link.platform}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
