'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface BrandWordmarkProps {
  /**
   * 'dark' renders rich charcoal typography for light backgrounds.
   * 'light' renders luminous warm white typography for dark canvases and hero headers.
   */
  variant?: 'dark' | 'light';
  /**
   * Responsive size presets:
   * 'sm': Compact, proportional navbar branding (no overflow or tall clipping).
   * 'md': Mobile drawer header, studio sidebar, login/register branding.
   * 'lg': Grand footer brand anchor and editorial moments.
   * 'xl': Monumental statement scale.
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Optional Link destination (e.g. href="/").
   */
  href?: string;
  /**
   * Optional secondary subtitle (e.g. "STUDIO PRACTICE", "ART ATELIER").
   */
  subtitle?: string;
  /**
   * Additional container CSS classes.
   */
  className?: string;
  /**
   * Optional click handler.
   */
  onClick?: () => void;
  /**
   * Interactive hover transitions (defaults to true).
   */
  interactive?: boolean;
}

/**
 * BrandWordmark
 * Distinctive two-line contemporary artist wordmark:
 * 1. "Darey's" — Refined, high-contrast, confident editorial display serif (Fraunces).
 * 2. "Artrealm" — Elegant, authentic italic serif (Fraunces Italics), proportionally smaller for hierarchy.
 */
export function BrandWordmark({
  variant = 'dark',
  size = 'sm',
  href,
  subtitle,
  className,
  onClick,
  interactive = true,
}: BrandWordmarkProps) {
  const isLight = variant === 'light';

  // Sizing definitions ensuring optical balance, clear vertical separation without overlapping,
  // and distinct visual hierarchy where "Artrealm" is gracefully smaller than "Darey's".
  const sizeStyles = {
    sm: {
      container: 'py-0.5 justify-center',
      primary: 'text-[0.875rem] sm:text-[0.9375rem] font-semibold tracking-[0.06em] leading-[1.05]',
      script: 'text-[0.71875rem] sm:text-[0.78125rem] font-display italic font-light tracking-[0.04em] leading-[1.1] mt-0.5',
      subtitle: 'text-[0.4375rem] sm:text-[0.5rem] tracking-[0.24em] mt-0.5',
    },
    md: {
      container: 'py-1 justify-center',
      primary: 'text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.05em] leading-[1.05]',
      script: 'text-sm sm:text-base md:text-lg font-display italic font-light tracking-[0.03em] leading-[1.1] mt-1',
      subtitle: 'text-[0.5625rem] sm:text-[0.625rem] tracking-[0.22em] mt-1',
    },
    lg: {
      container: 'py-2 justify-center',
      primary: 'text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold tracking-[0.03em] leading-[1.05]',
      script: 'text-xl sm:text-2xl md:text-3xl lg:text-[2.5rem] font-display italic font-light tracking-[0.02em] leading-[1.1] mt-1.5 sm:mt-2',
      subtitle: 'text-xs tracking-[0.2em] mt-2',
    },
    xl: {
      container: 'py-3 justify-center',
      primary: 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-[0.02em] leading-[1.05]',
      script: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display italic font-light tracking-[0.02em] leading-[1.1] mt-2 sm:mt-3',
      subtitle: 'text-sm tracking-[0.2em] mt-2.5',
    },
  }[size];

  // Colors & Transitions
  const colorStyles = {
    primary: isLight
      ? cn(
          'text-canvas drop-shadow-xs',
          interactive && 'group-hover:text-canvas/80 transition-colors duration-200'
        )
      : cn(
          'text-charcoal',
          interactive && 'group-hover:text-charcoal-muted transition-colors duration-200'
        ),
    script: isLight
      ? cn(
          'text-canvas/90 drop-shadow-xs',
          interactive && 'group-hover:text-canvas transition-colors duration-200'
        )
      : cn(
          'text-charcoal/85',
          interactive && 'group-hover:text-charcoal transition-colors duration-200'
        ),
    subtitle: isLight ? 'text-canvas/60' : 'text-charcoal-subtle',
  };

  const content = (
    <div
      className={cn(
        'flex flex-col select-none text-left',
        sizeStyles.container,
        className
      )}
    >
      {/* Line 1: Elegant, expressive display typography */}
      <span
        className={cn(
          'font-display inline-block',
          sizeStyles.primary,
          colorStyles.primary
        )}
      >
        Darey&apos;s
      </span>

      {/* Line 2: Fraunces italics, smaller for refined hierarchy, cleanly separated */}
      <span
        className={cn(
          'inline-block select-none',
          sizeStyles.script,
          colorStyles.script
        )}
      >
        Artrealm
      </span>

      {/* Optional Editorial Subtitle */}
      {subtitle && (
        <span
          className={cn(
            'gallery-plaque uppercase',
            sizeStyles.subtitle,
            colorStyles.subtitle
          )}
        >
          {subtitle}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal rounded-sm"
        aria-label="Darey's Artrealm"
      >
        {content}
      </Link>
    );
  }

  return content;
}

