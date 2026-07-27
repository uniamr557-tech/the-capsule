# Architecture Overview — The Capsule

This document outlines the architectural patterns, package responsibilities, dependency direction, import rules, and extraction strategy for **The Capsule**.

---

## 1. Why a Modular Monolith?

**The Capsule** is architected as a **modular monolith** within a TypeScript monorepo.

### Key Rationale:
1. **Operational Simplicity:** A single deployable web application (`apps/web`) and background worker (`apps/worker`) reduce operational overhead compared to microservices while maintaining high availability (99.9% SLO).
2. **Strict Domain Boundaries:** Code is organized into explicit, decoupled packages (`packages/*`). Domain entities and business rules are kept isolated from frameworks and storage implementations.
3. **Low Latency:** In-process domain calls eliminate network latency between sub-services while preserving modularity.
4. **Clean Future Extraction:** Each domain module is scoped by `capsule_id` and communicates through typed interfaces, allowing future extraction into standalone microservices if traffic demands it.

---

## 2. Package Responsibilities

```text
               ┌────────────────────────────────────────┐
               │                apps/web                │
               └───────────────────┬────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐     ┌──────────────────┐      ┌──────────────────┐
│  packages/ui     │     │ packages/auth    │      │ packages/media   │
└──────────────────┘     └─────────┬────────┘      └─────────┬────────┘
                                   │                         │
                                   ▼                         ▼
                         ┌────────────────────────────────────┐
                         │          packages/domain           │
                         └─────────────────┬──────────────────┘
                                           │
                                           ▼
                         ┌────────────────────────────────────┐
                         │            packages/db             │
                         └────────────────────────────────────┘
```

| Package / App | Layer | Primary Responsibility |
|---|---|---|
| `apps/web` | Application / BFF | Next.js routes, server components, API handlers, client pages. |
| `apps/worker` | Background Processing | Async media processing, EXIF stripping, retention purges, scheduled jobs. |
| `packages/domain` | Core Domain | Pure TypeScript domain entities, lifecycle state machines (`visible`/`hidden`/`deleted`), business rules. Zero external framework dependencies. |
| `packages/db` | Data Access | Database schemas, migrations, transactional repositories (PostgreSQL + Prisma/Drizzle). |
| `packages/api-contracts` | API Contracts | Zod validation schemas, OpenAPI specifications, shared DTO types. |
| `packages/ui` | Design System | Design tokens (Paper, Ink, Marigold, Evergreen), editorial typography, primitive components. |
| `packages/auth` | Authentication | Access code HMAC hashing, rate-limiting rules, scoped senior/admin sessions. |
| `packages/media` | Media Services | Direct-to-storage signed URL signatures, EXIF sanitization adapters, derivative specs. |
| `packages/observability` | Telemetry | Structured logging, metrics, error reporting, audit event formatters. |
| `packages/config` | Configuration | Type-safe environment variable validation and runtime settings. |

---

## 3. Layer Boundaries & Dependency Rules

1. **Unidirectional Dependency Flow:**
   - Dependencies MUST flow downward: `apps` $\rightarrow$ `packages/feature` $\rightarrow$ `packages/domain` $\rightarrow$ `packages/db`.
   - Lower-level packages (`@capsule/domain`) MUST NOT depend on higher-level packages (`@capsule/ui` or `apps/web`).

2. **Database Isolation Rule:**
   - UI components and page layouts MUST NOT import `@capsule/db` or ORM models directly.
   - All data fetching and mutations MUST go through domain use-cases or API route handlers.

3. **Framework Independence:**
   - `@capsule/domain` MUST remain 100% pure TypeScript. It MUST NOT import Next.js, React, Express, or database drivers.

---

## 4. Import Rules

1. **Path Alias Enforcement:**
   - All cross-package imports MUST use `@capsule/*` path aliases defined in `tsconfig.json`.
   - **Correct:** `import { colors } from '@capsule/ui';`
   - **Incorrect:** `import { colors } from '../../../packages/ui/src/tokens';`

2. **Explicit Public Exports:**
   - Packages expose public APIs strictly via their root `src/index.ts`. Internal package helpers MUST NOT be imported directly.

---

## 5. Future Extraction Strategy

If media volume or background processing requires independent scaling:

1. **Domain Partitioning:** All data and object storage keys are strictly partitioned by `capsule_id`.
2. **Outbox Event Pattern:** Domain events (e.g., `ContentSubmitted`, `MediaUploadFinalized`) are written to an transactional outbox table before being consumed by workers.
3. **Service Decoupling:** `apps/worker` can be split into dedicated microservices (e.g., `media-transcoder-service`) by consuming outbox events over a message broker (Redis/SQS) without modifying core domain policies.
