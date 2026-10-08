export type FrostedBlurTier = 'soft' | 'medium' | 'strong';
export type OverlayIntensityTier = 'subtle' | 'balanced' | 'strong';

export interface HeroConfig {
  imageUrl: string;
  imageAlt: string;
  focalPosition?: string;
  headline: string;
  headlineItalic?: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  frostedBlur: FrostedBlurTier; // 'soft' (3px), 'medium' (4.5px), 'strong' (6.5px)
  frostedBlurPx: number;
  overlayIntensity: OverlayIntensityTier;
  enabled: boolean;
  exhibitionStatus?: string;
  locationDispatch?: string;
}

export interface ManifestoSectionConfig {
  enabled: boolean;
  quote: string;
  quoteItalic: string;
  narrative: string;
  artworkImageUrl: string;
  artworkImageAlt: string;
  stackedArtworkImages?: string[]; // 3 overlapping artwork images
}

export interface SelectedWorksSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  artworkSlugs: string[];
}

export interface FeaturedCollectionSectionConfig {
  enabled: boolean;
  collectionSlug: string;
}

export interface ArtistIntroSectionConfig {
  enabled: boolean;
  headline: string;
  intro: string;
  portraitImageUrl: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface CommissionCtaSectionConfig {
  enabled: boolean;
  headline: string;
  supportingText: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImageUrl: string;
}

export interface ServicesPreviewSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  serviceSlugs: string[];
}

export interface FoundTheirHomesSectionConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  artworkSlugs: string[];
}

export interface ClosingStatementSectionConfig {
  enabled: boolean;
  headline: string;
  subtext: string;
}

export interface HomePageContentConfig {
  hero: HeroConfig;
  manifesto: ManifestoSectionConfig;
  selectedWorks: SelectedWorksSectionConfig;
  featuredCollection: FeaturedCollectionSectionConfig;
  artistIntro: ArtistIntroSectionConfig;
  commissionCta: CommissionCtaSectionConfig;
  servicesPreview: ServicesPreviewSectionConfig;
  foundTheirHomes: FoundTheirHomesSectionConfig;
  closingStatement: ClosingStatementSectionConfig;
  sectionOrder: string[];
}

export interface AboutPageConfig {
  artistBiography: string;
  curatorialStatement: string;
  studioPhilosophy: string;
  processNarrative: string;
  portraitImageUrl: string;
  studioLocation: string;
  exhibitionHighlight: string;
}

export interface ContactPageConfig {
  studioEmail: string;
  pressEmail: string;
  telephone: string;
  whatsapp: string;
  locationNote: string;
  hoursNote: string;
  instagram: string;
  xTwitter: string;
  linkedIn: string;
}

export interface GeneralSiteConfig {
  siteName: string;
  tagline: string;
  defaultCurrency: string;
  defaultMeasurementUnit: 'cm' | 'inches';
  copyrightText: string;
  brandStatement: string;
}
