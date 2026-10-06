'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Upload, RotateCcw, Move, Info, Sliders } from 'lucide-react';
import { Artwork } from '@/types/artwork';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ViewInSpaceModalProps {
  isOpen: boolean;
  artwork: Artwork;
  onClose: () => void;
}

const PRESET_ROOMS = [
  {
    id: 'gallery',
    name: 'Minimalist Gallery Wall',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    defaultWallWidth: 4.2, // meters
    defaultWallHeight: 3.0,
  },
  {
    id: 'living-room',
    name: 'Contemporary Living Room',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    defaultWallWidth: 4.5,
    defaultWallHeight: 2.8,
  },
  {
    id: 'dining',
    name: 'Warm Architectural Space',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    defaultWallWidth: 3.8,
    defaultWallHeight: 2.8,
  },
];

export function ViewInSpaceModal({ isOpen, artwork, onClose }: ViewInSpaceModalProps) {
  const [selectedRoomUrl, setSelectedRoomUrl] = useState<string>(PRESET_ROOMS[0].url);
  const [customRoomUrl, setCustomRoomUrl] = useState<string | null>(null);
  const [wallWidthMeters, setWallWidthMeters] = useState<number>(4.2);
  const [wallHeightMeters, setWallHeightMeters] = useState<number>(3.0);
  const [artworkScaleMultiplier, setArtworkScaleMultiplier] = useState<number>(1.0);
  const [frameStyle, setFrameStyle] = useState<'raw' | 'float' | 'shadow'>('shadow');

  // Drag position on the wall
  const [position, setPosition] = useState({ x: 0, y: -20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setPosition({ x: 0, y: -20 });
      setArtworkScaleMultiplier(1.0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clean up object url on unmount
  useEffect(() => {
    return () => {
      if (customRoomUrl) {
        URL.revokeObjectURL(customRoomUrl);
      }
    };
  }, [customRoomUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomRoomUrl(url);
      setSelectedRoomUrl(url);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Calculate relative artwork width in % of wall
  // Artwork width in cm / (wall width in meters * 100)
  const basePercentage = ((artwork.width / (wallWidthMeters * 100)) * 100);
  const calculatedWidthPct = Math.min(Math.max(basePercentage * artworkScaleMultiplier, 10), 85);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="view-in-space-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-charcoal/80 backdrop-blur-md"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative w-full max-w-5xl bg-canvas border border-canvas-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-canvas-border bg-canvas-paper">
          <div>
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle tracking-gallery uppercase">
              SPATIAL VISUALIZER PROTOTYPE
            </span>
            <h2 id="view-in-space-title" className="font-display text-xl sm:text-2xl text-charcoal">
              View in Your Space: {artwork.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-charcoal-muted hover:text-charcoal transition-colors rounded-full hover:bg-canvas-muted"
            aria-label="Close visualizer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Informational Disclaimer Banner */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-canvas-subtle/80 border-b border-canvas-border text-xs text-charcoal-muted font-light">
          <Info className="h-4 w-4 text-charcoal-subtle flex-shrink-0" />
          <span>
            Approximate visualization. Scaling is calculated relative to your wall dimensions ({artwork.width} Ã— {artwork.height} cm canvas).
          </span>
        </div>

        {/* Visualizer Stage */}
        <div
          className="relative flex-1 min-h-[380px] sm:min-h-[460px] overflow-hidden bg-charcoal/5 flex items-center justify-center cursor-default select-none"
        >
          {/* Wall Background Image */}
          <div className="absolute inset-0">
            <Image
              src={selectedRoomUrl}
              alt="Wall environment"
              fill
              className="object-cover pointer-events-none"
              priority
            />
            <div className="absolute inset-0 bg-black/5" />
          </div>

          {/* Draggable Artwork Component */}
          <div
            className={cn(
              'absolute cursor-grab active:cursor-grabbing transition-transform select-none z-10',
              frameStyle === 'shadow' && 'shadow-2xl',
              frameStyle === 'float' && 'p-2 bg-neutral-900 shadow-2xl border border-neutral-700'
            )}
            style={{
              width: `${calculatedWidthPct}%`,
              transform: `translate(${position.x}px, ${position.y}px)`,
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="relative aspect-[inherit] w-full">
              <Image
                src={artwork.coverImage.url}
                alt={artwork.title}
                width={artwork.coverImage.width || 1200}
                height={artwork.coverImage.height || 1600}
                className="w-full h-auto object-contain pointer-events-none drop-shadow-lg"
              />
            </div>

            {/* Drag Handle Indicator */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 bg-charcoal/70 text-white text-[0.625rem] tracking-wider uppercase backdrop-blur-sm rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <Move className="h-3 w-3" />
              <span>Drag to move</span>
            </div>
          </div>
        </div>

        {/* Bottom Control Panel */}
        <div className="p-4 sm:p-6 bg-canvas border-t border-canvas-border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Room Selector & Upload */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-sans text-xs text-charcoal-muted uppercase tracking-gallery mr-2">
              Wall:
            </span>
            {PRESET_ROOMS.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  setSelectedRoomUrl(room.url);
                  setWallWidthMeters(room.defaultWallWidth);
                  setWallHeightMeters(room.defaultWallHeight);
                }}
                className={cn(
                  'px-3 py-1 text-xs border rounded-sm transition-all',
                  selectedRoomUrl === room.url
                    ? 'border-charcoal bg-charcoal text-canvas'
                    : 'border-canvas-border hover:border-charcoal/50 text-charcoal'
                )}
              >
                {room.name}
              </button>
            ))}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1 text-xs border border-dashed border-charcoal/40 hover:border-charcoal text-charcoal rounded-sm"
              title="Upload your own wall photo (remains 100% in your browser)"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload Your Wall</span>
            </button>
          </div>

          {/* Wall Dimension & Fine-tuning Sliders */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-charcoal">
              <span className="text-charcoal-muted">Wall Width:</span>
              <input
                type="number"
                min="1.5"
                max="10"
                step="0.1"
                value={wallWidthMeters}
                onChange={(e) => setWallWidthMeters(parseFloat(e.target.value) || 4.0)}
                className="w-16 px-2 py-0.5 border border-canvas-border rounded text-center text-xs"
              />
              <span className="text-charcoal-subtle">m</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-charcoal">
              <span className="text-charcoal-muted">Scale Adj:</span>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={artworkScaleMultiplier}
                onChange={(e) => setArtworkScaleMultiplier(parseFloat(e.target.value))}
                className="w-20 accent-charcoal cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setPosition({ x: 0, y: -20 });
                setArtworkScaleMultiplier(1.0);
              }}
              className="p-1.5 text-charcoal-muted hover:text-charcoal rounded border border-canvas-border hover:border-charcoal transition-colors"
              title="Reset Position"
              aria-label="Reset position"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
