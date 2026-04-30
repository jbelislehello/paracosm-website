## Fix: Demo request form

### Problem
`supabase/functions/send-demo-request` posts to `https://connector-gateway.lovable.dev/resend` and fails with `401 Credential not found` because no Resend connector is registered in Lovable Cloud (this project uses an external Supabase). The `RESEND_API_KEY` secret is already configured.

### Change (1 file)
Edit `supabase/functions/send-demo-request/index.ts`:

1. Replace gateway constant:
   - `const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend"` → `const RESEND_API_URL = "https://api.resend.com"`
2. Drop the `LOVABLE_API_KEY` requirement (not needed when calling Resend directly).
3. Update the fetch call:
   - URL: `${RESEND_API_URL}/emails`
   - Headers: only `Content-Type` + `Authorization: Bearer ${RESEND_API_KEY}` (remove `X-Connection-Api-Key`).

Everything else stays as-is: zod validation, honeypot, time-trap, rate limit, recipient `jbelisle@helloarchitekt.com`, and `from: "Paracosm <onboarding@resend.dev>"` (works without a verified domain).

### Verification
After auto-deploy, submit the form on `/calm-magic-demo` and confirm a 200 + success toast. Check edge function logs to confirm no 401.

### Notes
- No DB changes, no new secrets.
- Other forms (`ContactSection`, `DriftLanding`, `ParacosmRetreatLanding` use `mailto:`; `BookLaunch` writes to DB only) don't need changes.
- Future option: verify `helloarchitekt.com` or `calm-magic.com` in Resend to send from a branded address.
