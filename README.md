# The Capsule

> **A premium, private digital yearbook and memory capsule exclusively for a graduating high-school class.**

---

## 1. Product Positioning

The Capsule is deliberately not a social network or school-management product. It gives each graduating class one enduring, beautiful place to preserve its shared story: the people, photos, videos, memories, and messages that matter at the end of high school.

The product feels intimate and archival, not feed-driven or performative. The primary emotional outcome is: *“We made this together, and it will still be here years from now.”*

---

## 2. Core Non-Goals

- **No social feed mechanics:** No direct messages, follows, likes, comments, replies, notifications, or algorithmic ranking.
- **No school administration:** No rosters, grades, attendance, or parent portals.
- **No senior accounts:** No password recovery, identity verification, or personalized profiles. Seniors enter via rotating class access code.
- **No monetization or public discovery:** No public indexing, ad tracking, or external sharing links.

---

## 3. Monorepo Architecture

```text
the-capsule/
├─ apps/
│  ├─ web/                         # Next.js web application & API route handlers
│  └─ worker/                      # Async media, retention, and scheduled jobs
├─ packages/
│  ├─ domain/                      # Domain entities, policies, state machines, use cases
│  ├─ db/                          # Database schema, migrations, repositories
│  ├─ api-contracts/               # OpenAPI/Zod schemas & generated client types
│  ├─ ui/                          # Design-system primitives & tokens
│  ├─ auth/                        # Admin & senior session/authorization logic
│  ├─ media/                       # Storage adapters, EXIF stripping, processing contracts
│  ├─ observability/               # Logging, metrics, tracing conventions
│  └─ config/                      # Typed environment & configuration loading
├─ infrastructure/
│  ├─ terraform/                   # Cloud resources & IAM declarations
│  └─ monitoring/                  # Dashboards & alerts as code
├─ docs/
│  ├─ adr/                         # Architecture Decision Records
│  ├─ api/                         # API standards & generated documentation
│  └─ runbooks/                    # Operational runbooks (incident, restore, deletion)
├─ tests/
│  ├─ e2e/                         # End-to-end Playwright tests
│  ├─ integration/                 # API & database integration tests
│  └─ fixtures/                    # Test fixtures & mocks
└─ tooling/                        # Workspace scripts & build tooling
```

---

## 4. Engineering Standards & Documentation

- See [`ARCHITECTURE.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/the-capsule/ARCHITECTURE.md) for modular monolith architecture, layer boundaries, and import rules.
- See [`DEVELOPMENT_RULES.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/the-capsule/DEVELOPMENT_RULES.md) for strict architectural boundaries and development principles.
- See [`docs/CODING_STANDARDS.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/the-capsule/docs/CODING_STANDARDS.md) for TypeScript and React conventions.
- See [`docs/SECURITY.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/the-capsule/docs/SECURITY.md) for threat modeling and data minimization rules.
- See [`docs/ACCESSIBILITY.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/the-capsule/docs/ACCESSIBILITY.md) for WCAG 2.2 AA requirements.
- See [`docs/PERFORMANCE.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/the-capsule/docs/PERFORMANCE.md) for performance budgets and latency SLOs.

---

## 5. Development Roadmap Overview

- **M0: Engineering Foundation** *(Current)* — Repository structure, guidelines, token system, boundaries.
- **M1: Core Domain & Access** — Capsule config, access codes, rotation state machine, scoped session verification.
- **M2: Moderation & Life Cycle** — Content state transitions (`visible`, `hidden`, `deleted`), Admin Studio moderation queues, audit log.
- **M3: Media Pipeline** — Upload intent flow, direct storage upload, EXIF sanitization, responsive variants, video processing.
- **M4: Browsing & Visual Polish** — Mobile-first gallery, timeline, written memory reader, theme accents, WCAG compliance.
- **M5: Archival Readiness & Production Gate** — Read-only archive freeze, backup/restore drills, penetration test, production deploy.
