'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Bookmark,
  FileText,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { useAuth } from '@/contexts/AuthContext';

const NAV_LINKS = [
  { label: 'Overview', href: '/account', icon: LayoutDashboard },
  { label: 'Your Collection & Orders', href: '/account/orders', icon: Package },
  { label: 'Active Commissions', href: '/account/commissions', icon: Sparkles },
  { label: 'Saved Artworks', href: '/account/saved', icon: Bookmark },
  { label: 'Certificates of Authenticity', href: '/account/certificates', icon: FileText },
  { label: 'Studio Dialogue', href: '/account/messages', icon: MessageSquare },
  { label: 'Collector Profile', href: '/account/profile', icon: User },
];

export const AccountShell: React.FC<{
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Route guard: if not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal pt-28 pb-20 md:pt-36 md:pb-28">
      <Container size="default">
        {/* Top Header greeting */}
        <div className="mb-10 border-b border-canvas-border pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-accent block mb-1">
              Private Collection Space
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal tracking-tight">
              {title || `Welcome back, ${user?.firstName || 'Collector'}.`}
            </h1>
            <p className="text-xs text-charcoal-muted mt-1.5 font-light">
              {subtitle || 'Your personal sanctuary for acquired originals, ongoing commissions, and archival certificates.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-muted font-light">
              {user?.email}
            </span>
          </div>
        </div>

        {/* Mobile Navigation Horizontal Scroll */}
        <div className="lg:hidden mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-3 pt-1 flex gap-2 border-b border-canvas-border scrollbar-none">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap px-3.5 py-2 text-xs rounded-sm transition-colors flex items-center gap-1.5 min-h-[38px] ${
                  isActive
                    ? 'bg-charcoal text-canvas font-medium'
                    : 'bg-canvas-subtle text-charcoal hover:bg-canvas-muted'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 space-y-6">
            <div className="p-4 bg-canvas-subtle border border-canvas-border rounded-sm space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs transition-colors ${
                      isActive
                        ? 'bg-charcoal text-canvas font-medium shadow-xs'
                        : 'text-charcoal hover:bg-canvas-muted hover:text-charcoal'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-canvas' : 'text-charcoal-muted'}`} />
                      <span>{link.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-canvas-border mt-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-charcoal-muted hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Authenticity Pledge Card */}
            <div className="p-4 bg-canvas border border-canvas-border rounded-sm space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-accent font-semibold uppercase tracking-gallery text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Archival Provenance</span>
              </div>
              <p className="text-charcoal-muted font-light leading-relaxed text-[11px]">
                Every original in your collection is permanently documented in the Studio Registry.
              </p>
            </div>
          </aside>

          {/* Right Main Content */}
          <div className="lg:col-span-9">{children}</div>
        </div>
      </Container>
    </div>
  );
};
