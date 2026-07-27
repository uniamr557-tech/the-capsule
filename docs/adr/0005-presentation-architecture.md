# ADR-0005: Presentation Layer Architecture

* **Status:** Proposed for Review
* **Date:** 2026-07-27
* **Authors:** Frontend & UX Engineering Team
* **Decider(s):** Product, Design & Security Lead

---

## Context & Problem Statement

**The Capsule** requires a responsive, high-aesthetic web application supporting two distinct user surfaces:
1. **Senior Experience:** Emotive, unhurried, image-led digital yearbook browse and memory submission interface on mobile and desktop.
2. **Senior Admin Studio:** Operational curation workspace for moderation, code rotation, branding, and archival controls.

We must define the presentation architecture in `apps/web`, including route layout, component hierarchy, server vs. client rendering strategy, state management, form validation, error boundaries, loading states, WCAG 2.2 AA accessibility, and design token integration.

---

## Decision Drivers

1. **Aesthetic Excellence & Atmosphere:** Fulfill the Experience & Visual Identity Specification (Paper `#F7F4EE`, Ink `#1D1C1A`, Marigold `#D89B3C`, `DM Serif Display` + `Inter`).
2. **Performance (LCP $\le$ 2.5s):** Fast mobile page rendering and zero layout shift.
3. **Security & Session Boundary:** Clean separation between anonymous senior session routes and authenticated Admin Studio routes.
4. **Accessibility (WCAG 2.2 AA):** Keyboard operability, high-contrast focus rings, screen reader labels, reduced-motion respect.

---

## Architecture Specifications & Trade-offs

### 1. Route Organization (`apps/web/src/app`)

Using Next.js App Router:

```text
apps/web/src/app/
├─ page.tsx                            # Class Code Entry Threshold & Landing Page
├─ capsules/[slug]/
│  ├─ page.tsx                         # Capsule Homepage & Hero Cover
│  ├─ layout.tsx                       # Senior Experience Shell & Collection Navigation
│  ├─ timeline/page.tsx                # Chronological Story Timeline
│  ├─ gallery/page.tsx                 # Masonry Media Gallery
│  ├─ memories/page.tsx                # Written Memories Reader
│  ├─ messages/page.tsx                # Class Messages Stream
│  └─ search/page.tsx                  # Content Search & Filter
├─ admin/
│  ├─ login/page.tsx                   # Admin Passwordless Login & Recovery Key Entry
│  └─ studio/[capsuleId]/
│     ├─ layout.tsx                    # Admin Studio Shell & Sidebar Nav
│     ├─ page.tsx                      # Overview Dashboard & Metrics
│     ├─ content/page.tsx              # Content Manager (Visible / Hidden / Deleted)
│     ├─ access/page.tsx               # Access Code Rotation & Policy
│     ├─ appearance/page.tsx           # Cover Focal Selector & Accent Theme Picker
│     ├─ archive/page.tsx              # Read-only Freeze & Retention Controls
│     └─ audit/page.tsx                # Audit Log Event Timeline
└─ api/v1/                              # API Route Handlers
```

- **Alternatives Considered:** Single Page App (SPA) hash routing vs Next.js App Router.
- **Trade-off:** App Router provides superior initial server render (RSC) for fast mobile LCP, automatic code splitting, and native metadata/SEO control.

---

### 2. Component Hierarchy & Layering

- **Foundation Primitives (`@capsule/ui`):** `Button`, `TextField`, `CodeInput`, `Dialog`, `PillToggle`, `Toast`, `Skeleton`, `Badge`.
- **Senior Surface Components (`apps/web/src/components/senior`):**
  - `CapsuleHero`: Full-bleed cover imagery, class title, warm welcome text.
  - `CollectionNav`: Pill navigation for Timeline, Gallery, Memories, Messages.
  - `MediaGrid` & `MediaCard`: Native aspect-ratio masonry presentation.
  - `MemoryCard`: Editorial typography reading card (line-length capped at 68 chars).
  - `ContributionModal`: 4-step wizard reducer for photo, video, memory, message submission.
- **Admin Surface Components (`apps/web/src/components/admin`):**
  - `StudioNav`: Operational header and studio navigation tabs.
  - `MetricCard`: Storage, contribution totals, access code status.
  - `ContentTable`: Filterable moderation queue with inline preview.
  - `ModerationDrawer`: Reversible Hide/Restore and irreversible Delete confirmation.

---

### 3. Server vs. Client Component Strategy

- **React Server Components (RSC) by Default:** Page layouts, initial capsule presentation, server authorization checks, and static typography render on the server.
- **Client Components (`'use client'`) Strictly Reserved For:**
  1. Interactive 8-character `CodeInput` keypad and rate-limiting UI.
  2. `ContributionModal` state machine & direct-to-storage upload progress bar.
  3. Dark video player overlay modal (`MediaPlayer`).
  4. Moderation drawers and toast notification manager.

---

### 4. State Management Strategy

- **Server Query State:** Next.js server cache and TanStack Query / React `useOptimistic` for Admin moderation actions.
- **Upload Workflow Finite State Machine:** Managed via a client React reducer:
  $$\text{selecting} \rightarrow \text{validating} \rightarrow \text{intent\_created} \rightarrow \text{uploading} \rightarrow \text{finalizing} \rightarrow \text{ready} \mid \text{failed}$$
- **URL Search Parameters:** Browse filters (content type, moment date, search query) are reflected in URL search params for bookmarking and back-button support.

---

### 5. Form & Error Boundary Architecture

- **Forms:** Controlled components validated against Zod schemas imported from `@capsule/api-contracts`.
- **Error Boundaries:** Segment-level `error.tsx` boundaries. Invalid access codes display neutral feedback (*"That code isn't active. Ask your Senior Admin for the current one."*).
- **Loading States:** Segment-level `loading.tsx` and Skeleton screens matching Paper Deep (`#EEE9E0`).

---

### 6. Accessibility & Responsive Architecture (WCAG 2.2 AA)

- **Contrast:** Paper (`#F7F4EE`) vs Ink (`#1D1C1A`) provides 15.8:1 contrast (exceeding 4.5:1 requirement).
- **Focus Rings:** Dedicated `Focus Blue` (`#245CBA`) 2px outline on all focused interactive elements.
- **Keyboard & Motion:** Full keyboard accessibility; modal focus traps; CSS media query `@media (prefers-reduced-motion: reduce)` disables non-essential animations.
- **Responsive System:** Fluid layout from 320px minimum mobile width to 1200px container max width.

---

## Compliance & Verification

- Verified visually by testing all viewport sizes (320px mobile to 1440px desktop).
- Automated check using WCAG 2.2 AA accessibility audit tooling.
