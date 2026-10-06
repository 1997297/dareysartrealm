# DAREY'S ARTREALM — CONTENT & BUSINESS DATA REQUIRED FOR PRODUCTION

Before public deployment, all simulated data, placeholder text, and sample records must be substituted with verified real-world business information, authentic artwork inventory, and verified legal details. This document provides the comprehensive checklist of assets and data required from the artist and studio management.

---

## 1. Official Studio & Business Entity

| Item Required | Current Development Value | Real Data Required | Priority |
| :--- | :--- | :--- | :--- |
| **Legal Business Name** | `Darey's Artrealm` | Registered legal corporate or business name | P0 |
| **Studio Registration Number** | None / Simulated | CAC registration number (Nigeria) or local business registration | P1 |
| **Physical Studio Address** | `Artist Studio & Contemporary Atelier` | Physical studio address for insured courier collections & private consultations | P0 |
| **Official Studio Email** | `studio@dareysartrealm.com` | Verified domain mailbox connected to Google Workspace / Microsoft 365 | P0 |
| **Studio Direct Phone / WhatsApp** | `+234 (0) 800 000 0000` | Dedicated studio phone number for private collector concierge & courier alerts | P0 |
| **Social Media Profiles** | `@dareysartrealm` | Verified Instagram, Twitter/X, and LinkedIn studio handles | P1 |

---

## 2. Artist Biography, Statement & Curatorial Philosophy

| Item Required | Current Development State | Required Studio Input |
| :--- | :--- | :--- |
| **Artist Biography** | Authentic textual narrative in `src/app/about/page.tsx` focusing on sculptural impasto, mineral pigments, and knife-work | Review and approve final biographical text; provide any verified institutional education, mentorships, or studio founding date. |
| **Exhibition History** | Unconfirmed exhibitions removed during Phase 6 hardening | Provide verified exhibition ledger (Solo & Group exhibitions, dates, venues, locations). If none, confirm studio-direct representation only. |
| **Curatorial Statement** | Textual manifesto in `ArtisticManifesto.tsx` | Artist sign-off on the manifesto text and philosophy of materiality. |
| **Artist Portrait** | High-contrast studio photograph (`/artworks/pic5.jpeg`) | High-resolution editorial portrait of Darey working in the studio (300 DPI, minimum 2400×3200px). |

---

## 3. Artwork Inventory & High-Resolution Photography (BACKEND READY — ASSETS REQUIRED)

> [!NOTE]
> Phase 7B has deployed the PostgreSQL tables (`artworks`, `artwork_images`, `collections`, `media_assets`) and Supabase Storage buckets (`artworks-public`, `artworks-private`). Studio staff can now directly upload and catalog physical pieces through the Artrealm Studio at `/studio/artworks/new`.

| Item Required | Specifications Needed | Status / Action Needed |
| :--- | :--- | :--- |
| **Artwork Titles & Slugs** | Descriptive titles matching physical canvases (e.g., `Echoes of Home`, `Ancestral Horizon`) | Provide verified list of canvas titles and confirmation of internal studio numbers. |
| **Exact Physical Dimensions** | Width × Height × Depth in centimeters and inches (e.g., `120 × 90 × 4.5 cm`) | Measure each canvas precisely including stretcher bar depth. |
| **Medium & Substrate Description** | Exact composition (e.g., `Heavy impasto oil, raw mineral pigments, and gold leaf on Belgian linen canvas`) | Provide detailed material breakdown for museum-grade provenance documentation. |
| **High-Resolution Photography** | Minimum 4000px on long edge, color-calibrated (sRGB / Adobe RGB), glare-free studio lighting | Upload via `/studio/artworks` or `/studio/media` to `artworks-public`. Master TIFFs go to `artworks-private`. |
| **Detail / Texture Angle Shots** | Close-up macro photographs showing impasto knife relief and canvas corners (3-5 per artwork) | Required for detail gallery on `/artworks/[slug]`. Classified as `detail`, `texture`, `angle`. |
| **Pricing & Currency** | Exact sale price per available artwork, or designation as `Price on Request` | Confirm pricing matrix in USD and local currency (NGN). |
| **Artwork Status Ledger** | Flag each canvas as `available`, `reserved`, or `sold` | Confirm which existing pieces have already been collected into private hands. |

---

## 4. Curated Collections

| Collection Name | Curatorial Focus | Required Studio Confirmation |
| :--- | :--- | :--- |
| **Human Stories** | Expressive portraits, emotional narratives, impasto character studies | Confirm artwork membership and curatorial statement. |
| **Ancestral Echoes** | Cultural memory, symbolic motifs, heritage dialogues | Confirm artwork membership and curatorial statement. |
| **Earth & Texture** | Raw tactile materiality, organic palette, mineral earth studies | Confirm artwork membership and curatorial statement. |
| **Silent Reflections** | Contemplative minimalist compositions, light studies | Confirm artwork membership and curatorial statement. |

---

## 5. Studio & Architectural Services

| Service Discipline | Description & Scope | Required Studio Input |
| :--- | :--- | :--- |
| **Original Artwork Acquisition** | Direct acquisition of 1-of-1 studio canvases | Confirm international transit insurance inclusion. |
| **Bespoke Commissions** | Site-specific canvases tailored to collector interiors | Confirm deposit terms (standard: 50% non-refundable deposit upon concept sign-off). |
| **Large-Scale Murals** | Hand-painted interior and exterior architectural murals | Define minimum surface area (sqm), travel requirements, and prep requirements. |
| **Luxury Interior Finishes** | Venetian plaster, limewash, textured metallic leafing | Confirm supplier certifications and residential/commercial availability. |
| **House Painting & Finishing** | Premium architectural coatings and protective finishes | Confirm regional availability boundaries (local metropolitan area vs travel). |

---

## 6. Payment Accounts & Merchant Gateway Credentials

| Service | Required Configuration | Notes |
| :--- | :--- | :--- |
| **Paystack** | Live Public Key (`pk_live_...`) & Live Secret Key (`sk_live_...`) | For processing local Nigerian cards, bank transfers, and USSD. |
| **Stripe** | Live Publishable Key (`pk_live_...`) & Live Secret Key (`sk_live_...`) | For processing international credit/debit cards (Visa, MasterCard, Amex) in USD/EUR/GBP. |
| **Flutterwave** (Optional) | Live Public & Secret Keys | For multi-currency pan-African collector settlements. |
| **Direct Bank Wire Details** | Studio Bank Name, Account Name, Account Number, SWIFT/BIC, IBAN | Displayed on invoices for institutional acquisitions exceeding online card limits. |

---

## 7. Logistics, Crating & Insured Transit

| Logistics Element | Studio Policy Required | Notes |
| :--- | :--- | :--- |
| **Primary Courier Partner** | Corporate account with DHL Express / FedEx Art Concierge | Account number for automated dispatch labels and tracking webhook integration. |
| **Crating Protocol** | Custom museum-grade pine/plywood crating with waterproof vapor barriers | Included in artwork price or calculated at checkout? (Current frontend: complimentary museum crating for original canvases). |
| **Transit Insurance** | 100% declared value marine/air cargo fine art insurance | Confirm insurer policy number and claims procedure. |
| **Customs & Import Duties Notice** | Standard international clause: collector responsible for local import VAT/duties | Verified and documented in `/terms`. |

---

## 8. Authenticity Protocols & Legal Wording

| Document / Asset | Current Implementation | Real Asset Required |
| :--- | :--- | :--- |
| **Certificate of Authenticity (COA)** | Cotton-rag simulated certificate on `/authenticity` | High-res scan or vector asset of Darey's physical studio stamp / wax seal. |
| **COA Serial Numbering Scheme** | `DAR-COA-YYYY-XXXX` | Confirmation of studio numbering registry. |
| **Terms of Service** (`/terms`) | Comprehensive art acquisition, copyright retention, and transport terms | Final legal review by studio counsel before production deployment. |
| **Privacy Policy** (`/privacy`) | Collector confidentiality and GDPR/NDPR data compliance statement | Final review by studio legal team. |

---

## 9. Collector Reviews & Testimonials

| Policy Decision | Options | Recommended Action |
| :--- | :--- | :--- |
| **Testimonial Display** | A) Display real collector testimonials with explicit permission.<br>B) Hide reviews completely until post-launch feedback is collected. | **Option B (Recommended):** In Phase 6, all mock reviews were designated as simulated development records in `/studio/reviews`. Keep public reviews disabled until authentic patron quotes are provided in writing. |
