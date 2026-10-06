'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ArtworkEditor } from '@/components/studio/ArtworkEditor';
import { artworkService } from '@/services/artworkService';
import { Artwork } from '@/types/artwork';

export default function EditArtworkPage() {
  const params = useParams();
  const id = params.id as string;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArtwork() {
      if (!id) return;
      try {
        const found = (await artworkService.getById(id)) || (await artworkService.getBySlug(id));
        setArtwork(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadArtwork();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Artwork Dossier...
        </p>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Artwork Record Not Found
        </h2>
        <p className="text-xs text-charcoal-muted leading-relaxed font-sans">
          The requested identifier &ldquo;{id}&rdquo; does not correspond to an existing catalogue registration.
        </p>
        <Link
          href="/studio/artworks"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  return <ArtworkEditor initialArtwork={artwork} isNew={false} />;
}
