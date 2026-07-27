# ADR-002: Senior Access Code Strategy

* **Status:** Proposed for Review
* **Date:** 2026-07-27
* **Authors:** Engineering & Security Team
* **Decider(s):** Product & Security Lead

---

## Context & Problem Statement

Graduating seniors access their class capsule without creating individual user accounts or personal profiles. Access is granted via a shared class access code.
The code strategy must balance mobile usability (students entering the code on phones) with cryptographic safety against brute-force guessing, unauthorized distribution, and enumeration attacks.

---

## Decision Drivers

1. **Usability:** 8–10 characters, easy to read and type on mobile keypads without ambiguous characters (`0`/`O`, `1`/`I`/`l`).
2. **Security at Rest:** Access codes MUST NOT be stored in cleartext.
3. **Revocation Unambiguity:** Code rotation must immediately invalidate earlier codes and revoke active senior sessions.
4. **Abuse Mitigation:** Throttling code submission attempts to prevent automated dictionary attacks.
5. **Privacy:** Neutral error responses to prevent discovering whether a capsule exists.

---

## Considered Options

### Option 1: 4-Digit Numeric PIN
A simple 4-digit code (e.g. `2026`).

- **Pros:** Extremely easy to type.
- **Cons:** Only 10,000 combinations ($10^4$). Trivial to brute-force in seconds; high risk of cross-capsule collision.

### Option 2: 8–10 Character Non-Ambiguous Alphanumeric Code + Salted HMAC at Rest + Atomic Session Revocation (Recommended)
Generate cryptographically random 8–10 character strings using a sanitized character set (`23456789ABCDEFGHJKLMNPQRSTUVWXYZ`), stored as salted HMAC hashes in `access_code_versions`. Upon rotation, invalidates all prior versions and deletes active `senior_sessions`.

- **Pros:** Over $3.5 \times 10^{12}$ combinations ($\sim 41$ bits entropy). Easy to type on mobile keypads. Cryptographically secure hash at rest. Atomic revocation cleanly invalidates prior student access.
- **Cons:** Admin must distribute the new code to classmates when rotated.

### Option 3: Individual Per-Student Single-Use Invites / Tokens
Generate unique single-use magic tokens for every student in the class.

- **Pros:** Per-student access tracking.
- **Cons:** Violates PRD non-goal of no rosters, emails, or student account management. Adds massive operational friction for Senior Admin.

---

## Decision Outcome

**Chosen Option:** **Option 2 (8–10 Character Non-Ambiguous Code + Salted HMAC at Rest + Atomic Session Revocation)**.

### Rationale
Option 2 fulfills all security requirements without imposing account management or roster uploads on the Senior Admin. The non-ambiguous character set prevents user error on mobile keyboards, while salted HMAC hashes protect code secrecy if database backups are compromised.

### Security Controls Enforced:
- **Rate-Limiting:** Maximum 5 failed attempts per IP per 15 minutes with exponential backoff.
- **Neutral Response:** Invalid codes return `401 Unauthorized` with the generic message: *"That code isn't active. Ask your Senior Admin for the current one."* (never revealing whether the slug exists).
- **Atomic Rotation:** Creating a new code sets `revoked_at` on previous code versions and deletes associated `senior_sessions`.

---

## Compliance & Verification

- Verified by domain unit tests in `@capsule/auth` checking HMAC hash generation and session revocation state machine.
