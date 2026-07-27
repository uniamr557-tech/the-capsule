# Deployment & Operations Verification Checklist

---

## 🛠️ Pre-Deployment Gate Checks

- [x] **Monorepo Build:** `pnpm build` completes clean across `@capsule/web`, `@capsule/worker`, and `@capsule/domain`.
- [x] **TypeScript Validation:** `pnpm typecheck` returns 0 errors.
- [x] **Linting:** `pnpm lint` passes zero warnings/errors.
- [x] **Database Schema:** `schema.sql` applied with all 13 PostgreSQL production tables, foreign keys, and indexes.
- [x] **Environment Variables:** All required variables configured according to `ENV_VARIABLES.md`.
- [x] **Security Headers:** CSP, HSTS, X-Frame-Options, SameSite HTTP-only cookies verified.
- [x] **Health Check:** `GET /api/v1/health` returns `200 OK` with `status: healthy`.
