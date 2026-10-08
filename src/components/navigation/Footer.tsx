'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { SITE_NAME, NAV_ITEMS, SOCIAL_LINKS, CONTACT_INFO } from '@/lib/constants';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { BrandWordmark } from '@/components/ui/BrandWordmark';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return (
    <footer className="w-full bg-canvas-subtle border-t border-canvas-border pt-20 md:pt-28 pb-12 transition-colors">
      <Container size="wide">
        {/* Exhibition Wall Header Statement */}
        <div className="border-b border-canvas-border pb-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3.5 sm:gap-4 mb-2">
                <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg bg-[#121212] border border-charcoal/30 select-none shadow-xs p-1 shrink-0">
                  <Logo variant="light" size={32} className="sm:scale-110" />
                </div>
                <BrandWordmark variant="dark" size="lg" interactive={false} />
              </div>
              <p className="mt-6 text-charcoal-muted text-base sm:text-lg max-w-xl font-light leading-relaxed">
                A sanctuary where original paintings, architectural interventions, and bespoke commissions are crafted to provoke feeling before understanding.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-8 lg:pl-12">
              <div className="p-8 bg-canvas border border-canvas-border/80 shadow-subtle">
                <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                  BESPOKE COMMISSIONS
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-charcoal mt-2 mb-3">
                  Have a specific space or story in mind?
                </h3>
                <p className="text-xs text-charcoal-muted mb-6 leading-relaxed">
                  Collaborate directly with Darey to create a monumental canvas or site-specific artwork tailored to your collection.
                </p>
                <Button href="/commission" variant="primary" size="sm">
                  Create a Piece
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 py-16 border-b border-canvas-border text-xs">
          {/* Column 1: Navigation */}
          <div>
            <p className="gallery-plaque text-[0.6875rem] text-charcoal-subtle mb-5">
              EXPLORE
            </p>
            <ul className="space-y-3 font-sans">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-charcoal-muted hover:text-charcoal transition-colors tracking-wide"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Studio & Inquiries */}
          <div>
            <p className="gallery-plaque text-[0.6875rem] text-charcoal-subtle mb-5">
              STUDIO & INQUIRIES
            </p>
            <div className="space-y-3 text-charcoal-muted">
              <p>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-charcoal transition-colors underline"
                >
                  {CONTACT_INFO.email}
                </a>
              </p>
              <p>{CONTACT_INFO.location}</p>
              <p className="text-charcoal-subtle italic">{CONTACT_INFO.hours}</p>
            </div>
          </div>

          {/* Column 3: Social Dialogue */}
          <div>
            <p className="gallery-plaque text-[0.6875rem] text-charcoal-subtle mb-5">
              CONNECT
            </p>
            <ul className="space-y-3 font-sans">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-charcoal-muted hover:text-charcoal transition-colors"
                  >
                    <span>{link.platform}</span>
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Studio Access */}
          <div>
            <p className="gallery-plaque text-[0.6875rem] text-charcoal-subtle mb-5">
              ARTREALM STUDIO
            </p>
            <p className="text-charcoal-muted leading-relaxed mb-4">
              Private portal for collectors, gallerists, and artist studio administration.
            </p>
            <Link
              href="/studio"
              className="inline-flex items-center text-[0.6875rem] font-medium tracking-gallery uppercase text-charcoal underline underline-offset-4 hover:text-charcoal-muted"
            >
              Enter Studio Portal &rarr;
            </Link>
          </div>
        </div>

        {/* Bottom Legal / Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.6875rem] text-charcoal-subtle">
          <p>
            &copy; {currentYear} {SITE_NAME}. All artworks, writings, and imagery copyright of Darey.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="hover:text-charcoal transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-charcoal transition-colors">
              Terms &amp; Provenance
            </Link>
            <Link href="/authenticity" className="hover:text-charcoal transition-colors">
              Certificates of Authenticity
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
