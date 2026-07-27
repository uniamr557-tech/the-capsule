# ADR-001: Admin Authentication & Recovery Strategy

* **Status:** Proposed for Review
* **Date:** 2026-07-27
* **Authors:** Engineering & Security Team
* **Decider(s):** Product & Security Lead

---

## Context & Problem Statement

The Senior Admin ("Maya") creates the capsule, configures branding, distributes the class access code, and moderates content.
The Capsule PRD explicitly dictates that the product **MUST NOT** include individual user accounts, password recovery systems, or public user profiles. However, the Admin must have a secure, resilient, and non-friction authentication and recovery mechanism to perform administrative tasks without risking capsule lock-out or administrative takeover.

---

## Decision Drivers

1. **Security:** Phishing resistance, session revocation, protection against admin impersonation or brute-force takeover.
2. **Product Alignment:** Avoid building a full identity/user account system; keep admin setup under 10 minutes.
3. **Recovery Reliability:** Admin lock-out recovery must be reliable if the admin changes mobile devices or clears browser data.
4. **Auditability:** Every administrative authentication and credential event must generate an immutable audit log entry.

---

## Considered Options

### Option 1: Permanent Static Admin Link (URL Secret Key)
A unique secret token in the URL path (e.g. `/admin/capsule-slug?key=secret_token_123`) grants permanent administrative access.

- **Pros:** Zero friction, no email sending required.
- **Cons:** High security vulnerability. Easily leaked via browser history, shoulder surfing, shoulder screenshots, or accidental copy-paste. Cannot revoke individual sessions or enforce re-authentication for destructive actions.

### Option 2: Passwordless Magic Links + One-Time Hashed Recovery Secret (Recommended)
Admin authentication uses passwordless email magic links combined with an HTTP-only secure cookie session (`admin_sessions`). Upon capsule creation, an emergency recovery key is displayed once and hashed at rest (`admin_identities.recovery_secret_hash`).

- **Pros:** Strong security baseline, revocable session cookies, phishing resistance, device listing/invalidation, re-authentication challenge for destructive actions (permanent deletion, code rotation, archive freeze).
- **Cons:** Requires transactional email integration for magic links.

### Option 3: Third-Party OAuth / Federated IdP (Google / Apple / School SSO)
Authenticate Admin via external OAuth 2.0 / OIDC provider.

- **Pros:** Outsources authentication security and password recovery entirely to Google/Apple.
- **Cons:** School email domains often restrict third-party OAuth apps for high school students. Violates self-contained capsule positioning.

---

## Decision Outcome

**Chosen Option:** **Option 2 (Passwordless Magic Links + One-Time Hashed Recovery Secret)**.

### Rationale
Option 2 balances security, simplicity, and compliance with non-goals. The Admin identity is anchored to a verified email address via magic links, while an emergency one-time recovery key is stored strictly as a cryptographic hash (`SHA-256` / `Argon2id`). Sessions are scoped to HTTP-only cookies with short TTLs (12 hours) and mandatory re-authentication for destructive actions.

### Trade-offs & Consequences
- **Positive:** No passwords stored; robust session revocation; audit-logged admin activity.
- **Negative:** Dependent on transactional email delivery; admin must store recovery secret securely at setup.

---

## Compliance & Verification

- Verified in code by ensuring `admin_identities` stores only `recovery_secret_hash` (never plain tokens).
- Route handlers enforce `AdminSession` claim checks on all `/admin/*` routes.
