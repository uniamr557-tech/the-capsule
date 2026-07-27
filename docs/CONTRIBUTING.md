# Contributing Guidelines

Thank you for contributing to **The Capsule**!

---

## 1. Branch & Commit Workflow

- **Branch Naming:** `feat/feature-name`, `fix/bug-description`, `docs/doc-update`.
- **Commit Messages:** Follow Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).

---

## 2. Pull Request Requirements

Before submitting a Pull Request, ensure:
1. `pnpm lint` passes with 0 errors.
2. `pnpm typecheck` compiles clean across all packages.
3. `pnpm test` runs and passes all unit/integration tests.
4. Relevant documentation in `docs/` is updated.
