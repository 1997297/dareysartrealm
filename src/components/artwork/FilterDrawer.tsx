'use client';

import React, { useEffect } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { ArtworkFilters, ArtworkOrientation, ArtworkStatus } from '@/types/artwork';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FilterDrawerProps {
  isOpen: boolean;
  filters: ArtworkFilters;
  onFilterChange: (filters: ArtworkFilters) => void;
  onClose: () => void;
  onReset: () => void;
  totalResultsCount: number;
}

const MEDIUM_OPTIONS = [
  'Acrylic',
  'Oil',
  'Charcoal',
  'Gold Leaf',
  'Encaustic',
  'Sand',
  'Mixed Media',
];

const ORIENTATION_OPTIONS: { label: string; value: ArtworkOrientation | 'all' }[] = [
  { label: 'All Orientations', value: 'all' },
  { label: 'Portrait', value: 'portrait' },
  { label: 'Landscape', value: 'landscape' },
  { label: 'Square', value: 'square' },
  { label: 'Panoramic', value: 'panoramic' },
];

const SIZE_OPTIONS: { label: string; value: ArtworkFilters['size']; desc: string }[] = [
  { label: 'All Sizes', value: 'all', desc: 'Any scale' },
  { label: 'Small', value: 'small', desc: '< 60 cm' },
  { label: 'Medium', value: 'medium', desc: '60 â€“ 120 cm' },
  { label: 'Large', value: 'large', desc: '120 â€“ 160 cm' },
  { label: 'Monumental', value: 'monumental', desc: '> 160 cm' },
];

const STATUS_OPTIONS: { label: string; value: ArtworkStatus | 'all' }[] = [
  { label: 'All Works', value: 'all' },
  { label: 'Available for Acquisition', value: 'available' },
  { label: 'Currently Reserved', value: 'reserved' },
  { label: 'Collected / Sold Works', value: 'sold' },
  { label: 'Private Commissions', value: 'commissioned' },
];

const COLLECTION_OPTIONS = [
  { label: 'All Collections', value: 'all' },
  { label: 'Human Stories', value: 'human-stories' },
  { label: 'Atmospheric Currents', value: 'atmospheric-currents' },
];

export function FilterDrawer({
  isOpen,
  filters,
  onFilterChange,
  onClose,
  onReset,
  totalResultsCount,
}: FilterDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-charcoal/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md sm:max-w-lg bg-canvas h-full max-h-screen shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 border-l border-canvas-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-canvas-border bg-canvas-paper">
          <div>
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle uppercase tracking-gallery">
              EXHIBITION CONTROLS
            </span>
            <h2 id="filter-drawer-title" className="font-display text-xl sm:text-2xl text-charcoal">
              Filter Artworks
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-charcoal-muted hover:text-charcoal transition-colors rounded-full hover:bg-canvas-muted"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Availability Status */}
          <div>
            <h3 className="font-sans text-xs font-semibold text-charcoal uppercase tracking-gallery mb-3">
              Availability Status
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = (filters.status || 'all') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, status: opt.value })}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 text-xs text-left border rounded-sm transition-all',
                      isSelected
                        ? 'border-charcoal bg-charcoal text-canvas font-medium'
                        : 'border-canvas-border hover:border-charcoal/40 text-charcoal bg-canvas'
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collection */}
          <div>
            <h3 className="font-sans text-xs font-semibold text-charcoal uppercase tracking-gallery mb-3">
              Body of Work / Collection
            </h3>
            <div className="flex flex-wrap gap-2">
              {COLLECTION_OPTIONS.map((opt) => {
                const isSelected = (filters.collectionSlug || 'all') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, collectionSlug: opt.value })}
                    className={cn(
                      'px-3 py-1.5 text-xs border rounded-sm transition-all',
                      isSelected
                        ? 'border-charcoal bg-charcoal text-canvas'
                        : 'border-canvas-border hover:border-charcoal/40 text-charcoal bg-canvas'
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Medium */}
          <div>
            <h3 className="font-sans text-xs font-semibold text-charcoal uppercase tracking-gallery mb-3">
              Medium & Material
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, medium: 'all' })}
                className={cn(
                  'px-3 py-1.5 text-xs border rounded-sm transition-all',
                  !filters.medium || filters.medium === 'all'
                    ? 'border-charcoal bg-charcoal text-canvas'
                    : 'border-canvas-border hover:border-charcoal/40 text-charcoal bg-canvas'
                )}
              >
                All Mediums
              </button>
              {MEDIUM_OPTIONS.map((med) => {
                const isSelected = filters.medium?.toLowerCase() === med.toLowerCase();
                return (
                  <button
                    key={med}
                    type="button"
                    onClick={() =>
                      onFilterChange({
                        ...filters,
                        medium: isSelected ? 'all' : med,
                      })
                    }
                    className={cn(
                      'px-3 py-1.5 text-xs border rounded-sm transition-all',
                      isSelected
                        ? 'border-charcoal bg-charcoal text-canvas'
                        : 'border-canvas-border hover:border-charcoal/40 text-charcoal bg-canvas'
                    )}
                  >
                    {med}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Orientation */}
          <div>
            <h3 className="font-sans text-xs font-semibold text-charcoal uppercase tracking-gallery mb-3">
              Canvas Orientation
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {ORIENTATION_OPTIONS.map((opt) => {
                const isSelected = (filters.orientation || 'all') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, orientation: opt.value })}
                    className={cn(
                      'px-3 py-2 text-xs text-center border rounded-sm transition-all',
                      isSelected
                        ? 'border-charcoal bg-charcoal text-canvas'
                        : 'border-canvas-border hover:border-charcoal/40 text-charcoal bg-canvas'
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scale / Dimension Brackets */}
          <div>
            <h3 className="font-sans text-xs font-semibold text-charcoal uppercase tracking-gallery mb-3">
              Scale & Dimensions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SIZE_OPTIONS.map((opt) => {
                const isSelected = (filters.size || 'all') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, size: opt.value })}
                    className={cn(
                      'flex flex-col text-left px-3 py-2 border rounded-sm transition-all',
                      isSelected
                        ? 'border-charcoal bg-charcoal text-canvas'
                        : 'border-canvas-border hover:border-charcoal/40 text-charcoal bg-canvas'
                    )}
                  >
                    <span className="text-xs font-medium">{opt.label}</span>
                    <span className={cn('text-[0.625rem]', isSelected ? 'text-canvas/80' : 'text-charcoal-subtle')}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-canvas-border bg-canvas-paper flex items-center justify-between gap-4 pb-safe">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-sans uppercase tracking-gallery text-charcoal-muted hover:text-charcoal transition-colors py-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All</span>
          </button>

          <Button onClick={onClose} variant="primary" size="md" className="text-xs">
            Show {totalResultsCount} {totalResultsCount === 1 ? 'Artwork' : 'Artworks'}
          </Button>
        </div>
      </div>
    </div>
  );
}
