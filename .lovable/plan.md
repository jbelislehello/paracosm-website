## Spam Protection Audit + hCaptcha on Demo Form

### Current state (audit)

| Form | Submission path | Existing spam protection |
|---|---|---|
| `GetDemoDialog` (used on `/calm-magic-demo` and other CTAs) | Edge function `send-demo-request` → Resend | Honeypot (`website` field) + time-trap (≥2s) + per-IP/email in-memory rate limit (3/min) |
| `BookLaunch` newsletter | Direct Supabase insert | Honeypot + min time-on-page |
| `ContactSection`, `DriftLanding`, `ParacosmRetreatLanding` | `mailto:` links | N/A — no server endpoint, nothing to abuse beyond the user's own mail client |
| Auth forms (`CalmMagicAuth`, `GlitchAuth`) | Supabase Auth | Supabase built-in rate limiting + email confirmation |
| Internal app forms (PRD editor, Paracosm dashboard, etc.) | RLS-protected DB writes | Auth required (RLS) |

Only `GetDemoDialog` is a public, unauthenticated form that triggers an outbound email. It's the realistic abuse target. `BookLaunch` is also public but only writes a row — lower risk, already has honeypot.

### Recommendation

Add **hCaptcha** (free tier, privacy-friendly, no Google account required) as a third defense layer on `GetDemoDialog`, on top of the existing honeypot + time-trap + rate limit. Use the **invisible** variant so users only see a challenge if hCaptcha's risk score is high — no friction for legitimate users.

Skip captcha on `BookLaunch` for now (low-value target, honeypot sufficient) but add the same pattern there later if abuse appears.

### Why hCaptcha over reCAPTCHA

- No Google dependency; better aligned with the brand's privacy posture.
- Free tier is generous, no billing setup.
- Drop-in React component (`@hcaptcha/react-hcaptcha`).
- Server verification is a single POST to `https://api.hcaptcha.com/siteverify`.

### Implementation (3 changes)

**1. Secrets (user action required before deploy)**
- Sign up at https://www.hcaptcha.com/ → create a site → get **Site Key** (public) and **Secret Key** (private).
- Add **`HCAPTCHA_SECRET_KEY`** as a Supabase edge function secret.
- The Site Key is public; we'll store it in `.env` as `VITE_HCAPTCHA_SITE_KEY` (or hard-code — it's safe to expose).

**2. Frontend — `src/components/GetDemoDialog.tsx`**
- Install `@hcaptcha/react-hcaptcha`.
- Add invisible hCaptcha ref; on submit, call `captcha.execute()` to get a token before invoking the edge function.
- Send `captchaToken` in the body alongside existing fields.
- Show a friendly error if the captcha fails to load or returns no token.

**3. Edge function — `supabase/functions/send-demo-request/index.ts`**
- Add `captchaToken: z.string().min(10)` to `BodySchema` (required).
- Before honeypot/time-trap checks, POST to `https://api.hcaptcha.com/siteverify` with `secret=HCAPTCHA_SECRET_KEY` and `response=captchaToken` (and optionally `remoteip`).
- If `success !== true`, return 400 with `{ success: false, error: "Captcha verification failed" }`.
- Keep all existing layers (honeypot, time-trap, rate limit) — defense in depth.

### Verification
- Submit `/calm-magic-demo` form normally → 200, email arrives.
- Submit with browser devtools blocking hCaptcha script → friendly error.
- Submit via `curl` without `captchaToken` → 400.
- Edge function logs show no honeypot/time-trap/captcha trips for legitimate submissions.

### Files touched
- `src/components/GetDemoDialog.tsx` (add hCaptcha widget + token)
- `supabase/functions/send-demo-request/index.ts` (verify token)
- `package.json` (+ `@hcaptcha/react-hcaptcha`)
- `.env` (+ `VITE_HCAPTCHA_SITE_KEY`, after user provides site key)

### What I need from you before implementing
1. Confirm hCaptcha is acceptable (vs Cloudflare Turnstile or Google reCAPTCHA v3).
2. Once you've created the hCaptcha site, share the **Site Key** (public, paste in chat) and add the **Secret Key** to Supabase secrets when prompted.
