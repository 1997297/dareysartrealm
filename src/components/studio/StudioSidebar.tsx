'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  FolderArchive,
  Image as ImageIcon,
  ShoppingBag,
  Briefcase,
  Building2,
  Layers,
  Inbox,
  Users,
  FileText,
  Star,
  BarChart3,
  Bell,
  Settings,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { enquiryService } from '@/services/enquiryService';
import { notificationService } from '@/services/notificationService';
import { MOCK_ADMIN_USER } from '@/data/mockStudioData';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface StudioSidebarProps {
  onItemClick?: () => void;
  className?: string;
}

export function StudioSidebar({ onItemClick, className }: StudioSidebarProps) {
  const pathname = usePathname();
  const [unreadEnquiries, setUnreadEnquiries] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const enquiries = await enquiryService.getAll();
        setUnreadEnquiries(enquiries.filter((e) => e.unread || e.status === 'new').length);
        const notifCount = await notificationService.getUnreadCount();
        setUnreadNotifs(notifCount);
      } catch (e) {
        console.error('Failed to load nav badges', e);
      }
    }
    fetchCounts();
  }, [pathname]);

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          label: 'Dashboard',
          href: '/studio',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'ART & INVENTORY',
      items: [
        {
          label: 'Artworks',
          href: '/studio/artworks',
          icon: Palette,
        },
        {
          label: 'Collections',
          href: '/studio/collections',
          icon: FolderArchive,
        },
        {
          label: 'Media Library',
          href: '/studio/media',
          icon: ImageIcon,
        },
      ],
    },
    {
      title: 'BUSINESS',
      items: [
        {
          label: 'Orders',
          href: '/studio/orders',
          icon: ShoppingBag,
        },
        {
          label: 'Commissions',
          href: '/studio/commissions',
          icon: Briefcase,
        },
        {
          label: 'Service Requests',
          href: '/studio/service-requests',
          icon: Building2,
        },
        {
          label: 'Services Catalog',
          href: '/studio/services',
          icon: Layers,
        },
        {
          label: 'Enquiry Inbox',
          href: '/studio/enquiries',
          icon: Inbox,
          badge: unreadEnquiries > 0 ? unreadEnquiries : undefined,
        },
        {
          label: 'Collectors CRM',
          href: '/studio/collectors',
          icon: Users,
        },
      ],
    },
    {
      title: 'WEBSITE & REPUTATION',
      items: [
        {
          label: 'Website Content',
          href: '/studio/pages',
          icon: FileText,
        },
        {
          label: 'Collector Reviews',
          href: '/studio/reviews',
          icon: Star,
        },
        {
          label: 'Studio Analytics',
          href: '/studio/analytics',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        {
          label: 'Notifications',
          href: '/studio/notifications',
          icon: Bell,
          badge: unreadNotifs > 0 ? unreadNotifs : undefined,
        },
        {
          label: 'Settings',
          href: '/studio/settings',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-canvas-subtle border-r border-canvas-border flex flex-col h-full shrink-0 select-none overflow-hidden',
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-canvas-border/80">
        <Link
          href="/studio"
          onClick={onItemClick}
          className="flex items-center gap-3 group"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg font-display text-lg bg-charcoal text-canvas select-none shadow-sm shrink-0">
            Da
          </span>
          <div className="flex flex-col min-w-0">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle tracking-[0.2em] block mb-0.5">
              ARTREALM STUDIO
            </span>
            <h1 className="font-display text-base font-semibold text-charcoal leading-none group-hover:text-charcoal-primary transition-colors truncate">
              Workroom &amp; Ops
            </h1>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="px-3 text-[0.6875rem] font-mono uppercase tracking-widest text-charcoal-subtle mb-1.5">
              {section.title}
            </p>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/studio'
                  ? pathname === '/studio'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans font-medium transition-all group',
                    isActive
                      ? 'bg-charcoal text-canvas shadow-subtle'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-canvas'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive ? 'text-canvas' : 'text-charcoal-subtle group-hover:text-charcoal'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded-full text-[0.625rem] font-mono font-bold leading-none shrink-0',
                        isActive
                          ? 'bg-canvas text-charcoal'
                          : 'bg-amber-100 text-amber-800'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer: External Link & Admin Profile */}
      <div className="p-3 border-t border-canvas-border/80 bg-canvas space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-charcoal-muted hover:text-charcoal hover:bg-canvas-subtle transition-colors group"
        >
          <span className="font-sans font-medium">Public Gallery</span>
          <ExternalLink className="w-3.5 h-3.5 text-charcoal-subtle group-hover:text-charcoal" />
        </Link>

        {/* Darey Profile Pill */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-canvas-subtle border border-canvas-border/60">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-300 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOCK_ADMIN_USER.avatarUrl}
              alt={MOCK_ADMIN_USER.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-charcoal truncate">
              {MOCK_ADMIN_USER.name}
            </p>
            <p className="text-[0.6875rem] text-charcoal-subtle truncate">
              {MOCK_ADMIN_USER.roleTitle}
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" title="Online & Active" />
        </div>
      </div>
    </aside>
  );
}
