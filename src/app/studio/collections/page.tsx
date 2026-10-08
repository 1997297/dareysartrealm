'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, ExternalLink, Trash2, FolderArchive, Layers } from 'lucide-react';
import { collectionService } from '@/services/collectionService';
import { artworkService } from '@/services/artworkService';
import { Collection } from '@/types/collection';
import { Artwork } from '@/types/artwork';
import { ConfirmationModal } from '@/components/studio/ConfirmationModal';

export default function StudioCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [cols, arts] = await Promise.all([
        collectionService.getAll({ includeUnpublished: true }),
        artworkService.getAll({ includeUnpublished: true }),
      ]);
      setCollections(cols);
      setArtworks(arts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await collectionService.delete(deleteTarget.id);
    setDeleteTarget(null);
    loadData();
  }

  function getArtworkCount(collectionSlug: string) {
    return artworks.filter((a) => a.collection?.slug === collectionSlug).length;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            SERIES & PORTFOLIOS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Curated Collections
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Organize artworks into cohesive thematic series and exhibition chapters.
          </p>
        </div>

        <Link
          href="/studio/collections/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-sans font-medium transition-colors shadow-subtle shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </Link>
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : collections.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-canvas-border bg-canvas-subtle">
          <p className="text-sm font-medium text-charcoal">No collections created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => {
            const count = getArtworkCount(col.slug);
            return (
              <div
                key={col.id}
                className="group rounded-2xl bg-canvas border border-canvas-border/80 shadow-subtle overflow-hidden flex flex-col justify-between hover:shadow-elevated transition-all"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={col.coverImage.url}
                    alt={col.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {col.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-amber-200 text-amber-900 font-bold backdrop-blur-sm">
                        Featured Series
                      </span>
                    )}
                    {col.visibility === 'draft' ? (
                      <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-stone-200 text-stone-700 font-medium backdrop-blur-sm">
                        Draft
                      </span>
                    ) : col.visibility === 'archived' ? (
                      <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-rose-100 text-rose-700 font-medium backdrop-blur-sm">
                        Archived
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-emerald-100 text-emerald-800 font-medium backdrop-blur-sm">
                        Published
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md text-[0.625rem] font-mono bg-stone-900/80 text-stone-100 backdrop-blur-sm">
                    {count} {count === 1 ? 'Artwork' : 'Artworks'}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg font-semibold text-charcoal leading-snug">
                      {col.title}
                    </h3>
                    <p className="text-xs text-charcoal-subtle font-mono mt-0.5">
                      {col.subtitle || 'Contemporary Series'}
                    </p>
                    <p className="text-xs text-charcoal-muted mt-2 line-clamp-2 leading-relaxed">
                      {col.statement}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-canvas-border flex items-center justify-between">
                    <Link
                      href={`/collections/${col.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[0.6875rem] font-medium text-charcoal hover:underline"
                    >
                      <span>Public View</span>
                      <ExternalLink className="w-3 h-3 text-charcoal-subtle" />
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/studio/collections/${col.id}`}
                        className="px-3 py-1 rounded-lg border border-canvas-border text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Manage</span>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(col)}
                        className="p-1 text-charcoal-subtle hover:text-rose-600 rounded"
                        title="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Collection "${deleteTarget?.title}"?`}
        description="Deleting this collection will remove the grouping. Associated artworks will not be deleted; their collection assignment will be unassigned."
        confirmLabel="Delete Collection"
        isDestructive={true}
      />
    </div>
  );
}
