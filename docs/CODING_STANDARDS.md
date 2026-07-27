# Coding Standards & Guidelines

---

## 1. TypeScript Standards

- **Strict Mode:** `strict: true` is enforced across all packages.
- **Explicit Types:** Use explicit return types for exports and API boundary functions.
- **No `any`:** `any` is forbidden. Use `unknown` with type narrowing guards where dynamic typing is required.
- **Immutability:** Prefer `readonly` arrays and properties where state mutations are prohibited.

---

## 2. React & Next.js Guidelines

- **Server Components First:** Default to React Server Components (RSC) for data fetching and layout structure. Use `'use client'` strictly for interactive client primitives.
- **No Direct DOM Mutation:** Never mutate third-party DOM properties or window state directly.
- **Clean Component Props:** Use explicitly defined TypeScript interfaces for component props.

---

## 3. Formatting & Linting

- Prettier rules (`.prettierrc`): 2 spaces, trailing commas (`all`), single quotes, 100 character print width.
- ESLint rules: Unused variables marked with `_` ignored; console logs allowed for `warn` and `error` only.
