'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  /**
   * 'dark' renders the clean transparent charcoal/black monogram (for light canvas).
   * 'light' renders the clean transparent pure white monogram (for dark/hero canvas).
   */
  variant?: 'dark' | 'light';
  /** Size in pixels (applied to width and height) */
  size?: number;
  /** Width in pixels (overrides size if specified) */
  width?: number;
  /** Height in pixels (overrides size if specified) */
  height?: number;
  /** Optional container CSS class */
  className?: string;
  /** Optional img CSS class */
  imageClassName?: string;
}

/**
 * DA Monogram Logo component for Darey's Artrealm.
 * Automatically adapts seamlessly between dark and light themes:
 * - variant="dark": Crisp transparent charcoal (#121212) monogram for light canvas.
 * - variant="light": Crisp transparent white (#FFFFFF) monogram for dark backgrounds & hero overlays.
 */
export function Logo({
  variant = 'dark',
  size = 32,
  width,
  height,
  className,
  imageClassName,
}: LogoProps) {
  const w = width ?? size;
  const h = height ?? size;
  const src = variant === 'light' ? '/logo-light.png' : '/logo-dark.png';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center shrink-0 select-none', className)}
      style={{ width: w, height: h }}
    >
      <Image
        src={src}
        alt="DA — Darey's Artrealm monogram"
        width={w}
        height={h}
        className={cn('w-full h-full object-contain', imageClassName)}
        priority
      />
    </div>
  );
}
