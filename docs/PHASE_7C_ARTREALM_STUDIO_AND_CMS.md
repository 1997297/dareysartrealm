# PHASE 7C — ARTREALM STUDIO, CMS & WEBSITE CONTENT CONTROL

**Status**: IMPLEMENTED & VERIFIED  
**Date**: October 2026  
**Scope**: Studio Content Management System, Supabase Persistence, Dynamic Site Control

---

## 1. Executive Summary & Core Principle

Phase 7C establishes **Artrealm Studio (`/studio`)** as the single source of truth and administrative control for Darey's Artrealm. The operational relationship is established as:

```
┌─────────────────────────────────────────────────────────────┐
│                    ARTREALM STUDIO (/studio)                │
│   (Admin authenticated via Supabase Auth + public.is_admin) │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mutations
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRESQL + STORAGE            │
│   • public.artworks (with is_piece_of_the_month)            │
│   • public.collections (with publication_status, sort_order)│
│   • public.site_settings (JSONB store for homepage, pages)  │
│   • public.services (architectural offerings & disciplines) │
│   • public.media_assets (artworks-public storage tracking)  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Real-time Queries
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC WEBSITE FRONTEND                  │
│   • Homepage (Hero, Selected Works, Piece of Month, Services)
│   • /artworks (Curated Gallery Wall, Multi-view Lightbox)   │
│   • /collections (Thematic Series, Ordered Artworks)        │
│   • /services (Studio Disciplines, Specifications)          │
│   • /about (Artist Biography, Manifesto, Studio Philosophy) │
│   • /contact (Atelier Coordinates, Direct Intake)           │
└─────────────────────────────────────────────────────────────┘
```

When an authorized administrator edits or publishes content in Studio, the corresponding public website sections update dynamically without editing source code.

---

## 2. Scope Boundaries & Commitments

1. **NO COMMERCE IN PHASE 7C**:
   - Strictly no payment gateway backends (Paystack, Flutterwave, Stripe).
   - Strictly no orders backend, checkout backend, deposits, invoices, or customer transaction processing.
   - Commerce modules in Studio explicitly display "Planned for Commerce Phase" status without breaking operational workflows.
2. **ZERO FABRICATED METADATA**:
   - No invented dimensions, prices, years, or medium descriptions.
   - Blank inputs are preserved on new artworks without auto-populating guessed values.
   - "Price on Request" is supported for works without public pricing.
   - Missing fields are highlighted in a dedicated **Metadata Integrity Queue**.
3. **COMPLETE ASSET INTEGRITY**:
   - All 31 genuine artwork photographs (`hero.jpeg`, `pic1.jpeg` through `pic30.jpeg`) and discipline assets are preserved.
   - 3-tier safe content resolution ensures offline and staging environments always render approved visual content cleanly without generic placeholders.

---

## 3. Database Schema & Migration

**Migration File**: `supabase/migrations/20261007000001_create_cms_and_site_content.sql`

### 3.1 Piece of the Month Single Designation
- Added `is_piece_of_the_month BOOLEAN NOT NULL DEFAULT false` column to `public.artworks`.
- Implemented trigger function `handle_single_piece_of_the_month()` that automatically clears any prior Piece of the Month designation when a new canvas is designated.

### 3.2 Dynamic Site Settings Store (`public.site_settings`)
- Stores configuration schemas (`key TEXT PRIMARY KEY`, `value JSONB NOT NULL`).
- Keys:
  - `homepage`: Hero headlines, editorial quotes, section toggles.
  - `about`: Artist biography, manifesto copy, portrait image URLs.
  - `contact`: Studio email, coordinates, atelier hours, confidentiality notices.
  - `general`: Site brand parameters, currency defaults, freight policies.
- RLS: Public read access (`true`), Admin mutation access (`public.is_admin() = true`).

### 3.3 Studio Services Store (`public.services`)
- Table storing practice offerings (`id`, `number`, `title`, `slug`, `short_description`, `description`, `cover_image_url`, `features`, `sort_order`).
- Seeded with the 5 approved disciplines:
  1. Original Fine Art Works
  2. Large-Scale Architectural Murals
  3. Bespoke Contemporary Commissions
  4. Textured & Mineral Wall Art Finishes
  5. High-End Architectural House Painting

---

## 4. Studio Operational Modules

| Studio Route | Operational Capability | Backend Connection |
| :--- | :--- | :--- |
| `/studio` | Inventory metrics (Available, Drafts, Reserved, Collected, Media count), Curatorial Queue, Piece of the Month Spotlight, Metadata Integrity Queue | `artworkService.getAll({ includeUnpublished: true })`, `collectionService.getAll({ includeUnpublished: true })`, `mediaService.getAll()` |
| `/studio/artworks` | Grid & Table view, Piece of the Month quick toggle, Instant publish/unpublish toggle, Duplicate draft, Archive modal | `artworkService`, `collectionService` |
| `/studio/artworks/[id]` & `/new` | Tabbed editor (Core, Physical, Commerce, Organisation, Media, Publishing, SEO). No fabricated defaults. Arbitrary image perspective uploads. Save Draft vs Publish validation | `artworkService.create()`, `artworkService.update()`, `mediaService.uploadFile()` |
| `/studio/collections` | Collection series cards, Publication status badges (`Published`, `Draft`, `Archived`), Artwork count | `collectionService.getAll({ includeUnpublished: true })` |
| `/studio/collections/[id]` & `/new` | Thematic editor, Publication status selector, Sort order priority, Interactive Artwork Sequence reordering (Move Up / Move Down) | `collectionService.create()`, `collectionService.update()`, `artworkService.update()` |
| `/studio/pages` | Multi-tab CMS for Homepage, About page, and Contact coordinates | `contentService`, `siteContentService`, Supabase `site_settings` |
| `/studio/services` | Overview of studio practice disciplines, spec sheet links | `serviceService.getAll()`, Supabase `services` |
| `/studio/media` | Storage file manager, Multi-file upload, Metadata categorization, Reference-protected deletion | `mediaService.getAll()`, `mediaService.uploadFile()`, `mediaService.delete()`, Supabase Storage `artworks-public` |
| `/studio/settings` | Operational parameters, currency defaults, crating policies | `settingsService`, Supabase `site_settings` |

---

## 5. Public Website Dynamic Integration

1. **Homepage (`/`)**:
   - `HeroSection`: Consumes live `heroConfig` (custom headline, subheadline, CTA text/destinations, background image override) with fallback to `heroArtwork` and approved initial assets.
   - `SelectedWorks`: Renders published artworks with visible titles and clickable card routing to `/artworks` and `/collections`.
   - `FeaturedCollection`: Highlights the active featured collection series.
   - `ServicesPreview`: Directly streams live services from `serviceService.getAll()`.
   - `CollectedWorks`: Displays genuine archival pieces with clean `"Private Collection"` provenance styling.
2. **Artworks Catalogue (`/artworks`)**:
   - Curated gallery wall responsive layout (3-4 desktop, 2-3 tablet, 2 mobile).
   - Multi-perspective lightbox allowing patrons to view additional perspective shots (macro impasto, raking light angle, framed mount, in-situ interior).
3. **Curated Collections (`/collections/[slug]`)**:
   - Renders sequence of assigned paintings in the exact order curated in Studio via `sort_order`.
4. **Studio Services (`/services`)**:
   - Dynamically renders service offerings directly from `serviceService.getAll()`.
5. **About Page (`/about`)**:
   - Dynamically renders headline, biography, and curatorial statement from `siteContentService.getAboutConfig()`.
6. **Contact Page (`/contact`)**:
   - Dynamically renders studio email, physical presence, and atelier hours from `siteContentService.getContactConfig()`.

---

## 6. Verification Checklist

- [x] Studio operates as the administrative source of truth.
- [x] Supabase `site_settings` table acts as dynamic configuration store.
- [x] Single-designation Piece of the Month trigger and service methods verified.
- [x] Draft artworks remain invisible publicly while fully manageable in Studio.
- [x] New artwork creation introduces zero fabricated dimensions, medium, or price defaults.
- [x] Save Draft allows partial metadata; Publish validates required attributes.
- [x] Collection artwork reordering controls verified.
- [x] Multi-perspective artwork image attachments verified.
- [x] Reference-protected media asset deletion verified.
- [x] Commerce operations strictly deferred to subsequent phases.
- [x] Approved visual assets (31 photographs) completely preserved.

