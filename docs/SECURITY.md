# Security & Privacy Guidelines

---

## 1. Threat Model Highlights

- **Access Code Brute Force / Enumeration:** Throttled at network and application layer. Failure messages MUST be generic.
- **Unauthorized Media Access:** Object storage buckets are private. Access requires short-lived signed CDN URLs generated only for valid sessions.
- **XSS & Injection:** All user-supplied text (display names, captions, memories) MUST be sanitized and HTML-encoded.
- **CSRF & Session Hijacking:** Sessions stored in HTTP-only, `SameSite=Strict`, `Secure` cookies. State-changing APIs require CSRF verification.

---

## 2. Sensitive Data & Logging Controls

- **NEVER** log raw access codes, session tokens, or unhashed IP addresses.
- IP addresses and user agents must be stored as salted cryptographic hashes.
- Image EXIF metadata (GPS coords, device ID) MUST be stripped prior to public derivative storage.
