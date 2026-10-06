'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Palette, ShoppingBag, Briefcase, Users, Inbox, ArrowRight } from 'lucide-react';
import { artworkService } from '@/services/artworkService';
import { orderService } from '@/services/orderService';
import { commissionService } from '@/services/commissionService';
import { collectorService } from '@/services/collectorService';
import { enquiryService } from '@/services/enquiryService';
import { Artwork } from '@/types/artwork';
import { Order } from '@/types/commerce';
import { CollectorCommission } from '@/types/collector';
import { CollectorCRMRecord, EnquiryThread } from '@/types/studio';

interface StudioSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StudioSearchModal({ isOpen, onClose }: StudioSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [commissions, setCommissions] = useState<CollectorCommission[]>([]);
  const [collectors, setCollectors] = useState<CollectorCRMRecord[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryThread[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      loadData();
    }
  }, [isOpen]);

  async function loadData() {
    const [a, o, c, col, enq] = await Promise.all([
      artworkService.getAll(),
      orderService.getAll(),
      commissionService.getAll(),
      collectorService.getAllCRM(),
      enquiryService.getAll(),
    ]);
    setArtworks(a);
    setOrders(o);
    setCommissions(c);
    setCollectors(col);
    setEnquiries(enq);
  }

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredArtworks = q
    ? artworks.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.artworkId.toLowerCase().includes(q) ||
          a.medium.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const filteredOrders = q
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          `${o.collector.firstName} ${o.collector.lastName}`.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredCommissions = q
    ? commissions.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const filteredCollectors = q
    ? collectors.filter(
        (col) =>
          col.fullName.toLowerCase().includes(q) ||
          col.email.toLowerCase().includes(q) ||
          (col.city && col.city.toLowerCase().includes(q))
      ).slice(0, 3)
    : [];

  const filteredEnquiries = q
    ? enquiries.filter(
        (e) =>
          e.clientName.toLowerCase().includes(q) ||
          e.subject.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const totalResults =
    filteredArtworks.length +
    filteredOrders.length +
    filteredCommissions.length +
    filteredCollectors.length +
    filteredEnquiries.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 xs:px-4 pt-safe pb-safe">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-canvas rounded-2xl border border-canvas-border shadow-elevated overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-canvas-border gap-3">
          <Search className="w-5 h-5 text-charcoal-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artworks, orders, commissions, collectors, enquiries..."
            className="flex-1 bg-transparent text-charcoal placeholder:text-charcoal-subtle focus:outline-none text-base font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-charcoal-subtle hover:text-charcoal rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[0.6875rem] font-mono uppercase bg-canvas-subtle border border-canvas-border text-charcoal-muted rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!query && (
            <div className="py-8 text-center">
              <p className="text-xs uppercase tracking-widest text-charcoal-subtle font-mono">
                Studio Global Search
              </p>
              <p className="mt-1 text-sm text-charcoal-muted">
                Type an artwork title, order ID (e.g. DAR-ORD), commission reference, or collector name.
              </p>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-charcoal-muted">No operational records match &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-charcoal-subtle mt-1">Try searching by title, collector name, or city.</p>
            </div>
          )}

          {/* Artworks Category */}
          {filteredArtworks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-subtle mb-2 px-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Artworks ({filteredArtworks.length})</span>
              </div>
              <div className="space-y-1">
                {filteredArtworks.map((art) => (
                  <Link
                    key={art.id}
                    href={`/studio/artworks/${art.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-canvas-subtle transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.coverImage.url}
                          alt={art.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate group-hover:text-charcoal-primary transition-colors">
                          {art.title}
                        </p>
                        <p className="text-xs text-charcoal-muted">
                          {art.artworkId} &bull; {art.medium} &bull; ${art.price?.toLocaleString()} USD
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-charcoal-subtle group-hover:translate-x-1 group-hover:text-charcoal transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Orders Category */}
          {filteredOrders.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-subtle mb-2 px-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Orders ({filteredOrders.length})</span>
              </div>
              <div className="space-y-1">
                {filteredOrders.map((ord) => (
                  <Link
                    key={ord.id}
                    href={`/studio/orders/${ord.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-canvas-subtle transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal group-hover:text-charcoal-primary transition-colors">
                        {ord.id}
                      </p>
                      <p className="text-xs text-charcoal-muted">
                        Collector: {ord.collector.firstName} {ord.collector.lastName} &bull; ${ord.totalAmount?.toLocaleString()} {ord.currency}
                      </p>
                    </div>
                    <span className="text-xs font-mono uppercase text-charcoal-subtle group-hover:text-charcoal">
                      {ord.status} &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Commissions Category */}
          {filteredCommissions.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-subtle mb-2 px-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Commissions ({filteredCommissions.length})</span>
              </div>
              <div className="space-y-1">
                {filteredCommissions.map((com) => (
                  <Link
                    key={com.id}
                    href={`/studio/commissions/${com.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-canvas-subtle transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal group-hover:text-charcoal-primary transition-colors">
                        {com.title}
                      </p>
                      <p className="text-xs text-charcoal-muted">
                        {com.id} &bull; Stage: {com.currentStage}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-charcoal-subtle group-hover:translate-x-1 group-hover:text-charcoal transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Collectors Category */}
          {filteredCollectors.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-subtle mb-2 px-2">
                <Users className="w-3.5 h-3.5" />
                <span>Collectors ({filteredCollectors.length})</span>
              </div>
              <div className="space-y-1">
                {filteredCollectors.map((col) => (
                  <Link
                    key={col.id}
                    href={`/studio/collectors/${col.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-canvas-subtle transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal group-hover:text-charcoal-primary transition-colors">
                        {col.fullName}
                      </p>
                      <p className="text-xs text-charcoal-muted">
                        {col.email} &bull; {col.city}, {col.country} &bull; Spend: ${col.totalSpend.toLocaleString()} USD
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-charcoal-subtle group-hover:translate-x-1 group-hover:text-charcoal transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Enquiries Category */}
          {filteredEnquiries.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-subtle mb-2 px-2">
                <Inbox className="w-3.5 h-3.5" />
                <span>Enquiries ({filteredEnquiries.length})</span>
              </div>
              <div className="space-y-1">
                {filteredEnquiries.map((enq) => (
                  <Link
                    key={enq.id}
                    href={`/studio/enquiries`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-canvas-subtle transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal group-hover:text-charcoal-primary transition-colors">
                        {enq.clientName}: {enq.subject}
                      </p>
                      <p className="text-xs text-charcoal-muted">
                        {enq.id} &bull; {enq.lastMessageTime}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-charcoal-subtle group-hover:translate-x-1 group-hover:text-charcoal transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
