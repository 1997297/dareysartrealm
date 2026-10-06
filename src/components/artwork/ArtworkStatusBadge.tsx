import React from 'react';
import { ArtworkStatus } from '@/types/artwork';
import { cn } from '@/lib/utils';

interface ArtworkStatusBadgeProps {
  status: ArtworkStatus;
  className?: string;
}

export function ArtworkStatusBadge({ status, className }: ArtworkStatusBadgeProps) {
  const statusConfig = {
    available: {
      label: 'AVAILABLE',
      dotClass: 'bg-emerald-600',
      badgeClass: 'text-charcoal bg-canvas-paper/95 border-canvas-border',
    },
    reserved: {
      label: 'RESERVED',
      dotClass: 'bg-amber-500',
      badgeClass: 'text-charcoal-muted bg-canvas-paper/95 border-canvas-border',
    },
    sold: {
      label: 'COLLECTED',
      dotClass: 'bg-charcoal-subtle',
      badgeClass: 'text-charcoal-muted bg-canvas-paper/95 border-canvas-border',
    },
    commissioned: {
      label: 'COMMISSIONED',
      dotClass: 'bg-accent-cobalt',
      badgeClass: 'text-charcoal bg-canvas-paper/95 border-canvas-border',
    },
    draft: {
      label: 'STUDIO DRAFT',
      dotClass: 'bg-charcoal-subtle',
      badgeClass: 'text-charcoal-subtle bg-canvas-subtle border-canvas-border',
    },
  };

  const current = statusConfig[status] || statusConfig.available;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.625rem] font-sans font-medium uppercase tracking-gallery border backdrop-blur-sm shadow-sm select-none',
        current.badgeClass,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full inline-block', current.dotClass)} />
      <span>{current.label}</span>
    </span>
  );
}
