# Pilot Launch & Readiness Checklist

---

## 🚀 Pilot Launch Gate Criteria (1–3 Pilot Classes)

1. **Senior Admin Recovery Secret:** Hashed and saved securely in vault.
2. **Access Code Salt:** `CODE_HMAC_SALT` initialized in production environment.
3. **Storage Bucket & CDN:** Private S3 bucket and signed CDN URL domain configured.
4. **Worker Readiness:** `apps/worker` background engine active for virus scanning and soft-delete purge.
5. **Support Playbook:** Support escalation contact pathways defined.
