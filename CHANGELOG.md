# Changelog

All notable changes to **The Capsule** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-27

### Added
- **Core Domain & Security Engine:**
  - Salted HMAC access code generation & verification (`23456789ABCDEFGHJKLMNPQRSTUVWXYZ` non-ambiguous set).
  - Atomic access code rotation with immediate senior session invalidation.
  - Scoped HTTP-only `SameSite=Strict` session cookies for seniors.
  - Passwordless magic link & one-time hashed recovery secret authentication for Senior Admins (ADR-0001, ADR-0002).
- **Content Lifecycle & Moderation Engine:**
  - Immutable content model post-submission for authors (ADR-0004).
  - Explicit lifecycle states (`visible`, `hidden`, `deleted`) with 30-day soft-delete purge queue SLA (ADR-0003).
  - Content Manager moderation queues and bulk actions in Senior Admin Studio.
  - Append-only `audit_events` logging for code rotations, moderation, and state transitions.
- **Media Storage & Pipeline Infrastructure:**
  - Direct-to-storage signed URL upload intent architecture (S3 / R2 provider-agnostic).
  - EXIF metadata stripping policy and responsive WebP/AVIF image derivative specs (320w, 1200w, 2048w).
  - Video poster frame extraction, HLS manifest generation, and MP4 fallback contracts.
  - Background worker engine (`apps/worker`) executing virus scanning and 30-day purge SLA jobs.
- **Presentation Layer & Editorial Design System:**
  - Paper (`#F7F4EE`) & Ink (`#1D1C1A`) editorial palette with curated theme accents (`Marigold`, `Lake Blue`, `Lilac`, `Poppy`, `Evergreen`).
  - `DM Serif Display` & `Inter` Google Fonts typography system.
  - Senior views: Ceremonial code entry threshold (`/`), Homepage Hero, Masonry Gallery (`/gallery`), Story Timeline (`/timeline`), Written Memories Reader (`/memories`), Class Messages Stream (`/messages`), Search & Tag Filtering (`/search`).
  - Dark `MediaViewer` modal for photo zoom and video playback.
  - 4-step `UploadWizard` contribution workflow.
  - Senior Admin Studio console: Overview Dashboard, Content Manager, Access Code Studio, Appearance Studio, Archive Controls, Audit Log.
- **Production Infrastructure & Database Schema:**
  - 13 PostgreSQL production tables (`schema.sql`), foreign keys, partial unique indexes, and cascading rules.
  - Concrete PostgreSQL repositories (`@capsule/db`).
  - REST API route handlers (`/api/v1/*`) and observability health endpoint (`/api/v1/health`).
  - Security headers, CSP middleware (`apps/web/middleware.ts`), multi-stage `Dockerfile`, and `docker-compose.yml`.
