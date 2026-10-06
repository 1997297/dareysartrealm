import { NavItem, SocialLink } from '@/types/navigation';

export const SITE_NAME = "Darey's Artrealm";
export const ARTIST_NAME = 'Darey';
export const SITE_TAGLINE = 'Original artworks, commissioned pieces and creative expressions.';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Artworks', href: '/artworks' },
  { label: 'Collections', href: '/collections' },
  { label: 'Commissions', href: '/commission' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'Instagram', handle: '@dareysartrealm', href: 'https://instagram.com' },
  { platform: 'Twitter / X', handle: '@darey_art', href: 'https://x.com' },
  { platform: 'LinkedIn', handle: 'Darey Artrealm', href: 'https://linkedin.com' },
];

export const CONTACT_INFO = {
  email: 'studio@dareysartrealm.com',
  location: 'Studio visits & worldwide commissions',
  hours: 'Studio visits by appointment',
};
