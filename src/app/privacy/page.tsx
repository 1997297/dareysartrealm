'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff } from 'lucide-react';
import { Container } from '@/components/layout/Container';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-canvas pt-28 pb-24">
      <Container size="narrow">
        {/* Header */}
        <div className="border-b border-canvas-border pb-12 mb-12">
          <span className="gallery-plaque text-[0.625rem] text-charcoal-subtle block mb-3">
            COLLECTOR PRIVACY &amp; CONFIDENTIALITY
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
            Effective Date: October 2026 &bull; Darey&apos;s Artrealm Fine Art Practice
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-12 text-xs sm:text-sm text-charcoal-muted font-light leading-relaxed">
          <div className="p-6 bg-canvas-subtle border border-canvas-border rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-charcoal font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Our Commitment to Collector Discretion</span>
            </div>
            <p className="text-xs text-charcoal-muted font-light">
              We understand that art collecting is deeply personal. Darey&apos;s Artrealm maintains an unwavering standard of privacy regarding our patrons, acquisition histories, and bespoke residential installations.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              1. Information We Collect
            </h2>
            <p>
              When you interact with Darey&apos;s Artrealm, we collect only information necessary to fulfill acquisitions, commissions, and curatorial correspondence:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Collector Contact Details:</strong> Name, email address, telephone/WhatsApp number, and postal addresses required for insured fine-art freight.
              </li>
              <li>
                <strong>Commission Specifications:</strong> Wall dimensions, interior photographs, palette references, and narrative briefs provided during bespoke consultations.
              </li>
              <li>
                <strong>Provenance Documentation:</strong> Certificate of Authenticity registration codes and acquisition timestamps logged in the private studio ledger.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              2. How Your Information is Utilized
            </h2>
            <p>
              Your data is utilized solely for:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Facilitating secure artwork transactions, crating, and insured international shipping.</li>
              <li>Maintaining the permanent studio provenance ledger for your acquired pieces.</li>
              <li>Communicating milestone progress photographs for bespoke commissions.</li>
              <li>Responding to private studio appointment requests and exhibition inquiries.</li>
            </ul>
            <p>
              We do not sell, rent, lease, or monetize collector information to third-party data brokers, advertising networks, or commercial marketing platforms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              3. Data Security &amp; Storage
            </h2>
            <p>
              We apply industry-standard administrative and technical safeguards to protect your personal information against unauthorized access, loss, or alteration. All transaction communications and account credentials are encrypted in transit.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              4. Cookies &amp; Local Persistence
            </h2>
            <p>
              Darey&apos;s Artrealm uses functional local browser storage solely to preserve your saved works selection, acquisition cart state, and authentication session. We do not employ aggressive cross-site tracking scripts.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl text-charcoal font-medium">
              5. Collector Rights
            </h2>
            <p>
              You maintain the right to inspect, correct, or request deletion of your personal account information from our active records at any time, subject to legal and taxation requirements governing historical fine-art sale records.
            </p>
            <p>
              To exercise these rights, email the studio administrator directly at{' '}
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
