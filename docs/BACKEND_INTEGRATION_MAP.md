# DAREY'S ARTREALM — BACKEND INTEGRATION MAP

This document establishes the official integration blueprint for transitioning the Darey's Artrealm frontend from simulated local state and mock services to production backend infrastructure (Supabase, Paystack, Flutterwave, Stripe, and Resend).

---

## 1. Authentication Architecture (STATUS: IMPLEMENTED IN PHASE 7A)

**Target Service:** Supabase Auth (GoTrue) + PostgreSQL Row-Level Security (RLS)  
**Implementation Files:**
- Browser / Server / Middleware Clients: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/middleware.ts`
- Database Migration: `supabase/migrations/20261006000001_create_profiles_and_roles.sql`
- Types & State: `src/types/supabase.ts`, `src/types/auth.ts`, `src/contexts/AuthContext.tsx`
- Documentation: `docs/PHASE_7A_BACKEND_FOUNDATION.md`

| Touchpoint | Implementation Status | Target Backend Route / SDK Call | Security & Verification |
| :--- | :--- | :--- | :--- |
| **Collector Login** (`/login`) | **LIVE** | `supabase.auth.signInWithPassword({ email, password })` | Returns JWT access token, refresh token, user UUID. Profile row joined from `public.profiles`. Open-redirect protected via sanitized `next` param. |
| **Collector Registration** (`/register`) | **LIVE** | `supabase.auth.signUp({ email, password, options: { data: { first_name, last_name, phone } } })` | Automatically provisions row in `public.profiles` via database trigger `handle_new_user()`. Role hardcoded to `'collector'`. |
| **Password Reset** (`/forgot-password`) | **LIVE** | `supabase.auth.resetPasswordForEmail(email, { redirectTo: '/auth/callback?next=/account/reset-password' })` | Triggers transactional email with PKCE recovery code. |
| **Password Reset Receiver** (`/account/reset-password`) | **LIVE** | `supabase.auth.updateUser({ password })` | Updates user password in active recovery session. |
| **Collector Logout** (Header / Account) | **LIVE** | `supabase.auth.signOut()` | Invalidates session tokens, flushes client caches. |
| **Server-Side Route Gate** (`/account/*`) | **LIVE** | Next.js Edge Middleware (`src/middleware.ts`) | Rejects unauthenticated traffic and redirects to `/login?next=...` |
| **Role Verification & Studio Gate** (`/studio/*`) | **LIVE** | Next.js Edge Middleware + `StudioClientShell.tsx` + `public.is_admin()` SQL helper | Blocks non-admin requests at both Edge middleware and database level. Redirects non-admins to `/account?denied=studio`. |
| **Row Level Security (RLS)** | **LIVE** | `public.profiles` policies | Enforces strict data isolation. Collectors can update contact info but `with check` mathematically blocks self-privilege escalation to admin. |

---

## 2. Artworks & Collections Catalog (STATUS: IMPLEMENTED IN PHASE 7B)

**Target Service:** Supabase Database (PostgreSQL) + Supabase Storage (`artworks-public`, `artworks-private`)  
**Implementation Files:**
- Database Migration: `supabase/migrations/20261006000002_create_artworks_collections_and_media.sql`
- Types: `src/types/supabase.ts`, `src/types/artwork.ts`, `src/types/collection.ts`, `src/types/media.ts`
- Production Services: `src/services/artworkService.ts`, `src/services/collectionService.ts`, `src/services/mediaService.ts`
- Studio Management: `src/components/studio/ArtworkEditor.tsx`, `src/components/studio/CollectionEditor.tsx`, `src/app/studio/media/page.tsx`
- Documentation: `docs/PHASE_7B_ARTWORK_DATA_AND_STORAGE.md`

| Touchpoint | Implementation Status | Target Backend Route / Query | Security & Schema Enforcement |
| :--- | :--- | :--- | :--- |
| **Public Catalog** (`/artworks`, `/artworks/[slug]`) | **LIVE** | `supabase.from('artworks').select('*, artwork_images(*), artwork_collections(...)').eq('publication_status', 'published')` | RLS policy restricts anonymous and collector queries strictly to `publication_status = 'published'`. Admins can preview drafts via `?preview=true`. |
| **Curated Collections** (`/collections`, `/collections/[slug]`) | **LIVE** | `supabase.from('collections').select('*').eq('publication_status', 'published')` | Curatorial exhibition rooms. RLS restricts non-admins to published rooms. Junction table `artwork_collections` provides ordered relationships. |
| **Artwork Images & Multi-Perspective Zoom** (`/artworks/[slug]`) | **LIVE** | `supabase.from('artwork_images').select('*').order('sort_order')` | Multi-perspective views (`primary`, `detail`, `texture`, `angle`, `framed`) stored in `public.artwork_images` pointing to Supabase Storage CDN URLs. |
| **Supabase Storage Buckets** | **LIVE** | `artworks-public` (15MB max, public read, admin write) & `artworks-private` (100MB max, admin-only read/write) | Storage RLS ensures public assets can be rendered sitewide while private master high-res files require admin authorization. |
| **Studio Artwork Management** (`/studio/artworks/*`) | **LIVE** | Direct CRUD via `artworkService` with sequential code generation (`DAR-YYYY-XXX`) | Strict admin RLS mutation policy (`public.is_admin() = true`). Validates medium, dimensions, price, and photography before publishing. |
| **Studio Media Library** (`/studio/media`) | **LIVE** | Direct file upload via `mediaService.uploadFile()` to `artworks-public` with metadata stored in `public.media_assets` | Admin-only upload, metadata indexing, and deletion. |

---

## 3. Commerce, Orders & Payment Processing

**Target Service:** Paystack / Flutterwave / Stripe + Supabase PostgreSQL  
**Current Frontend Abstraction:** `src/services/orderService.ts`, `src/contexts/CartContext.tsx`, `src/types/commerce.ts`

| Touchpoint | Current Simulation | Target Backend Route / Webhook | Concurrency & Security Protocol |
| :--- | :--- | :--- | :--- |
| **Cart Persistence** (`/cart`, `CartDrawer`) | Browser `localStorage` (`darey_cart`) | Hybrid: LocalStorage for guest, sync to `public.cart_items` on collector login | Prevents loss across devices for logged-in patrons. |
| **Checkout Initiation** (`/checkout`) | Local form validation with mock payment options | Edge Function `POST /api/checkout/initiate` creating payment session | **Concurrency Lock:** Database row lock (`SELECT FOR UPDATE`) marks artwork `reserved` for 15 minutes to prevent double-checkout on original 1-of-1 pieces. |
| **Payment Gateway Integration** (Paystack / Stripe) | Simulated mock transaction confirmation | Client SDK redirect / inline checkout modal (Paystack Popup / Stripe Checkout Session) | Currency routing: NGN/GHS/KES via Paystack/Flutterwave; USD/EUR/GBP via Stripe. |
| **Payment Webhook Verification** | Client-side immediate success redirect | Edge Function `POST /api/webhooks/payment` verifying HMAC signature | Verifies payment authenticity before marking order `paid` and artwork `sold`. |
| **Order Record Creation** (`/order/[id]`) | Mock ID generation (`DAR-ORD-...`) stored in localStorage | PostgreSQL table `orders` and `order_items` linked to collector UUID | Stores shipping address, payment reference, courier tracking, COA reference. |
| **Certificate of Authenticity (COA) Trigger** | Static template modal | Background Edge Worker generates cryptographically signed PDF COA with SHA-256 hash | Uploaded to private Supabase Storage bucket `certificates`; download link populated in order record. |

---

## 4. Bespoke Commissions Workflow

**Target Service:** Supabase Database + Storage + Resend  
**Current Frontend Abstraction:** `src/app/commission/page.tsx`, `src/services/commissionService.ts`, `src/types/commission.ts`

| Touchpoint | Current Simulation | Target Backend Route / Mutation | Required Schema & Storage |
| :--- | :--- | :--- | :--- |
| **Commission Atelier Intake** (`/commission`) | 5-step form with mock file uploads & simulated receipt | `POST /api/commissions` submitting multi-part payload | Table `commissions`: `id`, `collector_id`, `artwork_type`, `dimensions`, `space_type`, `budget_range`, `timeline`, `description`, `status` (`inquiry`, `consultation`, `concept`, `in_progress`, `completed`). |
| **Reference File Uploads** (`FileUploader`) | Simulated `URL.createObjectURL` object links | Supabase Storage bucket `commission-briefs` (private) | Edge Function generates pre-signed upload URLs; validates MIME types (PNG, JPG, PDF, WEBP) and 10MB limit. |
| **Commission Milestones** (`/account/commissions/[id]`) | Static progress stages | Table `commission_updates`: `commission_id`, `stage`, `title`, `notes`, `image_url`, `created_at` | RLS allows collector to read only their commission milestones. |
| **Studio Commission Triage** (`/studio/commissions/*`) | Mock state mutation | Admin mutations to update status, propose quotes, upload progress photos | Dispatches milestone notification emails to collector via Resend. |

---

## 5. Architectural & Studio Services

**Target Service:** Supabase Database + Resend  
**Current Frontend Abstraction:** `src/app/services/*`, `src/services/serviceRequestService.ts`, `src/types/serviceRequest.ts`

| Touchpoint | Current Simulation | Target Backend Route / Mutation | Description |
| :--- | :--- | :--- | :--- |
| **Service Inquiries & Quotes** (`/services/[slug]`) | Quote modal with mock submission feedback | `POST /api/services/request` | Table `service_requests`: `service_slug`, `client_name`, `client_email`, `client_phone`, `location`, `estimated_scope`, `project_timeline`, `architectural_plans_url`. |
| **Studio Service Request Triage** (`/studio/service-requests`) | Memory table with status filtering | Admin API to update triage status (`pending`, `contacted`, `site_visit_scheduled`, `quoted`, `declined`) | Sends automated curatorial email to client confirming inquiry receipt. |

---

## 6. General Enquiries & Curatorial Inquiries

**Target Service:** Supabase Database + Resend  
**Current Frontend Abstraction:** `src/app/contact/page.tsx`, `src/types/contact.ts`

| Touchpoint | Current Simulation | Target Backend Route | Description |
| :--- | :--- | :--- | :--- |
| **Contact Form** (`/contact`) | 1000ms timeout with local receipt | `POST /api/contact` | Ingests general messages, press inquiries, exhibition proposals, and acquisition questions into `enquiries` table. |
| **Artwork-Specific Inquiry** (`/artworks/[slug]`) | Modal enquiry form | `POST /api/artworks/inquire` | Binds inquiry directly to `artwork_id` and alerts artist studio via email webhook. |

---

## 7. Collector Portal

**Target Service:** Supabase Database + Storage  
**Current Frontend Abstraction:** `src/app/account/*`, `src/data/mockCollectorData.ts`, `src/types/collector.ts`

| Touchpoint | Current Simulation | Target Backend Query | Description |
| :--- | :--- | :--- | :--- |
| **Collector Overview** (`/account`) | Mock acquisitions, commissions, and COAs | `supabase.from('collectors').select('*, orders(*), commissions(*)')` | Aggregates all acquisitions, active bespoke commissions, and saved works for the authenticated user. |
| **Acquisition History** (`/account/orders/*`) | Static orders list | `supabase.from('orders').select('*, items(*, artwork:artworks(*))').eq('collector_id', auth.uid())` | Displays order details, courier tracking links, and high-res certificate access. |
| **Saved Artworks** (`/saved`, `/account/saved`) | `localStorage` (`darey_saved_artworks`) | Hybrid: LocalStorage for guests, synced to `public.saved_artworks` for registered collectors | Persists collector curations across devices. |
| **Profile Settings** (`/account/profile`) | Local form state | `supabase.from('profiles').update(formData).eq('id', auth.uid())` | Updates collector name, shipping coordinates, and communication preferences. |

---

## 8. Artrealm Studio (Operational Administration)

**Target Service:** Supabase Database (Admin Service Role) + Storage + Analytics  
**Current Frontend Abstraction:** `src/app/studio/*`, `src/data/mockStudioData.ts`, `src/types/studio.ts`

| Operational Tool | Current Frontend Module | Target Backend Implementation |
| :--- | :--- | :--- |
| **Dashboard Metrics** (`/studio`) | Mock metric cards and recent ledger | Supabase RPC / SQL aggregation view `studio_dashboard_metrics` calculating real revenue, open commissions, pending orders, and active inquiries. |
| **Artwork Catalog CMS** (`/studio/artworks`) | Mock list with add/edit modals | Full CRUD over `artworks` table with image upload pipeline to Supabase Storage. |
| **Collection Curator** (`/studio/collections`) | Mock collection management | CRUD over `collections` table with ordering sequence. |
| **Order Management** (`/studio/orders`) | Mock order fulfillment updates | Admin updates courier name, dispatch tracking number, and dispatches shipping notification email. |
| **Commission Pipeline** (`/studio/commissions`) | Mock Kanban / progress update | Manages lifecycle, milestones, deposit milestones, and final delivery confirmation. |
| **Collector CRM** (`/studio/collectors`) | Mock collector database | Aggregated view of patron lifetime value (LTV), acquisition count, and VIP status tiers. |
| **Media Library** (`/studio/media`) | Mock file cards with upload modal | Direct file manager over Supabase Storage buckets (`artworks`, `press`, `documents`). |
| **Review Moderation** (`/studio/reviews`) | Simulated reviews list with status toggle | Moderates feedback into `reviews` table (`approved`, `pending`, `hidden`). |
| **Studio Settings & Profile** (`/studio/settings`) | Mock CMS key-value store | Table `studio_settings` containing public studio coordinates, currency configurations, and notification webhooks. |

---

## 9. Transactional Email Blueprint (Resend)

| Email Identifier | Trigger Event | Recipient | Key Variables |
| :--- | :--- | :--- | :--- |
| `order_confirmation` | Payment webhook confirmed | Collector | `orderId`, `collectorName`, `artworkTitle`, `amount`, `currency`, `shippingAddress` |
| `order_dispatched` | Admin adds courier tracking in Studio | Collector | `orderId`, `courierName`, `trackingNumber`, `trackingUrl`, `estimatedDelivery` |
| `commission_received` | Commission form submitted | Collector | `commissionId`, `collectorName`, `artworkType`, `timeline` |
| `commission_milestone` | Studio posts milestone update | Collector | `commissionId`, `stageTitle`, `notes`, `progressImageUrl` |
| `service_quote_received` | Service request submitted | Patron | `serviceName`, `clientName`, `scopeSummary` |
| `new_studio_inquiry` | Contact / Inquiry submitted | Artist Studio (`studio@dareysartrealm.com`) | `senderName`, `senderEmail`, `messageIntent`, `artworkRef`, `messageBody` |

---

## 10. Required Environment Variables for Production Backend

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# Payment Gateways
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_...

# Transactional Email (Resend)
RESEND_API_KEY=re_...
STUDIO_NOTIFICATION_EMAIL=studio@dareysartrealm.com

# Storage & CDN
NEXT_PUBLIC_STORAGE_CDN_URL=https://cdn.dareysartrealm.com
```
