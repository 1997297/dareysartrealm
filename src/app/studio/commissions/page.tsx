'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  LayoutGrid,
  List,
  Plus,
  ArrowRight,
  Clock,
  DollarSign,
  ChevronRight,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { commissionService } from '@/services/commissionService';
import { CollectorCommission, CommissionTrackingStage } from '@/types/collector';

const PIPELINE_STAGES: { stage: CommissionTrackingStage; label: string; index: number }[] = [
  { stage: 'REQUEST RECEIVED', label: 'Intake', index: 1 },
  { stage: 'CONSULTATION', label: 'Consultation', index: 2 },
  { stage: 'STUDY SKETCHES', label: 'Concept & Sketches', index: 3 },
  { stage: 'IN CREATION', label: 'In Creation', index: 4 },
  { stage: 'PREVIEW', label: 'Preview & Approval', index: 5 },
  { stage: 'PACKAGING & PROVENANCE', label: 'Crating & Transit', index: 6 },
  { stage: 'DELIVERED', label: 'Delivered', index: 7 },
];

export default function StudioCommissionsPage() {
  const [commissions, setCommissions] = useState<CollectorCommission[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommissions();
  }, []);

  async function loadCommissions() {
    try {
      setLoading(true);
      const all = await commissionService.getAll();
      setCommissions(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdvanceStage(comm: CollectorCommission) {
    const currentIndex = PIPELINE_STAGES.findIndex((s) => s.stage === comm.currentStage);
    if (currentIndex < PIPELINE_STAGES.length - 1) {
      const next = PIPELINE_STAGES[currentIndex + 1];
      const updated = await commissionService.updateStage(comm.id, next.stage, next.index);
      if (updated) {
        loadCommissions();
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            BESPOKE PATRON PIPELINE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Commissions Workflow
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Track private commission proposals, structural sketches, impasto progress, and collector sign-offs.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-canvas-border bg-canvas-subtle shrink-0">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'kanban'
                ? 'bg-charcoal text-canvas shadow-subtle'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-charcoal text-canvas shadow-subtle'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List Table</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex gap-4 min-w-[1100px]">
            {PIPELINE_STAGES.map((col) => {
              const stageCommissions = commissions.filter(
                (c) => c.currentStage === col.stage
              );

              return (
                <div
                  key={col.stage}
                  className="flex-1 min-w-[280px] bg-canvas-subtle rounded-2xl border border-canvas-border/80 p-3.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-canvas-border mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-charcoal" />
                        <h3 className="font-display text-sm font-semibold text-charcoal">
                          {col.label}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono font-bold bg-canvas border border-canvas-border text-charcoal-muted">
                        {stageCommissions.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="space-y-3">
                      {stageCommissions.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-4 rounded-xl bg-canvas border border-canvas-border/90 shadow-subtle space-y-3 group hover:border-charcoal/40 transition-all"
                        >
                          <div className="flex items-center justify-between text-[0.6875rem] font-mono text-charcoal-subtle">
                            <span>{comm.id}</span>
                            <span>{comm.artworkType}</span>
                          </div>

                          <div>
                            <Link
                              href={`/studio/commissions/${comm.id}`}
                              className="font-display text-sm font-semibold text-charcoal group-hover:text-charcoal-primary transition-colors block line-clamp-2 leading-snug"
                            >
                              {comm.title}
                            </Link>
                            <p className="text-[0.6875rem] text-charcoal-muted mt-1 line-clamp-2">
                              {comm.dimensions} &bull; Budget: {comm.budget}
                            </p>
                          </div>

                          {/* Latest WIP Thumbnail if any */}
                          {comm.progressImages && comm.progressImages.length > 0 && (
                            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-stone-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={comm.progressImages[comm.progressImages.length - 1].url}
                                alt="WIP Preview"
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[0.5625rem] font-mono bg-stone-900/80 text-stone-100">
                                {comm.progressImages.length} updates
                              </span>
                            </div>
                          )}

                          {/* Next Step Note */}
                          <div className="p-2 rounded-lg bg-canvas-subtle border border-canvas-border/60 text-[0.6875rem] text-charcoal-muted">
                            <span className="font-semibold block text-charcoal">Next:</span>
                            <span className="line-clamp-2">{comm.nextStep}</span>
                          </div>

                          <div className="pt-2 border-t border-canvas-border flex items-center justify-between">
                            <Link
                              href={`/studio/commissions/${comm.id}`}
                              className="text-[0.6875rem] font-medium text-charcoal hover:underline"
                            >
                              Workspace &rarr;
                            </Link>

                            <button
                              onClick={() => handleAdvanceStage(comm)}
                              className="p-1 text-charcoal-subtle hover:text-charcoal rounded hover:bg-canvas-subtle"
                              title="Advance to next stage"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {stageCommissions.length === 0 && (
                        <div className="p-6 text-center rounded-xl border border-dashed border-canvas-border text-charcoal-subtle text-xs">
                          No active works
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIST TABLE VIEW */
        <div className="overflow-x-auto rounded-2xl border border-canvas-border bg-canvas shadow-subtle">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas-subtle border-b border-canvas-border text-[0.6875rem] font-mono uppercase tracking-wider text-charcoal-subtle">
              <tr>
                <th className="py-3 px-4">Commission ID</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Medium & Dimensions</th>
                <th className="py-3 px-4">Budget / Quote</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border/70">
              {commissions.map((comm) => (
                <tr key={comm.id} className="hover:bg-canvas-subtle/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                    {comm.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/studio/commissions/${comm.id}`}
                      className="font-semibold text-charcoal hover:underline block"
                    >
                      {comm.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted">
                    {comm.artworkType} &bull; {comm.dimensions}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-charcoal">
                    {comm.budget}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={comm.currentStage} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-charcoal-muted">
                    {comm.estimatedCompletion}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/studio/commissions/${comm.id}`}
                      className="px-3 py-1 rounded-lg border border-canvas-border text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors"
                    >
                      Open Workspace
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
