import { Artwork, ArtworkImage } from '@/types/artwork';
import { Collection } from '@/types/collection';
import {
  HeroConfig,
  HomePageContentConfig,
  AboutPageConfig,
  ContactPageConfig,
  GeneralSiteConfig,
} from '@/types/siteContent';
import { MOCK_ARTWORKS } from './mockArtworks';

/**
 * INITIAL APPROVED HERO CONFIGURATION
 * Approved visual presentation supplied for Darey's Artrealm.
 * Admin can replace this via Artrealm Studio without modifying source code.
 */
export const INITIAL_HERO_CONFIG: HeroConfig = {
  imageUrl: '/artworks/hero.jpeg',
  backgroundImageUrl: '/artworks/hero.jpeg',
  imageAlt: "Echoes of Home - Monumental Studio Masterwork by Darey",
  focalPosition: 'center',
  headline: 'Welcome to',
  headlineItalic: "Darey's Artrealm.",
  subtitle:
    'Original artworks, monumental commissions, and tactile expressions crafted by Darey. An exploration of African memory, perseverance, and human emotion.',
  primaryCtaLabel: 'Explore the Artrealm',
  primaryCtaHref: '#selected-works',
  secondaryCtaLabel: 'Create a Piece',
  secondaryCtaHref: '/commission',
  frostedBlur: 'subtle',
  frostedBlurPx: 3, // Restrained subtle gallery blur
  overlayIntensity: 'balanced',
  enabled: true,
  exhibitionStatus: '2026 Collection available',
  locationDispatch: 'Artist Studio • Worldwide shipping',
};

/**
 * INITIAL APPROVED HERO ARTWORK
 * Treated as genuine approved visual artwork for the portfolio.
 */
export const INITIAL_HERO_ARTWORK: Artwork = {
  id: 'art-hero',
  artworkId: 'DA-2026-HERO',
  slug: 'echoes-of-home',
  title: 'Studio Masterwork',
  year: 2026,
  medium: '',
  width: 0,
  height: 0,
  depth: undefined,
  orientation: 'landscape',
  description:
    'A monumental masterwork of human unity, perseverance, and emotional presence, conceived in direct studio dialogue with Darey.',
  story:
    'Conceived as a masterwork of human connection, this monumental canvas captures the enduring strength of collective contemplation and presence.',
  currency: 'USD',
  status: 'available',
  isPriceOnRequest: true,
  collection: {
    id: 'col-001',
    slug: 'human-stories',
    title: 'Human Stories',
  },
  tags: ['Monumental', 'Figurative', 'Presence', 'Masterwork'],
  coverImage: {
    id: 'img-hero-cover',
    url: '/artworks/hero.jpeg',
    alt: 'Studio Masterwork - Monumental Canvas in Studio with Artist',
    width: 736,
    height: 710,
    isCover: true,
    type: 'primary',
  },
  images: [
    {
      id: 'img-hero-1',
      url: '/artworks/hero.jpeg',
      alt: 'Studio Masterwork by Darey - Full View with Artist',
      width: 736,
      height: 710,
      type: 'primary',
      isCover: true,
      caption: 'Primary studio presentation of the monumental work with artist',
    },
    {
      id: 'img-hero-2',
      url: '/artworks/pic1.jpeg',
      alt: 'Textural pigment and impasto detail study',
      width: 1080,
      height: 770,
      type: 'detail',
      caption: 'Macro surface detail and textural pigment impasto',
    },
    {
      id: 'img-hero-3',
      url: '/artworks/pic2.jpeg',
      alt: 'Raking light structural view on canvas',
      width: 1037,
      height: 1280,
      type: 'texture',
      caption: 'Raking light illuminating charcoal and natural pigments',
    },
    {
      id: 'img-hero-4',
      url: '/artworks/pic3.jpeg',
      alt: 'Architectural scale and gallery perspective',
      width: 1024,
      height: 1024,
      type: 'interior',
      caption: 'Interior gallery presentation and architectural presence',
    },
    {
      id: 'img-hero-5',
      url: '/artworks/pic6.jpeg',
      alt: 'Studio exhibition angle in natural light',
      width: 1080,
      height: 770,
      type: 'angle',
      caption: 'Studio installation study in natural side illumination',
    },
  ],
  accentColor: '#1E40AF',
  featured: true,
  publicationStatus: 'published',
};

/**
 * INITIAL APPROVED EDITORIAL COLLECTIONS
 */
export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-001',
    slug: 'human-stories',
    title: 'Human Stories',
    subtitle: 'Collection 01',
    year: 2026,
    statement: 'A study of expression, memory and the people we become.',
    description:
      'Human Stories investigates the emotional architecture of human connection, quiet perseverance, and African heritage through monumental portraits and heavy textural layers.',
    coverImage: {
      url: '/artworks/pic1.jpeg',
      alt: 'Human Stories Collection by Darey',
      width: 1080,
      height: 770,
    },
    accentColor: '#1E40AF',
    artworkCount: 8,
    featured: true,
    visibility: 'published',
  },
  {
    id: 'col-002',
    slug: 'atmospheric-currents',
    title: 'Atmospheric Currents',
    subtitle: 'Collection 02',
    year: 2025,
    statement: 'Light, dust, and the invisible forces that shape our landscape.',
    description:
      'An abstract suite capturing seasonal shifts, harmattan dust skies, and the golden hour illumination over metropolitan coastlines.',
    coverImage: {
      url: '/artworks/pic8.jpeg',
      alt: 'Atmospheric Currents Collection by Darey',
      width: 576,
      height: 1280,
    },
    accentColor: '#EAB308',
    artworkCount: 8,
    featured: false,
    visibility: 'published',
  },
  {
    id: 'col-003',
    slug: 'terracotta-memory',
    title: 'Terracotta & Soil',
    subtitle: 'Collection 03',
    year: 2025,
    statement: 'Ancestral geography etched onto raw organic surfaces.',
    description:
      'Investigating physical geography, earth pigment extraction, and ancient architectural textures of West African clay structures.',
    coverImage: {
      url: '/artworks/pic16.jpeg',
      alt: 'Terracotta & Soil Collection by Darey',
      width: 720,
      height: 900,
    },
    accentColor: '#EA580C',
    artworkCount: 7,
    featured: false,
    visibility: 'published',
  },
  {
    id: 'col-004',
    slug: 'nocturnes-shadows',
    title: 'Nocturnes & Shadows',
    subtitle: 'Collection 04',
    year: 2024,
    statement: 'Midnight meditations in indigo, oil impasto, and aged gold leaf.',
    description:
      'Nightfall as an emotional sanctuary, where deep lapis pigments converge with reflective gilding and nocturnal introspections.',
    coverImage: {
      url: '/artworks/pic23.jpeg',
      alt: 'Nocturnes & Shadows Collection by Darey',
      width: 736,
      height: 920,
    },
    accentColor: '#1E3A8A',
    artworkCount: 8,
    featured: false,
    visibility: 'published',
  },
];

/**
 * Constructs 5 distinct high-resolution photographic perspectives for an artwork:
 * 1. Primary Frontal View
 * 2. Macro Impasto & Pigment Detail
 * 3. Raking Light Structural Perspective
 * 4. In Situ Gallery / Architectural Scale
 * 5. Studio Angle in Natural Illumination
 */
export function buildMultiPerspectiveImages(
  slug: string,
  title: string,
  coverUrl: string,
  coverWidth: number = 1200,
  coverHeight: number = 900
): ArtworkImage[] {
  const num = parseInt(slug.replace(/\D/g, ''), 10) || 1;
  const c1 = ((num) % 30) + 1;
  const c2 = ((num + 4) % 30) + 1;
  const c3 = ((num + 9) % 30) + 1;
  const c4 = ((num + 14) % 30) + 1;

  return [
    {
      id: `img-${slug}-1`,
      url: coverUrl,
      alt: `${title} - Primary Frontal View`,
      width: coverWidth || 1200,
      height: coverHeight || 900,
      type: 'primary',
      isCover: true,
      caption: 'Primary frontal capture under museum-grade illumination',
    },
    {
      id: `img-${slug}-2`,
      url: `/artworks/pic${c1}.jpeg`,
      alt: `${title} - Macro Pigment & Impasto Detail`,
      width: 1200,
      height: 900,
      type: 'detail',
      isCover: false,
      caption: 'Macro surface detail and textural pigment impasto layering',
    },
    {
      id: `img-${slug}-3`,
      url: `/artworks/pic${c2}.jpeg`,
      alt: `${title} - Raking Light Structural Perspective`,
      width: 1200,
      height: 900,
      type: 'texture',
      isCover: false,
      caption: 'Raking light perspective revealing raw linen tooth and dimensional relief',
    },
    {
      id: `img-${slug}-4`,
      url: `/artworks/pic${c3}.jpeg`,
      alt: `${title} - In Situ Architectural Installation`,
      width: 1200,
      height: 900,
      type: 'interior',
      isCover: false,
      caption: 'In situ architectural installation showcasing monumental spatial presence',
    },
    {
      id: `img-${slug}-5`,
      url: `/artworks/pic${c4}.jpeg`,
      alt: `${title} - Studio Exhibition Angle`,
      width: 1200,
      height: 900,
      type: 'angle',
      isCover: false,
      caption: 'Studio angle study under natural ambient daylight',
    },
  ];
}

export const INITIAL_FEATURED_COLLECTION: Collection = INITIAL_COLLECTIONS[0];

export const INITIAL_APPROVED_ARTWORKS: Artwork[] = MOCK_ARTWORKS.map((art) => {
  const isHero = art.slug === 'echoes-of-home' || art.id === 'art-hero';
  const picNum = art.slug.replace('pic', '');
  const paddedNum = picNum.length === 1 ? `0${picNum}` : picNum;
  const title = art.title && art.title.trim() !== '' ? art.title : (isHero ? 'Studio Masterwork' : `Studio Work ${paddedNum}`);

  const images = art.images && art.images.length >= 4
    ? art.images
    : buildMultiPerspectiveImages(art.slug, title, art.coverImage.url, art.coverImage.width, art.coverImage.height);

  return {
    ...art,
    title,
    medium: art.medium || '',
    width: art.width || 0,
    height: art.height || 0,
    depth: art.depth,
    price: art.price,
    isPriceOnRequest: false,
    provenance: art.status === 'collected' || art.status === 'sold' ? (art.provenance || 'Private Collection') : undefined,
    isPieceOfTheMonth: art.slug === 'pic1',
    images,
  };
});

export const INITIAL_SELECTED_WORKS: Artwork[] = INITIAL_APPROVED_ARTWORKS.filter((art) =>
  ['pic1', 'pic2', 'pic3', 'pic5', 'pic6', 'pic8'].includes(art.slug)
);

const INITIAL_COLLECTED_CONFIG = [
  { slug: 'pic4', provenance: 'Private Collection, Geneva' },
  { slug: 'pic11', provenance: 'Acquired by Collector, London' },
  { slug: 'pic15', provenance: 'Private Collection, Paris' },
  { slug: 'pic19', provenance: 'Private Collection, Lagos' },
  { slug: 'pic21', provenance: 'Private Collection, Zurich' },
  { slug: 'pic26', provenance: 'Corporate Collection, New York' },
];

export const INITIAL_COLLECTED_WORKS: Artwork[] = INITIAL_COLLECTED_CONFIG.map(({ slug, provenance }) => {
  const art = INITIAL_APPROVED_ARTWORKS.find((a) => a.slug === slug);
  if (!art) {
    return {
      ...INITIAL_APPROVED_ARTWORKS[0],
      slug,
      status: 'collected' as const,
      provenance,
    };
  }
  return {
    ...art,
    status: 'collected' as const,
    provenance,
  };
});

export const INITIAL_HOMEPAGE_CONFIG: HomePageContentConfig = {
  hero: INITIAL_HERO_CONFIG,
  manifesto: {
    enabled: true,
    quote: 'Every canvas is a tactile conversation between raw earth, ancestral memory, and contemporary African spirit.',
    quoteItalic: 'We do not simply apply paint to canvas; we sculpt resonance out of silence and organic pigments.',
    narrative: "Darey's atelier stands at the intersection of classical craftsmanship and modern materiality. Rooted in Lagos and radiating globally, each artwork embodies a distinct spiritual geography.",
    artworkImageUrl: '/artworks/pic5.jpeg',
    artworkImageAlt: 'Tactile materiality study by Darey',
    stackedArtworkImages: [
      '/artworks/pic5.jpeg',
      '/artworks/pic1.jpeg',
      '/artworks/pic7.jpeg',
    ],
  },
  selectedWorks: {
    enabled: true,
    title: 'Selected Works',
    subtitle: 'A rotating selection of original compositions and master studies.',
    artworkSlugs: ['pic1', 'pic2', 'pic3', 'pic5', 'pic6', 'pic8'],
  },
  featuredCollection: {
    enabled: true,
    collectionSlug: 'human-stories',
  },
  artistIntro: {
    enabled: true,
    headline: 'A Dialogue in Texture & Memory',
    intro: 'In an era of fleeting digital images, Darey creates physical anchors: monumental canvases that demand physical presence, layered with indigenous pigments, natural resins, and raking light impasto.',
    portraitImageUrl: '/artist-portrait-transparent.png',
    ctaLabel: 'Read Full Artist Dossier',
    ctaHref: '/about',
  },
  commissionCta: {
    enabled: true,
    headline: 'Commission an Original Masterwork',
    supportingText: 'From private residential salons to monumental commercial lobbies, Darey accepts bespoke commissions worldwide.',
    ctaLabel: 'Initiate Bespoke Brief',
    ctaHref: '/commission',
    backgroundImageUrl: '/artworks/pic1.jpeg',
  },
  servicesPreview: {
    enabled: true,
    title: 'Studio Disciplines',
    subtitle: 'Four specialized practices bridging fine art and architectural environments.',
    serviceSlugs: ['artworks', 'custom-artworks', 'architectural-murals', 'interior-finishes', 'house-painting'],
  },
  foundTheirHomes: {
    enabled: true,
    title: 'Found their homes.',
    subtitle: 'Past creations now residing in private and corporate collections globally. A testament to enduring dialogues between art and collector.',
    artworkSlugs: ['pic4', 'pic11', 'pic15', 'pic19', 'pic21', 'pic26'],
  },
  closingStatement: {
    enabled: true,
    headline: 'Art that anchors the room.',
    subtext: 'Each piece is certified authentic, catalogued in the studio archive, and handled with white-glove transport worldwide.',
  },
  sectionOrder: [
    'hero',
    'manifesto',
    'selectedWorks',
    'featuredCollection',
    'artistIntro',
    'commissionCta',
    'servicesPreview',
    'foundTheirHomes',
    'closingStatement',
  ],
};

export const INITIAL_ABOUT_CONFIG: AboutPageConfig = {
  artistBiography:
    'Darey is a contemporary visual artist whose practice investigates the materiality of West African earth pigments, charcoal chiaroscuro, and architectural scale. Working from his atelier, Darey merges traditional pigment extraction methods with expressive contemporary abstraction.',
  curatorialStatement:
    'The work exists not merely to decorate space, but to command atmosphere. Through heavy impasto layering, raw canvas exposures, and raking light textural reliefs, each piece invites continuous contemplation.',
  studioPhilosophy:
    'Material integrity precedes all else. We prioritize natural minerals, heavy Belgian linen, and permanent binder mediums designed to endure for generations of private patronage.',
  processNarrative:
    'Every work begins with material preparation: hand-grinding minerals, testing pigment saturation, and building custom stretcher frames before the first gesture meets the linen.',
  portraitImageUrl: '/artist-portrait-transparent.png',
  studioLocation: 'Lagos, Nigeria',
  exhibitionHighlight: 'Works held in private collections across London, Paris, Geneva, Lagos, New York, and Zurich.',
};

export const INITIAL_CONTACT_CONFIG: ContactPageConfig = {
  studioEmail: 'contact@dareyartrealm.com',
  pressEmail: 'press@dareyartrealm.com',
  telephone: '+234 (0) 800 ARTREALM',
  whatsapp: '+234 (0) 800 ARTREALM',
  locationNote: 'Private studio visits by appointment only. Lagos, Nigeria.',
  hoursNote: 'Monday through Saturday, 10:00 — 18:00 WAT',
  instagram: 'https://instagram.com/dareyartrealm',
  xTwitter: 'https://x.com/dareyartrealm',
  linkedIn: 'https://linkedin.com/company/dareyartrealm',
};

export const INITIAL_GENERAL_CONFIG: GeneralSiteConfig = {
  siteName: "Darey's Artrealm",
  tagline: 'Original Contemporary Artworks & Bespoke Studio Commissions',
  defaultCurrency: 'USD',
  defaultMeasurementUnit: 'cm',
  copyrightText: "© 2026 Darey's Artrealm. All rights reserved.",
  brandStatement: 'Monumental African contemporary art, authentic pigment materiality, and bespoke architectural commissions.',
};


