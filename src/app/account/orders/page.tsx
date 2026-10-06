'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Package, Clock, ShieldCheck } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { collectorService } from '@/services/collectorService';
import { Order } from '@/types/commerce';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDimensionsWithInches } from '@/lib/utils';

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    collectorService.getOrders().then((data) => {
      setOrders(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <AccountShell
      title="Your Collection & Acquired Works"
      subtitle="Original artworks permanently recorded under your provenance."
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-canvas-subtle border border-canvas-border rounded-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-canvas border border-canvas-border flex items-center justify-center mx-auto text-charcoal-muted">
              <Package className="w-6 h-6 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal font-light">
              No pieces have found their way here yet.
            </h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto font-light leading-relaxed">
              When an original canvas is acquired, its acquisition journey and authenticated provenance will be preserved in this private record.
            </p>
            <div className="pt-2">
              <Button href="/artworks" variant="primary" size="md">
                Explore Gallery Works
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const primaryArt = order.items[0]?.artwork;

              return (
                <div
                  key={order.id}
                  className="p-6 bg-canvas border border-canvas-border rounded-sm hover:border-charcoal/50 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
                >
                  <div className="flex gap-5 items-center">
                    {primaryArt && (
                      <div className="relative w-20 h-24 bg-canvas-subtle border border-canvas-border rounded-xs overflow-hidden shrink-0">
                        <Image
                          src={primaryArt.coverImage.url}
                          alt={primaryArt.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-charcoal-muted tracking-wider">
                          {order.id}
                        </span>
                        <span className="text-[10px] uppercase tracking-gallery px-2 py-0.5 bg-canvas-subtle border border-canvas-border rounded-xs text-accent font-semibold">
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>

                      {primaryArt && (
                        <>
                          <h3 className="font-serif text-xl text-charcoal font-medium">
                            {primaryArt.title}
                          </h3>
                          <p className="text-xs text-charcoal-muted font-light">
                            {primaryArt.medium} • {primaryArt.year}
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-canvas-border">
                    <div className="text-left md:text-right">
                      <span className="font-serif text-lg font-medium text-charcoal">
                        {formatPrice(order.totalAmount, order.currency)}
                      </span>
                      <p className="text-[11px] text-charcoal-muted font-light">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <Button
                      href={`/account/orders/${order.id}`}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5"
                    >
                      <span>Track Piece</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountShell>
  );
}
