import { artworkService } from '@/services/artworkService';
import { collectionService } from '@/services/collectionService';
import { MOCK_SERVICES } from '@/data/mockServices';
import { HeroSection } from '@/components/home/HeroSection';
import { ArtisticManifesto } from '@/components/home/ArtisticManifesto';
import { SelectedWorks } from '@/components/home/SelectedWorks';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { ArtistIntroduction } from '@/components/home/ArtistIntroduction';
import { CommissionCTA } from '@/components/home/CommissionCTA';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { CollectedWorks } from '@/components/home/CollectedWorks';
import { ClosingCTA } from '@/components/home/ClosingCTA';

export default async function HomePage() {
  // Service abstractions fetching data (swappable for real backend later)
  const heroArtwork = await artworkService.getHeroArtwork();
  const selectedArtworks = await artworkService.getSelected();
  const collectedArtworks = await artworkService.getCollected();
  const featuredCollection = await collectionService.getFeaturedCollection();

  return (
    <div className="relative w-full flex flex-col">
      {/* 01: Art-Directed Exhibition Hero */}
      <HeroSection heroArtwork={heroArtwork} />

      {/* 02: Artistic Manifesto & Tactile Materiality */}
      <ArtisticManifesto />

      {/* 03: Selected Works (Editorial Asymmetric Composition) */}
      <SelectedWorks artworks={selectedArtworks} />

      {/* 04: Featured Collection Room */}
      {featuredCollection && (
        <FeaturedCollection collection={featuredCollection} />
      )}

      {/* 05: Artist Personal Dialogue & Studio Insight */}
      <ArtistIntroduction />

      {/* 06: Bold Commission Invitation */}
      <CommissionCTA />

      {/* 07: Studio Services Preview */}
      <ServicesPreview services={MOCK_SERVICES} />

      {/* 08: Provenance & Archival Collected Works */}
      <CollectedWorks collectedArtworks={collectedArtworks} />

      {/* 09: Memorable Closing Statement */}
      <ClosingCTA />
    </div>
  );
}
