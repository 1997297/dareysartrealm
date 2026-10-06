'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, FileText, Printer, ArrowRight } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { collectorService } from '@/services/collectorService';
import { Certificate } from '@/types/collector';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { Button } from '@/components/ui/Button';

export default function AccountCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    collectorService.getCertificates().then((data) => {
      setCertificates(data);
      setIsLoading(false);
    });
  }, []);

  const handleOpenCertificate = (cert: Certificate) => {
    setSelectedCert(cert);
    setModalOpen(true);
  };

  return (
    <AccountShell
      title="Certificates of Authenticity"
      subtitle="Archival documentation certifying the unique one-of-one status and provenance of your acquired pieces."
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-charcoal border-t-transparent animate-spin" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center bg-canvas-subtle border border-canvas-border rounded-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-canvas border border-canvas-border flex items-center justify-center mx-auto text-charcoal-muted">
              <FileText className="w-6 h-6 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal font-light">
              No certificates issued yet.
            </h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto font-light leading-relaxed">
              Upon acquisition of any original studio piece, a wax-sealed Certificate of Authenticity is permanently archived in this registry.
            </p>
            <div className="pt-2">
              <Button href="/artworks" variant="primary" size="md">
                Browse Original Artworks
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-6 bg-canvas border border-canvas-border rounded-sm hover:border-charcoal/50 transition-colors space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-canvas-border pb-3">
                    <span className="font-mono text-xs font-medium text-charcoal tracking-wider">
                      {cert.id}
                    </span>
                    <span className="text-[10px] uppercase tracking-gallery px-2 py-0.5 bg-canvas-subtle border border-canvas-border rounded-xs text-accent font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="relative w-20 h-24 bg-canvas-subtle border border-canvas-border rounded-xs overflow-hidden shrink-0">
                      <Image
                        src={cert.artworkImageUrl}
                        alt={cert.artworkTitle}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-serif text-xl text-charcoal font-medium">
                        {cert.artworkTitle}
                      </h3>
                      <p className="text-xs text-charcoal-muted font-light">
                        {cert.artworkMedium}, {cert.artworkYear}
                      </p>
                      <p className="text-[11px] text-charcoal-muted/80">
                        {cert.dimensions}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-canvas-subtle border border-canvas-border rounded-xs text-xs space-y-1">
                    <div className="flex justify-between text-charcoal-muted text-[11px]">
                      <span>Collector:</span>
                      <span className="font-medium text-charcoal">{cert.collectorName}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-muted text-[11px]">
                      <span>Issue Date:</span>
                      <span className="text-charcoal">{cert.issuedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-canvas-border flex items-center justify-between">
                  <span className="font-mono text-[10px] text-charcoal-muted">
                    {cert.verificationCode}
                  </span>

                  <Button
                    onClick={() => handleOpenCertificate(cert)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Official Certificate</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CertificateModal
        certificate={selectedCert}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </AccountShell>
  );
}
