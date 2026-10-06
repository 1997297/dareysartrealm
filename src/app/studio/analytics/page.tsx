'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Palette,
  Users,
  Eye,
  MessageSquare,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { analyticsService, StudioAnalyticsSummary } from '@/services/analyticsService';

export default function StudioAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '12m' | 'all'>('30d');
  const [data, setData] = useState<StudioAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const res = await analyticsService.getSummary(timeRange);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Compiling Studio Analytics...
        </p>
      </div>
    );
  }

  const maxMonthRev = Math.max(...data.revenueHistory.map((m) => m.revenue));

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            CURATORIAL METRICS
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Studio Performance & Insights
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Calm, restrained telemetry across private acquisitions, commission inquiries, and collection liquidity.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-canvas-border bg-canvas-subtle text-xs font-mono uppercase">
          {(['30d', '90d', '12m', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                timeRange === r
                  ? 'bg-charcoal text-canvas font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-1">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
            Total Revenue
          </span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
            ${data.revenue.total.toLocaleString()} {data.revenue.currency}
          </p>
          <p className="text-[0.6875rem] text-emerald-700 font-medium">
            +{data.revenue.growthPercentage}% YoY
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-1">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
            Direct Acquisitions
          </span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
            ${data.revenue.directAcquisitions.toLocaleString()}
          </p>
          <p className="text-[0.6875rem] text-charcoal-muted">
            Original canvases shipped worldwide
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-1">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
            Bespoke Commissions
          </span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
            ${data.revenue.commissions.toLocaleString()}
          </p>
          <p className="text-[0.6875rem] text-charcoal-muted">
            {data.metrics.activeCommissions} active projects
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-1">
          <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
            Registered Patrons
          </span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
            {data.metrics.registeredCollectors} Collectors
          </p>
          <p className="text-[0.6875rem] text-charcoal-muted">
            Across 5 international hubs
          </p>
        </div>
      </div>

      {/* Revenue History Visual Ledger */}
      <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
        <div>
          <h2 className="font-display text-base font-semibold text-charcoal">
            Monthly Acquisition Chronology
          </h2>
          <p className="text-xs text-charcoal-muted">
            Direct sales and commission milestones by month
          </p>
        </div>

        <div className="h-44 flex items-end gap-3 sm:gap-6 pt-6 border-b border-canvas-border pb-2">
          {data.revenueHistory.map((m) => {
            const heightPercent = Math.round((m.revenue / maxMonthRev) * 100);
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[0.625rem] font-mono text-charcoal-subtle opacity-0 group-hover:opacity-100 transition-opacity">
                  ${m.revenue.toLocaleString()}
                </span>
                <div
                  className="w-full bg-stone-300 group-hover:bg-charcoal rounded-t-lg transition-all"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[0.625rem] font-mono uppercase text-charcoal-subtle truncate max-w-[50px] sm:max-w-none">
                  {m.month.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Most Consulted Works (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display text-base font-semibold text-charcoal">
            Most Viewed & Consulted Canvases
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-canvas-border bg-canvas shadow-subtle">
            <table className="w-full text-left text-xs">
              <thead className="bg-canvas-subtle border-b border-canvas-border text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                <tr>
                  <th className="py-3 px-4">Artwork</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Catalogue Views</th>
                  <th className="py-3 px-4">Inquiries</th>
                  <th className="py-3 px-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-border/70">
                {data.popularArtworks.map((art) => (
                  <tr key={art.id} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/studio/artworks/${art.id}`}
                            className="font-semibold text-charcoal hover:underline block"
                          >
                            {art.title}
                          </Link>
                          <p className="text-[0.6875rem] text-charcoal-muted">{art.collection}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={art.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-charcoal font-medium">
                      {art.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-charcoal font-medium">
                      {art.inquiries}
                    </td>
                    <td className="py-3 px-4 font-mono text-right font-medium text-charcoal">
                      ${art.price.toLocaleString()} {art.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Acquisition Conversion Funnel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-display text-base font-semibold text-charcoal">
            Acquisition Progression Funnel
          </h2>

          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            {data.acquisitionFunnel.map((step, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-charcoal">
                  <span className="font-medium">{step.stage}</span>
                  <span className="font-mono text-[0.6875rem] text-charcoal-muted">
                    {step.count.toLocaleString()} ({step.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-canvas rounded-full overflow-hidden border border-canvas-border/80">
                  <div
                    className="h-full bg-charcoal rounded-full"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
