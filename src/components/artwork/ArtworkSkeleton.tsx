import React from 'react';
import { cn } from '@/lib/utils';
import { ArtworkOrientation } from '@/types/artwork';

interface ArtworkSkeletonProps {
  orientation?: ArtworkOrientation;
  className?: string;
}

export function ArtworkSkeleton({
  orientation = 'portrait',
  className,
}: ArtworkSkeletonProps) {
  const aspectClasses = {
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    square: 'aspect-square',
    panoramic: 'aspect-[21/9]',
  };

  return (
    <div className={cn('w-full animate-pulse space-y-4', className)}>
      <div
        className={cn(
          'w-full bg-canvas-muted/60 rounded-xl border border-canvas-border',
          aspectClasses[orientation]
        )}
      />
      <div className="space-y-2 pt-2">
        <div className="h-5 w-2/3 bg-canvas-muted rounded-md" />
        <div className="h-3 w-1/3 bg-canvas-muted/70 rounded-md" />
      </div>
    </div>
  );
}
