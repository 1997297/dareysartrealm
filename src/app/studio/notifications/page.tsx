'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Briefcase,
  Building2,
  Inbox,
  CreditCard,
  Settings,
} from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { StudioNotification, NotificationCategory } from '@/types/studio';

export default function StudioNotificationsPage() {
  const [notifications, setNotifications] = useState<StudioNotification[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const all = await notificationService.getAll();
      setNotifications(all);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id: string) {
    const updated = await notificationService.markRead(id);
    if (updated) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
    }
  }

  async function handleMarkAllRead() {
    await notificationService.markAllRead();
    loadNotifications();
  }

  async function handleDelete(id: string) {
    await notificationService.delete(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function getCategoryIcon(cat: NotificationCategory) {
    switch (cat) {
      case 'order':
        return ShoppingBag;
      case 'commission':
        return Briefcase;
      case 'service':
        return Building2;
      case 'enquiry':
        return Inbox;
      case 'payment':
        return CreditCard;
      default:
        return Bell;
    }
  }

  const filtered = notifications.filter((n) => {
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            SYSTEM TELEMETRY
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Studio Notifications
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Operational alerts, order verifications, and commission milestones.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-canvas-border bg-canvas text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors shadow-subtle shrink-0"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl border border-canvas-border bg-canvas-subtle text-xs">
        <span className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle px-2">
          Category:
        </span>
        {(['all', 'order', 'commission', 'service', 'enquiry', 'payment', 'system'] as (NotificationCategory | 'all')[]).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-colors ${
                categoryFilter === cat
                  ? 'bg-charcoal text-canvas font-bold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-canvas-border bg-canvas-subtle">
          <p className="text-sm font-medium text-charcoal">No notifications match this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => {
            const Icon = getCategoryIcon(notif.category);
            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  notif.read
                    ? 'bg-canvas border-canvas-border/80 opacity-80'
                    : 'bg-canvas-subtle border-charcoal/30 shadow-subtle'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    notif.read
                      ? 'bg-canvas text-charcoal-subtle border-canvas-border'
                      : 'bg-canvas text-charcoal border-charcoal/20 shadow-subtle'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-charcoal text-sm">
                      {notif.title}
                    </span>
                    <span className="text-[0.625rem] text-charcoal-subtle font-mono">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-charcoal-muted leading-relaxed font-sans">
                    {notif.message}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    {notif.linkHref ? (
                      <Link
                        href={notif.linkHref}
                        onClick={() => handleMarkRead(notif.id)}
                        className="inline-flex items-center gap-1 font-medium text-charcoal hover:underline"
                      >
                        <span>{notif.linkLabel || 'Open Record'}</span>
                        <ExternalLink className="w-3 h-3 text-charcoal-subtle" />
                      </Link>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-2">
                      {!notif.read && (
                        <button
                          onClick={() => handleMarkRead(notif.id)}
                          className="text-[0.6875rem] text-charcoal-muted hover:text-charcoal"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="p-1 text-charcoal-subtle hover:text-rose-600 rounded"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
