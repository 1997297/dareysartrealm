'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, ArrowRight, X, Mail, MapPin, Tag } from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { collectorService } from '@/services/collectorService';
import { CollectorCRMRecord } from '@/types/studio';

export default function StudioCollectorsPage() {
  const [collectors, setCollectors] = useState<CollectorCRMRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollectors();
  }, []);

  async function loadCollectors() {
    try {
      setLoading(true);
      const all = await collectorService.getAllCRM();
      setCollectors(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = collectors.filter((col) => {
    if (statusFilter !== 'all' && col.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        col.fullName.toLowerCase().includes(q) ||
        col.email.toLowerCase().includes(q) ||
        (col.city && col.city.toLowerCase().includes(q)) ||
        col.country.toLowerCase().includes(q) ||
        col.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            PATRON RELATIONSHIPS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Collectors CRM
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Private collectors, art advisors, foundation trustees, and institutional patrons.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collector name, email, city, country, or patron tag..."
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

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-canvas-border/60">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle mr-1">
            Status:
          </span>
          {['all', 'vip', 'active', 'prospective', 'dormant'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-full text-[0.6875rem] font-mono uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-charcoal text-canvas font-bold'
                  : 'bg-canvas text-charcoal-muted hover:text-charcoal border border-canvas-border'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Collectors Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-canvas-border bg-canvas-subtle">
          <p className="text-sm font-medium text-charcoal">No collector records found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-canvas-border bg-canvas shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle border-b border-canvas-border text-[0.6875rem] font-mono uppercase tracking-wider text-charcoal-subtle">
              <tr>
                <th className="py-3 px-4">Patron</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Works Acquired</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Patron Tags</th>
                <th className="py-3 px-4">Last Interaction</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border/70">
              {filtered.map((col) => (
                <tr key={col.id} className="hover:bg-canvas-subtle/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/studio/collectors/${col.id}`}
                      className="font-semibold text-charcoal hover:underline block"
                    >
                      {col.fullName}
                    </Link>
                    <p className="text-[0.6875rem] text-charcoal-muted">{col.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted">
                    {col.city ? `${col.city}, ` : ''}
                    {col.country}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                    ${col.totalSpend.toLocaleString()} {col.currency}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-charcoal">
                    {col.totalArtworksAcquired}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={col.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {col.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[0.625rem] bg-canvas-subtle border border-canvas-border text-charcoal-muted"
                        >
                          {t}
                        </span>
                      ))}
                      {col.tags.length > 2 && (
                        <span className="text-[0.625rem] text-charcoal-subtle font-mono">
                          +{col.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted text-[0.6875rem]">
                    {col.lastInteraction}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/studio/collectors/${col.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-canvas-border text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors shadow-subtle"
                    >
                      <span>Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
