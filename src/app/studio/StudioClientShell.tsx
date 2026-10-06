'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, ShieldAlert, ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';
import { StudioSidebar } from '@/components/studio/StudioSidebar';
import { StudioTopBar } from '@/components/studio/StudioTopBar';
import { StudioMobileNav } from '@/components/studio/StudioMobileNav';
import { StudioSearchModal } from '@/components/studio/StudioSearchModal';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function StudioClientShell({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loginAsAdmin, isLoading } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-canvas">
        <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
      </div>
    );
  }

  // Access gate: standard collectors and unauthenticated guests must not have Studio access
  if (!isAdmin) {
    return (
      <div className="min-h-screen w-full bg-canvas flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-canvas-subtle border border-canvas-border p-8 sm:p-10 text-center space-y-6 shadow-subtle rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-canvas border border-canvas-border flex items-center justify-center mx-auto text-charcoal">
            <Lock className="w-6 h-6 stroke-1" />
          </div>

          <div className="space-y-2">
            <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
              STUDIO PORTAL &bull; RESTRICTED ACCESS
            </span>
            <h1 className="font-display text-3xl text-charcoal font-normal">
              Artist &amp; Atelier Workspace
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
              This operational workspace contains private cataloguing, fulfillment timelines, client CRM, and exhibition controls reserved for Darey and studio administration.
            </p>
          </div>

          <div className="p-4 bg-canvas border border-canvas-border text-xs text-left space-y-1 rounded-xl">
            <span className="text-[10px] uppercase tracking-gallery font-semibold text-charcoal-subtle block">
              Active Session
            </span>
            <p className="text-charcoal font-medium">
              {user ? `${user.firstName} ${user.lastName} (${user.role || 'collector'})` : 'Guest Visitor'}
            </p>
            <p className="text-charcoal-muted text-[11px]">
              Standard collector privileges do not permit direct studio administration access.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={loginAsAdmin}
              className="w-full py-3 px-4 bg-charcoal text-canvas hover:bg-charcoal-muted text-xs font-medium transition-colors flex items-center justify-center gap-2 rounded-lg"
            >
              <UserCheck className="w-4 h-4" />
              <span>Simulate Darey Admin Login</span>
            </button>

            <div className="flex gap-2">
              <Button href="/account" variant="secondary" size="sm" className="flex-1 text-xs">
                Collector Portal
              </Button>
              <Button href="/" variant="outline" size="sm" className="flex-1 text-xs">
                Public Gallery
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-canvas text-charcoal overflow-hidden font-sans">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden lg:block h-full shrink-0">
        <StudioSidebar />
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <StudioTopBar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-canvas p-4 sm:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile / Tablet Drawer */}
      <StudioMobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Global Command Search Modal */}
      <StudioSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
