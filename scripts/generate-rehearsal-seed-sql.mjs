// Generates SQL to seed all 9 Rehearsal Arc offerings + roadmap modules into public.trainings / training_modules.
// Writes to /tmp/rehearsal-seed.sql for hand-off to the supabase migration/insert tools.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Import TS source via tsx runtime (we invoke this file with `bunx tsx`).
const mod = await import(pathToFileURL(path.resolve("src/data/rehearsalArcProgram.ts")).href);
const { REHEARSAL_ARC_PROGRAM } = mod;

const esc = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const jesc = (o) => (o == null ? "NULL" : `'${JSON.stringify(o).replace(/'/g, "''")}'::jsonb`);

const TONE = { foreplay: { glitch: "warm", drift: "night", tune: "clay" }, foresight: "night", forecast: "clay" };
const toneFor = (o) => (o.tier === "foreplay" ? TONE.foreplay[o.slug] ?? "warm" : TONE[o.tier]);

const CTA = { foreplay: "Enroll in this training", foresight: "Reserve a seat", forecast: "Begin the residency" };
const CREWDLE = { foreplay: "Foreplay · Trainings", foresight: "Foresight · Retreats", forecast: "Forecast · Residencies" };

let sql = "-- Rehearsal Arc unified seed\nBEGIN;\n\n";

REHEARSAL_ARC_PROGRAM.forEach((o, idx) => {
  const orderIndex = idx + 1;
  const outcomes = Object.values(o.states).flatMap((s) => [s.artifact]);
  sql += `
-- ${o.title}
INSERT INTO public.trainings (
  slug, title, tagline, hours, crewdle_focus, hero_quote, cta_label, order_index, status,
  tier, tone, duration_label, narrative_premise, cognitive_model, identity_shift,
  commitment_prompt, commitment_template, commitment_witness,
  roadmap_pdf_url, playbook_pdf_url, program_doc_pdf_url,
  outcomes, big_picture_md
) VALUES (
  ${esc(o.slug)}, ${esc(o.title)}, ${esc(o.tagline)},
  ${Math.max(1, Math.round(o.roadmap.reduce((n, r) => n + (parseInt((r.when.match(/(\d+)h/) || [])[1] || "0", 10)), 0)))},
  ${esc(CREWDLE[o.tier])}, ${esc(o.narrativePremise)}, ${esc(CTA[o.tier])},
  ${orderIndex}, 'published',
  ${esc(o.tier)}, ${esc(toneFor(o))}, ${esc(o.duration)},
  ${esc(o.narrativePremise)}, ${esc(o.cognitiveModel)}, ${esc(o.identityShift)},
  ${esc(o.commitmentContract.prompt)}, ${esc(o.commitmentContract.template)}, ${esc(o.commitmentContract.witness)},
  ${esc(`/downloads/${o.slug}-roadmap.pdf`)}, ${esc(`/downloads/${o.slug}-facilitator-playbook.pdf`)}, ${esc(`/downloads/${o.slug}-program-doc.pdf`)},
  ${jesc(outcomes)}, ${esc(`**Narrative** — ${o.narrativePremise}\n\n**Cognitive** — ${o.cognitiveModel}\n\n**Identity** — ${o.identityShift}`)}
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, tagline = EXCLUDED.tagline, hours = EXCLUDED.hours,
  crewdle_focus = EXCLUDED.crewdle_focus, hero_quote = EXCLUDED.hero_quote, cta_label = EXCLUDED.cta_label,
  order_index = EXCLUDED.order_index, status = EXCLUDED.status,
  tier = EXCLUDED.tier, tone = EXCLUDED.tone, duration_label = EXCLUDED.duration_label,
  narrative_premise = EXCLUDED.narrative_premise, cognitive_model = EXCLUDED.cognitive_model,
  identity_shift = EXCLUDED.identity_shift,
  commitment_prompt = EXCLUDED.commitment_prompt, commitment_template = EXCLUDED.commitment_template,
  commitment_witness = EXCLUDED.commitment_witness,
  roadmap_pdf_url = EXCLUDED.roadmap_pdf_url, playbook_pdf_url = EXCLUDED.playbook_pdf_url,
  program_doc_pdf_url = EXCLUDED.program_doc_pdf_url,
  outcomes = EXCLUDED.outcomes, big_picture_md = EXCLUDED.big_picture_md,
  updated_at = now();

DELETE FROM public.training_modules WHERE training_id = (SELECT id FROM public.trainings WHERE slug = ${esc(o.slug)});
`;

  o.roadmap.forEach((r, i) => {
    const state = o.states[r.focus];
    const summary = r.outcome;
    sql += `INSERT INTO public.training_modules (training_id, order_index, title, summary, hours, focus_state, when_label, outcome, exercises_json, journeys_json, artifact, video_theme, video_title, video_duration_min)
VALUES ((SELECT id FROM public.trainings WHERE slug = ${esc(o.slug)}), ${i + 1}, ${esc(r.label)}, ${esc(summary)}, NULL,
  ${esc(r.focus)}, ${esc(r.when)}, ${esc(r.outcome)},
  ${jesc(state.exercises)}, ${jesc(state.journeys)}, ${esc(state.artifact)},
  ${esc(r.focus)}, ${esc(`Module ${i + 1} — ${state.intent}`)}, NULL);
`;
  });
});

sql += "\nCOMMIT;\n";
fs.writeFileSync("/tmp/rehearsal-seed.sql", sql);
console.log(`Wrote /tmp/rehearsal-seed.sql (${sql.length} chars)`);
