
The user wants me to test the book launch end-to-end. This is an explicit testing request, so browser automation is appropriate.

Test plan:
1. Navigate to `/book` — verify hero, pillars, chapters, bridge, form render
2. Switch language FR ↔ EN — verify translations load
3. Submit waitlist form with test data — verify Supabase insert + success toast
4. Navigate to `/` and dismiss the announcement banner — verify localStorage persistence
5. Open onboarding guide — verify new "I want to read the book" path routes to `/book`

Mobile viewport (390x591) is the current view, which matches a real user scenario.

Note: The form will write a real row to `book_preorders`. I'll use a clearly-marked test entry (`test+lovable@helloarchitekt.com`, name "Lovable Test") so you can identify and delete it later if you want.

Since this is a straightforward QA pass with no code changes planned, I'll execute it directly once you approve switching to default mode. If I find bugs along the way, I'll stop and report before fixing.

## What I'll do

1. `navigate_to_sandbox` → `/book` (mobile 390x591), screenshot, verify sections
2. Click language switcher → FR, screenshot, verify translated copy
3. Switch back to EN, fill the waitlist form (name, email, role, tier=Reader), submit, verify success toast + check Supabase row
4. Navigate to `/`, verify banner is visible, click X to dismiss, reload to confirm `localStorage` persistence
5. Trigger onboarding (or wait for auto-trigger), select "I want to read the book", verify redirect to `/book`

## Deliverable

A concise pass/fail report for each step, screenshots of key states, and a list of any bugs found (with proposed fixes if applicable).
