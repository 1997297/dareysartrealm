# Darey's Artrealm

> **Contemporary artist website + digital art gallery + artwork sales platform + commission platform + creative-services platform + collector experience + artist administration platform (Artrealm Studio).**

---

## Master Architecture & Current Status

This repository is built following the **Darey's Artrealm UI / Frontend Master Development Specification**.

### Implementation Status: Phase 1 Complete
- [x] **Phase 1: Foundation + Art Direction + Design System + Primitives + Homepage** (Current)
- [ ] **Phase 2: Art Discovery** (Catalog, Filtering, Artwork Detail, Collections, Space Visualizer)
- [ ] **Phase 3: Commissions & Services** (Multi-step Commission Flow, Service Quoting, Story & About)
- [ ] **Phase 4: Commerce & Collector Portal** (Cart Drawer, Checkout Simulation, Collector Accounts)
- [ ] **Phase 5: Artrealm Studio** (Artist CMS, Order Ledger, Commission Kanban, Media Manager)
- [ ] **Phase 6: Frontend Hardening** (Full A11y, Performance, and Cross-Device Verification)

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling**: Tailwind CSS with custom design tokens (`canvas`, `charcoal`, `accent`)
- **Typography**: Editorial Display Serif (`Cormorant Garamond`) + Functional Sans (`Plus Jakarta Sans`)
- **Motion**: Framer Motion with custom artistic easing (`cubic-bezier(0.22, 1, 0.36, 1)`)
- **Icons**: Lucide React
- **Architecture**: Domain service abstractions (`artworkService`, `collectionService`) over typed mock data

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript checks
npm run typecheck

# Run production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the Artrealm.
