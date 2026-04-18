
The user wants me to test the /book pre-order flow end-to-end after the RLS policy change. This is a verification task using browser automation — explicitly requested by the user ("Submit a test pre-order... to confirm").

Plan:

1. Navigate to `/book` in the preview.
2. Scroll to the waitlist form section.
3. Fill in valid data:
   - Name: "Test User"
   - Email: "test+preorder@helloarchitekt.com"
   - Role: "Founder"
   - Tier: "Reader" (valid per new policy: reader|practitioner|org)
4. Wait >2s before submitting (honeypot min-time guard).
5. Submit and verify the success state appears (`form_success_title`).
6. Confirm the row landed in `book_preorders` via a `supabase--read_query` SELECT on the most recent row matching the test email.
7. Clean up the test row so admin inbox stays clean.
8. Report result: pass/fail, with what was checked (UI success state + DB row insert + cleanup).

If the policy rejects the insert, the form will show `form_error_title` — I'll capture the console/network error and report exactly which CHECK clause failed.

This requires default mode (browser tools + DB write for cleanup).
