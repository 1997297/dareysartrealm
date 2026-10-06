'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Check, Trash2, ExternalLink } from 'lucide-react';
import { collectionService } from '@/services/collectionService';
import { artworkService } from '@/services/artworkService';
import { Collection } from '@/types/collection';
import { Artwork } from '@/types/artwork';

interface CollectionEditorProps {
  initialCollection?: Collection;
  isNew?: boolean;
}

export function CollectionEditor({ initialCollection, isNew = false }: CollectionEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialCollection?.title || '');
  const [subtitle, setSubtitle] = useState(initialCollection?.subtitle || '');
  const [slug, setSlug] = useState(initialCollection?.slug || '');
  const [statement, setStatement] = useState(initialCollection?.statement || '');
  const [description, setDescription] = useState(initialCollection?.description || '');
  const [year, setYear] = useState<number>(initialCollection?.year || new Date().getFullYear());
  const [featured, setFeatured] = useState<boolean>(initialCollection?.featured || false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    initialCollection?.coverImage?.url || '/artworks/pic1.jpeg'
  );

  const [allArtworks, setAllArtworks] = useState<Artwork[]>([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadArtworks() {
      const list = await artworkService.getAll();
      setAllArtworks(list);
    }
    loadArtworks();
  }, []);

  // Auto slug from title
  useEffect(() => {
    if (isNew && title && !initialCollection?.slug) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      );
    }
  }, [title, isNew, initialCollection]);

  // Determine which artworks belong to this collection
  const assignedArtworks = allArtworks.filter(
    (a) => a.collection?.slug === (initialCollection?.slug || slug)
  );

  async function toggleArtworkAssignment(artwork: Artwork) {
    const isAssigned = artwork.collection?.slug === slug;
    const targetSlug = slug || 'temp-collection';
    const targetTitle = title || 'Untitled Collection';

    if (isAssigned) {
      // Unassign
      await artworkService.update(artwork.id, { collection: undefined });
    } else {
      // Assign
      await artworkService.update(artwork.id, {
        collection: {
          id: initialCollection?.id || `col-${Date.now()}`,
          slug: targetSlug,
          title: targetTitle,
        },
      });
    }

    // Refresh local artworks
    const refreshed = await artworkService.getAll();
    setAllArtworks(refreshed);
  }

  async function handleSave() {
    if (!title.trim()) {
      alert('Please provide a collection title.');
      return;
    }

    setSaving(true);
    const finalSlug = slug.trim() || title.toLowerCase().replace(/\s+/g, '-');

    const collectionData: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      slug: finalSlug,
      statement: statement.trim(),
      description: description.trim(),
      year,
      featured,
      artworkCount: assignedArtworks.length,
      coverImage: {
        url: coverImageUrl,
        alt: `${title} Curated Series Cover`,
        width: 1600,
        height: 900,
      },
    };

    try {
      if (isNew) {
        const created = await collectionService.create(collectionData);
        setFeedback(`Collection "${created.title}" successfully established.`);
        setTimeout(() => router.push('/studio/collections'), 1200);
      } else if (initialCollection) {
        await collectionService.update(initialCollection.id, collectionData);
        setFeedback('Collection changes saved.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e) {
      console.error(e);
      alert('Error saving collection.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div className="flex items-center gap-3">
          <Link
            href="/studio/collections"
            className="p-2 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle uppercase">
              {isNew ? 'NEW COLLECTION' : 'CURATORIAL DOSSIER'}
            </span>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-charcoal tracking-tight mt-0.5">
              {title || 'Untitled Collection'}
            </h1>
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-medium transition-colors shadow-subtle disabled:opacity-50 shrink-0"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isNew ? 'Create Collection' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Metadata (7 cols) */}
        <div className="lg:col-span-7 space-y-5 bg-canvas-subtle p-6 rounded-2xl border border-canvas-border/80 shadow-subtle">
          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Collection Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Terracotta & Soil"
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Subtitle / Series Descriptor
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Earth Pigments & Natural Clays"
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Year of Exhibition
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              URL Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal-subtle font-mono">/collections/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Curatorial Statement (Lead Poetic Quote)
            </label>
            <textarea
              rows={3}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Poetic core thesis summarizing the chromatic and conceptual exploration..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Extended Curatorial Overview
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="In-depth exhibition text discussing technique, regional pigment sourcing, and thematic background..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
              Cover Image URL
            </label>
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
            />
            <div className="mt-2 aspect-[16/9] max-w-sm rounded-xl overflow-hidden bg-stone-100 border border-canvas-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt="Cover Preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-canvas-border bg-canvas flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">Featured on Homepage</p>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Highlight this series as the primary featured collection across public views.
              </p>
            </div>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-5 h-5 rounded border-canvas-border text-charcoal focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Panel: Artwork Membership Management (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-canvas-subtle p-6 rounded-2xl border border-canvas-border/80 shadow-subtle space-y-4">
            <div>
              <h2 className="font-display text-base font-semibold text-charcoal">
                Artwork Membership ({assignedArtworks.length})
              </h2>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Select which catalogued paintings belong to this collection.
              </p>
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {allArtworks.map((art) => {
                const isAssigned = art.collection?.slug === slug;
                return (
                  <div
                    key={art.id}
                    onClick={() => toggleArtworkAssignment(art)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isAssigned
                        ? 'bg-canvas border-charcoal shadow-subtle'
                        : 'bg-canvas/50 border-canvas-border/70 hover:bg-canvas'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.coverImage.url}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-charcoal truncate">
                          {art.title}
                        </p>
                        <p className="text-[0.6875rem] text-charcoal-muted font-mono truncate">
                          {art.artworkId} &bull; {art.width}&times;{art.height} cm
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        isAssigned
                          ? 'bg-charcoal text-canvas border-charcoal'
                          : 'border-canvas-border text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
