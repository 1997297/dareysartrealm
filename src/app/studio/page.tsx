'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Palette,
  FolderArchive,
  Image as ImageIcon,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Eye,
  FileEdit,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Settings,
} from 'lucide-react';
import { artworkService } from '@/services/artworkService';
import { collectionService } from '@/services/collectionService';
import { mediaService } from '@/services/mediaService';
import { serviceService } from '@/services/serviceService';
import { siteContentService } from '@/services/siteContentService';
import { Artwork } from '@/types/artwork';
import { Collection } from '@/types/collection';
import { StudioMediaAsset } from '@/types/studio';
import { Service } from '@/types/service';
import { StatusBadge } from '@/components/studio/StatusBadge';

export default function StudioDashboardPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [mediaAssets, setMediaAssets] = useState<StudioMediaAsset[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pieceOfTheMonth, setPieceOfTheMonth] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOperationalDossier() {
      try {
        setLoading(true);
        const [arts, cols, meds, srvs, potm] = await Promise.all([
          artworkService.getAll({ includeUnpublished: true }),
          collectionService.getAll({ includeUnpublished: true }),
          mediaService.getAll(),
          serviceService.getAll({ includeUnpublished: true }),
          artworkService.getPieceOfTheMonth(),
        ]);
        setArtworks(arts);
        setCollections(cols);
        setMediaAssets(meds);
        setServices(srvs);
        setPieceOfTheMonth(potm);
      } catch (e) {
        console.error('Failed to load studio dossier:', e);
      } finally {
        setLoading(false);
      }
    }
    loadOperationalDossier();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Atelier Operations...
        </p>
      </div>
    );
  }

  // Real operational content calculations
  const publishedArtworks = artworks.filter(
    (a) => a.publicationStatus === 'published' && a.status === 'available'
  );
  const draftArtworks = artworks.filter(
    (a) => a.publicationStatus === 'draft' || a.status === 'draft'
  );
  const reservedArtworks = artworks.filter((a) => a.status === 'reserved');
  const collectedArtworks = artworks.filter(
    (a) => a.status === 'collected' || a.status === 'sold'
  );
  const commissionedArtworks = artworks.filter((a) => a.status === 'commissioned');

  // Items needing curatorial attention
  const artworksNeedingAttention = artworks.filter((a) => {
    const missingTitle = !a.title || a.title.startsWith('Studio Work');
    const missingMedium = !a.medium || a.medium.trim() === '';
    const missingDimensions = !a.width || !a.height || a.width === 0 || a.height === 0;
    const missingPrice = !a.isPriceOnRequest && (!a.price || a.price === 0);
    return missingTitle || missingMedium || missingDimensions || missingPrice;
  });

  // Recently updated content (sorted by updatedAt)
  const recentlyUpdatedArtworks = [...artworks]
    .sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200 pb-16">
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            ATELIER OPERATIONS &bull; CMS CONTROL CENTRE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-charcoal font-semibold tracking-tight mt-1">
            WELCOME BACK, DAREY.
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-xl font-sans">
            Here is your live cataloguing overview, curatorial publications, and content management queue.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/studio/artworks/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-sans font-medium transition-colors shadow-subtle"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Artwork</span>
          </Link>
          <Link
            href="/studio/collections/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas text-charcoal text-xs font-sans font-medium transition-colors"
          >
            <FolderArchive className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>New Collection</span>
          </Link>
          <Link
            href="/studio/pages"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-canvas-border bg-canvas-subtle hover:bg-canvas text-charcoal text-xs font-sans font-medium transition-colors"
          >
            <FileEdit className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>Edit Website Copy</span>
          </Link>
        </div>
      </div>

      {/* 2. Real Content Inventory KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Published Available */}
        <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.625rem]">Available</span>
            <Palette className="w-3.5 h-3.5 text-emerald-700" />
          </div>
          <div className="mt-2.5">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {publishedArtworks.length}
            </p>
            <p className="text-[0.6875rem] text-charcoal-muted mt-0.5 font-sans">
              Publicly listed for acquisition
            </p>
          </div>
        </div>

        {/* Draft Works */}
        <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.625rem]">Drafts</span>
            <Clock className="w-3.5 h-3.5 text-amber-700" />
          </div>
          <div className="mt-2.5">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {draftArtworks.length}
            </p>
            <p className="text-[0.6875rem] text-charcoal-muted mt-0.5 font-sans">
              Unpublished in studio atelier
            </p>
          </div>
        </div>

        {/* Reserved */}
        <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.625rem]">Reserved</span>
            <AlertCircle className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div className="mt-2.5">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {reservedArtworks.length}
            </p>
            <p className="text-[0.6875rem] text-charcoal-muted mt-0.5 font-sans">
              Curatorial hold / Private patron
            </p>
          </div>
        </div>

        {/* Collected */}
        <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.625rem]">Collected</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-700" />
          </div>
          <div className="mt-2.5">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {collectedArtworks.length}
            </p>
            <p className="text-[0.6875rem] text-charcoal-muted mt-0.5 font-sans">
              Archived in private collections
            </p>
          </div>
        </div>

        {/* Collections */}
        <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.625rem]">Collections</span>
            <FolderArchive className="w-3.5 h-3.5 text-charcoal" />
          </div>
          <div className="mt-2.5">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {collections.length}
            </p>
            <p className="text-[0.6875rem] text-charcoal-muted mt-0.5 font-sans">
              Curated exhibition rooms
            </p>
          </div>
        </div>

        {/* Media Assets */}
        <div className="p-4 rounded-2xl bg-canvas-subtle border border-canvas-border/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal-subtle">
            <span className="font-mono uppercase tracking-wider text-[0.625rem]">Media Assets</span>
            <ImageIcon className="w-3.5 h-3.5 text-charcoal" />
          </div>
          <div className="mt-2.5">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-charcoal">
              {mediaAssets.length}
            </p>
            <p className="text-[0.6875rem] text-charcoal-muted mt-0.5 font-sans">
              Supabase storage photography
            </p>
          </div>
        </div>
      </div>

      {/* 3. Piece of the Month Editorial Designation & Curatorial Highlight */}
      <div className="p-5 sm:p-6 rounded-2xl bg-canvas-subtle border border-canvas-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h2 className="font-display font-semibold text-lg text-charcoal tracking-tight">
              EDITORIAL DESIGNATION &bull; PIECE OF THE MONTH
            </h2>
          </div>
          <Link
            href="/studio/artworks"
            className="text-xs text-charcoal-muted hover:text-charcoal underline underline-offset-4"
          >
            Change Designation in Artworks Catalogue
          </Link>
        </div>

        {pieceOfTheMonth ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-canvas border border-canvas-border">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-canvas-muted shrink-0 border border-canvas-border">
                <Image
                  src={pieceOfTheMonth.coverImage?.url || '/artworks/pic1.jpeg'}
                  alt={pieceOfTheMonth.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[0.625rem] bg-charcoal text-canvas font-mono uppercase tracking-wider">
                    Piece of the Month
                  </span>
                  <span className="font-mono text-xs text-charcoal-subtle">
                    {pieceOfTheMonth.artworkId}
                  </span>
                </div>
                <h3 className="font-display text-lg text-charcoal font-semibold">
                  {pieceOfTheMonth.title}
                </h3>
                <p className="text-xs text-charcoal-muted font-sans mt-0.5">
                  {pieceOfTheMonth.medium || 'Original Studio Composition'} &bull;{' '}
                  {pieceOfTheMonth.width && pieceOfTheMonth.height
                    ? `${pieceOfTheMonth.width} × ${pieceOfTheMonth.height} cm`
                    : 'Dimensions on request'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Link
                href={`/artworks/${pieceOfTheMonth.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-canvas-border text-xs text-charcoal hover:bg-canvas-subtle"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Public Room</span>
              </Link>
              <Link
                href={`/studio/artworks/${pieceOfTheMonth.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal text-canvas text-xs hover:bg-charcoal/90"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Edit Record</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-canvas border border-dashed border-canvas-border text-center text-xs text-charcoal-muted">
            No artwork currently designated as Piece of the Month. Open an artwork in the catalogue and toggle &quot;Piece of the Month&quot; to highlight it.
          </div>
        )}
      </div>

      {/* 4. Two-Column Operational Queue: Needs Attention vs Recently Updated */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7/12): Content Requiring Curatorial Attention */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-canvas-subtle border border-canvas-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <h2 className="font-display font-semibold text-lg text-charcoal tracking-tight">
                METADATA INTEGRITY QUEUE
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[0.625rem] font-bold font-mono bg-amber-100 text-amber-900 border border-amber-200">
              {artworksNeedingAttention.length} records require details
            </span>
          </div>

          <p className="text-xs text-charcoal-muted leading-relaxed">
            Approved visual works currently lacking complete factual metadata (dimensions, medium specifications, or acquisition pricing decisions).
          </p>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {artworksNeedingAttention.slice(0, 5).map((art) => {
              const missing: string[] = [];
              if (!art.medium || art.medium.trim() === '') missing.push('Medium');
              if (!art.width || !art.height) missing.push('Dimensions');
              if (!art.isPriceOnRequest && (!art.price || art.price === 0)) missing.push('Price');

              return (
                <div
                  key={art.id}
                  className="p-3.5 rounded-xl bg-canvas border border-canvas-border/80 flex items-center justify-between gap-3 hover:border-charcoal/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-canvas-muted shrink-0 border border-canvas-border">
                      <Image
                        src={art.coverImage?.url || '/artworks/pic1.jpeg'}
                        alt={art.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-charcoal truncate">
                        {art.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[0.625rem] font-mono text-charcoal-subtle">
                          {art.artworkId}
                        </span>
                        <span className="text-charcoal-subtle text-[10px]">&bull;</span>
                        <span className="text-[0.625rem] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          Missing: {missing.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/studio/artworks/${art.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-canvas-border text-[0.6875rem] font-medium text-charcoal hover:bg-canvas-subtle shrink-0"
                  >
                    <span>Complete Record</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-canvas-border">
            <Link
              href="/studio/artworks"
              className="text-xs text-charcoal font-medium hover:underline inline-flex items-center gap-1"
            >
              <span>View all {artworks.length} portfolio records in Artworks Manager</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Column (5/12): Recently Updated Content */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-canvas-subtle border border-canvas-border space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display font-semibold text-lg text-charcoal tracking-tight">
                RECENTLY UPDATED
              </h2>
              <span className="text-[0.6875rem] font-mono text-charcoal-subtle">
                Atelier Log
              </span>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
              Latest modifications to artwork records and curatorial statements.
            </p>

            <div className="space-y-3">
              {recentlyUpdatedArtworks.map((art) => (
                <Link
                  key={art.id}
                  href={`/studio/artworks/${art.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-canvas border border-canvas-border hover:border-charcoal/40 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-9 h-9 rounded-md overflow-hidden bg-canvas-muted shrink-0 border border-canvas-border">
                      <Image
                        src={art.coverImage?.url || '/artworks/pic1.jpeg'}
                        alt={art.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-charcoal truncate group-hover:text-charcoal-primary transition-colors">
                        {art.title}
                      </p>
                      <p className="text-[0.625rem] text-charcoal-muted font-mono mt-0.5">
                        {art.status} &bull; {art.publicationStatus}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-charcoal-subtle group-hover:translate-x-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 mt-4">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed">
                <span className="font-semibold block mb-0.5">CMS Security &amp; Isolation Active</span>
                All draft works and private high-res masters remain securely protected behind server-side RLS policies.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Clear Milestone Status for Pending Modules (Requirement 67) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-canvas-subtle border border-canvas-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-charcoal-subtle" />
            <h2 className="font-display font-semibold text-base text-charcoal">
              PHASE ROADMAP &bull; PENDING COMMERCE &amp; INTAKE MODULES
            </h2>
          </div>
          <span className="text-[0.6875rem] font-mono text-charcoal-subtle">
            Legitimate Empty States
          </span>
        </div>

        <p className="text-xs text-charcoal-muted">
          Per development protocol, payment gateways, checkout order persistence, and client CRM will be wired in Phase 7D (Commissions &amp; Enquiries) and Phase 7E (Commerce &amp; Payments). Fabricated financial values are intentionally omitted.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-canvas border border-canvas-border text-xs space-y-1">
            <span className="font-mono uppercase text-[0.625rem] text-charcoal-subtle block">
              PHASE 7D &bull; INTAKE
            </span>
            <p className="font-medium text-charcoal">Bespoke Commissions &amp; Enquiries</p>
            <p className="text-[0.6875rem] text-charcoal-muted">
              Collector inquiry intake and custom milestone updates.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-canvas border border-canvas-border text-xs space-y-1">
            <span className="font-mono uppercase text-[0.625rem] text-charcoal-subtle block">
              PHASE 7E &bull; COMMERCE
            </span>
            <p className="font-medium text-charcoal">Paystack &amp; Stripe Gateways</p>
            <p className="text-[0.6875rem] text-charcoal-muted">
              Live orders, digital receipts, and COA generation.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-canvas border border-canvas-border text-xs space-y-1">
            <span className="font-mono uppercase text-[0.625rem] text-charcoal-subtle block">
              PHASE 7F &bull; DISPATCH
            </span>
            <p className="font-medium text-charcoal">Transactional Notifications</p>
            <p className="text-[0.6875rem] text-charcoal-muted">
              Automated Resend transactional emails to collectors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
