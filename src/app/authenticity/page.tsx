'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, FileText, CheckCircle2, ArrowRight, Stamp, Lock } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function AuthenticityPage() {
  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <Container size="narrow">
        {/* Header */}
        <div className="border-b border-canvas-border pb-12 mb-16">
          <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
            ARCHIVAL STANDARDS &amp; PROVENANCE
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal tracking-tight">
            Certificates of Authenticity
          </h1>
          <p className="mt-6 text-base sm:text-lg text-charcoal-muted font-light leading-relaxed">
            Every original painting created by Darey is a singular, unrepeatable one-of-one masterwork. To protect collectors and ensure archival provenance across generations, each acquisition is certified through physical and permanent archival protocols.
          </p>
        </div>

        {/* Certificate Feature Card */}
        <div className="p-8 sm:p-12 bg-canvas-subtle border border-canvas-border rounded-2xl space-y-8 mb-16 shadow-subtle">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-charcoal text-canvas flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 stroke-1" />
            </div>
            <div>
              <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
                AUTHENTICITY GUARANTEE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl text-charcoal font-medium">
                The Physical Certificate
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
            Upon completion and acquisition of an original artwork, a physical Certificate of Authenticity is printed on heavyweight 310gsm cotton-rag archival archival paper. The document is signed in ink by Darey, hand-dated, and sealed with the studio’s bespoke wax seal.
          </p>

          <div className="p-6 bg-canvas border border-canvas-border rounded-xl space-y-4 text-xs font-mono text-charcoal">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <span className="text-charcoal-subtle uppercase tracking-gallery text-[10px]">Document Attribute</span>
              <span className="text-charcoal-subtle uppercase tracking-gallery text-[10px]">Studio Specification</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted font-sans">Substrate</span>
              <span>310gsm 100% Cotton Rag Archival Paper</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted font-sans">Artist Signature</span>
              <span>Physical Pigment Ink Signature by Darey</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted font-sans">Embossing</span>
              <span>Studio Seal Wax Imprint</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted font-sans">Registration Code</span>
              <span>Unique Alpha-Numeric Studio Ledger Identifier</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-charcoal-muted font-sans">Digital Twin</span>
              <span>Permanently mirrored in Collector Portal</span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Provenance */}
        <div className="space-y-8 mb-16">
          <h3 className="font-display text-2xl sm:text-3xl text-charcoal font-normal">
            The Provenance Process
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-canvas border border-canvas-border rounded-xl space-y-3">
              <span className="font-mono text-xs font-semibold text-charcoal block">01 / CREATION LOG</span>
              <h4 className="font-serif text-lg text-charcoal font-medium">Original Ledger Registry</h4>
              <p className="text-xs text-charcoal-muted font-light leading-relaxed">
                Before any canvas leaves the studio, its high-resolution photographic master, physical dimensions, medium alchemy, and date of completion are recorded into the central archive.
              </p>
            </div>

            <div className="p-6 bg-canvas border border-canvas-border rounded-xl space-y-3">
              <span className="font-mono text-xs font-semibold text-charcoal block">02 / COLLECTOR REGISTRATION</span>
              <h4 className="font-serif text-lg text-charcoal font-medium">Confidential Handover</h4>
              <p className="text-xs text-charcoal-muted font-light leading-relaxed">
                The initial collector name and acquisition date are linked to the artwork’s registry number. This establishes primary provenance without compromising client privacy.
              </p>
            </div>

            <div className="p-6 bg-canvas border border-canvas-border rounded-xl space-y-3">
              <span className="font-mono text-xs font-semibold text-charcoal block">03 / SECONDARY RESALE</span>
              <h4 className="font-serif text-lg text-charcoal font-medium">Provenance Transfer</h4>
              <p className="text-xs text-charcoal-muted font-light leading-relaxed">
                Should a work be resold through a gallery, auction house, or private transaction, the studio verifies the certificate code and updates the permanent chain of custody.
              </p>
            </div>

            <div className="p-6 bg-canvas border border-canvas-border rounded-xl space-y-3">
              <span className="font-mono text-xs font-semibold text-charcoal block">04 / REPRODUCTION RIGHTS</span>
              <h4 className="font-serif text-lg text-charcoal font-medium">Copyright Protection</h4>
              <p className="text-xs text-charcoal-muted font-light leading-relaxed">
                Ownership of the physical canvas passes to the collector; all copyright and moral reproduction rights are preserved by the artist under international fine-art conventions.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Inquiries */}
        <div className="p-8 bg-canvas-subtle border border-canvas-border rounded-2xl space-y-4">
          <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block">
            PROVENANCE INQUIRIES
          </span>
          <h3 className="font-display text-xl text-charcoal font-medium">
            Need to Verify an Artwork Certificate?
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
            Curators, appraisers, and collectors wishing to verify an existing artwork registration number or request a re-issued certificate may contact the studio directly with the verification code and high-resolution photographs of the physical piece.
          </p>
          <div className="pt-2">
            <Button href="/contact" variant="secondary" size="sm">
              Contact Studio Archival Desk &rarr;
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
