-- ==============================================================================
-- DAREY'S ARTREALM — PHASE 7C: CMS, SITE SETTINGS, EDITORIAL & SERVICES SCHEMA
-- Migration: 20261007000001_create_cms_and_site_content.sql
-- Description: Establishes production database entities for site settings,
--              homepage editorial configuration, service catalog, Piece of the Month,
--              and admin-controlled content management with strict RLS.
-- ==============================================================================

-- 1. Extend Artworks Table for Editorial Piece of the Month
alter table public.artworks
  add column if not exists is_piece_of_the_month boolean not null default false;

create index if not exists idx_artworks_piece_of_month 
  on public.artworks(is_piece_of_the_month) 
  where is_piece_of_the_month = true;

-- Function & Trigger: Enforce only one Piece of the Month at a time
create or replace function public.handle_single_piece_of_the_month()
returns trigger
language plpgsql
as $$
begin
  if new.is_piece_of_the_month = true then
    update public.artworks
    set is_piece_of_the_month = false
    where id <> new.id and is_piece_of_the_month = true;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_single_piece_of_the_month on public.artworks;
create trigger trg_single_piece_of_the_month
  before insert or update on public.artworks
  for each row
  when (new.is_piece_of_the_month = true)
  execute function public.handle_single_piece_of_the_month();


-- 2. Create Site Settings Table (Structured JSON configuration store)
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();


-- 3. Create Services Table
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null default '',
  description text not null default '',
  cover_image_url text,
  cover_image_alt text,
  pricing_structure text,
  typical_timeline text,
  features text[] not null default '{}',
  process jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  publication_status text not null default 'published' check (publication_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_services_slug on public.services(slug);
create index if not exists idx_services_pub_status on public.services(publication_status);
create index if not exists idx_services_sort_order on public.services(sort_order);

create trigger set_services_updated_at
  before update on public.services
  for each row execute function public.handle_updated_at();


-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.site_settings enable row level security;
alter table public.services enable row level security;

-- Site Settings Policies
drop policy if exists "Public can view site settings" on public.site_settings;
drop policy if exists "Admins can manage site settings" on public.site_settings;

create policy "Public can view site settings"
  on public.site_settings
  for select
  using (true);

create policy "Admins can manage site settings"
  on public.site_settings
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- Services Policies
drop policy if exists "Public can view published services" on public.services;
drop policy if exists "Admins can view all services" on public.services;
drop policy if exists "Admins can insert services" on public.services;
drop policy if exists "Admins can update services" on public.services;
drop policy if exists "Admins can delete services" on public.services;

create policy "Public can view published services"
  on public.services
  for select
  using (publication_status = 'published');

create policy "Admins can view all services"
  on public.services
  for select
  using (public.is_admin());

create policy "Admins can insert services"
  on public.services
  for insert
  with check (public.is_admin());

create policy "Admins can update services"
  on public.services
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete services"
  on public.services
  for delete
  using (public.is_admin());


-- ==============================================================================
-- 5. INITIAL APPROVED CONTENT SEEDING (Idempotent)
-- ==============================================================================

-- Seed Site Settings: Homepage Editorial Config
insert into public.site_settings (key, value, description)
values
  ('homepage', '{
    "hero": {
      "imageUrl": "/artworks/hero.jpeg",
      "imageAlt": "Darey with Masterwork in Studio",
      "focalPosition": "center 30%",
      "headline": "Welcome to Darey''s Artrealm.",
      "headlineItalic": "Original masterworks, tactile earth pigments, and bespoke architectural commissions.",
      "subtitle": "Discover curated original works and bespoke atelier creations.",
      "primaryCtaLabel": "Explore Catalogue",
      "primaryCtaHref": "/artworks",
      "secondaryCtaLabel": "Bespoke Commissions",
      "secondaryCtaHref": "/commission",
      "frostedBlur": "medium",
      "frostedBlurPx": 4.5,
      "overlayIntensity": "balanced",
      "enabled": true
    },
    "manifesto": {
      "enabled": true,
      "quote": "Every canvas is a tactile conversation between raw earth, ancestral memory, and contemporary African spirit.",
      "quoteItalic": "We do not simply apply paint to canvas; we sculpt resonance out of silence and organic pigments.",
      "narrative": "Darey''s atelier stands at the intersection of classical craftsmanship and modern materiality. Rooted in Lagos and radiating globally, each artwork embodies a distinct spiritual geography.",
      "artworkImageUrl": "/artworks/pic5.jpeg",
      "artworkImageAlt": "Tactile materiality study by Darey"
    },
    "selectedWorks": {
      "enabled": true,
      "title": "Selected Works",
      "subtitle": "A rotating selection of original compositions and master studies.",
      "artworkSlugs": ["pic1", "pic2", "pic3", "pic5", "pic6", "pic8"]
    },
    "featuredCollection": {
      "enabled": true,
      "collectionSlug": "human-stories"
    },
    "artistIntro": {
      "enabled": true,
      "headline": "A Dialogue in Texture & Memory",
      "intro": "In an era of fleeting digital images, Darey creates physical anchors: monumental canvases that demand physical presence, layered with indigenous pigments, natural resins, and raking light impasto.",
      "portraitImageUrl": "/artist-portrait-transparent.png",
      "ctaLabel": "Read Full Artist Dossier",
      "ctaHref": "/about"
    },
    "commissionCta": {
      "enabled": true,
      "headline": "Commission an Original Masterwork",
      "supportingText": "From private residential salons to monumental commercial lobbies, Darey accepts bespoke commissions worldwide.",
      "ctaLabel": "Initiate Bespoke Brief",
      "ctaHref": "/commission",
      "backgroundImageUrl": "/artworks/pic1.jpeg"
    },
    "servicesPreview": {
      "enabled": true,
      "title": "Studio Disciplines",
      "subtitle": "Four specialized practices bridging fine art and architectural environments.",
      "serviceSlugs": ["artworks", "custom-artworks", "architectural-murals", "interior-finishes", "house-painting"]
    },
    "foundTheirHomes": {
      "enabled": true,
      "title": "Found their homes.",
      "subtitle": "Past creations now residing in private and corporate collections globally.",
      "artworkSlugs": ["pic4", "pic11", "pic15", "pic19", "pic21", "pic26"]
    },
    "closingStatement": {
      "enabled": true,
      "headline": "Art that anchors the room.",
      "subtext": "Each piece is certified authentic, catalogued in the studio archive, and handled with white-glove transport worldwide."
    },
    "sectionOrder": [
      "hero",
      "manifesto",
      "selectedWorks",
      "featuredCollection",
      "artistIntro",
      "commissionCta",
      "servicesPreview",
      "foundTheirHomes",
      "closingStatement"
    ]
  }'::jsonb, 'Homepage section and editorial layout configuration'),

  ('about', '{
    "artistBiography": "Darey is a contemporary visual artist whose practice investigates the materiality of West African earth pigments, charcoal chiaroscuro, and architectural scale. Working from his atelier, Darey merges traditional pigment extraction methods with expressive contemporary abstraction.",
    "curatorialStatement": "The work exists not merely to decorate space, but to command atmosphere. Through heavy impasto layering, raw canvas exposures, and raking light textural reliefs, each piece invites continuous contemplation.",
    "studioPhilosophy": "Material integrity precedes all else. We prioritize natural minerals, heavy Belgian linen, and permanent binder mediums designed to endure for generations of private patronage.",
    "processNarrative": "Every work begins with material preparation: hand-grinding minerals, testing pigment saturation, and building custom stretcher frames before the first gesture meets the linen.",
    "portraitImageUrl": "/artist-portrait-transparent.png",
    "studioLocation": "Lagos, Nigeria",
    "exhibitionHighlight": "Works held in private collections across London, Paris, Geneva, Lagos, New York, and Zurich."
  }'::jsonb, 'About page artist dossier and philosophy'),

  ('contact', '{
    "studioEmail": "contact@dareyartrealm.com",
    "pressEmail": "press@dareyartrealm.com",
    "telephone": "+234 (0) 800 ARTREALM",
    "whatsapp": "+234 (0) 800 ARTREALM",
    "locationNote": "Private studio visits by appointment only. Lagos, Nigeria.",
    "hoursNote": "Monday through Saturday, 10:00 — 18:00 WAT",
    "instagram": "https://instagram.com/dareyartrealm",
    "xTwitter": "https://x.com/dareyartrealm",
    "linkedIn": "https://linkedin.com/company/dareyartrealm"
  }'::jsonb, 'Studio contact logistics, hours, and social connections'),

  ('general', '{
    "siteName": "Darey''s Artrealm",
    "tagline": "Original Contemporary Artworks & Bespoke Studio Commissions",
    "defaultCurrency": "USD",
    "defaultMeasurementUnit": "cm",
    "copyrightText": "© 2026 Darey''s Artrealm. All rights reserved.",
    "brandStatement": "Monumental African contemporary art, authentic pigment materiality, and bespoke architectural commissions."
  }'::jsonb, 'General website settings and defaults')
on conflict (key) do nothing;


-- Seed Services (5 Canonical disciplines)
insert into public.services (slug, title, short_description, description, cover_image_url, cover_image_alt, pricing_structure, typical_timeline, features, sort_order, publication_status)
values
  (
    'artworks',
    'Original Artworks',
    'Original paintings on canvas and linen, created in the studio with oil, acrylic, and tactile earth pigments.',
    'Original one-of-a-kind artworks created in the studio. Each piece is crafted using premium pigments, Belgian linen, and archival framing, complete with a signed Certificate of Authenticity.',
    '/artworks/pic5.jpeg',
    'Original Artwork by Darey',
    'Fixed catalog pricing / Price on Request',
    'Immediate dispatch (3–7 days packaging)',
    array['Museum-grade Belgian linen', 'Hand-ground earth pigments', 'Certificate of Authenticity', 'White-glove worldwide shipping'],
    1,
    'published'
  ),
  (
    'custom-artworks',
    'Custom Artworks',
    'Bespoke commissioned paintings created to your preferred scale, palette, and spatial requirements.',
    'Collaborate directly with Darey to create a custom artwork designed specifically for your interior environment, architectural proportions, and aesthetic vision.',
    '/artworks/hero.jpeg',
    'Custom Artworks in Studio Session',
    '50% deposit upon concept approval; balance upon completion',
    '4–8 weeks depending on dimensions',
    array['Personal curatorial consultation', 'Material palette sample approvals', 'Progress photography updates', 'Custom dimensions up to 300cm'],
    2,
    'published'
  ),
  (
    'architectural-murals',
    'Architectural Murals',
    'Large-scale indoor and outdoor murals for residences, hospitality venues, and corporate spaces.',
    'Monumental wall installations that transform architectural surfaces into immersive artistic statements. Designed to harmonize with ambient light, building materials, and acoustic properties.',
    '/artworks/architectural-murals.jpg',
    'Architectural Mural Installation',
    'Per square meter + site logistics estimate',
    '2–4 weeks on-site execution',
    array['Site survey and 3D architectural mockups', 'Weather-resistant exterior formulations', 'Coordination with interior architects', 'Protective anti-UV matte sealant'],
    3,
    'published'
  ),
  (
    'interior-finishes',
    'Interior Art & Finishes',
    'Artistic wall finishes including metallic leaf, textured plaster, micro-cement, and custom patinas.',
    'Elevate interior surfaces with artisanal tactile finishes. From hand-burnished Venetian plaster with crushed earth pigments to subtle 24k gold leaf accents.',
    '/artworks/interior-finishes.jpg',
    'Artisanal Interior Textural Finishes',
    'Scope quotation based on wall area & material tiers',
    '1–3 weeks per zone',
    array['Natural mineral plasters', 'Custom color grading to match furniture', 'Seamless application', 'Durable washable sealants'],
    4,
    'published'
  ),
  (
    'house-painting',
    'House Painting & Finishing',
    'Premium residential and commercial painting with exceptional surface preparation and flawless execution.',
    'High-end decorative and architectural painting services executed with museum-grade precision, pristine edge taping, and durable low-VOC coatings.',
    '/artworks/house-painting.jpg',
    'Professional Architectural Finishing',
    'Comprehensive project estimate following physical site survey',
    '3–10 business days',
    array['Full surface patching and priming', 'Dustless orbital sanding', 'Zero-VOC eco-conscious paints', '2-year workmanship warranty'],
    5,
    'published'
  )
on conflict (slug) do nothing;

