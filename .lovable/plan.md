# Add 5 Service & Product Design Disciplines to PRD Checklist

The uploaded infographic defines 5 disciplines every PRD should cover: **Psychology, Economics, Politics (Policy), Operations, Technology**. The current PRD checklists in the wizard and assembly panel don't explicitly track these. This plan maps each discipline to the most semantically appropriate Calm Magic layer and adds a checklist item there.

## Discipline → Layer mapping

| Discipline | Layer | Rationale | Check basis |
|---|---|---|---|
| Psychology — understand people & behaviour | POLLENS | Human aspirations, emotional texture, team dynamics | `pollens_team_dynamics` or `pollens_cultural_elements` keyword presence |
| Economics — incentives & trade-offs | NOEMS | Mental models of value, trade-offs | keyword scan in `noems_concepts`/`noems_mental_models` for value/incentive/trade-off |
| Operations — how things get delivered | POEMS | Systems, environments, delivery flows | `poems_systems` or `poems_environments` already covered, add explicit "delivery flow" check |
| Politics (Policy) — power, rules, systems | TOTEMS | Access controls, governance, security policies | `totems_security_policies` or `totems_access_controls` keyword for policy/governance/rules |
| Technology — systems & constraints | TOTEMS | Data architecture, technical constraints | `totems_data_architecture` keyword for tech stack/constraints |

Each item uses a lightweight keyword/length check on existing fields — no schema changes, no new DB columns (respects ontological 1:1 rule).

## Files to edit

Both files duplicate the same `LAYER_CHECKLIST` structure and must stay in sync:

1. `src/components/prd-generator/PrdGeneratorWizard.tsx` (lines 145–167)
2. `src/components/calm-magic/PrdAssemblyPanel.tsx` (lines 180–202)

## New checklist additions

```ts
POLLENS: [
  // existing 2 items…
  { label: 'Psychology — people & behaviour understood',
    check: (c) => /(behaviour|behavior|psycholog|emotion|motivation)/i.test(
      `${c.pollens_aspirations ?? ''} ${c.pollens_team_dynamics ?? ''} ${c.pollens_cultural_elements ?? ''}`
    )},
],
NOEMS: [
  // existing 2 items…
  { label: 'Economics — incentives & trade-offs surfaced',
    check: (c) => /(incentive|trade.?off|economic|value|cost|benefit)/i.test(
      `${c.noems_concepts ?? ''} ${c.noems_mental_models ?? ''} ${c.noems_intuitions ?? ''}`
    )},
],
POEMS: [
  // existing 2 items…
  { label: 'Operations — delivery flows mapped',
    check: (c) => /(deliver|operation|workflow|process|fulfil)/i.test(
      `${c.poems_systems ?? ''} ${c.poems_environments ?? ''} ${c.poems_people ?? ''} ${c.poems_objects ?? ''}`
    )},
],
TOTEMS: [
  // existing 2 items…
  { label: 'Politics (Policy) — power, rules & governance defined',
    check: (c) => /(policy|policies|governance|rule|permission|role)/i.test(
      `${c.totems_security_policies ?? ''} ${c.totems_access_controls ?? ''}`
    )},
  { label: 'Technology — systems & constraints specified',
    check: (c) => /(stack|api|infrastructure|constraint|technolog|framework|database)/i.test(
      `${c.totems_data_architecture ?? ''} ${c.totems_security_policies ?? ''}`
    )},
],
ANTHEMS: [ /* unchanged */ ]
```

## Out of scope

- No DB migration, no new PRD fields (keeps strict 1:1 ontological mapping).
- No UI restructure — items appear inline in the existing checklist UI in both surfaces.
- Bilingual copy not added; current checklist labels are English-only across the file.
