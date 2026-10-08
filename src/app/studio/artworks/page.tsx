'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Filter,
  MoreVertical,
  ExternalLink,
  Copy,
  Archive,
  Edit,
  Eye,
  Check,
  X,
  Sparkles,
  Globe,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { ConfirmationModal } from '@/components/studio/ConfirmationModal';
import { artworkService } from '@/services/artworkService';
import { collectionService } from '@/services/collectionService';
import { Artwork, ArtworkStatus } from '@/types/artwork';
import { Collection } from '@/types/collection';

export default function StudioArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [collectionFilter, setCollectionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-desc' | 'price-asc' | 'title-asc'>('newest');
  const [loading, setLoading] = useState(true);

  // Archive modal state
  const [archiveTarget, setArchiveTarget] = useState<Artwork | null>(null);

  // Preview modal state
  const [previewArtwork, setPreviewArtwork] = useState<Artwork | null>(null);

  // Notification feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadArtworks();
  }, []);

  async function loadArtworks() {
    try {
      setLoading(true);
      const [allArt, allCols] = await Promise.all([
        artworkService.getAll({ includeUnpublished: true }),
        collectionService.getAll({ includeUnpublished: true }),
      ]);
      setArtworks(allArt);
      setCollections(allCols);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function showFeedback(msg: string) {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleDuplicate(artwork: Artwork) {
    const dup = await artworkService.duplicate(artwork.id);
    if (dup) {
      showFeedback(`Created copy "${dup.title}" as draft.`);
      loadArtworks();
    }
  }

  async function handleConfirmArchive() {
    if (!archiveTarget) return;
    await artworkService.archive(archiveTarget.id);
    showFeedback(`Archived "${archiveTarget.title}".`);
    setArchiveTarget(null);
    loadArtworks();
  }

  async function handleTogglePieceOfTheMonth(artwork: Artwork) {
    if (artwork.isPieceOfTheMonth) {
      await artworkService.update(artwork.id, { isPieceOfTheMonth: false });
      showFeedback(`Cleared Piece of the Month designation from "${artwork.title}".`);
    } else {
      await artworkService.setPieceOfTheMonth(artwork.id);
      showFeedback(`Designated "${artwork.title}" as Piece of the Month.`);
    }
    loadArtworks();
  }

  async function handleTogglePublish(artwork: Artwork) {
    const nextStatus = artwork.publicationStatus === 'published' ? 'draft' : 'published';
    await artworkService.update(artwork.id, { publicationStatus: nextStatus });
    showFeedback(`Artwork "${artwork.title}" set to ${nextStatus}.`);
    loadArtworks();
  }

  // Filter & sort logic
  const filtered = artworks.filter((art) => {
    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'draft') {
        if (art.publicationStatus !== 'draft' && art.status !== 'draft') return false;
      } else if (statusFilter === 'archived') {
        if (art.publicationStatus !== 'archived') return false;
      } else {
        if (art.status !== statusFilter) return false;
      }
    }

    // Collection filter
    if (collectionFilter !== 'all') {
      if (art.collection?.slug !== collectionFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        art.title.toLowerCase().includes(q) ||
        art.artworkId.toLowerCase().includes(q) ||
        art.medium.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  // Sort
  filtered.sort((a, b) => {
    if (sortBy === 'newest') return b.year - a.year;
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            INVENTORY MANAGEMENT
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Artwork Catalogue
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {artworks.length} total canvases catalogued &bull; {artworks.filter((a) => a.status === 'available').length} available for acquisition
          </p>
        </div>

        <Link
          href="/studio/artworks/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-sans font-medium transition-colors shadow-subtle shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Artwork</span>
        </Link>
      </div>

      {/* Controls: Search, Filters, Sort, View Toggle */}
      <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, ID (e.g. DAR-2026-001), medium, pigments..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-canvas-border bg-canvas text-charcoal placeholder:text-charcoal-subtle text-xs font-sans focus:outline-none focus:border-charcoal/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-charcoal-subtle hover:text-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-canvas-border bg-canvas shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-charcoal text-canvas'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
              aria-label="Grid View"
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-charcoal text-canvas'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
              aria-label="Table View"
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills & Sort Select */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-canvas-border/60 text-xs">
          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle mr-1">
              Status:
            </span>
            {['all', 'available', 'reserved', 'sold', 'commissioned', 'draft', 'archived'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-full text-[0.6875rem] font-mono uppercase transition-colors ${
                    statusFilter === st
                      ? 'bg-charcoal text-canvas font-bold'
                      : 'bg-canvas text-charcoal-muted hover:text-charcoal border border-canvas-border'
                  }`}
                >
                  {st === 'sold' ? 'collected' : st}
                </button>
              )
            )}
          </div>

          {/* Collection & Sort Selects */}
          <div className="flex items-center gap-2">
            <select
              value={collectionFilter}
              onChange={(e) => setCollectionFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
            >
              <option value="all">All Collections</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="title-asc">Sort: Title A–Z</option>
              <option value="price-desc">Sort: Price (High–Low)</option>
              <option value="price-asc">Sort: Price (Low–High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-canvas-border bg-canvas-subtle">
          <p className="text-sm font-medium text-charcoal">No artworks match your search or filter.</p>
          <p className="text-xs text-charcoal-muted mt-1">Try clearing filters or adding a new artwork.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCollectionFilter('all');
            }}
            className="mt-4 px-3 py-1.5 rounded-lg border border-canvas-border bg-canvas text-xs font-medium text-charcoal hover:bg-canvas-subtle"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((art) => (
            <div
              key={art.id}
              className="group rounded-2xl bg-canvas border border-canvas-border/80 shadow-subtle overflow-hidden flex flex-col justify-between transition-all hover:shadow-elevated hover:border-canvas-border"
            >
              {/* Artwork Image Container */}
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={art.coverImage.url}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                {/* Badges Over Image */}
                <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={art.status} size="sm" />
                    {art.publicationStatus === 'draft' && (
                      <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-stone-900/80 text-stone-100 backdrop-blur-sm">
                        Draft
                      </span>
                    )}
                    {art.publicationStatus === 'archived' && (
                      <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-rose-900/80 text-rose-100 backdrop-blur-sm">
                        Archived
                      </span>
                    )}
                  </div>
                  {art.isPieceOfTheMonth && (
                    <span className="px-2 py-0.5 rounded-md text-[0.625rem] font-mono uppercase bg-amber-500 text-stone-950 font-semibold flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Piece of the Month</span>
                    </span>
                  )}
                </div>

                {/* Quick Action Overlay On Hover */}
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewArtwork(art)}
                    className="p-2 rounded-xl bg-canvas text-charcoal hover:bg-canvas-subtle shadow-md transition-transform hover:scale-105"
                    title="Simulate Public Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/studio/artworks/${art.id}`}
                    className="p-2 rounded-xl bg-canvas text-charcoal hover:bg-canvas-subtle shadow-md transition-transform hover:scale-105"
                    title="Edit Artwork Dossier"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Artwork Details Body */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[0.6875rem] font-mono text-charcoal-subtle">
                    <span>{art.artworkId}</span>
                    <span>{art.year}</span>
                  </div>
                  <Link href={`/studio/artworks/${art.id}`} className="hover:underline block">
                    <h3 className="font-display text-base font-semibold text-charcoal leading-snug line-clamp-1 mt-0.5">
                      {art.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-charcoal-muted line-clamp-1 font-sans">
                    {art.medium}
                  </p>
                  <p className="text-[0.6875rem] text-charcoal-subtle font-mono mt-1">
                    {art.width} &times; {art.height} cm &bull; {art.collection?.title || 'Unassigned'}
                  </p>
                </div>

                <div className="pt-2 border-t border-canvas-border flex items-center justify-between">
                  <p className="text-xs font-semibold text-charcoal font-mono">
                    {art.isPriceOnRequest
                      ? 'Price on Request'
                      : `$${art.price?.toLocaleString()} ${art.currency}`}
                  </p>

                  <div className="flex items-center gap-1 text-charcoal-muted">
                    <button
                      onClick={() => handleTogglePieceOfTheMonth(art)}
                      className={`p-1.5 rounded hover:bg-canvas-subtle touch-target flex items-center justify-center ${
                        art.isPieceOfTheMonth ? 'text-amber-600 bg-amber-50' : 'hover:text-amber-600'
                      }`}
                      title={art.isPieceOfTheMonth ? 'Clear Piece of the Month' : 'Designate Piece of the Month'}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleTogglePublish(art)}
                      className={`p-1.5 rounded hover:bg-canvas-subtle touch-target flex items-center justify-center ${
                        art.publicationStatus === 'published' ? 'text-emerald-700' : 'text-stone-400'
                      }`}
                      title={art.publicationStatus === 'published' ? 'Unpublish to draft' : 'Publish artwork'}
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/studio/artworks/${art.id}`}
                      className="p-1.5 hover:text-charcoal rounded hover:bg-canvas-subtle touch-target flex items-center justify-center"
                      title="Edit artwork dossier"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDuplicate(art)}
                      className="p-1.5 hover:text-charcoal rounded hover:bg-canvas-subtle touch-target flex items-center justify-center"
                      title="Duplicate as draft"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setArchiveTarget(art)}
                      className="p-1.5 hover:text-rose-600 rounded hover:bg-canvas-subtle touch-target flex items-center justify-center"
                      title="Archive artwork"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-canvas-border bg-canvas shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle border-b border-canvas-border text-[0.6875rem] font-mono uppercase tracking-wider text-charcoal-subtle">
              <tr>
                <th className="py-3 px-4">Artwork</th>
                <th className="py-3 px-4">Identifier</th>
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Dimensions</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border/70">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-canvas-subtle/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.coverImage.url}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/studio/artworks/${art.id}`}
                            className="font-display text-sm font-semibold text-charcoal hover:underline truncate block"
                          >
                            {art.title}
                          </Link>
                          {art.isPieceOfTheMonth && (
                            <span className="px-1.5 py-0.5 rounded text-[0.5625rem] font-mono uppercase bg-amber-500 text-stone-950 font-bold flex items-center gap-0.5 shadow-2xs">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>POTM</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[0.6875rem] text-charcoal-muted line-clamp-1">
                          {art.medium} ({art.year})
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-charcoal font-medium">
                    {art.artworkId}
                  </td>
                  <td className="py-3 px-4 text-charcoal-muted">
                    {art.collection?.title || 'Unassigned'}
                  </td>
                  <td className="py-3 px-4 font-mono text-charcoal-subtle text-[0.6875rem]">
                    {art.width} &times; {art.height} cm
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-charcoal">
                    {art.isPriceOnRequest
                      ? 'Price on Request'
                      : `$${art.price?.toLocaleString()} ${art.currency}`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <StatusBadge status={art.status} size="sm" />
                      <button
                        onClick={() => handleTogglePublish(art)}
                        className={`text-[0.625rem] font-mono uppercase px-1.5 py-0.5 rounded border transition-colors ${
                          art.publicationStatus === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {art.publicationStatus}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleTogglePieceOfTheMonth(art)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          art.isPieceOfTheMonth
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'border-canvas-border text-charcoal-muted hover:text-amber-600 hover:bg-canvas-subtle'
                        }`}
                        title={art.isPieceOfTheMonth ? 'Clear Piece of the Month' : 'Designate Piece of the Month'}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setPreviewArtwork(art)}
                        className="p-1.5 rounded-lg border border-canvas-border text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <Link
                        href={`/studio/artworks/${art.id}`}
                        className="p-1.5 rounded-lg border border-canvas-border text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle transition-colors"
                        title="Edit Dossier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(art)}
                        className="p-1.5 rounded-lg border border-canvas-border text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setArchiveTarget(art)}
                        className="p-1.5 rounded-lg border border-canvas-border text-charcoal-muted hover:text-rose-600 hover:bg-canvas-subtle transition-colors"
                        title="Archive"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Archive Confirmation Dialog */}
      <ConfirmationModal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleConfirmArchive}
        title={`Archive "${archiveTarget?.title}"?`}
        description="Archiving will remove this artwork from the active catalogue and exhibition displays. The record and its provenance history will remain safely stored in the studio archive."
        confirmLabel="Archive Artwork"
        isDestructive={true}
      />

      {/* Public Preview Simulation Modal */}
      {previewArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            onClick={() => setPreviewArtwork(null)}
          />
          <div className="relative w-full max-w-3xl bg-canvas rounded-2xl border border-canvas-border shadow-elevated p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-canvas-border">
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                PUBLIC CATALOGUE PREVIEW SIMULATION
              </span>
              <button
                onClick={() => setPreviewArtwork(null)}
                className="p-1 text-charcoal-subtle hover:text-charcoal rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="rounded-xl overflow-hidden bg-stone-100 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewArtwork.coverImage.url}
                  alt={previewArtwork.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                    {previewArtwork.collection?.title || 'Studio Collection'}
                  </span>
                  <h2 className="font-display text-2xl text-charcoal font-semibold mt-1">
                    {previewArtwork.title}
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {previewArtwork.medium} &bull; {previewArtwork.year}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-canvas-subtle border border-canvas-border/80">
                  <p className="text-xs text-charcoal-subtle font-mono">SPECIFICATIONS</p>
                  <p className="text-xs text-charcoal mt-1">
                    Dimensions: {previewArtwork.width} &times; {previewArtwork.height} cm
                  </p>
                  <p className="text-xs text-charcoal mt-0.5">
                    Orientation: {previewArtwork.orientation}
                  </p>
                  <p className="text-xs text-charcoal mt-0.5">
                    Price:{' '}
                    {previewArtwork.isPriceOnRequest
                      ? 'Price on Request'
                      : `$${previewArtwork.price?.toLocaleString()} ${previewArtwork.currency}`}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-charcoal-subtle font-mono uppercase">Curator Description</p>
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                    {previewArtwork.description}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/artworks/${previewArtwork.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs text-charcoal hover:underline font-medium"
                  >
                    <span>Open Live Public Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
