# Known Limitations & v1 Scope Boundaries

This document outlines intentional design boundaries and known limitations for v1 of **The Capsule**.

---

## 1. Intentional Non-Goals (PRD v1)

- **No Self-Service Post Editing:** Content is immutable post-submission (ADR-0004). Authors must contact Admin to hide an item and re-submit.
- **No Direct Messaging or Likes:** Deliberately omitted to prevent social comparison and feed mechanics.
- **No Self-Service Admin Transfer:** Capsule owner transfer is performed via audited support operations.
- **English Language Only at Launch:** Localization architecture is supported, but initial strings are English-only.

---

## 2. Technical Thresholds

- **Maximum Upload Sizes:** 15 MB for photos, 100 MB for videos.
- **Maximum Character Limits:** 500 characters for class messages, 10,000 characters for written memories.
- **Senior Session TTL:** 24 hours (requires entering active class code upon expiration).
