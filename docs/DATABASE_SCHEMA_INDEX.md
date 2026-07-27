# Database Schema Index — The Capsule

---

## Production PostgreSQL Tables (`packages/db/src/schema/schema.sql`)

| Table Name | Primary Key | Foreign Keys | Key Purpose |
|---|---|---|---|
| `capsules` | `id` (UUID) | `cover_media_id` | Capsule metadata, state (`draft`/`active`/`archived`/`deleted`), accent theme, welcome text. |
| `admin_identities` | `id` (UUID) | `capsule_id` (CASCADE) | Passwordless admin email & recovery secret hash (`recovery_secret_hash`). Exactly 1 active per capsule. |
| `admin_sessions` | `id` (UUID) | `admin_id`, `capsule_id` | Admin HTTP-only session ledger, expiration, IP/UA hashes, re-authentication timestamp. |
| `access_code_versions` | `id` (UUID) | `capsule_id` (CASCADE) | Salted HMAC code verifier hash, generation counter. Unique partial index on active version. |
| `senior_sessions` | `id` (UUID) | `capsule_id`, `code_version_id` | Scoped senior ephemeral session ledger (24h TTL). Revoked upon code rotation. |
| `participant_handles` | `id` (UUID) | `capsule_id`, `session_id` | Accountless author display name (raw & normalized). |
| `content_items` | `id` (UUID) | `capsule_id`, `author_handle_id` | Core content items (`photo`, `video`, `memory`, `message`), status (`visible`, `hidden`, `deleted`), moment date. |
| `media_assets` | `id` (UUID) | `capsule_id`, `content_item_id` | Binary asset metadata, SHA-256, 9-state lifecycle status (`Requested` $\rightarrow$ `Purged`), storage key. |
| `media_variants` | `id` (UUID) | `media_asset_id` | Derived media assets (`thumbnail`, `display`, `full`, `video_poster`, `hls_manifest`, `mp4_fallback`). |
| `tags` | `id` (UUID) | `capsule_id` | Class collection tags (unique normalized label per capsule). |
| `content_tags` | Composite | `content_item_id`, `tag_id` | Join table between content items and tags. |
| `audit_events` | `id` (UUID) | `capsule_id` (CASCADE) | Immutable append-only audit trail (`actor_type`, `action`, `target_type`, `target_id`). |
| `deletion_jobs` | `id` (UUID) | `capsule_id` | 30-day soft-delete purge queue SLA tracking. |
