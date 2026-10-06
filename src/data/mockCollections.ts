import { Collection } from '@/types/collection';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'col-001',
    slug: 'human-stories',
    title: 'Human Stories',
    subtitle: 'Collection 01',
    year: 2026,
    statement: 'A study of expression, memory and the people we become.',
    description:
      'Human Stories investigates the emotional architecture of migration, quiet perseverance, and African heritage through monumental portraits and heavy textural layers.',
    coverImage: {
      url: '/artworks/pic1.jpeg',
      alt: 'Human Stories Collection by Darey',
      width: 1080,
      height: 770,
    },
    accentColor: '#1E40AF', // Cobalt
    artworkCount: 8,
    featured: true,
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
  },
];
