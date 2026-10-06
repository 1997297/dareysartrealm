'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { ArtworkImage } from '@/types/artwork';
import { cn } from '@/lib/utils';

interface ArtworkViewerProps {
  isOpen: boolean;
  images: ArtworkImage[];
  initialIndex?: number;
  artworkTitle: string;
  onClose: () => void;
}

export function ArtworkViewer({
  isOpen,
  images,
  initialIndex = 0,
  artworkTitle,
  onClose,
}: ArtworkViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync index on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPan({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  const currentImage = images[currentIndex] || images[0];

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Zoom handlers
  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, zoomIn, zoomOut]);

  // Mouse pan handlers for zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Fullscreen viewer for ${artworkTitle}`}
      className="fixed inset-0 z-50 flex flex-col bg-[#0F0E0D]/95 backdrop-blur-xl text-canvas select-none pt-safe pb-safe"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top Header / Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 z-10 gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-base sm:text-xl font-normal text-white truncate">
            {artworkTitle}
          </h2>
          <span className="font-sans text-[0.6875rem] sm:text-xs text-white/60 tracking-gallery block truncate">
            {currentIndex + 1} / {images.length} {currentImage.type ? `• ${currentImage.type.toUpperCase()}` : ''}
          </span>
        </div>

        {/* Zoom Controls & Close */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={zoomIn}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
            title="Zoom In (+)"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 1}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 disabled:opacity-40"
            title="Zoom Out (-)"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          {scale > 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
              title="Reset Zoom"
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <div className="h-4 w-[1px] bg-white/20 mx-1" />
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
            title="Close Viewer (Esc)"
            aria-label="Close fullscreen viewer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Artwork Stage */}
      <div
        className={cn(
          'relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden',
          scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        )}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => (scale > 1 ? resetZoom() : setScale(2))}
      >
        <div
          className="relative max-h-full max-w-full transition-transform duration-200 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt || `${artworkTitle} - View ${currentIndex + 1}`}
            width={currentImage.width || 1600}
            height={currentImage.height || 1200}
            className="max-h-[82vh] w-auto object-contain mx-auto shadow-2xl pointer-events-none select-none"
            priority
          />
        </div>

        {/* Previous / Next Arrow Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/90 transition-all border border-white/10"
              aria-label="Previous artwork view"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/90 transition-all border border-white/10"
              aria-label="Next artwork view"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip & Caption */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 border-t border-white/10 bg-black/60 gap-3 pb-safe">
        <p className="font-sans text-[0.6875rem] sm:text-xs text-white/70 italic text-center sm:text-left">
          {currentImage.caption || `Detail inspection: ${artworkTitle}`}
          {scale > 1 && ' • Drag to pan across details'}
        </p>

        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => {
                  setScale(1);
                  setPan({ x: 0, y: 0 });
                  setCurrentIndex(idx);
                }}
                className={cn(
                  'relative h-12 w-16 overflow-hidden rounded border transition-all flex-shrink-0',
                  currentIndex === idx
                    ? 'border-white opacity-100 ring-2 ring-white/50'
                    : 'border-white/20 opacity-50 hover:opacity-80'
                )}
                aria-label={`View image ${idx + 1}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `Thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
