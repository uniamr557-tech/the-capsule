# Operations & Monitoring Guide

---

## 1. Post-Launch Monitoring Dashboards

Monitor the following key metrics in production:

| Area | Metric Name | Warning Threshold | Alert Action |
|---|---|---|---|
| **API Health** | `http_requests_failed_total` | $> 0.5\%$ | Inspect server error logs; verify DB pool connection limit. |
| **Media Uploads** | `media_upload_failed_total` | $> 1.0\%$ | Check S3 signed URL expiration & client upload size limits. |
| **Worker Lag** | `worker_queue_depth` | $> 100$ jobs | Scale `apps/worker` instance pool. |
| **Database** | `db_connection_active` | $> 80\%$ pool | Scale PostgreSQL read replicas or increase connection pool. |
| **Security** | `access_code_failed_attempts` | $> 50 / 5\text{min}$ | Rate-limiter auto-throttling active. Verify no brute force surge. |

---

## 2. Emergency Operational Runbooks

- **Emergency Access Code Revocation:** Log into Admin Studio $\rightarrow$ Access Code Studio $\rightarrow$ Click **Rotate Access Code Now**.
- **Urgent Content Removal:** Log into Admin Studio $\rightarrow$ Content Manager $\rightarrow$ Click **Permanent Delete**.
- **Database Point-in-Time Restore (PITR):** Execute PostgreSQL restore script against last automated snapshot.
