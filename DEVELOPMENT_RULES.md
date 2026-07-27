# Development Rules & Architectural Principles

These development rules govern all engineering work within **The Capsule** codebase. Every contributor and AI pair programmer must adhere strictly to these principles.

---

## 1. Domain Boundary Isolation

1. **No Database Access from UI Layer:**
   - React components and Next.js page components in `apps/web` MUST NOT import ORM/database modules directly.
   - All state mutations and queries MUST pass through domain use-cases in `@capsule/domain` or API handlers in `@capsule/api-contracts`.

2. **Framework-Free Domain Core:**
   - `@capsule/domain` MUST NOT depend on Next.js, React, Express, NestJS, or any database framework.
   - Domain logic, policies, and state transitions MUST be pure TypeScript functions/classes.

3. **Adapter Isolation:**
   - Third-party SDKs (S3, Redis, Mux, Cloudflare) MUST reside behind interface adapters in `@capsule/media`, `@capsule/auth`, or `@capsule/db`.

---

## 2. Security & Privacy Rules

1. **No Accounts for Seniors:**
   - Seniors enter exclusively using a valid rotating 8–10 character class access code.
   - Never introduce individual user login, email registration, password recovery, or personal profiles for senior contributors.

2. **Access Code Verification:**
   - Access codes MUST never be stored in plain text. Stored as salted HMAC/hashes only (`access_code_versions`).
   - Access code verification failures MUST return a neutral error message to prevent capsule enumeration.
   - Code rotation MUST immediately and atomically invalidate all prior code versions and revoke active senior sessions.

3. **Data Minimization:**
   - Never log raw access codes, session tokens, or personal message bodies in application telemetry or structured logs.
   - Image EXIF metadata (including GPS location and camera identifiers) MUST be stripped prior to public derivative generation.

---

## 3. Life Cycle State Integrity

1. **Explicit Life Cycle Enum:**
   - Content items MUST be in one of three lifecycle states: `visible`, `hidden`, or `deleted`.
   - `deleted` items MUST never be returned to any client application.
   - Soft-deleted items undergo permanent media purge from object storage within the designated safety retention SLA (30 days max).

2. **Archived Read-Only Freeze:**
   - An archived capsule disables all content creation and code rotation server-side.
   - Reopening an archived capsule requires an explicit, audited action.

---

## 4. Engineering Quality

1. **Append-Only Auditing:**
   - Every administrative action (code rotation, moderation state change, theme edit, archive state change) MUST append an entry to `audit_events`.
   - Audit event payloads must exclude secrets and raw personal message content.

2. **Idempotency:**
   - All state-changing API operations MUST accept an `Idempotency-Key` header to protect against network retries.

3. **Zero Symptom Patches:**
   - Fix underlying root causes rather than swallowing exceptions or returning dummy empty states.
