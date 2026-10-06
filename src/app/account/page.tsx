'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Package,
  Sparkles,
  Bookmark,
  FileText,
  MessageSquare,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { collectorService } from '@/services/collectorService';
import { CollectorOverviewData, Certificate } from '@/types/collector';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function AccountOverviewPage() {
  const [overview, setOverview] = useState<CollectorOverviewData | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);

  useEffect(() => {
    collectorService.getOverview().then((data) => setOverview(data));
  }, []);

  if (!overview) {
    return (
      <AccountShell>
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
        </div>
      </AccountShell>
    );
  }

  const activeCommission = overview.activeCommissions[0];
  const latestOrder = overview.recentOrders[0];

  return (
    <AccountShell>
      <div className="space-y-10">
        {/* 1. RECENT ACQUIRED PIECE HERO (Private Gallery Sanctuary) */}
        {latestOrder ? (
          <div className="p-6 sm:p-8 bg-canvas-subtle border border-canvas-border rounded-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Featured in Your Collection
              </span>
              <span className="text-xs text-charcoal-muted font-mono">
                {latestOrder.id}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-4">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-canvas-border bg-canvas shadow-sm">
                  <Image
                    src={latestOrder.items[0]?.artwork.coverImage.url || ''}
                    alt={latestOrder.items[0]?.artwork.title || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="sm:col-span-8 space-y-3">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                    {latestOrder.items[0]?.artwork.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted font-light mt-0.5">
                    {latestOrder.items[0]?.artwork.medium}, {latestOrder.items[0]?.artwork.year}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-charcoal-muted pt-1">
                  <div>
                    <span className="block text-[10px] uppercase tracking-gallery font-medium">Status</span>
                    <span className="text-accent font-medium capitalize">
                      {latestOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-gallery font-medium">Acquired</span>
                    <span className="text-charcoal">
                      {new Date(latestOrder.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-gallery font-medium">Provenance</span>
                    <span className="text-charcoal font-medium">Verified Certificate</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Button
                    href={`/account/orders/${latestOrder.id}`}
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <span>View Acquisition Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>

                  {overview.certificates[0] && (
                    <Button
                      onClick={() => {
                        setSelectedCert(overview.certificates[0]);
                        setCertModalOpen(true);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Certificate</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Collection State */
          <div className="p-8 text-center bg-canvas-subtle border border-canvas-border rounded-sm space-y-4">
            <h3 className="font-serif text-2xl text-charcoal font-light">
              No pieces have found their way here yet.
            </h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto font-light leading-relaxed">
              When you acquire an original canvas from Darey’s Artrealm, your verified provenance and crating schedule will appear here.
            </p>
            <Button href="/artworks" variant="primary" size="md">
              Explore Available Artworks
            </Button>
          </div>
        )}

        {/* 2. ACTIVE COMMISSION HIGHLIGHT */}
        {activeCommission && (
          <div className="p-6 sm:p-8 bg-canvas border border-canvas-border rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Active Commission in Studio
              </span>
              <span className="text-xs font-mono text-charcoal-muted">
                {activeCommission.id}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-charcoal font-medium">
                {activeCommission.title}
              </h3>
              <p className="text-xs text-charcoal-muted font-light line-clamp-2">
                {activeCommission.brief}
              </p>
            </div>

            <div className="p-4 bg-canvas-subtle border border-canvas-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted block">
                  Current Stage
                </span>
                <span className="font-medium text-charcoal">
                  Stage 0{activeCommission.stageIndex} — {activeCommission.currentStage}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted block">
                  Next Milestone
                </span>
                <span className="text-charcoal-muted">{activeCommission.nextStep}</span>
              </div>
              <Button
                href={`/account/commissions/${activeCommission.id}`}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                Track Journey
              </Button>
            </div>
          </div>
        )}

        {/* 3. QUICK ACCESS TILES (Saved, Certificates, Messages) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tile 1: Saved Works */}
          <Link
            href="/account/saved"
            className="group p-5 bg-canvas border border-canvas-border hover:border-charcoal rounded-sm transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <Bookmark className="w-4 h-4 text-charcoal-muted group-hover:text-charcoal" />
              <span className="text-xs font-mono font-medium text-charcoal">
                {overview.savedCount}
              </span>
            </div>
            <h4 className="font-serif text-lg text-charcoal font-medium">Saved Works</h4>
            <p className="text-[11px] text-charcoal-muted font-light">
              Pieces you are considering for your space.
            </p>
          </Link>

          {/* Tile 2: Certificates */}
          <Link
            href="/account/certificates"
            className="group p-5 bg-canvas border border-canvas-border hover:border-charcoal rounded-sm transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-4 h-4 text-charcoal-muted group-hover:text-charcoal" />
              <span className="text-xs font-mono font-medium text-charcoal">
                {overview.certificates.length}
              </span>
            </div>
            <h4 className="font-serif text-lg text-charcoal font-medium">Certificates</h4>
            <p className="text-[11px] text-charcoal-muted font-light">
              Wax-sealed documentation and verification codes.
            </p>
          </Link>

          {/* Tile 3: Studio Messages */}
          <Link
            href="/account/messages"
            className="group p-5 bg-canvas border border-canvas-border hover:border-charcoal rounded-sm transition-colors space-y-2"
          >
            <div className="flex items-center justify-between">
              <MessageSquare className="w-4 h-4 text-charcoal-muted group-hover:text-charcoal" />
              <span className="text-xs font-mono font-medium text-accent">
                {overview.unreadMessagesCount > 0 ? `${overview.unreadMessagesCount} new` : '0 unread'}
              </span>
            </div>
            <h4 className="font-serif text-lg text-charcoal font-medium">Studio Dialogue</h4>
            <p className="text-[11px] text-charcoal-muted font-light">
              Direct communication thread with Darey.
            </p>
          </Link>
        </div>
      </div>

      <CertificateModal
        certificate={selectedCert}
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
      />
    </AccountShell>
  );
}
