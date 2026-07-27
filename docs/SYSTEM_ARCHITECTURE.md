# System Architecture Summary — The Capsule

This document outlines the end-to-end system architecture of **The Capsule v1.0.0**.

---

## 1. Modular Monolith Topology

```text
                                  ┌───────────────────────────┐
                                  │   Browser Client (Web)    │
                                  └─────────────┬─────────────┘
                                                │ HTTPS + Cookies
                                                ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ Next.js Web App (apps/web)                                                              │
│                                                                                         │
│  ├─ App Router Pages (RSC + Client Components)                                         │
│  ├─ API Route Handlers (/api/v1/*)                                                      │
│  └─ Security Middleware (CSP, HSTS, SameSite Cookie Enforcement)                        │
└───────────────────────────────┬───────────────────────────────┬─────────────────────────┘
                                │                               │
                                ▼                               ▼
┌──────────────────────────────────────────────────┐ ┌────────────────────────────────────┐
│ Domain & Auth Packages                           │ │ Infrastructure Adapters            │
│                                                  │ │                                    │
│  ├─ @capsule/domain (Entities & Lifecycle)       │ │  ├─ @capsule/db (PostgreSQL Repos) │
│  ├─ @capsule/auth (Session & Policy Rules)       │ │  ├─ @capsule/media (S3 Adapters)   │
│  ├─ @capsule/ui (Design System Tokens)          │ │  └─ @capsule/observability (Logs)  │
│  └─ @capsule/api-contracts (Zod Schemas)         │ │                                    │
└──────────────────────────────────────────────────┘ └─────────────────┬──────────────────┘
                                                                       │
                                                                       ▼
                                                     ┌────────────────────────────────────┐
                                                     │ Async Worker Engine (apps/worker)  │
                                                     │                                    │
                                                     │  ├─ EXIF Stripper & Image Variants │
                                                     │  ├─ Virus Scanner                  │
                                                     │  ├─ Soft-Delete Purge SLA Queue    │
                                                     │  └─ Scheduled Code Rotation Ticker │
                                                     └────────────────────────────────────┘
```

---

## 2. Security Boundaries & Session Architecture

- **Senior Access:** 8-character code $\rightarrow$ salted HMAC hash verifier $\rightarrow$ 24-hour HTTP-only `SameSite=Strict` cookie (`senior_sessions`).
- **Admin Access:** Passwordless magic link / 8-character recovery secret $\rightarrow$ 12-hour HTTP-only cookie (`admin_sessions`) with mandatory re-authentication for destructive actions.
- **Media Upload Security:** Direct-to-S3 uploads bypass web app servers. Objects are uploaded into `quarantine/` until virus scan and EXIF sanitization complete.
