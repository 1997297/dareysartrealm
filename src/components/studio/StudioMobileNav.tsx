'use client';

import React from 'react';
import { X } from 'lucide-react';
import { StudioSidebar } from './StudioSidebar';

interface StudioMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudioMobileNav({ isOpen, onClose }: StudioMobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[85vw] bg-canvas-subtle h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
        <div className="p-4 border-b border-canvas-border flex items-center justify-between">
          <span className="font-display text-sm font-semibold tracking-wide text-charcoal">
            NAVIGATION
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-canvas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <StudioSidebar onItemClick={onClose} className="w-full border-r-0 h-full" />
        </div>
      </div>
    </div>
  );
}
