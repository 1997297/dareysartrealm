-- ==============================================================================
-- DAREY'S ARTREALM — PHASE 7B: ARTWORKS, COLLECTIONS, MEDIA & STORAGE SCHEMA
-- Migration: 20261006000002_create_artworks_collections_and_media.sql
-- Description: Establishes production database entities for collections, artworks,
--              artwork images, media metadata, Supabase Storage buckets & policies,
--              and concurrency-safe public artwork code generation.
-- ==============================================================================

-- 1. Create Collections Table
create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  statement text not null default '',
  description text not null default '',
  year integer,
  cover_image_url text,
  cover_image_alt text,
  accent_color text,
  featured boolean not null default false,
  publication_status text not null default 'draft' check (publication_status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  archived_at timestamptz
);

-- Indexes for collections
create index if not exists idx_collections_slug on public.collections(slug);
create index if not exists idx_collections_pub_status on public.collections(publication_status);
create index if not exists idx_collections_featured on public.collections(featured);
create index if not exists idx_collections_sort_order on public.collections(sort_order);

-- Collections updated_at trigger
create trigger set_collections_updated_at
  before update on public.collections
  for each row execute function public.handle_updated_at();


-- 2. Concurrency-Safe Public Artwork Code Sequence & Generator
create sequence if not exists public.artwork_code_seq start with 1 increment by 1;

create or replace function public.generate_artwork_code()
returns text
language plpgsql
as $$
declare
  v_year text := to_char(now(), 'YYYY');
  v_next_val bigint;
begin
  v_next_val := nextval('public.artwork_code_seq');
  return 'DAR-' || v_year || '-' || lpad(v_next_val::text, 3, '0');
end;
$$;


-- 3. Create Artworks Table
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  artwork_code text unique not null default public.generate_artwork_code(),
  slug text unique not null,
  title text not null,
  year integer not null,
  medium text not null,
  description text not null default '',
  story text,
  artist_note text,
  availability_note text,
  provenance text,
  width numeric not null check (width > 0),
  height numeric not null check (height > 0),
  depth numeric check (depth is null or depth >= 0),
  dimension_unit text not null default 'cm',
  orientation text not null check (orientation in ('portrait', 'landscape', 'square', 'panoramic')),
  price numeric check (price is null or price >= 0),
  currency text not null default 'USD',
  is_price_on_request boolean not null default false,
  availability_status text not null default 'available' check (availability_status in ('available', 'reserved', 'sold', 'commissioned', 'draft')),
  publication_status text not null default 'draft' check (publication_status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  accent_color text,
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  archived_at timestamptz
);

-- Indexes for artworks
create index if not exists idx_artworks_slug on public.artworks(slug);
create index if not exists idx_artworks_code on public.artworks(artwork_code);
create index if not exists idx_artworks_pub_status on public.artworks(publication_status);
create index if not exists idx_artworks_avail_status on public.artworks(availability_status);
create index if not exists idx_artworks_featured on public.artworks(featured);
create index if not exists idx_artworks_year on public.artworks(year desc);
create index if not exists idx_artworks_price on public.artworks(price);
create index if not exists idx_artworks_created_at on public.artworks(created_at desc);

-- Artworks updated_at trigger
create trigger set_artworks_updated_at
  before update on public.artworks
  for each row execute function public.handle_updated_at();


-- 4. Artwork ↔ Collection Junction Table
create table if not exists public.artwork_collections (
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (artwork_id, collection_id)
);

create index if not exists idx_artwork_collections_art on public.artwork_collections(artwork_id);
create index if not exists idx_artwork_collections_col on public.artwork_collections(collection_id);


-- 5. Media Assets Metadata Table
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_bucket text not null check (storage_bucket in ('artworks-public', 'artworks-private')),
  storage_path text not null,
  public_url text,
  title text not null,
  filename text not null,
  mime_type text not null,
  file_size bigint not null default 0,
  width integer,
  height integer,
  category text not null default 'artwork' check (category in ('artwork', 'studio', 'portrait', 'service', 'commission', 'website')),
  alt_text text not null default '',
  caption text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_media_assets_bucket_path on public.media_assets(storage_bucket, storage_path);
create index if not exists idx_media_assets_category on public.media_assets(category);
create index if not exists idx_media_assets_created_at on public.media_assets(created_at desc);

create trigger set_media_assets_updated_at
  before update on public.media_assets
  for each row execute function public.handle_updated_at();


-- 6. Artwork Images Table (Multi-image views per canvas)
create table if not exists public.artwork_images (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  media_asset_id uuid references public.media_assets(id) on delete set null,
  image_url text not null,
  image_role text not null default 'primary' check (image_role in ('primary', 'detail', 'texture', 'angle', 'framed', 'interior', 'process', 'other')),
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  alt_text text not null default '',
  caption text,
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_artwork_images_artwork_id on public.artwork_images(artwork_id);
create index if not exists idx_artwork_images_sort_order on public.artwork_images(artwork_id, sort_order);
create index if not exists idx_artwork_images_is_cover on public.artwork_images(artwork_id, is_cover);

create trigger set_artwork_images_updated_at
  before update on public.artwork_images
  for each row execute function public.handle_updated_at();


-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKETS SETUP
-- ==============================================================================
-- Ensure the storage buckets exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('artworks-public', 'artworks-public', true, 15728640, array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('artworks-private', 'artworks-private', false, 104857600, null)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;


-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all Phase 7B tables
alter table public.collections enable row level security;
alter table public.artworks enable row level security;
alter table public.artwork_collections enable row level security;
alter table public.media_assets enable row level security;
alter table public.artwork_images enable row level security;

-- ------------------------------------------------------------------------------
-- A. Collections Policies
-- ------------------------------------------------------------------------------
drop policy if exists "Public can view published collections" on public.collections;
drop policy if exists "Admins can view all collections" on public.collections;
drop policy if exists "Admins can insert collections" on public.collections;
drop policy if exists "Admins can update collections" on public.collections;
drop policy if exists "Admins can delete collections" on public.collections;

-- Public can view published collections
create policy "Public can view published collections"
  on public.collections
  for select
  using (publication_status = 'published');

-- Admins can view all collections (drafts, published, archived)
create policy "Admins can view all collections"
  on public.collections
  for select
  using (public.is_admin());

-- Admins can manage collections
create policy "Admins can insert collections"
  on public.collections
  for insert
  with check (public.is_admin());

create policy "Admins can update collections"
  on public.collections
  for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete collections"
  on public.collections
  for delete
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- B. Artworks Policies
-- ------------------------------------------------------------------------------
drop policy if exists "Public can view published artworks" on public.artworks;
drop policy if exists "Admins can view all artworks" on public.artworks;
drop policy if exists "Admins can insert artworks" on public.artworks;
drop policy if exists "Admins can update artworks" on public.artworks;
drop policy if exists "Admins can delete artworks" on public.artworks;

-- Public/Collectors can only view published artworks
create policy "Public can view published artworks"
  on public.artworks
  for select
  using (publication_status = 'published');

-- Admins can view all artworks
create policy "Admins can view all artworks"
  on public.artworks
  for select
  using (public.is_admin());

-- Admins can insert artworks
create policy "Admins can insert artworks"
  on public.artworks
  for insert
  with check (public.is_admin());

-- Admins can update artworks
create policy "Admins can update artworks"
  on public.artworks
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can delete artworks
create policy "Admins can delete artworks"
  on public.artworks
  for delete
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- C. Artwork Collections Junction Policies
-- ------------------------------------------------------------------------------
drop policy if exists "Public can view published artwork collections" on public.artwork_collections;
drop policy if exists "Admins can manage artwork collections" on public.artwork_collections;

create policy "Public can view published artwork collections"
  on public.artwork_collections
  for select
  using (
    exists (
      select 1 from public.artworks a
      where a.id = artwork_id and a.publication_status = 'published'
    )
  );

create policy "Admins can manage artwork collections"
  on public.artwork_collections
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------------------------
-- D. Media Assets Policies
-- ------------------------------------------------------------------------------
drop policy if exists "Public can view public media assets" on public.media_assets;
drop policy if exists "Admins can manage all media assets" on public.media_assets;

create policy "Public can view public media assets"
  on public.media_assets
  for select
  using (storage_bucket = 'artworks-public');

create policy "Admins can manage all media assets"
  on public.media_assets
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------------------------
-- E. Artwork Images Policies
-- ------------------------------------------------------------------------------
drop policy if exists "Public can view published artwork images" on public.artwork_images;
drop policy if exists "Admins can manage all artwork images" on public.artwork_images;

create policy "Public can view published artwork images"
  on public.artwork_images
  for select
  using (
    exists (
      select 1 from public.artworks a
      where a.id = artwork_id and a.publication_status = 'published'
    )
  );

create policy "Admins can manage all artwork images"
  on public.artwork_images
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ==============================================================================
-- 9. SUPABASE STORAGE RLS POLICIES (storage.objects)
-- ==============================================================================
-- Public display bucket: Public read allowed for everyone
drop policy if exists "Public display images are readable by all" on storage.objects;
create policy "Public display images are readable by all"
  on storage.objects
  for select
  using (bucket_id = 'artworks-public');

-- Private bucket: Readable ONLY by verified Admins
drop policy if exists "Private masters readable only by Admins" on storage.objects;
create policy "Private masters readable only by Admins"
  on storage.objects
  for select
  using (bucket_id = 'artworks-private' and public.is_admin());

-- Uploads: Strictly Admins only
drop policy if exists "Admins can upload to artworks buckets" on storage.objects;
create policy "Admins can upload to artworks buckets"
  on storage.objects
  for insert
  with check (
    bucket_id in ('artworks-public', 'artworks-private')
    and public.is_admin()
  );

-- Updates: Strictly Admins only
drop policy if exists "Admins can update artworks objects" on storage.objects;
create policy "Admins can update artworks objects"
  on storage.objects
  for update
  using (
    bucket_id in ('artworks-public', 'artworks-private')
    and public.is_admin()
  )
  with check (
    bucket_id in ('artworks-public', 'artworks-private')
    and public.is_admin()
  );

-- Deletions: Strictly Admins only
drop policy if exists "Admins can delete artworks objects" on storage.objects;
create policy "Admins can delete artworks objects"
  on storage.objects
  for delete
  using (
    bucket_id in ('artworks-public', 'artworks-private')
    and public.is_admin()
  );

