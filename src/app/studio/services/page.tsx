'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Building2, Check, ExternalLink } from 'lucide-react';
import { serviceService } from '@/services/serviceService';
import { ServiceOffering } from '@/types/service';

export default function StudioServicesPage() {
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const list = await serviceService.getAll();
        setServices(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-border">
        <div>
          <span className="gallery-plaque text-[0.6875rem] text-charcoal-subtle tracking-[0.2em]">
            STUDIO CAPABILITIES
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-charcoal tracking-tight">
            Architectural & Studio Services
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Public offerings for commercial installations, hospitality murals, and private curatorial advisory.
          </p>
        </div>

        <Link
          href="/studio/service-requests"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-charcoal text-canvas hover:bg-charcoal/90 text-xs font-sans font-medium transition-colors shadow-subtle shrink-0"
        >
          <Building2 className="w-4 h-4" />
          <span>View Service Requests</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="p-6 rounded-2xl bg-canvas border border-canvas-border/80 shadow-subtle flex flex-col justify-between space-y-4 hover:shadow-elevated transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-charcoal-subtle uppercase">OFFERING</span>
                  <span className="px-2 py-0.5 rounded-full text-[0.625rem] bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Active & Receiving Briefs
                  </span>
                </div>

                <h3 className="font-display text-xl font-semibold text-charcoal">
                  {srv.title}
                </h3>
                <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                  {srv.description || srv.shortDescription}
                </p>

                <div className="mt-4 p-3 rounded-xl bg-canvas-subtle border border-canvas-border/70 text-xs font-sans space-y-1">
                  <p className="text-[0.6875rem] font-mono uppercase text-charcoal-subtle">
                    Engagement Structure
                  </p>
                  <p className="font-medium text-charcoal">
                    {srv.pricingStructure || 'Custom Consultation & Scope Proposal'}
                  </p>
                  <p className="text-charcoal-muted text-[0.6875rem]">
                    Typical Lead Time: {srv.typicalTimeline || '6–12 weeks'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-canvas-border flex items-center justify-between">
                <Link
                  href={`/services/${srv.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal hover:underline font-medium"
                >
                  <span>Public Offering Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-charcoal-subtle" />
                </Link>

                <Link
                  href="/studio/service-requests"
                  className="px-3 py-1.5 rounded-xl border border-canvas-border text-xs font-medium text-charcoal hover:bg-canvas-subtle transition-colors"
                >
                  Incoming Briefs &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
