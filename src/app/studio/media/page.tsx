'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  X,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { mediaService } from '@/services/mediaService';
import { StudioMediaAsset, MediaCategory } from '@/types/studio';
import { ConfirmationModal } from '@/components/studio/ConfirmationModal';

export default function StudioMediaPage() {
  const [assets, setAssets] = useState<StudioMediaAsset[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<MediaCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<StudioMediaAsset | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload simulation modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>('artwork');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAlt, setUploadAlt] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<StudioMediaAsset | null>(null);

  // Feedback toast
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      setLoading(true);
      const all = await mediaService.getAll();
      setAssets(all);
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

  function formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showFeedback('Asset URL copied to clipboard.');
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await mediaService.delete(deleteTarget.id);
    if (selectedAsset?.id === deleteTarget.id) {
      setSelectedAsset(null);
    }
    setDeleteTarget(null);
    loadMedia();
    showFeedback('Asset removed from studio archive.');
  }

  async function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    setIsUploading(true);
    setUploadProgress(25);

    try {
      if (selectedFile) {
        setUploadProgress(50);
        const newAsset = await mediaService.uploadFile(selectedFile, {
          title: uploadTitle.trim(),
          category: uploadCategory,
          altText: uploadAlt.trim() || uploadTitle.trim(),
        });
        setUploadProgress(100);
        showFeedback(`Uploaded "${newAsset.title}" to storage.`);
      } else {
        const sampleImages = [
          '/artworks/hero.jpeg',
          '/artworks/pic1.jpeg',
          '/artworks/pic2.jpeg',
          '/artworks/pic3.jpeg',
          '/artworks/pic4.jpeg',
        ];

        const pick = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        setUploadProgress(65);
        const newAsset = await mediaService.upload({
          title: uploadTitle.trim(),
          filename: `${uploadTitle.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          url: pick,
          category: uploadCategory,
          fileSize: Math.floor(2500000 + Math.random() * 2000000),
          width: 2400,
          height: 1800,
          mimeType: 'image/jpeg',
          altText: uploadAlt.trim() || uploadTitle.trim(),
          caption: 'Studio archival capture',
        });
        setUploadProgress(100);
        showFeedback(`Uploaded "${newAsset.title}".`);
      }

      setIsUploading(false);
      setUploadProgress(0);
      setUploadModalOpen(false);
      setUploadTitle('');
      setUploadAlt('');
      setSelectedFile(null);
      loadMedia();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      alert(msg);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  const filtered = assets.filter((a) => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        a.title.toLowerCase().includes(q) ||
        a.filename.toLowerCase().includes(q) ||
        a.altText.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            ASSET REPOSITORY
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Media Library
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Archival captures, macro pigment details, studio sessions, and architectural installation documentation.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-sans font-medium transition-colors shadow-subtle shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media Asset</span>
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by title, filename, or alt text..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-canvas-border bg-canvas text-charcoal placeholder:text-charcoal-subtle text-xs font-sans focus:outline-none"
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

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-canvas-border/60">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle mr-1">
            Category:
          </span>
          {(['all', 'artwork', 'studio', 'portrait', 'service', 'commission', 'website'] as (MediaCategory | 'all')[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-[0.6875rem] font-mono uppercase transition-colors ${
                  categoryFilter === cat
                    ? 'bg-charcoal text-canvas font-bold'
                    : 'bg-canvas text-charcoal-muted hover:text-charcoal border border-canvas-border'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-canvas-border bg-canvas-subtle">
          <p className="text-sm font-medium text-charcoal">No visual assets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((asset) => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="group rounded-xl overflow-hidden bg-canvas border border-canvas-border/80 shadow-subtle cursor-pointer hover:border-charcoal hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-stone-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[0.5625rem] font-mono uppercase bg-stone-900/80 text-stone-100 backdrop-blur-sm">
                  {asset.category}
                </span>
              </div>

              <div className="p-2.5 text-xs space-y-0.5">
                <p className="font-semibold text-charcoal truncate">{asset.title}</p>
                <div className="flex items-center justify-between text-[0.625rem] font-mono text-charcoal-subtle">
                  <span>{formatBytes(asset.fileSize)}</span>
                  <span>{asset.usageCount} uses</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Asset Inspector Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            onClick={() => setSelectedAsset(null)}
          />
          <div className="relative w-full max-w-3xl bg-canvas rounded-2xl border border-canvas-border shadow-elevated p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-canvas-border">
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle">
                MEDIA ASSET INSPECTOR
              </span>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 text-charcoal-subtle hover:text-charcoal rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="rounded-xl overflow-hidden bg-stone-100 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.altText}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-mono text-[0.6875rem] uppercase text-charcoal-subtle">
                    {selectedAsset.category}
                  </span>
                  <h2 className="font-display text-xl font-semibold text-charcoal mt-0.5">
                    {selectedAsset.title}
                  </h2>
                  <p className="text-charcoal-subtle font-mono text-[0.6875rem] mt-0.5">
                    {selectedAsset.filename}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-canvas-subtle border border-canvas-border space-y-1 font-mono text-[0.6875rem]">
                  <p className="text-charcoal">Dimensions: {selectedAsset.width} &times; {selectedAsset.height} px</p>
                  <p className="text-charcoal">File Size: {formatBytes(selectedAsset.fileSize)}</p>
                  <p className="text-charcoal">MIME: {selectedAsset.mimeType}</p>
                </div>

                <div>
                  <span className="font-mono text-[0.625rem] uppercase text-charcoal-subtle block mb-1">
                    Alt Text (Accessibility & SEO)
                  </span>
                  <p className="p-2.5 rounded-lg bg-canvas-subtle border border-canvas-border text-charcoal-muted leading-relaxed">
                    {selectedAsset.altText}
                  </p>
                </div>

                {selectedAsset.usageReferences && selectedAsset.usageReferences.length > 0 && (
                  <div>
                    <span className="font-mono text-[0.625rem] uppercase text-charcoal-subtle block mb-1">
                      Active Website Usages
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedAsset.usageReferences.map((ref, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[0.625rem] bg-canvas-subtle border border-canvas-border text-charcoal"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-canvas-border flex items-center justify-between">
                  <button
                    onClick={() => copyToClipboard(selectedAsset.url)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-canvas-border text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors shadow-subtle"
                  >
                    <Copy className="w-3.5 h-3.5 text-charcoal-subtle" />
                    <span>Copy CDN URL</span>
                  </button>

                  <button
                    onClick={() => {
                      setDeleteTarget(selectedAsset);
                    }}
                    className="p-1.5 rounded-lg border border-canvas-border text-charcoal-muted hover:text-rose-600 hover:bg-canvas-subtle transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Simulation Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            onClick={() => !isUploading && setUploadModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-canvas rounded-2xl border border-canvas-border shadow-elevated p-6 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
            <h3 className="font-display text-lg font-semibold text-charcoal mb-4">
              Upload High-Resolution Asset
            </h3>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Upload Image File (Optional - or simulated sample)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setSelectedFile(f);
                      if (!uploadTitle) {
                        setUploadTitle(f.name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas-subtle text-xs text-charcoal focus:outline-none file:mr-2.5 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[11px] file:bg-charcoal file:text-canvas cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Studio Session - Pigment Grinding"
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas-subtle text-xs text-charcoal focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as MediaCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas-subtle text-xs text-charcoal"
                >
                  <option value="artwork">Artwork Canvas</option>
                  <option value="studio">Studio Atelier</option>
                  <option value="portrait">Artist Portrait</option>
                  <option value="service">Architectural Mural</option>
                  <option value="commission">Commission Progress</option>
                  <option value="website">Editorial Gallery</option>
                </select>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Detailed visual description of materials and perspective..."
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas-subtle text-xs text-charcoal focus:outline-none"
                />
              </div>

              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[0.6875rem] font-mono text-charcoal-subtle">
                    <span>Compressing & Indexing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-canvas-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-charcoal transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => setUploadModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-charcoal-muted hover:text-charcoal disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadTitle.trim()}
                  className="px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete Media Asset "${deleteTarget?.title}"?`}
        description="This will permanently delete the visual asset from the studio repository. Any catalogue pages referencing this asset should be updated."
        confirmLabel="Delete Asset"
        isDestructive={true}
      />
    </div>
  );
}
