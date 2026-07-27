# Incident Response & Emergency Procedures

---

## 1. Emergency Code Revocation (Compromised Code)

If an access code is posted on public social media or distributed to non-seniors:

1. **Step 1:** Admin logs into Admin Studio $\rightarrow$ Access Code Studio.
2. **Step 2:** Click **Rotate Access Code Now** and confirm.
3. **Step 3:** System atomically revokes prior code and deletes active senior sessions.
4. **Step 4:** Distribute new code strictly through internal senior class channel.

---

## 2. Emergency Data Purge (Legal Removal Request)

If an urgent removal request is issued by school administration or legal counsel:

1. Admin locates content item in Content Manager and clicks **Permanent Delete**.
2. Run manual background worker deletion job: `pnpm --filter @capsule/worker start --purge-now`.
3. Verify binary objects removed from S3 bucket quarantine/original prefixes.
