'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Eye,
  Archive,
  Upload,
  Trash2,
  Star,
  Check,
  AlertCircle,
  Plus,
  Image as ImageIcon,
  ExternalLink,
  Loader2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ConfirmationModal } from './ConfirmationModal';
import { artworkService } from '@/services/artworkService';
import { collectionService } from '@/services/collectionService';
import { mediaService } from '@/services/mediaService';
import { Artwork, ArtworkImage, ArtworkOrientation, ArtworkStatus, ArtworkImageType } from '@/types/artwork';
import { Collection } from '@/types/collection';

interface ArtworkEditorProps {
  initialArtwork?: Artwork;
  isNew?: boolean;
}

export function ArtworkEditor({ initialArtwork, isNew = false }: ArtworkEditorProps) {
  const router = useRouter();

  // Collections for dropdown
  const [collections, setCollections] = useState<Collection[]>([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'core' | 'physical' | 'commerce' | 'organisation' | 'media' | 'publishing' | 'seo'
  >('core');

  // Form States
  const [title, setTitle] = useState(initialArtwork?.title || '');
  const [artworkId, setArtworkId] = useState(
    initialArtwork?.artworkId || `DAR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
  );
  const [slug, setSlug] = useState(initialArtwork?.slug || '');
  const [year, setYear] = useState<number>(initialArtwork?.year || new Date().getFullYear());
  const [description, setDescription] = useState(initialArtwork?.description || '');
  const [story, setStory] = useState(initialArtwork?.story || '');
  const [availabilityNote, setAvailabilityNote] = useState(initialArtwork?.availabilityNote || '');

  // Physical
  const [medium, setMedium] = useState(initialArtwork?.medium || '');
  const [width, setWidth] = useState<number | undefined>(initialArtwork?.width);
  const [height, setHeight] = useState<number | undefined>(initialArtwork?.height);
  const [depth, setDepth] = useState<number | undefined>(initialArtwork?.depth);
  const [orientation, setOrientation] = useState<ArtworkOrientation>(initialArtwork?.orientation || 'portrait');

  // Commerce
  const [status, setStatus] = useState<ArtworkStatus>(
    initialArtwork?.status === 'sold' ? 'collected' : (initialArtwork?.status || 'available')
  );
  const [price, setPrice] = useState<number | undefined>(initialArtwork?.price);
  const [currency, setCurrency] = useState(initialArtwork?.currency || 'USD');
  const [isPriceOnRequest, setIsPriceOnRequest] = useState<boolean>(initialArtwork?.isPriceOnRequest || false);

  // Organisation
  const [collectionSlug, setCollectionSlug] = useState<string>(initialArtwork?.collection?.slug || '');
  const [tagsInput, setTagsInput] = useState<string>(initialArtwork?.tags?.join(', ') || '');
  const [featured, setFeatured] = useState<boolean>(initialArtwork?.featured || false);
  const [isPieceOfTheMonth, setIsPieceOfTheMonth] = useState<boolean>(initialArtwork?.isPieceOfTheMonth || false);
  const [displayOrder, setDisplayOrder] = useState<number>(initialArtwork?.displayOrder || 1);

  // Publishing
  const [publicationStatus, setPublicationStatus] = useState<'published' | 'draft' | 'archived'>(
    initialArtwork?.publicationStatus || (isNew ? 'draft' : 'published')
  );

  // SEO
  const [metaTitle, setMetaTitle] = useState(initialArtwork?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialArtwork?.metaDescription || '');

  // Media List
  const [images, setImages] = useState<ArtworkImage[]>(
    initialArtwork?.images?.length
      ? initialArtwork.images
      : initialArtwork?.coverImage
      ? [initialArtwork.coverImage]
      : []
  );

  // UI state
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [customUrlType, setCustomUrlType] = useState<ArtworkImageType>('detail');
  const [showAddUrl, setShowAddUrl] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Auto-generate slug from title if new
  useEffect(() => {
    if (isNew && title && !initialArtwork?.slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title, isNew, initialArtwork]);

  useEffect(() => {
    async function loadCollections() {
      const cols = await collectionService.getAll();
      setCollections(cols);
      if (isNew && cols.length > 0 && !collectionSlug) {
        setCollectionSlug(cols[0].slug);
      }
    }
    loadCollections();
  }, [isNew, collectionSlug]);

  function markDirty() {
    if (!isDirty) setIsDirty(true);
  }

  // Cover image helper
  const coverImage: ArtworkImage = images.find((img) => img.isCover) || images[0] || {
    id: 'img-empty',
    url: '',
    alt: title || 'Artwork image',
    width: 1200,
    height: 900,
    type: 'primary',
    isCover: true,
  };

  function setCover(imageId: string) {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === imageId,
        type: img.id === imageId ? 'primary' : img.type,
      }))
    );
    markDirty();
  }

  function updateImageMeta(imageId: string, updates: Partial<ArtworkImage>) {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, ...updates } : img))
    );
    markDirty();
  }

  function removeImage(imageId: string) {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== imageId);
      if (next.length > 0 && !next.some((i) => i.isCover)) {
        next[0].isCover = true;
      }
      return next;
    });
    markDirty();
  }

  function moveImage(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    setImages((prev) => {
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
    markDirty();
  }

  function handleAddCustomImageUrl(url: string, type: ArtworkImageType = 'detail') {
    if (!url.trim()) return;
    const newImg: ArtworkImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: url.trim(),
      alt: `${title || 'Artwork'} perspective view`,
      width: 1200,
      height: 900,
      type,
      isCover: images.length === 0,
    };
    setImages((prev) => [...prev, newImg]);
    markDirty();
    setFeedback('Image perspective added to artwork gallery.');
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleRealUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const uploadedAssets = await Promise.all(
        files.map((file, idx) =>
          mediaService.uploadFile(file, {
            title: `${title || 'Artwork'} - ${file.name}`,
            category: 'artwork',
            altText: `${title || 'Artwork'} perspective ${images.length + idx + 1}`,
          })
        )
      );

      const newImages: ArtworkImage[] = uploadedAssets.map((asset, idx) => ({
        id: asset.id,
        url: asset.url,
        alt: asset.altText || `${title || 'Artwork'} view ${images.length + idx + 1}`,
        width: asset.width || 1200,
        height: asset.height || 900,
        type: (images.length === 0 && idx === 0 ? 'primary' : 'detail') as ArtworkImageType,
        isCover: images.length === 0 && idx === 0,
      }));

      setImages((prev) => [...prev, ...newImages]);
      markDirty();
      setFeedback(`${files.length} media asset${files.length > 1 ? 's' : ''} uploaded to studio archive.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      alert(msg);
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  }

  function handleMockUpload() {
    const sampleOptions = [
      {
        url: '/artworks/pic2.jpeg',
        alt: 'High resolution impasto macro detail by Darey',
        type: 'detail' as ArtworkImageType,
      },
      {
        url: '/artworks/pic3.jpeg',
        alt: 'Raking light structural view on canvas',
        type: 'texture' as ArtworkImageType,
      },
      {
        url: '/artworks/hero.jpeg',
        alt: 'Monumental canvas in studio with artist',
        type: 'interior' as ArtworkImageType,
      },
      {
        url: '/artworks/pic4.jpeg',
        alt: 'Framed profile view by Darey',
        type: 'framed' as ArtworkImageType,
      },
    ];

    const pick = sampleOptions[Math.floor(Math.random() * sampleOptions.length)];
    const newImg: ArtworkImage = {
      id: `img-${Date.now()}`,
      url: pick.url,
      alt: pick.alt,
      width: 1200,
      height: 900,
      type: pick.type,
      isCover: false,
    };
    setImages((prev) => [...prev, newImg]);
    markDirty();
    setFeedback('Added high-resolution asset to artwork gallery.');
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleSave(pubStatus: 'published' | 'draft' | 'archived') {
    if (!title.trim()) {
      alert('Please provide an artwork title.');
      setActiveTab('core');
      return;
    }
    if (!artworkId.trim()) {
      alert('Please provide an artwork identifier.');
      setActiveTab('core');
      return;
    }

    // Publish validation: ensure required physical and commercial fields exist
    if (pubStatus === 'published') {
      if (!medium.trim()) {
        alert('Medium and materials are required before publishing.');
        setActiveTab('physical');
        return;
      }
      if (!width || !height) {
        alert('Physical dimensions (width and height) are required before publishing.');
        setActiveTab('physical');
        return;
      }
      if (!isPriceOnRequest && (price === undefined || price <= 0)) {
        alert('Artwork must have a valid price or be marked as "Price on Request" before publishing.');
        setActiveTab('commerce');
        return;
      }
      if (images.length === 0) {
        alert('Artwork must have at least one image before publishing.');
        setActiveTab('media');
        return;
      }
    }

    setSaving(true);
    const selectedCollection = collections.find((c) => c.slug === collectionSlug);

    const artworkData: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      artworkId: artworkId.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/\s+/g, '-'),
      year,
      medium: medium.trim(),
      width: width || 0,
      height: height || 0,
      depth,
      orientation,
      description: description.trim(),
      story: story.trim() || undefined,
      availabilityNote: availabilityNote.trim() || undefined,
      price: isPriceOnRequest ? undefined : price,
      currency,
      status,
      isPriceOnRequest,
      publicationStatus: pubStatus,
      collection: selectedCollection
        ? {
            id: selectedCollection.id,
            slug: selectedCollection.slug,
            title: selectedCollection.title,
          }
        : undefined,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      featured,
      isPieceOfTheMonth,
      displayOrder,
      coverImage,
      images,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
    };

    try {
      if (isNew) {
        const created = await artworkService.create(artworkData);
        setIsDirty(false);
        setFeedback(`Artwork "${created.title}" successfully registered.`);
        setTimeout(() => {
          router.push('/studio/artworks');
        }, 1200);
      } else if (initialArtwork) {
        await artworkService.update(initialArtwork.id, artworkData);
        setIsDirty(false);
        setPublicationStatus(pubStatus);
        setFeedback('Changes successfully saved to studio catalogue.');
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.message ? `Error saving artwork: ${e.message}` : 'Error saving artwork.');
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmArchive() {
    if (!initialArtwork) return;
    await artworkService.archive(initialArtwork.id);
    setArchiveModalOpen(false);
    router.push('/studio/artworks');
  }

  const tabs = [
    { id: 'core', label: 'Core Artwork' },
    { id: 'physical', label: 'Physical Details' },
    { id: 'commerce', label: 'Commerce' },
    { id: 'organisation', label: 'Organisation' },
    { id: 'media', label: `Media (${images.length})` },
    { id: 'publishing', label: 'Publishing' },
    { id: 'seo', label: 'SEO & Meta' },
  ] as const;

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Top Header & Sticky Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div className="flex items-center gap-3">
          <Link
            href="/studio/artworks"
            className="p-2 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6875rem] font-mono text-charcoal-subtle uppercase">
                {artworkId}
              </span>
              <StatusBadge status={status} size="sm" />
              {isDirty && (
                <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-amber-100 text-amber-800 font-bold">
                  Unsaved Edits
                </span>
              )}
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-charcoal tracking-tight mt-0.5">
              {title || 'Untitled Artwork'}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-canvas-border bg-canvas text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors shadow-subtle"
          >
            <Eye className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>Preview</span>
          </button>

          {!isNew && (
            <button
              type="button"
              onClick={() => setArchiveModalOpen(true)}
              className="p-2 rounded-xl border border-canvas-border text-charcoal-muted hover:text-rose-600 hover:bg-canvas-subtle transition-colors"
              title="Archive Artwork"
            >
              <Archive className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('draft')}
            className="px-3.5 py-1.5 rounded-xl border border-canvas-border bg-canvas text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-medium transition-colors shadow-subtle disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isNew ? 'Publish Artwork' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 border-b border-canvas-border pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-charcoal text-canvas shadow-subtle'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tabbed Form Container */}
      <div className="bg-canvas-subtle border border-canvas-border/80 rounded-2xl p-6 shadow-subtle">
        {/* TAB 1: CORE ARTWORK */}
        {activeTab === 'core' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Artwork Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  markDirty();
                }}
                placeholder="e.g. Echoes of Home"
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                  Artwork Identifier (ID) *
                </label>
                <input
                  type="text"
                  value={artworkId}
                  onChange={(e) => {
                    setArtworkId(e.target.value);
                    markDirty();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                  Year of Creation
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => {
                    setYear(Number(e.target.value));
                    markDirty();
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                URL Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-charcoal-subtle font-mono">/artworks/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    markDirty();
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Short Curatorial Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  markDirty();
                }}
                placeholder="Concise overview of palette, spatial presence, and resonance for preview cards..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Full Artwork Story / Poetic Dossier
              </label>
              <textarea
                rows={5}
                value={story}
                onChange={(e) => {
                  setStory(e.target.value);
                  markDirty();
                }}
                placeholder="Extended narrative documenting the emotional origin, studio session memories, and conceptual journey..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Availability Note (Optional)
              </label>
              <input
                type="text"
                value={availabilityNote}
                onChange={(e) => {
                  setAvailabilityNote(e.target.value);
                  markDirty();
                }}
                placeholder="e.g. Reserved for upcoming exhibition or private viewing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>
          </div>
        )}

        {/* TAB 2: PHYSICAL DETAILS */}
        {activeTab === 'physical' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Medium & Materials
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => {
                  setMedium(e.target.value);
                  markDirty();
                }}
                placeholder="e.g. Oil, pulverized charcoal, and earth pigments on Belgian linen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                  Width (cm)
                </label>
                <input
                  type="number"
                  value={width ?? ''}
                  onChange={(e) => {
                    setWidth(e.target.value ? Number(e.target.value) : undefined);
                    markDirty();
                  }}
                  placeholder="e.g. 120"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={height ?? ''}
                  onChange={(e) => {
                    setHeight(e.target.value ? Number(e.target.value) : undefined);
                    markDirty();
                  }}
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                  Depth (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={depth || ''}
                  onChange={(e) => {
                    setDepth(e.target.value ? Number(e.target.value) : undefined);
                    markDirty();
                  }}
                  placeholder="4.5"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Canvas Orientation
              </label>
              <select
                value={orientation}
                onChange={(e) => {
                  setOrientation(e.target.value as ArtworkOrientation);
                  markDirty();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              >
                <option value="portrait">Portrait (Vertical)</option>
                <option value="landscape">Landscape (Horizontal)</option>
                <option value="square">Square</option>
                <option value="panoramic">Panoramic</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 3: COMMERCE */}
        {activeTab === 'commerce' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Availability Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as ArtworkStatus);
                  markDirty();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              >
                <option value="available">Available (Publicly Acquirable)</option>
                <option value="reserved">Reserved (Collector Hold)</option>
                <option value="collected">Collected (Private Collection)</option>
                <option value="commissioned">Commissioned Work</option>
                <option value="draft">Draft (Not Available)</option>
              </select>
            </div>

            {/* Price on Request Toggle */}
            <div className="p-4 rounded-xl border border-canvas-border bg-canvas flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">Price on Request</p>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Hides exact numeric price publicly and directs collectors to submit private dossier inquiries.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isPriceOnRequest}
                onChange={(e) => {
                  setIsPriceOnRequest(e.target.checked);
                  markDirty();
                }}
                className="w-5 h-5 rounded border-canvas-border text-charcoal focus:ring-0 cursor-pointer"
              />
            </div>

            {!isPriceOnRequest && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                    Price Amount
                  </label>
                  <input
                    type="number"
                    value={price || ''}
                    onChange={(e) => {
                      setPrice(e.target.value ? Number(e.target.value) : undefined);
                      markDirty();
                    }}
                    placeholder="3500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      markDirty();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="NGN">NGN (₦)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ORGANISATION */}
        {activeTab === 'organisation' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Collection Assignment
              </label>
              <select
                value={collectionSlug}
                onChange={(e) => {
                  setCollectionSlug(e.target.value);
                  markDirty();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              >
                <option value="">Unassigned</option>
                {collections.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Artwork Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => {
                  setTagsInput(e.target.value);
                  markDirty();
                }}
                placeholder="e.g. Earth Pigments, Impasto, Monumental, Gilded"
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>

            <div className="p-4 rounded-xl border border-canvas-border bg-canvas flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">Featured Spotlight</p>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Spotlight this artwork on the home page gallery showcase and editorial highlights.
                </p>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => {
                  setFeatured(e.target.checked);
                  markDirty();
                }}
                className="w-5 h-5 rounded border-canvas-border text-charcoal focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl border border-canvas-border bg-canvas flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-charcoal">Piece of the Month</p>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Designate as the single spotlight Piece of the Month featured on the homepage.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isPieceOfTheMonth}
                onChange={(e) => {
                  setIsPieceOfTheMonth(e.target.checked);
                  markDirty();
                }}
                className="w-5 h-5 rounded border-canvas-border text-charcoal focus:ring-0 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Display Order Priority
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => {
                  setDisplayOrder(Number(e.target.value));
                  markDirty();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-mono focus:outline-none focus:border-charcoal/40"
              />
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA MANAGEMENT */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-charcoal">
                    Artwork Images & Perspectives
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[0.6875rem] font-mono bg-canvas-muted text-charcoal border border-canvas-border">
                    {images.length} Image{images.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Attach as many perspectives as desired: primary frontal capture, macro impasto details, raking light profiles, framed mounts, and in-situ installations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleRealUpload}
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  multiple
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 disabled:opacity-50 transition-colors shadow-subtle shrink-0"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading Files...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Images (Multi-Select)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddUrl((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-charcoal text-xs font-medium hover:bg-canvas-subtle transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add from Path / URL</span>
                </button>

                <button
                  type="button"
                  onClick={handleMockUpload}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-charcoal text-xs font-medium hover:bg-canvas-subtle transition-colors shadow-2xs"
                  title="Add complementary detail view from studio archive"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-charcoal-subtle" />
                  <span>+ Sample Detail</span>
                </button>
              </div>
            </div>

            {/* Quick Add Custom Path / URL form */}
            {showAddUrl && (
              <div className="p-4 rounded-xl border border-charcoal/20 bg-canvas-muted/60 space-y-3">
                <p className="text-xs font-mono uppercase tracking-gallery text-charcoal">
                  Add Image Perspective via URL or Asset Path
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-7">
                    <input
                      type="text"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="e.g. /artworks/pic7.jpeg or https://..."
                      className="w-full px-3 py-2 rounded-lg border border-canvas-border bg-canvas text-xs font-mono text-charcoal"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={customUrlType}
                      onChange={(e) => setCustomUrlType(e.target.value as ArtworkImageType)}
                      className="w-full px-3 py-2 rounded-lg border border-canvas-border bg-canvas text-xs text-charcoal"
                    >
                      <option value="detail">Detail (Macro)</option>
                      <option value="texture">Texture (Impasto)</option>
                      <option value="interior">Interior (In Situ)</option>
                      <option value="angle">Angle (Raking Light)</option>
                      <option value="framed">Framed / Mount</option>
                      <option value="primary">Primary (Frontal)</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (customUrlInput.trim()) {
                          handleAddCustomImageUrl(customUrlInput.trim(), customUrlType);
                          setCustomUrlInput('');
                          setShowAddUrl(false);
                        }
                      }}
                      className="w-full px-3 py-2 bg-charcoal text-canvas text-xs font-medium rounded-lg hover:bg-black transition-colors"
                    >
                      Add Image
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Images Grid */}
            {images.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-canvas-border rounded-xl bg-canvas">
                <ImageIcon className="w-8 h-8 text-charcoal-subtle mx-auto mb-2" />
                <p className="text-sm font-medium text-charcoal">No images attached yet</p>
                <p className="text-xs text-charcoal-muted mt-1">
                  Upload high-resolution files or add an asset path above to showcase this artwork.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className={`p-4 rounded-xl border bg-canvas flex flex-col sm:flex-row gap-4 transition-all ${
                      img.isCover
                        ? 'border-charcoal shadow-subtle'
                        : 'border-canvas-border/80'
                    }`}
                  >
                    {/* Thumbnail & Badges */}
                    <div className="w-full sm:w-32 aspect-square rounded-lg overflow-hidden bg-stone-100 shrink-0 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                        {img.isCover && (
                          <span className="px-1.5 py-0.5 rounded-md text-[0.625rem] font-bold font-mono bg-charcoal text-canvas uppercase">
                            Cover
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded-md text-[0.625rem] font-mono bg-black/70 backdrop-blur-xs text-canvas">
                          #{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Metadata fields */}
                    <div className="flex-1 space-y-2 min-w-0 text-xs">
                      <div>
                        <label className="block text-[0.625rem] font-mono uppercase text-charcoal-subtle mb-1">
                          Perspective Type
                        </label>
                        <select
                          value={img.type || 'primary'}
                          onChange={(e) =>
                            updateImageMeta(img.id, {
                              type: e.target.value as ArtworkImageType,
                            })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-canvas-border bg-canvas-subtle text-xs text-charcoal"
                        >
                          <option value="primary">Primary (Frontal)</option>
                          <option value="detail">Detail (Macro)</option>
                          <option value="texture">Texture (Impasto)</option>
                          <option value="angle">Angle (Raking Light)</option>
                          <option value="framed">Framed / Mount</option>
                          <option value="interior">Interior (In Situ)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[0.625rem] font-mono uppercase text-charcoal-subtle mb-1">
                          Alt Text (Accessibility)
                        </label>
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => updateImageMeta(img.id, { alt: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-canvas-border bg-canvas-subtle text-xs text-charcoal"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-canvas-border/50">
                        <div className="flex items-center gap-2">
                          {!img.isCover ? (
                            <button
                              type="button"
                              onClick={() => setCover(img.id)}
                              className="text-[0.6875rem] font-medium text-charcoal hover:underline"
                            >
                              Set as Cover
                            </button>
                          ) : (
                            <span className="text-[0.6875rem] font-medium text-emerald-700 font-mono">
                              Primary Cover
                            </span>
                          )}

                          {/* Reorder Buttons */}
                          <div className="flex items-center gap-1 border-l border-canvas-border/80 pl-2">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveImage(idx, 'up')}
                              className="p-1 text-charcoal-subtle hover:text-charcoal disabled:opacity-30 rounded"
                              title="Move perspective earlier"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === images.length - 1}
                              onClick={() => moveImage(idx, 'down')}
                              className="p-1 text-charcoal-subtle hover:text-charcoal disabled:opacity-30 rounded"
                              title="Move perspective later"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="p-1 text-charcoal-subtle hover:text-rose-600 rounded"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PUBLISHING */}
        {activeTab === 'publishing' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Publication Status
              </label>
              <select
                value={publicationStatus}
                onChange={(e) => {
                  setPublicationStatus(e.target.value as any);
                  markDirty();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              >
                <option value="published">Published (Visible in Public Catalogue)</option>
                <option value="draft">Draft (Private in Studio)</option>
                <option value="archived">Archived (Stored in Historical Archives)</option>
              </select>
              <p className="text-xs text-charcoal-muted mt-1.5 leading-relaxed font-sans">
                Note: Publication status controls whether visitors can see the artwork in the public catalogue, whereas availability status controls whether a published artwork is available for purchase.
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => {
                  setMetaTitle(e.target.value);
                  markDirty();
                }}
                placeholder={`${title || 'Artwork'} | Darey's Artrealm`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-charcoal-subtle mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => {
                  setMetaDescription(e.target.value);
                  markDirty();
                }}
                placeholder="Search engine meta description for fine art collectors..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-canvas-border bg-canvas text-charcoal text-sm font-sans focus:outline-none focus:border-charcoal/40"
              />
            </div>
          </div>
        )}
      </div>

      {/* Archive Modal */}
      <ConfirmationModal
        isOpen={archiveModalOpen}
        onClose={() => setArchiveModalOpen(false)}
        onConfirm={handleConfirmArchive}
        title={`Archive "${title}"?`}
        description="Archiving moves this canvas into the historical archive and removes it from public exploration views."
        confirmLabel="Archive Artwork"
        isDestructive={true}
      />

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            onClick={() => setPreviewOpen(false)}
          />
          <div className="relative w-full max-w-3xl bg-canvas rounded-2xl border border-canvas-border shadow-elevated p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-canvas-border">
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                PUBLIC CATALOGUE PREVIEW SIMULATION
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 text-charcoal-subtle hover:text-charcoal rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="rounded-xl overflow-hidden bg-stone-100 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage.url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                    {collectionSlug
                      ? collections.find((c) => c.slug === collectionSlug)?.title
                      : 'Studio Collection'}
                  </span>
                  <h2 className="font-display text-2xl text-charcoal font-semibold mt-1">
                    {title || 'Untitled Artwork'}
                  </h2>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {medium} &bull; {year}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-canvas-subtle border border-canvas-border/80 text-xs">
                  <p className="font-mono text-charcoal-subtle">SPECIFICATIONS</p>
                  <p className="text-charcoal mt-1">
                    Dimensions: {width} &times; {height} cm
                  </p>
                  <p className="text-charcoal mt-0.5">
                    Price:{' '}
                    {isPriceOnRequest
                      ? 'Price on Request'
                      : `$${price?.toLocaleString()} ${currency}`}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-charcoal-subtle font-mono uppercase">Story / Description</p>
                  <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                    {description || story || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
