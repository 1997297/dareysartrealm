'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/layout/Container';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <Container size="narrow">
        {/* Header */}
        <div className="border-b border-canvas-border pb-12 mb-12">
          <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
            LEGAL &amp; ACQUISITION AGREEMENT
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal tracking-tight">
            Terms &amp; Provenance
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
            Effective Date: October 2026 &bull; Darey&apos;s Artrealm Fine Art Practice
          </p>
        </div>

        {/* Legal Text Content */}
        <div className="space-y-12 text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              1. Original Artwork Acquisitions
            </h2>
            <p>
              All artworks listed in the public catalogue are unique, one-of-one original creations conceived and executed by Darey. Because each work is a singular physical asset, purchases are subject to immediate inventory reservation upon order verification.
            </p>
            <p>
              Prices are displayed in United States Dollars (USD) or the currency agreed upon during formal invoice generation. Prices do not include local import duties, tariffs, or municipal taxes levied in the collector’s delivery jurisdiction, which remain the sole responsibility of the importer.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              2. Intellectual Property &amp; Copyright
            </h2>
            <p>
              The acquisition of an original painting or commissioned piece transfers physical ownership of the canvas or substrate to the collector. All copyright, reproduction rights, and moral rights remain strictly and exclusively reserved by Darey under international intellectual property conventions.
            </p>
            <p>
              The collector may display the physical artwork privately or in public institutional settings, but may not commercially reproduce, manufacture merchandise, mint non-fungible tokens (NFTs), or broadcast unauthorized derivative imagery without explicit prior written license from Darey.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              3. Bespoke Commission Agreements
            </h2>
            <p>
              Bespoke commissions proceed according to an agreed milestone schedule:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Initial Deposit:</strong> A non-refundable 50% deposit is required to reserve the artist’s atelier schedule, secure custom Belgian linen substrates, and initiate compositional studies.
              </li>
              <li>
                <strong>Study Approval:</strong> The collector reviews charcoal sketches, scale ratios, and color palettes before heavy impasto sculpting begins.
              </li>
              <li>
                <strong>Final Balance:</strong> The remaining 50% balance, plus crating and shipping logistics, is due upon collector approval of completed studio photographs and prior to dispatch.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              4. Packaging, Fine-Art Transport &amp; Insurance
            </h2>
            <p>
              To ensure the preservation of delicate impasto relief, high-mineral pigments, and gold leaf, all canvases are crated in custom-built, moisture-sealed, reinforced timber crates lined with acid-free foam.
            </p>
            <p>
              Transport is handled exclusively via specialized fine-art logistics couriers with full transit insurance. In the extraordinary event that damage occurs during international transit, the collector must notify the studio within 48 hours of delivery with photographic documentation of both the exterior crate and the substrate.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              5. Certificate of Authenticity &amp; Provenance Transfer
            </h2>
            <p>
              Each original work is accompanied by a physical, wax-sealed Certificate of Authenticity signed by Darey. Should the artwork ever be sold, gifted, or consigned to an auction house, this certificate must accompany the piece to maintain uninterrupted provenance in the studio archive.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              6. Return &amp; Cancellation Policy
            </h2>
            <p>
              Due to the bespoke and irreplaceable nature of original fine art, all sales are final upon delivery confirmation and inspection. If an acquired piece fails to match the documented catalogued specifications, collectors may request an inspection consultation within 7 days of delivery.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              7. Studio Contact
            </h2>
            <p>
              For legal inquiries, provenance transfer notifications, or questions regarding these terms, contact the atelier desk at{' '}
              <a href="mailto:studio@dareysartrealm.com" className="text-charcoal underline">
                studio@dareysartrealm.com
              </a>.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
