'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  Box,
  ShieldCheck,
  Send,
  FileCheck,
  AlertTriangle,
  Clock,
  MapPin,
  Mail,
  Phone,
  User,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { StatusBadge } from '@/components/studio/StatusBadge';
import { ConfirmationModal } from '@/components/studio/ConfirmationModal';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types/commerce';

export default function StudioOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);

  // Tracking inputs
  const [courier, setCourier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingSaving, setTrackingSaving] = useState(false);

  // Internal Note input
  const [noteText, setNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  // Toast feedback
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadOrder() {
    if (!id) return;
    try {
      setLoading(true);
      const found = await orderService.getById(id);
      if (found) {
        setOrder(found);
        setCourier(found.courier || 'Hasenkamp Fine Art Logistics');
        setTrackingNumber(found.trackingNumber || '');
      }
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

  async function handleConfirmStatusChange() {
    if (!targetStatus || !order) return;
    const updated = await orderService.updateStatus(order.id, targetStatus);
    if (updated) {
      setOrder(updated);
      showFeedback(`Order status advanced to "${targetStatus}".`);
    }
    setTargetStatus(null);
  }

  async function handleSaveTracking() {
    if (!order) return;
    setTrackingSaving(true);
    const updated = await orderService.updateTracking(order.id, trackingNumber.trim(), courier.trim());
    if (updated) {
      setOrder(updated);
      showFeedback('Courier tracking details updated.');
    }
    setTrackingSaving(false);
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim() || !order) return;

    setNoteSaving(true);
    const updated = await orderService.addInternalNote(order.id, noteText.trim(), 'Darey');
    if (updated) {
      setOrder(updated);
      setNoteText('');
      showFeedback('Internal note recorded.');
    }
    setNoteSaving(false);
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Order Dossier...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Order Record Not Found
        </h2>
        <p className="text-xs text-charcoal-muted leading-relaxed font-sans">
          The requested acquisition order &ldquo;{id}&rdquo; does not exist.
        </p>
        <Link
          href="/studio/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-canvas px-4 py-2.5 rounded-xl shadow-elevated text-xs font-sans flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div className="flex items-center gap-3">
          <Link
            href="/studio/orders"
            className="p-2 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6875rem] font-mono text-charcoal-subtle uppercase">
                {order.id}
              </span>
              <StatusBadge status={order.status} size="sm" />
              <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                Payment Verified
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-charcoal tracking-tight mt-0.5">
              Acquisition Fulfillment Dossier
            </h1>
          </div>
        </div>

        {/* Status Transition Action Buttons */}
        <div className="flex items-center gap-2">
          {order.status === 'confirmed' && (
            <button
              onClick={() => setTargetStatus('preparing')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Begin Crating & Prep</span>
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={() => setTargetStatus('dispatched')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Mark Dispatched</span>
            </button>
          )}

          {order.status === 'dispatched' && (
            <button
              onClick={() => setTargetStatus('delivered')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-canvas text-xs font-medium hover:bg-emerald-900 transition-colors shadow-subtle"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Delivery</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Artwork & Collector Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Acquired Artwork(s) */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Acquired Artwork Item(s)
            </h2>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-canvas border border-canvas-border flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-full sm:w-28 aspect-square rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.artwork.coverImage.url}
                      alt={item.artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1 text-xs">
                    <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                      {item.artwork.artworkId}
                    </span>
                    <h3 className="font-display text-base font-semibold text-charcoal">
                      {item.artwork.title}
                    </h3>
                    <p className="text-charcoal-muted font-sans">
                      {item.artwork.medium} ({item.artwork.year})
                    </p>
                    <p className="text-[0.6875rem] text-charcoal-subtle font-mono">
                      Dimensions: {item.artwork.width} &times; {item.artwork.height} cm
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <p className="font-mono font-semibold text-charcoal">
                        ${item.artwork.price?.toLocaleString()} {order.currency}
                      </p>
                      <Link
                        href={`/studio/artworks/${item.artwork.id}`}
                        className="text-[0.6875rem] font-medium text-charcoal hover:underline"
                      >
                        Catalogue Record &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-4 border-t border-canvas-border space-y-1.5 text-xs text-charcoal-muted font-sans">
              <div className="flex justify-between">
                <span>Artwork Subtotal</span>
                <span>${order.totalAmount?.toLocaleString()} {order.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Museum Crate & Climate Freight</span>
                <span className="text-emerald-700 font-medium">Complimentary Curatorial Freight</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-canvas-border/80 font-display text-sm font-semibold text-charcoal">
                <span>Total Acquisition Amount</span>
                <span>${order.totalAmount?.toLocaleString()} {order.currency}</span>
              </div>
            </div>
          </div>

          {/* Collector & Delivery Details */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Collector & Consignment Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                  Client Contact
                </span>
                <p className="font-medium text-charcoal text-sm">
                  {order.collector.firstName} {order.collector.lastName}
                </p>
                <p className="text-charcoal-muted flex items-center gap-1.5 mt-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{order.collector.email}</span>
                </p>
                {order.collector.phone && (
                  <p className="text-charcoal-muted flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{order.collector.phone}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                  Consignment Address
                </span>
                <p className="text-charcoal font-medium">
                  {order.shippingAddress.addressLine1}
                </p>
                <p className="text-charcoal-muted">
                  {order.shippingAddress.city} {order.shippingAddress.postalCode}
                </p>
                <p className="text-charcoal-muted font-medium">
                  {order.shippingAddress.country}
                </p>
                {order.shippingAddress.deliveryNotes && (
                  <p className="text-[0.6875rem] text-charcoal-subtle italic mt-2">
                    Note: &ldquo;{order.shippingAddress.deliveryNotes}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Courier & Tracking Manager */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Fine Art Freight & Courier Tracking
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. Hasenkamp Fine Art, Cadogan Tate, DHL Express"
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.6875rem] font-mono uppercase text-charcoal-subtle mb-1">
                  Consignment / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. HSK-ART-984210"
                  className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs font-mono text-charcoal focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={trackingSaving}
                onClick={handleSaveTracking}
                className="px-3.5 py-1.5 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors shadow-subtle disabled:opacity-50"
              >
                Update Transit Details
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Internal Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Authenticity Certificate Box */}
          <div className="p-5 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-canvas border border-canvas-border text-charcoal">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase text-charcoal-subtle">
                  AUTHENTICITY DOSSIER
                </p>
                <p className="font-display text-sm font-semibold text-charcoal">
                  {order.certificateId || 'DAR-COA-DEV-0001'}
                </p>
              </div>
            </div>

            <span className="text-[0.6875rem] font-medium font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Wax-Sealed
            </span>
          </div>

          {/* Fulfillment Timeline Chronology */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Operational Timeline
            </h2>

            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-canvas-border">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative text-xs">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                      event.completed
                        ? 'bg-charcoal text-canvas border-charcoal'
                        : 'bg-canvas text-charcoal-subtle border-canvas-border'
                    }`}
                  >
                    {event.completed ? (
                      <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <Clock className="w-2.5 h-2.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-charcoal">{event.label}</span>
                      <span className="text-[0.625rem] text-charcoal-subtle font-mono">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-charcoal-muted mt-0.5 leading-snug">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Studio Notes */}
          <div className="p-6 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle space-y-4">
            <h2 className="font-display text-base font-semibold text-charcoal">
              Internal Studio Notes
            </h2>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {order.internalNotes?.length ? (
                order.internalNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-xl bg-canvas border border-canvas-border text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[0.625rem] font-mono text-charcoal-subtle">
                      <span className="font-medium text-charcoal">{note.author}</span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-charcoal-muted leading-relaxed">{note.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-charcoal-subtle italic">No internal notes added yet.</p>
              )}
            </div>

            {/* Note Composer */}
            <form onSubmit={handleAddNote} className="pt-2 border-t border-canvas-border space-y-2">
              <textarea
                rows={2}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add confidential studio note regarding crate specifications, collector preference, or courier contact..."
                className="w-full px-3 py-2 rounded-xl border border-canvas-border bg-canvas text-xs text-charcoal placeholder:text-charcoal-subtle focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={noteSaving || !noteText.trim()}
                  className="px-3 py-1.5 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                >
                  Record Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* State Transition Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!targetStatus}
        onClose={() => setTargetStatus(null)}
        onConfirm={handleConfirmStatusChange}
        title={`Advance Fulfillment to "${targetStatus?.toUpperCase()}"?`}
        description={`This will mark the order as ${targetStatus}, update the collector's acquisition tracking chronometer, and trigger provenance verification.`}
        confirmLabel="Confirm Transition"
      />
    </div>
  );
}
