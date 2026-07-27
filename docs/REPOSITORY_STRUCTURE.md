# Repository Structure Summary

```text
the-capsule/
├─ .github/
│  └─ workflows/
│     ├─ ci.yml                          # GitHub Actions CI (lint, typecheck, test)
│     └─ cd.yml                          # Production CD pipeline
├─ apps/
│  ├─ web/                               # Next.js 14 web app, routes & components
│  │  ├─ src/
│  │  │  ├─ app/                        # App Router pages & API handlers
│  │  │  ├─ components/                 # UI primitives, senior & admin components
│  │  │  ├─ hooks/                      # Custom hooks (useContentCollection)
│  │  │  └─ lib/                        # Session & service adapters
│  │  └─ middleware.ts                  # Security CSP & cookie middleware
│  └─ worker/                            # Async background worker engine
├─ packages/
│  ├─ domain/                            # Pure domain entities, state machines & interfaces
│  ├─ db/                                # PostgreSQL schema & repository implementations
│  ├─ api-contracts/                     # OpenAPI & Zod DTO contracts
│  ├─ ui/                                # Design token foundation (palette, type, spacing)
│  ├─ auth/                              # Session hashing & authorization policies
│  ├─ media/                             # Storage adapters & processing contracts
│  ├─ observability/                     # Logging & metrics conventions
│  └─ config/                            # Environment configuration loading
├─ infrastructure/
│  ├─ terraform/                         # AWS S3 & IAM Terraform modules
│  └─ monitoring/                        # Prometheus / CloudWatch alerts
├─ docs/
│  ├─ adr/                               # ADRs 0001 through 0005
│  ├─ runbooks/                          # Operations & onboarding runbooks
│  ├─ SYSTEM_ARCHITECTURE.md
│  ├─ REPOSITORY_STRUCTURE.md
│  └─ DATABASE_SCHEMA_INDEX.md
├─ tests/
│  ├─ domain/                            # Unit tests (state machines & policies)
│  ├─ integration/                       # API route integration tests
│  ├─ e2e/                               # Playwright E2E guidelines
│  └─ fixtures/                           # Test data fixtures
├─ ARCHITECTURE.md                       # Modular monolith architectural guide
├─ DEVELOPMENT_RULES.md                  # Strict domain boundary rules
├─ ENV_VARIABLES.md                      # Environment variables reference
├─ Dockerfile                            # Multi-stage production build Dockerfile
├─ docker-compose.yml                    # Production docker-compose orchestration
├─ README.md                             # Monorepo overview
├─ CHANGELOG.md                          # Release history
├─ RELEASE_NOTES.md                      # Version 1.0.0 feature notes
└─ VERSION.md                            # Version tag file (v1.0.0)
```
