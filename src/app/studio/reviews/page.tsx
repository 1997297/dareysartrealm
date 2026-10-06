'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, EyeOff, Check, Trash2, X } from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { ConfirmationModal } from '@/components/studio/ConfirmationModal';
import { reviewService } from '@/services/reviewService';
import { CollectorReview, ReviewStatus } from '@/types/studio';

export default function StudioReviewsPage() {
  const [reviews, setReviews] = useState<CollectorReview[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'all'>('all');
  const [deleteTarget, setDeleteTarget] = useState<CollectorReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setLoading(true);
      const all = await reviewService.getAll();
      setReviews(all);
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

  async function handleStatusChange(id: string, status: ReviewStatus) {
    const updated = await reviewService.updateStatus(id, status);
    if (updated) {
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showFeedback(`Review marked as ${status}.`);
    }
  }

  async function handleToggleFeatured(id: string) {
    const updated = await reviewService.toggleFeatured(id);
    if (updated) {
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showFeedback(updated.featured ? 'Review spotlighted on public site.' : 'Review removed from spotlight.');
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    await reviewService.delete(deleteTarget.id);
    setDeleteTarget(null);
    loadReviews();
    showFeedback('Review removed.');
  }

  const filtered = reviews.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
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
            CURATORIAL REPUTATION
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Collector Reviews & Appraisals
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Moderate feedback from private collectors and commission patrons (Simulated development records).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-canvas-border bg-canvas-subtle text-xs">
          {(['all', 'approved', 'pending', 'hidden'] as (ReviewStatus | 'all')[]).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-colors ${
                statusFilter === st
                  ? 'bg-charcoal text-canvas font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-canvas-border bg-canvas-subtle">
          <p className="text-sm font-medium text-charcoal">No reviews match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-canvas border border-canvas-border/80 shadow-subtle flex flex-col justify-between space-y-4 hover:shadow-elevated transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {rev.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono bg-amber-100 text-amber-900 border border-amber-200">
                        Featured Spotlight
                      </span>
                    )}
                    <StatusBadge status={rev.status} size="sm" />
                  </div>
                </div>

                <p className="text-xs text-charcoal-muted italic leading-relaxed pt-1">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>

                <div className="mt-4 pt-3 border-t border-canvas-border/80 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-charcoal">{rev.collectorName}</p>
                    <p className="text-[0.6875rem] text-charcoal-subtle">
                      {rev.collectorTitle || 'Verified Private Patron'}
                    </p>
                  </div>
                  <span className="text-[0.6875rem] text-charcoal-subtle font-mono">
                    {rev.submittedDate}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-canvas-border flex items-center justify-between text-xs">
                <button
                  onClick={() => handleToggleFeatured(rev.id)}
                  className={`text-xs font-medium transition-colors ${
                    rev.featured ? 'text-amber-700 hover:text-amber-800' : 'text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  {rev.featured ? 'Remove from Spotlight' : 'Spotlight on Homepage'}
                </button>

                <div className="flex items-center gap-1.5">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(rev.id, 'approved')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium hover:bg-emerald-100 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  {rev.status !== 'hidden' && (
                    <button
                      onClick={() => handleStatusChange(rev.id, 'hidden')}
                      className="px-2.5 py-1 rounded-lg border border-canvas-border text-xs text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle transition-colors"
                    >
                      Hide
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(rev)}
                    className="p-1 text-charcoal-subtle hover:text-rose-600 rounded"
                    title="Delete review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Collector Review?"
        description="This will permanently delete this appraisal from the studio records."
        confirmLabel="Delete Review"
        isDestructive={true}
      />
    </div>
  );
}
