# Relational Intelligence Assessment — a second, plain-language questionnaire

The existing Calm Magic Readiness Assessment stays exactly as it is: same tiles, same scoring, same PDF, same share links, same route behaviour. This plan adds a **separate, parallel questionnaire** written in ordinary professional language for team leaders and coaches who don't know the Paracosm vocabulary — plus a short onboarding that tells them what they're doing and why.

## 1. Chooser page at /readiness

`/readiness` becomes a two-card entry screen:

```text
+---------------------------------+  +---------------------------------+
| Relational Intelligence         |  | Calm Magic Readiness            |
| For team leaders & coaches      |  | For Paracosm practitioners      |
| ~12 min · 30 questions          |  | ~45 min · 5 seasons · 320 tiles |
| Plain language, no jargon       |  | Full ontological diagnostic     |
| [ Start ]                       |  | [ Continue / Start ]            |
+---------------------------------+  +---------------------------------+
```

- Existing assessment moves to `/readiness/calm-magic` (old `/readiness` deep links redirect to the chooser; nothing is deleted).
- New assessment lives at `/readiness/relational`.
- Both cards show whether an in-progress session exists.
- Bilingual (EN default, FR via the existing language toggle), consistent with the rest of the site.

## 2. The Relational Intelligence questionnaire

Its own question set — not a re-labelling of the 320 tiles. Five dimensions, six questions each (30 total, 5-point agreement scale, one optional open reflection per dimension):

| Dimension | What it measures (plain wording) |
| --- | --- |
| Self-awareness | Noticing your own state, triggers, and impact before acting |
| Attunement | Reading other people's signals and adjusting to them |
| Co-regulation | Helping a group settle under pressure instead of escalating it |
| Repair | Naming ruptures and restoring trust after conflict |
| Boundaries & consent | Holding limits clearly while staying in relationship |

Each question is answered on two lenses the user actually understands:
- **Me** — how true this is for you personally.
- **My team** — how true this is of the group you lead or coach.

Results give: a score per dimension (0–100) for Me and Team, the gap between them with a plain-English reading ("your team is ahead of you here", "you're carrying this alone"), a strongest/weakest dimension callout, and two suggested next practices per low dimension. No Paracosm terms anywhere in the user-facing copy.

Results page reuses the existing visual language, and gets the same **Export PDF** and **secure share link** features as the Calm Magic version.

## 3. Onboarding — 3-step modal

Shown before the first question, dismissible, remembered per user (localStorage, same pattern as the existing tour hook):

1. **What this is** — a 12-minute map of how you and your team handle connection, pressure, and conflict. Not a performance review; nothing is scored against a benchmark.
2. **What you'll get** — five dimension scores for you and your team, where the two diverge, your strongest lever, and a short set of practices to try next.
3. **How it works** — 30 questions, two quick answers each, saves automatically, resume anytime, export as PDF or share privately.

A "How this works" button in the header reopens it at any point.

## 4. Cross-linking

- `/products` Readiness Platform card gains a second CTA for the Relational Intelligence version.
- Homepage hero CTA points to the chooser at `/readiness` (already does).
- Each assessment's intro links to the other ("Looking for the deeper Paracosm diagnostic?" / "Want a shorter, plain-language version?").

## Technical notes

- **Database:** one migration adding `relational_sessions` and `relational_answers` (mirroring the existing readiness tables: user-scoped, RLS, GRANTs to `authenticated` + `service_role`, `updated_at` trigger). Answers store `dimension_id`, `question_id`, `self_answer_index`, `team_answer_index`, `open_text`. The existing `readiness_sessions` / `readiness_answers` tables are untouched.
- **Content:** `src/data/relational/dimensions.json` holds the 30 questions with EN and FR strings.
- **Logic:** `src/lib/relational/{types,scoring,data}.ts` — its own simple scoring (mean of 1–5 answers normalized to 100, no zone weighting), its own gap interpretations in plain language.
- **UI:** `src/pages/ReadinessChooser.tsx`, `src/pages/RelationalAssessment.tsx`, `src/components/relational/{OnboardingModal,QuestionCard,DimensionResultCard}.tsx`. Existing readiness components and `exportPdf.ts` are reused where they generalize; a `exportRelationalPdf` variant handles the different shape.
- **Sharing:** reuses the two existing edge functions by storing a frozen snapshot in `readiness_shares` with a `kind` marker, so `/r/:shareId` renders either report. No new edge functions.
- **Analytics:** new events `relational_assessment_viewed / started / completed`, plus `readiness_variant_selected` on the chooser, so the existing `/admin/readiness-funnel` report can be split by variant.
- **Routes in App.tsx:** `/readiness` (chooser, public), `/readiness/relational` and `/readiness/calm-magic` (both protected, as today).

## Scope boundary

No changes to the tile content, scoring math, PDF layout, or share flow of the existing Calm Magic assessment beyond moving its route and adding a link back to the chooser.
