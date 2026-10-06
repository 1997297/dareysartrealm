'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Plus,
  Bell,
  Menu,
  X,
  Palette,
  FolderArchive,
  ExternalLink,
  ChevronDown,
  Check,
} from 'lucide-react';
import { notificationService } from '@/services/notificationService';
import { StudioNotification } from '@/types/studio';
import { MOCK_ADMIN_USER } from '@/data/mockStudioData';

interface StudioTopBarProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export function StudioTopBar({ onOpenSearch, onOpenMobileMenu }: StudioTopBarProps) {
  const pathname = usePathname();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState<StudioNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const quickAddRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();
  }, [pathname]);

  async function loadNotifications() {
    try {
      const all = await notificationService.getAll();
      setNotifications(all);
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (e) {
      console.error(e);
    }
  }

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (quickAddRef.current && !quickAddRef.current.contains(event.target as Node)) {
        setQuickAddOpen(false);
      }
      if (notifsRef.current && !notifsRef.current.contains(event.target as Node)) {
        setNotifsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute clean contextual title based on pathname
  function getPageTitle(path: string): { title: string; subtitle?: string } {
    if (path === '/studio') return { title: 'Studio Overview', subtitle: 'Atelier & Operational Control' };
    if (path === '/studio/artworks') return { title: 'Artwork Inventory', subtitle: 'Permanent Studio Catalogue' };
    if (path === '/studio/artworks/new') return { title: 'New Artwork', subtitle: 'Catalogue Registration' };
    if (path.startsWith('/studio/artworks/')) return { title: 'Artwork Editor', subtitle: 'Dossier & Specifications' };
    if (path === '/studio/collections') return { title: 'Collections', subtitle: 'Curated Series & Portfolios' };
    if (path === '/studio/collections/new') return { title: 'New Collection', subtitle: 'Curatorial Grouping' };
    if (path.startsWith('/studio/collections/')) return { title: 'Collection Editor', subtitle: 'Membership & Ordering' };
    if (path === '/studio/orders') return { title: 'Acquisition Orders', subtitle: 'Collector Transactions & Freight' };
    if (path.startsWith('/studio/orders/')) return { title: 'Order Details', subtitle: 'Fulfillment & Provenance Dossier' };
    if (path === '/studio/commissions') return { title: 'Commission Pipeline', subtitle: 'Bespoke Patron Workflow' };
    if (path.startsWith('/studio/commissions/')) return { title: 'Commission Workspace', subtitle: 'Brief, Milestones & Dialogue' };
    if (path === '/studio/services') return { title: 'Studio Services', subtitle: 'Architectural & Curatorial Offerings' };
    if (path === '/studio/service-requests') return { title: 'Service Requests', subtitle: 'Proposals & Site Consultations' };
    if (path === '/studio/enquiries') return { title: 'Enquiry Inbox', subtitle: 'Private Collector & Gallery Communications' };
    if (path === '/studio/collectors') return { title: 'Collectors CRM', subtitle: 'Patron Directory & Relationships' };
    if (path.startsWith('/studio/collectors/')) return { title: 'Collector Dossier', subtitle: 'Acquisition History & Notes' };
    if (path === '/studio/media') return { title: 'Media Library', subtitle: 'High-Resolution Visual Assets' };
    if (path === '/studio/reviews') return { title: 'Collector Reviews', subtitle: 'Appraisals & Testimonials' };
    if (path === '/studio/analytics') return { title: 'Studio Analytics', subtitle: 'Restrained Art Business Insights' };
    if (path === '/studio/notifications') return { title: 'Notifications', subtitle: 'Operational Alerts & Updates' };
    if (path === '/studio/pages') return { title: 'Website Content', subtitle: 'Curatorial Statements & Editorial Copy' };
    if (path === '/studio/settings') return { title: 'Studio Settings', subtitle: 'Parameters, Commerce & Contact Rules' };
    return { title: 'Studio Control' };
  }

  const { title, subtitle } = getPageTitle(pathname);

  return (
    <header className="h-16 border-b border-canvas-border bg-canvas/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile hamburger & Contextual page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-canvas-subtle"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="font-display text-base sm:text-lg font-semibold text-charcoal tracking-tight leading-none">
            {title}
          </h2>
          {subtitle && (
            <p className="hidden sm:block text-[0.6875rem] font-sans text-charcoal-subtle mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Actions: Global Search Trigger, Quick Add, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas hover:border-charcoal/20 text-charcoal-muted transition-all text-xs"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-sans">Search Studio...</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[0.625rem] font-mono bg-canvas border border-canvas-border rounded text-charcoal-subtle">
            Ctrl+K
          </kbd>
        </button>

        {/* Quick Add Menu */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-sans font-medium transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quick Add</span>
            <ChevronDown className="w-3 h-3 text-canvas/70" />
          </button>

          {quickAddOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-canvas rounded-xl border border-canvas-border shadow-elevated py-1.5 z-40 animate-in fade-in-0 zoom-in-95 duration-150">
              <Link
                href="/studio/artworks/new"
                onClick={() => setQuickAddOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-charcoal hover:bg-canvas-subtle transition-colors"
              >
                <Palette className="w-4 h-4 text-charcoal-muted" />
                <span>New Artwork</span>
              </Link>
              <Link
                href="/studio/collections/new"
                onClick={() => setQuickAddOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-charcoal hover:bg-canvas-subtle transition-colors"
              >
                <FolderArchive className="w-4 h-4 text-charcoal-muted" />
                <span>New Collection</span>
              </Link>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => setNotifsOpen(!notifsOpen)}
            className="relative p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-600" />
            )}
          </button>

          {notifsOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 bg-canvas rounded-2xl border border-canvas-border shadow-elevated overflow-hidden z-40 animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="p-3 border-b border-canvas-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold text-charcoal">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[0.625rem] font-bold bg-amber-100 text-amber-900 font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <Link
                  href="/studio/notifications"
                  onClick={() => setNotifsOpen(false)}
                  className="text-[0.6875rem] font-mono uppercase text-charcoal-muted hover:text-charcoal transition-colors"
                >
                  View All &rarr;
                </Link>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-canvas-border/60">
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 text-xs transition-colors ${
                      notif.read ? 'bg-canvas opacity-75' : 'bg-canvas-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-charcoal">{notif.title}</span>
                      <span className="text-[0.625rem] text-charcoal-subtle font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-charcoal-muted line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.linkHref && (
                      <Link
                        href={notif.linkHref}
                        onClick={() => {
                          notificationService.markRead(notif.id);
                          setNotifsOpen(false);
                        }}
                        className="mt-1.5 inline-block text-[0.6875rem] font-medium text-charcoal hover:underline"
                      >
                        {notif.linkLabel || 'Open record'} &rarr;
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
