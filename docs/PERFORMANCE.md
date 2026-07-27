# Performance Guidelines & Service Level Objectives

---

## 1. Key Performance Metrics (SLOs)

| Metric | Target | Focus Area |
|---|---:|---|
| **Largest Contentful Paint (LCP)** | `<= 2.5s` (p75 mobile) | Core browse & cover pages |
| **API Response Time** | `p95 <= 400ms` | Excluding media blob transfers |
| **Upload Finalize Processing** | `<= 5.0s` | Virus scan & thumbnail intent generation |
| **Availability Target** | `99.9%` monthly | Browse & API services |

---

## 2. Optimization Principles

1. **Direct-to-Store Uploads:** Media is uploaded directly to object storage via short-lived signed URLs, bypassing application web servers.
2. **Responsive Image Derivatives:** Serve WebP/AVIF variants scaled to viewport size rather than raw originals.
3. **Cursor Pagination:** All list/gallery APIs use cursor-based pagination with strict limits to prevent large payload bottlenecks.
