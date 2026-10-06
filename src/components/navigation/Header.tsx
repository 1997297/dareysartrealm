'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, UserCircle } from 'lucide-react';
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isScrolled } = useScrollPosition();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Dark header when on homepage over the dark painting hero section
  const isDarkHeader = pathname === '/' && !isScrolled;

  // Keyboard shortcut (Cmd/Ctrl + K or '/') to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === '/' && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  if (pathname?.startsWith('/studio')) {
    return null;
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 w-full transition-all duration-500 ease-artistic',
          isScrolled
            ? 'bg-canvas/90 backdrop-blur-md py-2.5 sm:py-3 border-b border-canvas-border/80 shadow-subtle'
            : 'bg-transparent py-3.5 sm:py-4 md:py-4.5'
        )}
      >
        <div className="mx-auto flex w-full max-w-[92rem] items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Brand Logo / Identity with "Da" site icon mark */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 sm:gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal"
            aria-label="Darey's Artrealm - Return to Homepage"
          >
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-md select-none transition-all duration-300 shadow-xs shrink-0 p-0.5 bg-[#121212] border border-charcoal/30 group-hover:bg-black group-hover:border-charcoal/60',
                isDarkHeader && 'border-white/20'
              )}
            >
              <Logo
                variant="light"
                size={26}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={cn(
                  'font-display text-sm sm:text-base font-semibold tracking-[0.16em] transition-colors leading-tight',
                  isDarkHeader
                    ? 'text-canvas group-hover:text-canvas/80'
                    : 'text-charcoal group-hover:text-charcoal-muted'
                )}
              >
                {SITE_NAME}
              </span>
              <span
                className={cn(
                  'gallery-plaque text-[0.55rem] tracking-[0.24em] transition-colors',
                  isDarkHeader ? 'text-canvas/60' : 'text-charcoal-subtle'
                )}
              >
                ART STUDIO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center space-x-8 xl:space-x-10"
            aria-label="Main Navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                isLight={isDarkHeader}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Utility Actions & Primary CTA */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Profile / Account */}
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className={cn(
                'p-2 transition-colors focus:outline-none focus-visible:ring-2 rounded-full',
                isDarkHeader
                  ? 'text-canvas hover:text-canvas/80 hover:bg-white/10 focus-visible:ring-canvas'
                  : 'text-charcoal hover:text-charcoal-muted hover:bg-canvas-muted/50 focus-visible:ring-charcoal'
              )}
              aria-label={isAuthenticated ? 'Go to your account' : 'Sign in to your account'}
              title={isAuthenticated ? 'My Account' : 'Sign In'}
            >
              <UserCircle className="h-5 w-5" />
            </Link>

            {/* Primary CTA (Desktop) */}
            <div className="hidden sm:block">
              <Button
                href="/commission"
                variant={isDarkHeader ? 'secondary' : 'primary'}
                size="sm"
                className={cn(
                  'rounded-lg tracking-wider text-xs uppercase px-4 sm:px-5 py-2 font-medium',
                  isDarkHeader && 'bg-canvas text-charcoal hover:bg-canvas-subtle border-none'
                )}
              >
                CREATE A PIECE
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                'lg:hidden p-2 focus:outline-none focus-visible:ring-2 rounded-md',
                isDarkHeader
                  ? 'text-canvas hover:text-canvas/80 focus-visible:ring-canvas'
                  : 'text-charcoal hover:text-charcoal-muted focus-visible:ring-charcoal'
              )}
              aria-label="Open mobile navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Global Interactive Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
