// Rehearsal Arc — facilitator workbook (.docx)
import fs from "node:fs";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  PageOrientation, LevelFormat, Table, TableRow, TableCell, BorderStyle,
  WidthType, ShadingType, PageBreak, TabStopType, TabStopPosition,
} from "docx";
import { REHEARSAL_ARC_PROGRAM } from "../src/data/rehearsalArcProgram.ts";
import {
  STATE_META, STATE_ORDER, JOURNEY_META, TIER_META,
} from "../src/data/rehearsalArcMeta.ts";

const CELL_BORDER = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const CELL_BORDERS = { top: CELL_BORDER, bottom: CELL_BORDER, left: CELL_BORDER, right: CELL_BORDER };

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const p  = (t, opts = {}) => new Paragraph({ children: [new TextRun({ text: t, ...opts })] });
const em = (t) => new Paragraph({ children: [new TextRun({ text: t, italics: true })] });
const bullet = (t) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, children: [new TextRun(t)] });
const pb = () => new Paragraph({ children: [new PageBreak()] });
const label = (l, v) => new Paragraph({ children: [
  new TextRun({ text: l + " ", bold: true }),
  new TextRun(v),
]});

const children = [];

// Title
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 2400, after: 200 },
  children: [new TextRun({ text: "The Rehearsal Arc", bold: true, size: 72, font: "Georgia" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 200 },
  children: [new TextRun({ text: "A facilitator's workbook", italics: true, size: 32, font: "Georgia" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Paracosm · Trainings · Retreats · Residencies", size: 20, color: "6B6154" })],
}));
children.push(pb());

// How to use
children.push(h1("How to use this workbook"));
children.push(p("Each of the nine offerings is scored through the same two coordinates: the five cognitive states — LOVE, MAGIC, CALM, OPEN, FREE — and the three simultaneous journeys — Narrative, Cognitive, Identity."));
children.push(p("Read the offering that fits the room you are in. Use the exercises verbatim the first time. Rewrite them the second time. By the third time they belong to your practice."));
children.push(p("Voice in this workbook is facilitator's voice: second-person, timed, ready to read aloud."));
children.push(pb());

// The ontology
children.push(h1("The ontology"));
children.push(h2("The five states"));
STATE_ORDER.forEach((st) => {
  const m = STATE_META[st];
  children.push(h3(`${m.label} — ${m.role}`));
  children.push(label("Intent —", m.intent));
  children.push(label("Facilitator move —", m.facilitatorMove));
});
children.push(h2("The three journeys"));
Object.entries(JOURNEY_META).forEach(([k, m]) => {
  children.push(h3(m.label));
  children.push(em(m.question));
  children.push(label("Artefact —", m.artefact));
});
children.push(pb());

// Per offering
REHEARSAL_ARC_PROGRAM.forEach((o) => {
  const tier = TIER_META[o.tier];
  children.push(h1(`${o.title}`));
  children.push(em(`${tier.label} · ${tier.phase} · ${o.duration}`));
  children.push(p(o.tagline));

  children.push(h2("Three simultaneous journeys"));
  children.push(label("Narrative —", o.narrativePremise));
  children.push(label("Cognitive —", o.cognitiveModel));
  children.push(label("Identity —", o.identityShift));

  STATE_ORDER.forEach((st, si) => {
    const m = STATE_META[st];
    const c = o.states[st];
    children.push(h2(`${String(si + 1).padStart(2, "0")}. ${m.label} — ${m.role}`));
    children.push(label("Intent —", c.intent));
    children.push(em(`Prompt: "${c.promptQuestion}"`));
    children.push(label("Artifact —", c.artifact));

    c.exercises.forEach((e, ei) => {
      children.push(h3(`Exercise ${ei + 1}: ${e.name} (${e.timingMin} min)`));
      children.push(label("Intent —", e.intent));
      children.push(em(`"${e.prompt}"`));
      children.push(label("Materials —", e.materials));
      children.push(label("Debrief —", e.debrief));
    });

    children.push(h3("Journey signals, this state"));
    children.push(bullet(`Narrative — ${c.journeys.narrative}`));
    children.push(bullet(`Cognitive — ${c.journeys.cognitive}`));
    children.push(bullet(`Identity — ${c.journeys.identity}`));
  });

  // Roadmap table
  children.push(h2("Roadmap"));
  const rows = [
    new TableRow({ tableHeader: true, children: ["Step", "When", "State", "Outcome"].map((h) =>
      new TableCell({
        borders: CELL_BORDERS,
        width: { size: 2340, type: WidthType.DXA },
        shading: { fill: "EEE8DD", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
      })) }),
    ...o.roadmap.map((r) => new TableRow({
      children: [r.label, r.when, STATE_META[r.focus].label, r.outcome].map((v) =>
        new TableCell({
          borders: CELL_BORDERS,
          width: { size: 2340, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun(v)] })],
        })),
    })),
  ];
  children.push(new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2340, 2340, 2340, 2340],
    rows,
  }));

  children.push(h2("Commitment contract"));
  children.push(em(o.commitmentContract.prompt));
  children.push(p(o.commitmentContract.template));
  children.push(label("Witness —", o.commitmentContract.witness));

  children.push(pb());
});

// Appendix — printable prompt cards
children.push(h1("Appendix — Printable prompt cards"));
STATE_ORDER.forEach((st) => {
  const m = STATE_META[st];
  children.push(h2(`${m.label} — ${m.role}`));
  children.push(em(`Facilitator: "${m.facilitatorMove}"`));
});

const doc = new Document({
  creator: "Paracosm",
  title: "The Rehearsal Arc — Facilitator Workbook",
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 40, bold: true, font: "Georgia" },
        paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Georgia" },
        paragraph: { spacing: { before: 260, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Georgia" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("/mnt/documents/rehearsal-arc-workbook.docx", buf);
  console.log(`Wrote workbook: ${buf.length} bytes`);
});
