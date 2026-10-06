'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Maximize2,
  Calendar,
} from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { collectorService } from '@/services/collectorService';
import { CollectorCommission } from '@/types/collector';
import { CommissionProgress } from '@/components/commission/CommissionProgress';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function AccountCommissionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [commission, setCommission] = useState<CollectorCommission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    async function loadCommission() {
      setIsLoading(true);
      const data = await collectorService.getCommissionById(id);
      setCommission(data);
      setIsLoading(false);
    }

    if (id) {
      loadCommission();
    }
  }, [id]);

  if (isLoading) {
    return (
      <AccountShell>
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
        </div>
      </AccountShell>
    );
  }

  if (!commission) {
    return (
      <AccountShell title="Commission Not Found">
        <div className="p-8 text-center space-y-4">
          <p className="text-xs text-charcoal-muted">
            The commission project &ldquo;{id}&rdquo; was not found.
          </p>
          <Button href="/account/commissions" variant="outline" size="sm">
            Back to Commissions
          </Button>
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell
      title={`Commission: ${commission.title}`}
      subtitle={`Project Reference: ${commission.id} • ${commission.artworkType}`}
    >
      <div className="space-y-10">
        {/* Back Link */}
        <Link
          href="/account/commissions"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-gallery text-charcoal-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Commissions</span>
        </Link>

        {/* 1. ARTISTIC PROGRESS TIMELINE */}
        <div className="p-6 sm:p-8 bg-canvas border border-canvas-border rounded-sm">
          <CommissionProgress
            currentStage={commission.currentStage}
            stageIndex={commission.stageIndex}
          />
        </div>

        {/* 2. STUDIO PROGRESS PHOTOGRAPHY GALLERY */}
        {commission.progressImages && commission.progressImages.length > 0 && (
          <div className="p-6 sm:p-8 bg-canvas-subtle border border-canvas-border rounded-sm space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                Studio Documentation
              </span>
              <h3 className="font-serif text-2xl text-charcoal font-medium">
                Work in Progress & Studies
              </h3>
              <p className="text-xs text-charcoal-muted mt-1 font-light">
                Direct updates from the studio easel, showing tactile material development.
              </p>
            </div>

            {/* Featured Active Photo */}
            <div className="space-y-2">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden border border-canvas-border bg-canvas shadow-xs">
                <Image
                  src={commission.progressImages[activePhotoIndex].url}
                  alt={commission.progressImages[activePhotoIndex].caption}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-charcoal/80 text-canvas text-xs px-3 py-1 rounded-xs backdrop-blur-xs">
                  {commission.progressImages[activePhotoIndex].stage} • {commission.progressImages[activePhotoIndex].date}
                </div>
              </div>
              <p className="text-xs text-charcoal font-serif italic text-center pt-1">
                &ldquo;{commission.progressImages[activePhotoIndex].caption}&rdquo;
              </p>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
              {commission.progressImages.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`relative aspect-[4/3] rounded-xs overflow-hidden border transition-all ${
                    activePhotoIndex === idx
                      ? 'border-charcoal ring-2 ring-charcoal'
                      : 'border-canvas-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={img.caption} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. PROJECT BRIEF & SPECIFICATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brief */}
          <div className="md:col-span-7 p-6 sm:p-8 bg-canvas border border-canvas-border rounded-sm space-y-4">
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
              The Creative Brief
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
              Concept & Narrative
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed font-light whitespace-pre-wrap">
              {commission.brief}
            </p>

            <div className="pt-4 border-t border-canvas-border grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted block">
                  Scale & Dimensions
                </span>
                <span className="font-medium text-charcoal">{commission.dimensions}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted block">
                  Estimated Delivery
                </span>
                <span className="font-medium text-charcoal">{commission.estimatedCompletion}</span>
              </div>
            </div>
          </div>

          {/* Payment & Settlement Summary */}
          <div className="md:col-span-5 p-6 sm:p-8 bg-canvas-subtle border border-canvas-border rounded-sm space-y-5">
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
              Investment Overview
            </span>
            <h3 className="font-serif text-xl text-charcoal font-medium">
              Settlement Status
            </h3>

            {commission.paymentSummary ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-charcoal-muted">
                  <span>Agreed Commission Scope</span>
                  <span className="font-medium text-charcoal">
                    {formatPrice(commission.paymentSummary.quotedAmount, commission.paymentSummary.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-charcoal-muted">
                  <span>Studio Initial Deposit (50%)</span>
                  <span className="font-medium text-accent">Paid & Cleared</span>
                </div>
                <div className="flex justify-between items-center text-charcoal-muted">
                  <span>Balance Due on Final Approval</span>
                  <span className="font-serif text-base font-medium text-charcoal">
                    {formatPrice(commission.paymentSummary.balanceRemaining, commission.paymentSummary.currency)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-charcoal-muted font-light">
                Budget: {commission.budget}
              </p>
            )}

            <div className="pt-3 border-t border-canvas-border">
              <Button
                href="/account/messages"
                variant="outline"
                size="sm"
                className="w-full justify-center flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Darey About Project</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
