# Environment Variables Documentation

This document describes all environment variables required for **The Capsule** in production.

---

## Required Environment Variables

| Variable Name | Description | Example |
|---|---|---|
| `NODE_ENV` | Application environment (`development`, `staging`, `production`) | `production` |
| `PORT` | Web application port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/capsule_db` |
| `REDIS_URL` | Redis connection string for rate limiting & job queues | `redis://localhost:6379` |
| `S3_MEDIA_BUCKET` | AWS S3 / Object Storage bucket name for private media | `the-capsule-media-prod` |
| `S3_REGION` | AWS region for object storage | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | IAM credentials for media storage | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `CODE_HMAC_SALT` | Secret salt for hashing senior access codes at rest | `random_secret_salt_string_32chars` |
| `COOKIE_SECRET` | Secret key for signing HTTP-only session cookies | `random_cookie_secret_64chars` |
