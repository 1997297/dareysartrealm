# DAREY'S ARTREALM — CONTENT & CMS ARCHITECTURE
## INITIAL APPROVED CONTENT, EDITORIAL ASSETS & CMS REPLACEMENT MODEL

This document establishes the official content strategy and CMS-ready architecture for Darey's Artrealm.

---

## 1. Executive Content Classification

To prevent data confusion, all project content is categorized under three distinct definitions:

### 1.1 Approved Initial Project Content
- **Definition**: Genuine, approved visual artwork files and photographs deliberately supplied by Darey for this project.
- **Scope**:
  - `hero.jpeg`: Darey with the monumental masterwork in studio.
  - `pic1.jpeg` through `pic30.jpeg`: Authentic original paintings created by Darey and collaborating artists.
  - `architectural-murals.jpg`, `interior-finishes.jpg`, `house-painting.jpg`: Dedicated architectural and studio finish imagery.
  - `artist-portrait-transparent.png`: Transparent portrait of Darey.
- **Rule**: These are **APPROVED VISUAL ASSETS**. They must **NEVER** be deleted, replaced by generic placeholders, or suppressed as "fake mock data". They populate the initial website experience.

### 1.2 Fictional Business Data (Strictly Forbidden)
- **Definition**: Fabricated commercial or historical facts (invented sale prices, fake buyer names, invented city locations, fake provenance).
- **Rule**: If an approved artwork image lacks confirmed business facts (e.g. price or year), the platform displays `"Price on Request"`, `"Private Collection"`, or curatorial descriptors. **Never invent fictional collectors or sale figures.**

### 1.3 Editorial Visual vs Formal Artwork Record
- **Editorial Visual**: An approved asset utilized to establish atmosphere, theme, or narrative (e.g. Hero background, manifesto textural detail, services cover, about page diptych). An image does not require complete commercial metadata to appear editorially.
- **Formal Artwork Record**: A catalogued portfolio item with structured database metadata (dimensions, medium, price/Price on Request, availability status, certificate ID).

---

## 2. The 3-Tier Safe Content Fallback Hierarchy

All production services (`artworkService.ts`, `collectionService.ts`, `mediaService.ts`, `siteContentService.ts`) adhere to a strict resolution hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. REAL CMS-MANAGED PUBLISHED CONTENT                       │
│    Authoritative records stored in Supabase tables          │
│    Mutated and published via Artrealm Studio               │
└──────────────────────────────┬──────────────────────────────┘
                               │ (if empty / unseeded)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. APPROVED INITIAL PROJECT CONTENT                         │
│    Darey's genuine supplied assets (src/data/initialContent)│
│    Populates complete, rich gallery and editorial layout    │
└──────────────────────────────┬──────────────────────────────┘
                               │ (if explicitly disabled)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. INTENTIONAL ARTISTIC EMPTY STATE                         │
│    Branded studio curation notices; zero generic gray boxes │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. CMS Replacement Behavior (Studio Administration)

When Darey or an authorized administrator manages content in **Artrealm Studio**, the updated record becomes authoritative immediately without source-code modification:

1. **Hero Masterwork**:
   - Initial State: Renders `/artworks/hero.jpeg` with refined frosted gallery glass (`blur(4px–5.5px)`), directional lighting overlay, and the headline *"Welcome to Darey's Artrealm."*
   - CMS Override: When an admin marks a new artwork as `featured = true` and `published` in Studio, or updates Hero settings via `siteContentService`, the new artwork or image becomes the hero background automatically.
2. **Selected Works Marquee**:
   - Initial State: Displays the continuous infinite marquee featuring Darey's supplied works (`pic1`, `pic2`, `pic3`, `pic5`, `pic6`, `pic8`).
   - CMS Override: Artworks published in Supabase with `available` or `reserved` status dynamically populate the marquee.
3. **Featured Collection Room**:
   - Initial State: Displays the "Human Stories" suite (`/artworks/pic1.jpeg`).
   - CMS Override: The published collection marked `featured = true` in Supabase supersedes the initial room.
4. **Piece of the Month Spotlight**:
   - Initial State: Curated spotlight canvas.
   - CMS Override: Setting `is_piece_of_the_month = true` on any canvas in Studio instantly updates the spotlight, while database trigger `handle_single_piece_of_the_month()` safely clears prior designations.
5. **Collected Works**:
   - Initial State: Displays verified archival pieces with clean `"Private Collection"` provenance styling (no fabricated buyer names).
   - CMS Override: Artworks marked `status = 'collected'` in the database automatically stream into the archival room.
6. **Editorial Site Pages (/studio/pages)**:
   - Initial State: Curated statements, biographies, and contact coordinates in `src/data/initialContent.ts`.
   - CMS Override: Supabase `public.site_settings` JSONB store allows administrators to update headlines, manifestos, biographies, and studio contact logistics dynamically.

---

## 4. Initial Asset Registry

| Asset Path | Category | Placement | Description |
| :--- | :--- | :--- | :--- |
| `/artworks/hero.jpeg` | Hero / Editorial | Hero Section, About Page, Custom Artworks Service | Monumental canvas with figures on horizontal beam; studio session with Darey |
| `/artworks/pic1.jpeg` | Artwork / Editorial | Selected Works, Human Stories Collection, Commission Texture | Expressive African dance & drummers painting with vibrant palette |
| `/artworks/pic2.jpeg` | Artwork / Architectural | Selected Works, Collected Works, Interior Entryway | Fine art vertical canvas hung on collector's wall in molded niche |
| `/artworks/pic3.jpeg` | Artwork / Atelier | Selected Works, Artist Introduction | Textured orange poppies with impasto relief and palette knife work |
| `/artworks/pic4.jpeg` | Artwork / Archival | Collected Works | Raw textural impasto panel |
| `/artworks/pic5.jpeg` | Artwork / Editorial | Artistic Manifesto, Artworks Service Preview | Earth pigments and lapis figure study |
| `/artworks/pic6.jpeg` | Artwork | Selected Works, Human Stories Suite | Gilded geometric and charcoal study |
| `/artworks/pic7.jpeg` | Artwork | Catalogue, Studio Media | Charcoal chiaroscuro and ochre wash |
| `/artworks/pic8.jpeg` | Artwork / Collection | Atmospheric Currents Cover, Selected Works | Harmattan dust glaze vertical canvas |
| `/artworks/pic9.jpeg`–`pic30.jpeg` | Artwork Portfolio | Artworks Catalogue, Collections Suites | Full spectrum of original impasto, oil, and mineral pigment works |
| `/artworks/architectural-murals.jpg` | Service | Architectural Murals Service | Large-scale geometric outdoor/indoor wall installation |
| `/artworks/interior-finishes.jpg` | Service | Interior Art & Finishes Service | Natural textured mineral plaster and metallic leaf sample wall |
| `/artworks/house-painting.jpg` | Service | House Painting & Finishing Service | Professional surface preparation and architectural coating application |
| `/artist-portrait-transparent.png` | Personal | Artist Introduction | Studio portrait of Darey in frosted glass card |

---

## 5. Content Intake Protocol

To convert initial editorial imagery into complete formal database records in Artrealm Studio:
1. Open **Artrealm Studio → Artworks → New Artwork**.
2. Select an existing supplied asset or upload high-resolution photography.
3. Confirm core metadata:
   - Title
   - Year
   - Medium & Substrate
   - Metric Dimensions (Width × Height × Depth)
   - Orientation
4. Define commercial terms:
   - Numeric price OR toggle `Price on Request`
   - Initial status: `Available`, `Reserved`, `Collected`, `Commissioned`
5. Assign curatorial collection and tags.
6. Publish to make the record authoritative across the live site.

