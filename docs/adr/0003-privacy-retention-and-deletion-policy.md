# ADR-003: Privacy, Data Retention & Content Deletion Policy

* **Status:** Proposed for Review
* **Date:** 2026-07-27
* **Authors:** Engineering & Security Team
* **Decider(s):** Product, Security & Legal Lead

---

## Context & Problem Statement

Senior contributors submit photos, videos, written memories, and messages anonymously with self-entered display names.
Content lifecycle management (`visible`, `hidden`, `deleted`) must balance immediate moderation needs (hiding inappropriate uploads instantly), accidental deletion recovery, minor safety compliance, and permanent media purging from cloud storage.

---

## Decision Drivers

1. **Moderation Speed:** Admin must hide problematic items in under 30 seconds.
2. **Reversibility vs. Irreversibility:** Hiding must be instantly reversible; permanent deletion must be irreversible after a documented safety window.
3. **Data Minimization & Minor Safety:** Original camera EXIF metadata (GPS coordinates, camera serial numbers, device details) MUST NOT be exposed publicly.
4. **Auditability:** Moderation and deletion events must leave immutable audit entries without preserving private message bodies indefinitely.

---

## Considered Options

### Option 1: Immediate Hard Deletion from Storage and DB
When an Admin clicks delete, database rows and object storage files are deleted immediately and synchronously.

- **Pros:** Instant data removal.
- **Cons:** Zero recovery from accidental deletion or compromised admin sessions. High risk of data loss. Synchronous cloud storage API calls slow down admin responses.

### Option 2: Soft Delete with 30-Day Purge Queue SLA + Automatic EXIF Sanitization (Recommended)
Content moves through explicit lifecycle states:
- `visible`: Returned to authorized senior browse/search APIs.
- `hidden`: Hidden from seniors; accessible in Admin Content Manager for restoration.
- `deleted`: Excluded from all product APIs immediately. Queued in `deletion_jobs` for permanent purge from object storage (S3) within a 30-day safety SLA window.

- **Pros:** Fast admin response; instant removal from public view; safety window to recover accidental deletions; background async purging of binary assets; automatic stripping of EXIF metadata upon upload processing.
- **Cons:** Requires background worker queue (`apps/worker`) to process deletion jobs.

### Option 3: Indefinite Data Retention
Keep all uploads and originals indefinitely, even when deleted by Admin.

- **Pros:** Simple data management.
- **Cons:** Severe privacy violation; non-compliant with data minimization standards and minor safety expectations; high object storage costs.

---

## Decision Outcome

**Chosen Option:** **Option 2 (Soft Delete with 30-Day Purge Queue SLA + Automatic EXIF Sanitization)**.

### Rationale
Option 2 enforces immediate content moderation while guarding against catastrophic accidental data loss. Media uploads undergo EXIF stripping during processing before derivative storage. Deletion jobs execute idempotently in background workers within 30 days.

### Audit & Retention Rules:
- IP addresses and user agents stored ONLY as salted hashes (`participant_handles`).
- Audit log records moderation events with timestamp, actor ID, action type, and optional reason code, redacting message text.

---

## Compliance & Verification

- Verified by domain state machine tests in `@capsule/domain` enforcing valid status transitions (`visible` $\rightarrow$ `hidden` $\rightarrow$ `visible`, `visible`/`hidden` $\rightarrow$ `deleted`).
- Background worker tests verifying binary purge from object storage upon executing `deletion_jobs`.
