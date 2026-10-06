'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isDestructive = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-canvas rounded-2xl border border-canvas-border shadow-elevated p-6 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isDestructive
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-amber-50 text-amber-600 border border-amber-200'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl text-charcoal font-medium leading-snug">
              {title}
            </h3>
            <p className="mt-2 text-sm text-charcoal-muted leading-relaxed font-sans">
              {description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-charcoal-subtle hover:text-charcoal transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-canvas-border/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-sans font-medium uppercase tracking-wider text-charcoal-muted hover:text-charcoal transition-colors"
          >
            {cancelLabel}
          </button>

          <Button
            variant={isDestructive ? 'primary' : 'primary'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={isDestructive ? 'bg-rose-700 hover:bg-rose-800 text-white border-transparent' : ''}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
