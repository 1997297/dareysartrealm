'use client';

import React from 'react';
import Image from 'next/image';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';
import { Certificate } from '@/types/collector';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-canvas rounded-2xl border border-canvas-border shadow-2xl my-8 overflow-hidden">
        {/* Modal Controls Header */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-canvas-border bg-canvas-subtle">
          <div className="flex items-center gap-2 text-xs text-charcoal">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="font-mono">{certificate.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="text-xs uppercase tracking-gallery px-3.5 py-1.5 border border-canvas-border hover:border-charcoal rounded-lg text-charcoal flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-canvas-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PRINTABLE ARCHIVAL CERTIFICATE DOCUMENT */}
        <div className="p-8 sm:p-12 md:p-14 bg-[#FCFBF8] text-charcoal border-8 border-double border-canvas-border/80 m-4 rounded-xl">
          {/* Certificate Header */}
          <div className="text-center space-y-2 border-b border-charcoal/20 pb-8 flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center mb-1">
              <Logo variant="dark" size={44} />
            </div>
            <span className="font-display tracking-[0.25em] text-xs font-bold uppercase text-charcoal">
              DAREY’S ARTREALM
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl tracking-wider text-charcoal uppercase font-normal">
              Certificate of Authenticity
            </h2>
            <p className="font-serif italic text-xs text-charcoal-muted">
              Official Studio Provenance Record
            </p>
          </div>

          {/* Certificate Body */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Artwork Image */}
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] bg-canvas border border-charcoal/30 rounded-xs overflow-hidden shadow-sm">
                <Image
                  src={certificate.artworkImageUrl}
                  alt={certificate.artworkTitle}
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>

            {/* Artwork Specifications Plaque */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-gallery text-charcoal-muted block">
                  Title of Work
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                  {certificate.artworkTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-y border-charcoal/15 py-3">
                <div>
                  <span className="text-[9px] uppercase tracking-gallery text-charcoal-muted block">
                    Artist
                  </span>
                  <span className="font-medium text-charcoal">Darey</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-gallery text-charcoal-muted block">
                    Year of Creation
                  </span>
                  <span className="font-medium text-charcoal">{certificate.artworkYear}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-gallery text-charcoal-muted block">
                    Medium
                  </span>
                  <span className="font-medium text-charcoal">{certificate.artworkMedium}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-gallery text-charcoal-muted block">
                    Dimensions
                  </span>
                  <span className="font-medium text-charcoal">{certificate.dimensions}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[9px] uppercase tracking-gallery text-charcoal-muted block">
                  Original Acquired By
                </span>
                <span className="font-serif text-base text-charcoal font-medium">
                  {certificate.collectorName}
                </span>
              </div>

              <div className="text-[11px] text-charcoal-muted leading-relaxed font-serif italic pt-1">
                {certificate.authenticityStatement}
              </div>
            </div>
          </div>

          {/* Certificate Footer with Signature & Wax Seal */}
          <div className="border-t border-charcoal/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left text-[11px]">
              <span className="text-[9px] uppercase tracking-gallery text-charcoal-muted block">
                Verification Identifier
              </span>
              <span className="font-mono text-charcoal font-medium">{certificate.verificationCode}</span>
              <p className="text-[10px] text-charcoal-muted">Issued: {certificate.issuedDate}</p>
            </div>

            {/* Simulated Wax Seal Graphic */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-[#8A2424] bg-[#962A2A] text-canvas flex flex-col items-center justify-center shadow-md p-2">
                <Logo variant="light" size={24} className="opacity-95" />
                <span className="text-[6px] tracking-widest text-[#FCD5D5] uppercase font-bold mt-0.5">
                  STUDIO SEAL
                </span>
              </div>
              <div className="text-right">
                <span className="font-serif italic text-lg text-charcoal block -mb-1 font-medium">
                  Darey
                </span>
                <span className="text-[9px] uppercase tracking-gallery text-charcoal-muted">
                  Artist & Studio Principal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
