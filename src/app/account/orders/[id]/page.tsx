'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Clock,
  ShieldCheck,
  FileText,
  MessageSquare,
  Building,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { collectorService } from '@/services/collectorService';
import { orderService } from '@/services/orderService';
import { Order } from '@/types/commerce';
import { Certificate } from '@/types/collector';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { Button } from '@/components/ui/Button';
import { formatPrice, formatDimensionsWithInches } from '@/lib/utils';

export default function AccountOrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const orderData = await orderService.getById(id);
      setOrder(orderData);

      if (orderData?.certificateId) {
        const certData = await collectorService.getCertificateById(orderData.certificateId);
        setCertificate(certData);
      }
      setIsLoading(false);
    }

    if (id) {
      loadData();
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

  if (!order) {
    return (
      <AccountShell title="Acquisition Not Found">
        <div className="p-8 text-center space-y-4">
          <p className="text-xs text-charcoal-muted">
            The acquisition record &ldquo;{id}&rdquo; was not found in your private archive.
          </p>
          <Button href="/account/orders" variant="outline" size="sm">
            Back to Collection
          </Button>
        </div>
      </AccountShell>
    );
  }

  const primaryArt = order.items[0]?.artwork;

  return (
    <AccountShell
      title={`Acquisition: ${order.id}`}
      subtitle="Complete record of provenance, crating, and fulfillment journey."
    >
      <div className="space-y-8">
        {/* Back Link */}
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-gallery text-charcoal-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Acquisitions</span>
        </Link>

        {/* 1. ARTWORK DETAIL & STATUS BANNER */}
        <div className="p-6 sm:p-8 bg-canvas border border-canvas-border rounded-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
                Acquisition Reference
              </span>
              <h2 className="font-mono text-xl sm:text-2xl font-medium text-charcoal">
                {order.id}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-gallery px-3 py-1 bg-canvas-subtle border border-canvas-border rounded-xs text-accent font-semibold">
                Status: {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {primaryArt && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-canvas-border bg-canvas-subtle shadow-xs">
                  <Image
                    src={primaryArt.coverImage.url}
                    alt={primaryArt.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted font-semibold block">
                  Original Canvas
                </span>
                <h3 className="font-serif text-3xl text-charcoal font-medium">
                  {primaryArt.title}
                </h3>
                <p className="text-xs text-charcoal-muted font-light">
                  {primaryArt.medium}, {primaryArt.year}
                </p>
                <p className="text-xs text-charcoal-muted">
                  {formatDimensionsWithInches(primaryArt.width, primaryArt.height).cm}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-canvas-border text-xs">
                  <span className="text-charcoal-muted uppercase tracking-gallery">Acquired Value</span>
                  <span className="font-serif text-2xl font-medium text-charcoal">
                    {formatPrice(order.totalAmount, order.currency)}
                  </span>
                </div>

                <div className="pt-3 flex flex-wrap gap-3">
                  {certificate && (
                    <Button
                      onClick={() => setCertModalOpen(true)}
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Authenticity Certificate</span>
                    </Button>
                  )}

                  <Button
                    href="/account/messages"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Studio About Piece</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. ORDER PROGRESS TIMELINE */}
        <div className="p-6 sm:p-8 bg-canvas-subtle border border-canvas-border rounded-sm space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block">
              Fulfillment Journey
            </span>
            <h3 className="font-serif text-2xl text-charcoal font-medium">
              Acquisition Timeline
            </h3>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-canvas-border">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="relative group">
                {/* Node dot */}
                <span
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full border-2 transition-colors ${
                    event.completed
                      ? 'bg-charcoal border-charcoal text-canvas'
                      : 'bg-canvas border-canvas-border'
                  } flex items-center justify-center`}
                >
                  {event.completed && <Check className="w-2.5 h-2.5" />}
                </span>

                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4
                      className={`text-sm font-medium ${
                        event.completed ? 'text-charcoal' : 'text-charcoal-muted'
                      }`}
                    >
                      {event.label}
                    </h4>
                    <span className="text-[11px] text-charcoal-muted font-mono">
                      {event.date}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted font-light leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. LOGISTICS & DESTINATION SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Destination */}
          <div className="p-6 bg-canvas border border-canvas-border rounded-sm space-y-3 text-xs">
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Delivery Destination
            </span>
            <div className="space-y-1 text-charcoal">
              <p className="font-medium text-sm">{order.shippingAddress.fullName}</p>
              <p className="font-light">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="font-light">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="font-light">
                {order.shippingAddress.city}, {order.shippingAddress.country}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-charcoal-muted font-light pt-1">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment & Terms */}
          <div className="p-6 bg-canvas border border-canvas-border rounded-sm space-y-3 text-xs">
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              Payment & Settlement Mode
            </span>
            <div className="space-y-1 text-charcoal">
              <p className="font-medium text-sm capitalize">
                {order.paymentMethod.replace('_', ' ')}
              </p>
              <p className="text-charcoal-muted font-light">
                Status: <span className="font-medium text-accent">Simulated Settled</span>
              </p>
              <p className="text-charcoal-muted font-light pt-2">
                Wax-sealed physical certificate packed in dedicated crate envelope. Full transport insurance activated.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CertificateModal
        certificate={certificate}
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
      />
    </AccountShell>
  );
}
