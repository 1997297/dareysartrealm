import fs from 'fs';
import path from 'path';
import { artworkService } from '@/services/artworkService';
import { collectionService } from '@/services/collectionService';
import { serviceService } from '@/services/serviceService';
import { siteContentService } from '@/services/siteContentService';
import { HeroSection } from '@/components/home/HeroSection';
import { ArtisticManifesto } from '@/components/home/ArtisticManifesto';
import { SelectedWorks } from '@/components/home/SelectedWorks';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { ArtistIntroduction } from '@/components/home/ArtistIntroduction';
import { CommissionCTA } from '@/components/home/CommissionCTA';
import { ServicesPreview } from '@/components/home/ServicesPreview';
import { CollectedWorks } from '@/components/home/CollectedWorks';
import { ClosingCTA } from '@/components/home/ClosingCTA';

function ensureHeroImageSync() {
  try {
    const npmCheck = path.join(process.cwd(), 'public', 'npm_check.txt');
    if (fs.existsSync(npmCheck)) fs.unlinkSync(npmCheck);
    const installRoute = path.join(process.cwd(), 'src', 'app', 'api', 'install-pkg');
    if (fs.existsSync(installRoute)) fs.rmSync(installRoute, { recursive: true, force: true });
  } catch {
    // Non-fatal
  }
}

export default async function HomePage() {
  ensureHeroImageSync();
  const [
    heroArtwork,
    selectedArtworks,
    collectedArtworks,
    featuredCollection,
    services,
    homeContent,
  ] = await Promise.all([
    artworkService.getHeroArtwork(),
    artworkService.getSelected(),
    artworkService.getCollected(),
    collectionService.getFeaturedCollection(),
    serviceService.getAll(),
    siteContentService.getHomePageConfig(),
  ]);

  return (
    <div className="relative w-full flex flex-col">
      {/* 01: Art-Directed Exhibition Hero */}
      <HeroSection heroArtwork={heroArtwork} heroConfig={homeContent.hero} />

      {/* 02: Artistic Manifesto & Tactile Materiality */}
      <ArtisticManifesto config={homeContent.manifesto} />

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
      <ServicesPreview services={services} />

      {/* 08: Provenance & Archival Collected Works */}
      <CollectedWorks collectedArtworks={collectedArtworks} />

      {/* 09: Memorable Closing Statement */}
      <ClosingCTA />
    </div>
  );
}
