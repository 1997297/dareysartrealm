'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Clock, Palette } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { collectorService } from '@/services/collectorService';
import { CollectorCommission } from '@/types/collector';
import { Button } from '@/components/ui/Button';

export default function AccountCommissionsPage() {
  const [commissions, setCommissions] = useState<CollectorCommission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    collectorService.getCommissions().then((data) => {
      setCommissions(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <AccountShell
      title="Commissioned Artworks"
      subtitle="Follow the bespoke unfolding of tailored artworks created in intimate dialogue with Darey."
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs uppercase tracking-gallery font-semibold text-accent">
            Bespoke Projects ({commissions.length})
          </span>
          <Button href="/commission" variant="outline" size="sm">
            Begin New Commission
          </Button>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
          </div>
        ) : commissions.length === 0 ? (
          <div className="p-12 text-center bg-canvas-subtle border border-canvas-border rounded-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-canvas border border-canvas-border flex items-center justify-center mx-auto text-charcoal-muted">
              <Sparkles className="w-6 h-6 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal font-light">
              No active commissions at present.
            </h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto font-light leading-relaxed">
              When you commission an artwork, you will be able to follow preparatory sketches, linen stretching, and impasto sculpting stages here.
            </p>
            <div className="pt-2">
              <Button href="/commission" variant="primary" size="md">
                Start a Commission Brief
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {commissions.map((comm) => (
              <div
                key={comm.id}
                className="p-6 bg-canvas border border-canvas-border rounded-sm hover:border-charcoal/50 transition-colors space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-canvas-border pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-charcoal-muted tracking-wider">
                      {comm.id}
                    </span>
                    <span className="text-[10px] uppercase tracking-gallery px-2.5 py-0.5 bg-canvas-subtle border border-canvas-border rounded-xs text-accent font-semibold">
                      {comm.currentStage}
                    </span>
                  </div>
                  <span className="text-xs text-charcoal-muted font-light">
                    Initiated:{' '}
                    {new Date(comm.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl text-charcoal font-medium">
                    {comm.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted font-light line-clamp-2 leading-relaxed">
                    {comm.brief}
                  </p>
                </div>

                <div className="p-4 bg-canvas-subtle border border-canvas-border rounded-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted block">
                      Dimensions
                    </span>
                    <span className="font-medium text-charcoal">{comm.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted block">
                      Target Delivery
                    </span>
                    <span className="font-medium text-charcoal">{comm.estimatedCompletion}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted block">
                      Next Step
                    </span>
                    <span className="text-charcoal-muted truncate block">{comm.nextStep}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    href={`/account/commissions/${comm.id}`}
                    variant="primary"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <span>Track Studio Journey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountShell>
  );
}
