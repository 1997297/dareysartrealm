import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { artworkService } from '@/services/artworkService';
import { ArtworkDetailClient } from './ArtworkDetailClient';

interface PageProps {
  params: { slug: string };
  searchParams: { preview?: string };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const isPreview = searchParams?.preview === 'true';
  const artwork = await artworkService.getBySlug(params.slug, { allowDraft: isPreview });

  if (!artwork || (!isPreview && artwork.publicationStatus !== 'published')) {
    return {
      title: 'Artwork Not Found | Darey\'s Artrealm',
    };
  }

  return {
    title: `${artwork.title} (${artwork.year}) | Darey's Artrealm`,
    description: artwork.metaDescription || artwork.description,
    openGraph: {
      title: `${artwork.title} | Darey's Artrealm`,
      description: artwork.description,
      images: [
        {
          url: artwork.coverImage.url,
          width: artwork.coverImage.width,
          height: artwork.coverImage.height,
          alt: artwork.coverImage.alt || artwork.title,
        },
      ],
    },
  };
}

export default async function ArtworkDetailPage({ params, searchParams }: PageProps) {
  const { slug } = params;
  const isPreview = searchParams?.preview === 'true';

  // 1. Admin Draft Preview Workflow
  if (isPreview) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Block anonymous requests to draft preview
    if (!user) {
      notFound();
    }

    // Verify trusted admin role in database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .maybeSingle();

    // Block collectors or non-admin users
    if (!profile || profile.role !== 'admin' || profile.status !== 'active') {
      notFound();
    }

    // Trusted Admin: Fetch draft or published artwork
    const artwork = await artworkService.getBySlug(slug, { allowDraft: true });
    if (!artwork) {
      notFound();
    }

    const related = await artworkService.getRelated(artwork.id, 3);
    return (
      <ArtworkDetailClient
        initialArtwork={artwork}
        initialRelatedArtworks={related}
        isAdminPreview={true}
      />
    );
  }

  // 2. Standard Public Visitor Workflow
  // Anonymous and collectors can ONLY access published artworks
  const artwork = await artworkService.getBySlug(slug);

  if (!artwork || artwork.publicationStatus !== 'published') {
    notFound();
  }

  const related = await artworkService.getRelated(artwork.id, 3);
  return (
    <ArtworkDetailClient
      initialArtwork={artwork}
      initialRelatedArtworks={related}
      isAdminPreview={false}
    />
  );
}
