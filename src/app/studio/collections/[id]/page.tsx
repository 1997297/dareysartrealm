'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { CollectionEditor } from '@/components/studio/CollectionEditor';
import { collectionService } from '@/services/collectionService';
import { Collection } from '@/types/collection';

export default function EditCollectionPage() {
  const params = useParams();
  const id = params.id as string;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollection() {
      if (!id) return;
      try {
        const found =
          (await collectionService.getById(id)) ||
          (await collectionService.getBySlug(id));
        setCollection(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCollection();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="mt-3 text-xs uppercase tracking-widest text-charcoal-muted font-mono">
          Loading Collection Dossier...
        </p>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Collection Not Found
        </h2>
        <p className="text-xs text-charcoal-muted leading-relaxed font-sans">
          The requested series &ldquo;{id}&rdquo; does not exist or has been removed.
        </p>
        <Link
          href="/studio/collections"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal text-canvas text-xs font-medium hover:bg-charcoal/90 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Collections</span>
        </Link>
      </div>
    );
  }

  return <CollectionEditor initialCollection={collection} isNew={false} />;
}
