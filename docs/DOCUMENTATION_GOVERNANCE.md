# Documentation Governance

This document defines rules for maintaining, updating, and governing documentation for **The Capsule**.

---

## 1. Documentation as Code

- All documentation is kept alongside code in Markdown (`.md`) format.
- Documentation updates MUST accompany code changes in the same Pull Request.
- Broken links or stale code references in documentation are treated as build failures.

---

## 2. ADR Lifecycle

1. Any non-trivial architectural change (e.g. changing storage providers, session tokens, or caching layer) requires a new ADR.
2. ADRs follow the template at [`docs/adr/template.md`](file:///C:/Users/ASUS/.gemini/antigravity/scratch/the-capsule/docs/adr/template.md).
3. Once accepted, ADRs are immutable. If superseded, create a new ADR and update the original status to `Superseded by ADR XXXX`.

---

## 3. Runbooks & API Docs

- Runbooks in `docs/runbooks/` must cover operational incidents (e.g., emergency code revocation, DB PITR restore, data purge request).
- API documentation is generated from Zod / OpenAPI contracts defined in `@capsule/api-contracts`.
