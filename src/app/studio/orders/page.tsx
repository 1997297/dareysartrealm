'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ArrowRight, X, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types/commerce';

export default function StudioOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      const all = await orderService.getAll();
      setOrders(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filtered = orders.filter((ord) => {
    if (statusFilter !== 'all' && ord.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ord.id.toLowerCase().includes(q) ||
        `${ord.collector.firstName} ${ord.collector.lastName}`.toLowerCase().includes(q) ||
        ord.shippingAddress.country.toLowerCase().includes(q) ||
        ord.items.some((i) => i.artwork.title.toLowerCase().includes(q));
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
            COLLECTOR COMMERCE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Acquisition Orders
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Monitor client acquisitions, museum timber crating, and white-glove courier deliveries worldwide.
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
            placeholder="Search order ID (e.g. DAR-ORD-DEV-0001), collector name, country..."
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

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-canvas-border/60">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle mr-1">
            Status:
          </span>
          {['all', 'confirmed', 'preparing', 'dispatched', 'delivered', 'cancelled'].map((st) => (
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

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-canvas-border bg-canvas-subtle">
          <p className="text-sm font-medium text-charcoal">No acquisition orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-canvas-border bg-canvas shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle border-b border-canvas-border text-[0.6875rem] font-mono uppercase tracking-wider text-charcoal-subtle">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Collector</th>
                <th className="py-3 px-4">Artwork Item(s)</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border/70">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-canvas-subtle/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                    {ord.id}
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted text-[0.6875rem]">
                    {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-charcoal">
                      {ord.collector.firstName} {ord.collector.lastName}
                    </p>
                    <p className="text-[0.6875rem] text-charcoal-subtle">
                      {ord.shippingAddress.city}, {ord.shippingAddress.country}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-charcoal">
                      {ord.items[0]?.artwork.title || 'Original Canvas'}
                    </p>
                    <p className="text-[0.6875rem] text-charcoal-subtle font-mono">
                      {ord.items[0]?.artwork.artworkId}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                    ${ord.totalAmount?.toLocaleString()} {ord.currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Verified
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ord.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/studio/orders/${ord.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-canvas-border text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors shadow-subtle"
                    >
                      <span>Fulfillment Dossier</span>
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
