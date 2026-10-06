'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Palette,
  ShoppingBag,
  Briefcase,
  Inbox,
  ArrowRight,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { analyticsService, StudioAnalyticsSummary } from '@/services/analyticsService';
import { auditService } from '@/services/auditService';
import { orderService } from '@/services/orderService';
import { commissionService } from '@/services/commissionService';
import { enquiryService } from '@/services/enquiryService';
import { AuditEvent, EnquiryThread } from '@/types/studio';
import { Order } from '@/types/commerce';
import { CollectorCommission } from '@/types/collector';

export default function StudioDashboardPage() {
  const [analytics, setAnalytics] = useState<StudioAnalyticsSummary | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeCommissions, setActiveCommissions] = useState<CollectorCommission[]>([]);
  const [pendingEnquiries, setPendingEnquiries] = useState<EnquiryThread[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [a, aud, ord, com, enq] = await Promise.all([
          analyticsService.getSummary('30d'),
          auditService.getAll(),
          orderService.getAll(),
          commissionService.getAll(),
          enquiryService.getAll(),
        ]);
        setAnalytics(a);
        setAuditEvents(aud.slice(0, 6));
        setRecentOrders(ord.slice(0, 4));
        setActiveCommissions(com.filter((c) => c.currentStage !== 'DELIVERED').slice(0, 3));
        setPendingEnquiries(enq.filter((e) => e.unread || e.status === 'new').slice(0, 3));
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Studio Dossier...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            ATELIER OPERATIONS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-charcoal font-semibold tracking-tight mt-1">
            WELCOME BACK, DAREY.
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl font-sans">
            Here is your studio operational pulse, current inquiries, and active commissions in creation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/studio/artworks/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-sans font-medium transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Artwork</span>
          </Link>
          <Link
            href="/studio/enquiries"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas text-charcoal text-xs font-sans font-medium transition-colors"
          >
            <Inbox className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>View Inbox</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Operational Metrics (Restrained Art-Business KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.6875rem]">Total Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              ${analytics.revenue.total.toLocaleString()} <span className="text-xs font-sans font-normal text-charcoal-muted">USD</span>
            </p>
            <p className="text-[0.6875rem] text-emerald-700 mt-1 font-medium">
              +{analytics.revenue.growthPercentage}% over previous period
            </p>
          </div>
        </div>

        {/* Active Commissions */}
        <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.6875rem]">Commissions</span>
            <Briefcase className="w-4 h-4 text-amber-700" />
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {analytics.metrics.activeCommissions} <span className="text-xs font-sans font-normal text-charcoal-muted">Active</span>
            </p>
            <p className="text-[0.6875rem] text-charcoal-muted mt-1 font-sans">
              Currently in progress in the atelier
            </p>
          </div>
        </div>

        {/* New Enquiries */}
        <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.6875rem]">New Enquiries</span>
            <Inbox className="w-4 h-4 text-blue-700" />
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {analytics.metrics.newEnquiries} <span className="text-xs font-sans font-normal text-charcoal-muted">Unanswered</span>
            </p>
            <p className="text-[0.6875rem] text-blue-700 mt-1 font-medium">
              Awaiting studio curator response
            </p>
          </div>
        </div>

        {/* Available Artworks */}
        <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.6875rem]">Available Works</span>
            <Palette className="w-4 h-4 text-stone-700" />
          </div>
          <div className="mt-3">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {analytics.metrics.availableArtworksCount} <span className="text-xs font-sans font-normal text-charcoal-muted">Canvases</span>
            </p>
            <p className="text-[0.6875rem] text-charcoal-muted mt-1 font-sans">
              {analytics.metrics.soldArtworksCount} collected into private holdings
            </p>
          </div>
        </div>
      </div>

      {/* 3. "NEEDS ATTENTION" Operational Queue */}
      <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-medium text-sm">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span className="font-display font-semibold tracking-tight text-base text-amber-950">
              NEEDS ATTENTION
            </span>
            <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-bold font-mono bg-amber-200 text-amber-900">
              {pendingEnquiries.length + 1} items
            </span>
          </div>
          <span className="text-xs text-amber-900/70 hidden sm:inline">
            Action items requiring Darey&apos;s decision
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Enquiry Attention Item */}
          {pendingEnquiries.map((enq) => (
            <Link
              key={enq.id}
              href="/studio/enquiries"
              className="p-3.5 rounded-xl bg-canvas border border-amber-200/80 hover:border-amber-400 transition-all flex flex-col justify-between group shadow-subtle"
            >
              <div>
                <div className="flex items-center justify-between text-[0.6875rem] text-amber-900 font-mono mb-1">
                  <span>ENQUIRY</span>
                  <span>{enq.lastMessageTime}</span>
                </div>
                <p className="text-xs font-semibold text-charcoal truncate">
                  {enq.clientName}
                </p>
                <p className="text-xs text-charcoal-muted line-clamp-2 mt-1 leading-snug">
                  {enq.subject}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-canvas-border flex items-center justify-between text-[0.6875rem] text-charcoal group-hover:text-charcoal-primary font-medium">
                <span>Reply in Inbox</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}

          {/* Commission Attention Item */}
          {activeCommissions.length > 0 && (
            <Link
              href={`/studio/commissions/${activeCommissions[0].id}`}
              className="p-3.5 rounded-xl bg-canvas border border-amber-200/80 hover:border-amber-400 transition-all flex flex-col justify-between group shadow-subtle"
            >
              <div>
                <div className="flex items-center justify-between text-[0.6875rem] text-amber-900 font-mono mb-1">
                  <span>COMMISSION MILESTONE</span>
                  <span>{activeCommissions[0].currentStage}</span>
                </div>
                <p className="text-xs font-semibold text-charcoal truncate">
                  {activeCommissions[0].title}
                </p>
                <p className="text-xs text-charcoal-muted line-clamp-2 mt-1 leading-snug">
                  {activeCommissions[0].nextStep}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-canvas-border flex items-center justify-between text-[0.6875rem] text-charcoal group-hover:text-charcoal-primary font-medium">
                <span>Review In-Progress Work</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* 4. Two-Column Layout: Active Commissions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Commissions Workspace Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-charcoal tracking-tight">
                Active Commissions in Creation
              </h2>
              <p className="text-xs text-charcoal-muted">
                Patron works undergoing substrate priming, impasto sculpting, and varnish
              </p>
            </div>
            <Link
              href="/studio/commissions"
              className="text-xs font-sans font-medium text-charcoal hover:underline flex items-center gap-1"
            >
              <span>Pipeline Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activeCommissions.map((comm) => (
              <div
                key={comm.id}
                className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.6875rem] font-mono text-charcoal-subtle">
                      {comm.id}
                    </span>
                    <StatusBadge status={comm.currentStage} size="sm" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-charcoal truncate">
                    {comm.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted font-sans line-clamp-1">
                    {comm.dimensions} &bull; Budget: {comm.budget} &bull; Target: {comm.estimatedCompletion}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Link
                    href={`/studio/commissions/${comm.id}`}
                    className="px-3.5 py-1.5 rounded-xl border border-canvas-border bg-canvas text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors shadow-subtle"
                  >
                    Open Workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Activity Audit Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-charcoal tracking-tight">
                Recent Studio Activity
              </h2>
              <p className="text-xs text-charcoal-muted">
                Audit events across cataloguing, orders, and dialogue
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle divide-y divide-canvas-border/60">
            {auditEvents.map((event) => (
              <div key={event.id} className="py-3 first:pt-0 last:pb-0 text-xs">
                <div className="flex items-center justify-between text-[0.6875rem] text-charcoal-subtle font-mono mb-1">
                  <span className="font-medium text-charcoal">{event.actor}</span>
                  <span>{event.timestamp}</span>
                </div>
                <p className="text-charcoal-muted leading-relaxed font-sans">
                  {event.description}
                </p>
                {event.linkHref && (
                  <Link
                    href={event.linkHref}
                    className="inline-block mt-1 text-[0.6875rem] font-medium text-charcoal hover:underline"
                  >
                    View record &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Orders Mini-Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-charcoal tracking-tight">
              Recent Acquisition Orders
            </h2>
            <p className="text-xs text-charcoal-muted">
              Collector transactions, museum timber crating, and insured fine art couriers
            </p>
          </div>
          <Link
            href="/studio/orders"
            className="text-xs font-sans font-medium text-charcoal hover:underline flex items-center gap-1"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-canvas-border bg-canvas shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle border-b border-canvas-border text-[0.6875rem] font-mono uppercase tracking-wider text-charcoal-subtle">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Collector</th>
                <th className="py-3 px-4">Artwork Item</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border/70">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-canvas-subtle/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                    {ord.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-charcoal">
                      {ord.collector.firstName} {ord.collector.lastName}
                    </p>
                    <p className="text-[0.6875rem] text-charcoal-subtle">{ord.shippingAddress.country}</p>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal">
                    {ord.items[0]?.artwork.title || 'Original Canvas'}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal">
                    ${ord.totalAmount?.toLocaleString()} {ord.currency}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ord.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/studio/orders/${ord.id}`}
                      className="px-3 py-1 rounded-lg border border-canvas-border text-[0.6875rem] font-medium text-charcoal hover:bg-canvas-subtle transition-colors"
                    >
                      Dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
