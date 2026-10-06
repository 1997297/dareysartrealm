'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Palette,
  ShoppingBag,
  Briefcase,
  Tag,
  Plus,
  X,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { collectorService } from '@/services/collectorService';
import { artworkService } from '@/services/artworkService';
import { orderService } from '@/services/orderService';
import { CollectorCRMRecord } from '@/types/studio';
import { Artwork } from '@/types/artwork';
import { Order } from '@/types/commerce';

export default function StudioCollectorProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [collector, setCollector] = useState<CollectorCRMRecord | null>(null);
  const [acquiredArtworks, setAcquiredArtworks] = useState<Artwork[]>([]);
  const [collectorOrders, setCollectorOrders] = useState<Order[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadProfile() {
    if (!id) return;
    try {
      setLoading(true);
      const [col, allArts, allOrders] = await Promise.all([
        collectorService.getCRMById(id),
        artworkService.getAll(),
        orderService.getAll(),
      ]);

      if (col) {
        setCollector(col);
        const arts = allArts.filter((a) => col.collectedArtworkIds.includes(a.id));
        setAcquiredArtworks(arts);
        const ords = allOrders.filter(
          (o) => o.collector.email.toLowerCase() === col.email.toLowerCase()
        );
        setCollectorOrders(ords);
      }
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

  async function handleStatusChange(status: CollectorCRMRecord['status']) {
    if (!collector) return;
    const updated = await collectorService.updateCRMStatus(collector.id, status);
    if (updated) {
      setCollector(updated);
      showFeedback(`Collector status marked as ${status}.`);
    }
  }

  async function handleAddTag(e: React.FormEvent) {
    e.preventDefault();
    if (!collector || !newTag.trim()) return;
    const tag = newTag.trim();
    if (collector.tags.includes(tag)) return;

    const updatedTags = [...collector.tags, tag];
    const updated = await collectorService.updateCRMTags(collector.id, updatedTags);
    if (updated) {
      setCollector(updated);
      setNewTag('');
      showFeedback(`Tag "${tag}" appended.`);
    }
  }

  async function handleRemoveTag(tagToRemove: string) {
    if (!collector) return;
    const updatedTags = collector.tags.filter((t) => t !== tagToRemove);
    const updated = await collectorService.updateCRMTags(collector.id, updatedTags);
    if (updated) {
      setCollector(updated);
      showFeedback(`Tag removed.`);
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!collector || !newNote.trim()) return;

    const updated = await collectorService.addCRMNote(collector.id, newNote.trim());
    if (updated) {
      setCollector(updated);
      setNewNote('');
      showFeedback('Curator note archived in patron record.');
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Collector Dossier...
        </p>
      </div>
    );
  }

  if (!collector) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Collector Record Not Found
        </h2>
        <Link
          href="/studio/collectors"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Collectors</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div className="flex items-center gap-3">
          <Link
            href="/studio/collectors"
            className="p-2 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6875rem] font-mono text-charcoal-subtle uppercase">
                {collector.id}
              </span>
              <StatusBadge status={collector.status} size="sm" />
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-charcoal tracking-tight mt-0.5">
              {collector.fullName}
            </h1>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-charcoal-subtle">Relationship:</span>
          <select
            value={collector.status}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-canvas-border bg-canvas text-xs font-medium text-charcoal focus:outline-none"
          >
            <option value="vip">VIP Patron</option>
            <option value="active">Active Collector</option>
            <option value="prospective">Prospective</option>
            <option value="dormant">Dormant</option>
          </select>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-canvas-subtle border border-canvas-border">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
            Lifetime Spend
          </span>
          <p className="font-display text-xl sm:text-2xl font-semibold text-charcoal mt-1">
            ${collector.totalSpend.toLocaleString()} {collector.currency}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-canvas-subtle border border-canvas-border">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
            Artworks Acquired
          </span>
          <p className="font-display text-xl sm:text-2xl font-semibold text-charcoal mt-1">
            {collector.totalArtworksAcquired} Canvases
          </p>
        </div>

        <div className="p-4 rounded-xl bg-canvas-subtle border border-canvas-border">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
            Bespoke Commissions
          </span>
          <p className="font-display text-xl sm:text-2xl font-semibold text-charcoal mt-1">
            {collector.totalCommissions} Projects
          </p>
        </div>

        <div className="p-4 rounded-xl bg-canvas-subtle border border-canvas-border">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
            Patron Since
          </span>
          <p className="font-display text-xl sm:text-2xl font-semibold text-charcoal mt-1">
            {collector.collectorSince}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Acquired Works & Orders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Acquired Artworks Gallery */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Acquired Artwork Holdings ({acquiredArtworks.length})
            </h2>

            {acquiredArtworks.length === 0 ? (
              <p className="text-xs text-charcoal-subtle italic">No permanent acquisitions recorded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {acquiredArtworks.map((art) => (
                  <div
                    key={art.id}
                    className="p-3 rounded-xl bg-canvas border border-canvas-border flex gap-3 group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={art.coverImage.url}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 text-xs flex-1">
                      <Link
                        href={`/studio/artworks/${art.id}`}
                        className="font-semibold text-charcoal hover:underline truncate block"
                      >
                        {art.title}
                      </Link>
                      <p className="text-charcoal-muted text-[0.6875rem]">{art.medium}</p>
                      <p className="text-charcoal-subtle font-mono text-[0.625rem] mt-0.5">
                        {art.artworkId} &bull; ${art.price?.toLocaleString()} {art.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders History Table */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Acquisition Invoices & Orders ({collectorOrders.length})
            </h2>

            {collectorOrders.length === 0 ? (
              <p className="text-xs text-charcoal-subtle italic">No past transactions found.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-canvas-border bg-canvas">
                <table className="w-full text-left text-xs">
                  <thead className="bg-canvas-subtle border-b border-canvas-border text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                    <tr>
                      <th className="py-2.5 px-3">Order ID</th>
                      <th className="py-2.5 px-3">Artwork Item</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-canvas-border">
                    {collectorOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-canvas-subtle/50">
                        <td className="py-2.5 px-3 font-mono font-medium text-charcoal">
                          <Link href={`/studio/orders/${ord.id}`} className="hover:underline">
                            {ord.id}
                          </Link>
                        </td>
                        <td className="py-2.5 px-3 text-charcoal-muted">
                          {ord.items[0]?.artwork.title || 'Original Canvas'}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-medium text-charcoal">
                          ${ord.totalAmount?.toLocaleString()} {ord.currency}
                        </td>
                        <td className="py-2.5 px-3">
                          <StatusBadge status={ord.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Contact, Tags & Curator Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Contact Details */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-3">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Patron Contact & Freight Address
            </h2>

            <div className="text-xs space-y-2">
              <p className="flex items-center gap-2 text-charcoal-muted">
                <Mail className="w-3.5 h-3.5 text-charcoal-subtle" />
                <span>{collector.email}</span>
              </p>
              {collector.phone && (
                <p className="flex items-center gap-2 text-charcoal-muted">
                  <Phone className="w-3.5 h-3.5 text-charcoal-subtle" />
                  <span>{collector.phone}</span>
                </p>
              )}
              {collector.address && (
                <p className="flex items-start gap-2 text-charcoal-muted">
                  <MapPin className="w-3.5 h-3.5 text-charcoal-subtle shrink-0 mt-0.5" />
                  <span>{collector.address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Patron Tags Manager */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-3">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Curatorial Tags & Segment
            </h2>

            <div className="flex flex-wrap gap-1.5">
              {collector.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-canvas border border-canvas-border text-charcoal"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 text-charcoal-subtle hover:text-charcoal"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddTag} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag (e.g. Zurich Collector, Gilded Works)..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newTag.trim()}
                className="px-3 py-1.5 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </form>
          </div>

          {/* Confidential Curator Notes */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Private Curatorial Notes
            </h2>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {collector.internalNotes?.map((n) => (
                <div
                  key={n.id}
                  className="p-3 rounded-xl bg-canvas border border-canvas-border text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[0.625rem] font-mono text-charcoal-subtle">
                    <span className="font-medium text-charcoal">{n.author}</span>
                    <span>
                      {new Date(n.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-charcoal-muted leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="pt-2 border-t border-canvas-border space-y-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Record patron aesthetic preference, preferred frame woods, or private viewing recollections..."
                className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="px-3.5 py-1.5 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                >
                  Archival Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
