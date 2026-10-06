# DAREY'S ARTREALM — PHASE 7B ARCHITECTURE & SPECIFICATION
## PRODUCTION ARTWORK DATA, COLLECTIONS, MEDIA & SUPABASE STORAGE

This document details the complete technical architecture, relational schema, security model, and storage policies implemented in **Phase 7B** for Darey's Artrealm.

---

## 1. Executive Summary & Objective

In Phase 7A, the foundational authentication, user profile triggers, and role-based access control (`collector` vs `admin`) were established. In Phase 7B, all legacy mock arrays and temporary in-memory artwork and collection abstractions were superseded by a production-ready PostgreSQL relational database layer and Supabase Storage bucket infrastructure.

Key accomplishments in Phase 7B:
1. **PostgreSQL Relational Schema**: Defined and migrated `collections`, `artworks`, `artwork_collections`, `media_assets`, and `artwork_images`.
2. **Concurrency-Safe Artwork Identifiers**: Implemented `artwork_code_seq` and `public.generate_artwork_code()` producing immutable institutional accession identifiers (`DAR-YYYY-XXX`).
3. **Dual-Tier Storage Strategy**: Provisioned `artworks-public` (optimized web assets, 15MB limit) and `artworks-private` (archival master TIFFs/RAWs with restricted RLS).
4. **Row Level Security (RLS) & Storage Security**: Non-admin visitors are strictly confined to reading `published` artworks, collections, and public assets; admin accounts have complete CRUD capabilities.
5. **Universal Service Layer**: Created `artworkService.ts`, `collectionService.ts`, and `mediaService.ts` with real Supabase queries and seamless, build-safe local fallbacks.
6. **Studio Administrative Integration**: Upgraded Studio Artwork Editor, Collection Editor, and Media Library with real direct-to-storage uploads, progress tracking, and publishing guards.
7. **Public Gallery Hardening**: Connected `/artworks`, `/artworks/[slug]`, `/collections`, `/collections/[slug]`, Search Overlay, and the homepage exhibition rooms to live data.

---

## 2. Database Schema Architecture

The database migration is registered in `supabase/migrations/20261006000002_create_artworks_collections_and_media.sql`.

### 2.1 Table: `public.collections`
Curated thematic exhibition rooms grouping artwork portfolios.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique immutable identifier |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | SEO-friendly URL slug (e.g. `earth-and-texture`) |
| `title` | `TEXT` | `NOT NULL` | Exhibition title |
| `subtitle` | `TEXT` | `NULL` | Secondary curatorial classification |
| `statement` | `TEXT` | `NOT NULL` | Curatorial room statement |
| `description` | `TEXT` | `NOT NULL` | Long-form background / narrative |
| `year` | `INTEGER` | `NULL` | Collection debut year |
| `cover_image_url` | `TEXT` | `NULL` | Primary visual banner URL |
| `cover_image_alt` | `TEXT` | `NULL` | Accessibility alt text |
| `accent_color` | `TEXT` | `NULL` | Optional hexadecimal brand accent |
| `featured` | `BOOLEAN` | `DEFAULT false NOT NULL` | Homepage featured exhibition flag |
| `publication_status` | `TEXT` | `DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived'))` | Visibility state |
| `sort_order` | `INTEGER` | `DEFAULT 0 NOT NULL` | Curatorial display priority |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now() NOT NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now() NOT NULL` | Modification timestamp |

### 2.2 Table: `public.artworks`
Original, 1-of-1 physical artworks created by Darey.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique primary key |
| `artwork_code` | `TEXT` | `UNIQUE NOT NULL DEFAULT public.generate_artwork_code()` | Institutional catalog identifier (`DAR-YYYY-XXX`) |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | Unique URL slug |
| `title` | `TEXT` | `NOT NULL` | Artwork title |
| `year` | `INTEGER` | `NOT NULL` | Year of creation |
| `medium` | `TEXT` | `NOT NULL` | Physical materials (oil, impasto, linen, gold leaf) |
| `description` | `TEXT` | `NOT NULL` | Curatorial description |
| `story` | `TEXT` | `NULL` | Artist personal narrative / provenance background |
| `artist_note` | `TEXT` | `NULL` | Personal reflections from Darey |
| `availability_note`| `TEXT` | `NULL` | Notes on framing, exhibition loan, or delivery |
| `provenance` | `TEXT` | `NULL` | Historical record of exhibition & custody |
| `width` | `NUMERIC(8,2)` | `NOT NULL` | Width in specified units |
| `height` | `NUMERIC(8,2)` | `NOT NULL` | Height in specified units |
| `depth` | `NUMERIC(8,2)` | `NULL` | Stretcher bar depth |
| `dimension_unit` | `TEXT` | `DEFAULT 'cm' CHECK (dimension_unit IN ('cm', 'in'))` | Dimensional unit of measure |
| `orientation` | `TEXT` | `CHECK (orientation IN ('portrait', 'landscape', 'square', 'panoramic'))` | Spatial composition |
| `price` | `NUMERIC(12,2)` | `NULL` | Acquisition price |
| `currency` | `TEXT` | `DEFAULT 'USD' NOT NULL` | Settlement currency code |
| `is_price_on_request`| `BOOLEAN` | `DEFAULT false NOT NULL` | Hide numeric figure for high-value inquiries |
| `availability_status`| `TEXT` | `DEFAULT 'available' CHECK (availability_status IN ('available', 'reserved', 'sold'))` | Commercial availability state |
| `publication_status` | `TEXT` | `DEFAULT 'draft' CHECK (publication_status IN ('draft', 'published', 'archived'))` | Public gallery exhibition state |
| `featured` | `BOOLEAN` | `DEFAULT false NOT NULL` | Promoted in Selected Works / Hero candidate |
| `accent_color` | `TEXT` | `NULL` | Dominant palette hex code |
| `tags` | `TEXT[]` | `DEFAULT '{}' NOT NULL` | Search and curation tags |
| `sort_order` | `INTEGER` | `DEFAULT 0 NOT NULL` | Manual catalogue arrangement order |
| `seo_title` | `TEXT` | `NULL` | Custom meta title tag |
| `seo_description` | `TEXT` | `NULL` | Custom meta description tag |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now() NOT NULL` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now() NOT NULL` | Record modification timestamp |

### 2.3 Table: `public.artwork_collections`
Curatorial many-to-many junction table linking artworks to curated collections.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Link identifier |
| `artwork_id` | `UUID` | `REFERENCES public.artworks(id) ON DELETE CASCADE` | Artwork foreign key |
| `collection_id`| `UUID` | `REFERENCES public.collections(id) ON DELETE CASCADE` | Collection foreign key |
| `sort_order` | `INTEGER` | `DEFAULT 0 NOT NULL` | Position within collection room |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now() NOT NULL` | Association timestamp |
| **Constraint** | `UNIQUE(artwork_id, collection_id)` | Enforces single membership per collection |

### 2.4 Table: `public.media_assets`
Comprehensive media asset metadata for files residing in Supabase Storage.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Asset identifier |
| `bucket_name` | `TEXT` | `NOT NULL` | Bucket identifier (`artworks-public` or `artworks-private`) |
| `file_path` | `TEXT` | `NOT NULL` | Key / relative storage path |
| `public_url` | `TEXT` | `NULL` | CDN URL for public bucket files |
| `filename` | `TEXT` | `NOT NULL` | Original client filename |
| `file_size_bytes`| `BIGINT` | `NULL` | File size in bytes |
| `mime_type` | `TEXT` | `NOT NULL` | MIME classification (`image/jpeg`, `image/webp`, etc.) |
| `width` | `INTEGER` | `NULL` | Intrinsic pixel width |
| `height` | `INTEGER` | `NULL` | Intrinsic pixel height |
| `category` | `TEXT` | `DEFAULT 'artwork' CHECK (category IN ('artwork', 'collection', 'artist', 'studio', 'document'))` | Asset classification |
| `alt_text` | `TEXT` | `NULL` | Default descriptive text |
| `caption` | `TEXT` | `NULL` | Curatorial note or credit |
| `uploaded_by` | `UUID` | `REFERENCES auth.users(id) ON DELETE SET NULL` | Administrator uploader UUID |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now() NOT NULL` | Upload timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now() NOT NULL` | Modification timestamp |

### 2.5 Table: `public.artwork_images`
Ordered multi-angle photography of physical canvases.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Image record ID |
| `artwork_id` | `UUID` | `REFERENCES public.artworks(id) ON DELETE CASCADE` | Parent artwork foreign key |
| `media_asset_id`| `UUID` | `REFERENCES public.media_assets(id) ON DELETE SET NULL` | Associated media metadata |
| `url` | `TEXT` | `NOT NULL` | Direct CDN image URL |
| `alt_text` | `TEXT` | `NULL` | Specific accessibility text |
| `caption` | `TEXT` | `NULL` | Detailed caption (e.g. "Macro detail of raw mineral impasto") |
| `image_role` | `TEXT` | `DEFAULT 'primary' CHECK (image_role IN ('primary', 'detail', 'texture', 'angle', 'framed', 'in_situ', 'process'))` | Image perspective classification |
| `is_cover` | `BOOLEAN` | `DEFAULT false NOT NULL` | Designates primary catalogue thumbnail |
| `sort_order` | `INTEGER` | `DEFAULT 0 NOT NULL` | Carousel sequence |
| `width` | `INTEGER` | `DEFAULT 1200 NOT NULL` | Pixel width |
| `height` | `INTEGER` | `DEFAULT 900 NOT NULL` | Pixel height |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now() NOT NULL` | Record creation timestamp |

---

## 3. Storage Bucket Strategy & Policies

Two isolated storage buckets are registered in Supabase:

### 3.1 `artworks-public`
- **Purpose**: Public artwork photography, collection banners, editorial close-ups, and studio portraits.
- **Access Model**: Public read access enabled (`public: true`).
- **File Constraints**: Max 15 MB per file.
- **Allowed MIME Types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/avif`.
- **Security Policies**:
  - `Public read access`: Anyone (anonymous or authenticated) can view and download objects.
  - `Admin upload access`: Only authenticated administrators (`public.is_admin() = true`) can insert files.
  - `Admin update access`: Only administrators can replace or update files.
  - `Admin delete access`: Only administrators can delete files.

### 3.2 `artworks-private`
- **Purpose**: High-resolution print-grade master files (TIFF, RAW, PSD), proof of provenance documentation, and uncompressed archival assets.
- **Access Model**: Private read access (`public: false`).
- **File Constraints**: Max 100 MB per file.
- **Security Policies**:
  - `Admin read access`: Only administrators (`public.is_admin() = true`) can read or generate pre-signed URLs.
  - `Admin write access`: Only administrators can insert, update, or delete private files.

---

## 4. Concurrency-Safe Artwork Code Generation

Physical fine art pieces require non-repeating, sequential accession numbering for catalogues, certificates, and provenance records.

- **Sequence**: `public.artwork_code_seq`
- **Stored Procedure**:
```sql
CREATE OR REPLACE FUNCTION public.generate_artwork_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year TEXT;
  v_seq INTEGER;
  v_code TEXT;
BEGIN
  v_year := to_char(CURRENT_DATE, 'YYYY');
  v_seq := nextval('public.artwork_code_seq');
  v_code := 'DAR-' || v_year || '-' || lpad(v_seq::TEXT, 3, '0');
  RETURN v_code;
END;
$$;
```
This guarantees race-condition immunity when multiple studio operators register pieces concurrently.

---

## 5. Security & Row Level Security (RLS) Matrix

RLS is enabled on all 5 tables. The matrix enforces the following:

| Table | Anonymous / Collector Read | Collector Write | Admin Full Access |
| :--- | :--- | :--- | :--- |
| `collections` | `publication_status = 'published'` | Denied | Allowed (`public.is_admin()`) |
| `artworks` | `publication_status = 'published'` | Denied | Allowed (`public.is_admin()`) |
| `artwork_collections` | Through parent published artwork & collection | Denied | Allowed (`public.is_admin()`) |
| `media_assets` | `bucket_name = 'artworks-public'` | Denied | Allowed (`public.is_admin()`) |
| `artwork_images` | Through parent published artwork | Denied | Allowed (`public.is_admin()`) |

### Admin Draft Preview Workflow
On public routes like `/artworks/[slug]`, public visitors receive a 404 response if the artwork is not published. If an authenticated administrator views `/artworks/[slug]?preview=true`, the client component detects `isAdmin` from `AuthContext` and allows them to preview unpublished drafts with an ambient admin warning badge.

---

## 6. Service Layer Implementation

Three production services mediate all database and storage communication:

1. **`src/services/artworkService.ts`**:
   - `getAll()`: Relational query selecting `artworks` joined with `artwork_images` and `artwork_collections(collection)`.
   - `getFeatured()` / `getSelected()` / `getCollected()`: Status- and flag-filtered curated sets.
   - `getHeroArtwork()`: 3-tier cascade fallback (`echoes-of-home` -> `featured = true` -> first published artwork).
   - `getBySlug(slug)` / `getById(id)`: Slugs and ID lookups.
   - `filter(filters, options)`: Multi-facet query handling medium, orientation, dimensions, price bounds, search query, and publication status.
   - `create(data)` / `update(id, data)` / `archive(id)` / `delete(id)` / `duplicate(id)`: Concurrency-safe CRUD mutations.

2. **`src/services/collectionService.ts`**:
   - `getAll()`: Reads collections with dynamic artwork counts from `artwork_collections`.
   - `getFeaturedCollection()`: Priority resolution for primary homepage exhibition room.
   - `getBySlug(slug)` / `getArtworks(slug)`: Room and member artworks loader.
   - `search(query)`: Multi-field text search over titles, subtitles, statements, and descriptions.
   - `create(data)` / `update(id, data)` / `delete(id)`: Collection CRUD.

3. **`src/services/mediaService.ts`**:
   - `uploadFile(file, options)`: Uploads to Supabase Storage, calculates metadata, records row in `public.media_assets`, and returns public URL.
   - `getAll(category)`: Queries media library with category filter.
   - `delete(id)`: Removes file from Supabase Storage and deletes database metadata row.

---

## 7. Studio Management Integration

- **`src/components/studio/ArtworkEditor.tsx`**:
  - Direct file uploads via `<input type="file">` and `mediaService.uploadFile()`.
  - Live upload progress bar and status feedback.
  - Multi-perspective image tagging (`primary`, `detail`, `texture`, `angle`, `framed`, etc.).
  - Publish readiness validation: blocks publishing if medium, physical dimensions, price, or photography are absent.
- **`src/components/studio/CollectionEditor.tsx`**:
  - Direct cover photography upload via `mediaService.uploadFile()`.
  - Multi-artwork selector linking works through `artwork_collections`.
- **`src/app/studio/media/page.tsx`**:
  - Replaced simulated file dialog with real file picker.
  - Uploads directly to `artworks-public` with instant library refresh.

---

## 8. Graceful Fallbacks & Offline Capability

Every service tests `isSupabaseConfigured()`. When environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are present, production queries run. When unconfigured during initial clones, builds, or CI test runners, services gracefully fall back to local in-memory storage without throwing unhandled exceptions.

