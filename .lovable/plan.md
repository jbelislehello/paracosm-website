## Trainings (Formations) — GL!TCH · Drift · Tune

Three sellable 60h trainings, one per playbook, each teaching organizations to adapt AI to their productivity style and data maturity through sequenced Crewdle platform mastery.

### Narrative spine

| Training | Hours | Crewdle focus | Maturity stage taught |
|---|---|---|---|
| GL!TCH Formation — *Naming the AI Moment* | 60h | **Crewdle Core** — unified LLM, workflow & agent platform, model-agnostic, preserving enterprise project memory & context | Foundations: AI in industrial society + first contact with a maturity-aware unified platform |
| Drift Formation — *Co-Assisted Exploration* | 60h | **Crewdle Build** + **Lovable** | Intermediate: co-assisted development of apps and systems |
| Tune Formation — *Orchestrating Autonomy* | 60h | **Crewdle Forge** | Advanced: automation workflow orchestration |

### Each training contains

- Big-picture frame (why this stage matters in the agentic era)
- 6 modules × ~10h, mixing video lessons, live exercises, Crewdle hands-on labs
- Per-module **knowledge-check questionnaire** (auto-graded MCQ + short answer) gating progress
- Capstone: apply the playbook to learner's own org context
- Enrollment form routing to **jbelisle@helloarchitekt.com**

### Suggested video pieces (placeholders, per training)

GL!TCH — 6 videos, ~8–12 min each:
1. "The Industrial AI Moment" (10m) · 2. "Why Most AI Pilots Stall" (8m) · 3. "Crewdle Core Tour: Memory & Context" (12m) · 4. "Model-Agnostic Thinking" (9m) · 5. "Routing Workflows & Agents in One Place" (11m) · 6. "Your First Maturity-Aware Stack" (10m)

Drift — 6 videos:
1. "From Tools to Co-Assistance" (9m) · 2. "Crewdle Build, First Project" (12m) · 3. "Lovable for System Prototyping" (12m) · 4. "Designing the Co-Assisted Loop" (10m) · 5. "Patterns That Survive Production" (11m) · 6. "Drift Capstone Brief" (8m)

Tune — 6 videos:
1. "What Orchestration Really Means" (9m) · 2. "Crewdle Forge: Workflow Anatomy" (12m) · 3. "Autonomy Without Chaos" (11m) · 4. "Observability & Guardrails" (10m) · 5. "Scaling From Pilot to Practice" (12m) · 6. "Tune Capstone Brief" (8m)

### Data model

```text
trainings (id, slug[glitch|drift|tune], title, tagline, hours, crewdle_focus,
           big_picture_md, outcomes[], audience_md, order_index, status,
           hero_quote, cta_label)

training_modules (id, training_id, order_index, title, summary,
                  video_title, video_duration_min, video_theme,
                  video_placeholder_url, content_md, hands_on_md)

training_questions (id, module_id, order_index, prompt, kind[mcq|short],
                    options jsonb, correct_answer, explanation_md, weight)

training_enrollments (id, training_slug, name, email, org, role,
                      productivity_style, data_maturity[1..5], goals,
                      utm jsonb, created_at)

training_attempts (id, user_id, module_id, answers jsonb, score, passed,
                   created_at)   -- auth-gated, optional phase 2
```

GRANTs + RLS: public SELECT on `trainings`/`training_modules` where `status='published'`; public INSERT on `training_enrollments` with validation check; admin-only ALL via `has_role(auth.uid(),'admin')`. `training_attempts` scoped to `auth.uid()`.

### Pages & routes

- `/trainings` — hub (3 cards, comparison table)
- `/trainings/glitch` · `/trainings/drift` · `/trainings/tune` — each renders: hero, big picture, Crewdle focus, 6 module accordion (with video placeholder + duration + theme), questionnaire preview, capstone, enrollment form
- `/admin/trainings` — admin CRUD (reuse `BookManuscriptAdmin` patterns)

### Landing surfaces

- **BookLaunch.tsx** — add `TrainingsBand` under the Playbooks section: 3 cards linking to each training page
- **LandingPage.tsx** — add `TrainingsBand` between Services and Transformation Journey sections
- i18n: new `trainings.json` (EN + FR)

### Edge function

`enroll-training` — validates payload, inserts row, sends Resend email to `jbelisle@helloarchitekt.com` with enrollment summary + maturity self-score.

### Build order

1. Migration: 4 tables + GRANTs + RLS + seed (3 trainings, 18 modules, ~3 questions per module placeholder)
2. `src/i18n/{en,fr}/trainings.json`
3. `src/pages/TrainingsIndex.tsx`, `src/pages/Training.tsx` (slug-routed), `src/components/training/{TrainingHero,ModuleAccordion,QuestionnairePreview,EnrollmentForm,TrainingsBand}.tsx`
4. Route registration in `src/App.tsx`
5. `TrainingsBand` added to `BookLaunch.tsx` and `LandingPage.tsx`
6. Edge function `enroll-training` + wire to `EnrollmentForm`
7. Admin page `src/pages/TrainingsAdmin.tsx`

### Notes

- Videos are placeholders only — `video_placeholder_url` stays null; UI renders a styled "Coming soon — {title} · {duration}m" tile
- All copy bilingual EN/FR; brand tokens only (no hard-coded colors)
- Questionnaire engine is read-only in phase 1 (preview); attempt tracking ships in phase 2 once auth gate confirmed