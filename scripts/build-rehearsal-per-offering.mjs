// Per-offering Rehearsal Arc artifacts.
// For each of the 9 offerings this script writes:
//   /mnt/documents/{slug}-facilitator-playbook.pptx
//   /mnt/documents/{slug}-program-doc.docx
//   /mnt/documents/{slug}-roadmap.pptx  (single-slide landscape roadmap)
// A companion script (build-rehearsal-pdfs.mjs) converts them to PDF via LibreOffice.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import PptxGenJS from "pptxgenjs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  PageOrientation,
} from "docx";

const OUT = "/mnt/documents";
fs.mkdirSync(OUT, { recursive: true });

const mod = await import(pathToFileURL(path.resolve("src/data/rehearsalArcProgram.ts")).href);
const meta = await import(pathToFileURL(path.resolve("src/data/rehearsalArcMeta.ts")).href);
const { REHEARSAL_ARC_PROGRAM } = mod;
const { STATE_META, STATE_ORDER, JOURNEY_META, TIER_META } = meta;

const CREAM = "F4EFE6";
const INK = "1B1B1B";
const MUTE = "6B6154";
const RULE = "C9BFB0";

// ---------- Facilitator Playbook (PPTX) ----------
function buildPlaybook(o) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "REH", width: 13.333, height: 7.5 });
  pptx.layout = "REH";
  const tier = TIER_META[o.tier];

  // Cover
  {
    const s = pptx.addSlide();
    s.background = { color: INK };
    s.addText(o.title, { x: 0.6, y: 2.2, w: 12, h: 1.5, fontSize: 54, bold: true, fontFace: "Georgia", color: CREAM });
    s.addText(o.tagline, { x: 0.6, y: 3.8, w: 12, h: 1.2, fontSize: 20, italic: true, fontFace: "Georgia", color: "D9CFBD" });
    s.addText(`${tier.label} · ${tier.phase} · ${o.duration}`, {
      x: 0.6, y: 6.7, w: 12, h: 0.4, fontSize: 11, bold: true, charSpacing: 6, fontFace: "Calibri", color: "D9CFBD",
    });
  }

  // Three journeys
  {
    const s = pptx.addSlide(); s.background = { color: CREAM };
    s.addText("THREE SIMULTANEOUS JOURNEYS", { x: 0.6, y: 0.5, w: 12, h: 0.35, fontSize: 11, bold: true, charSpacing: 6, color: MUTE, fontFace: "Calibri" });
    s.addShape(pptx.ShapeType.line, { x: 0.6, y: 0.95, w: 12.1, h: 0, line: { color: RULE, width: 0.75 } });
    s.addText("Every module runs three tracks at once.", { x: 0.6, y: 1.1, w: 12, h: 0.8, fontSize: 32, bold: true, fontFace: "Georgia", color: INK });
    const cols = [
      { l: "NARRATIVE", t: o.narrativePremise },
      { l: "COGNITIVE", t: o.cognitiveModel },
      { l: "IDENTITY", t: o.identityShift },
    ];
    cols.forEach((c, i) => {
      const x = 0.6 + i * 4.2;
      s.addText(c.l, { x, y: 2.4, w: 4, h: 0.35, fontSize: 10, bold: true, charSpacing: 6, color: MUTE, fontFace: "Calibri" });
      s.addText(c.t, { x, y: 2.85, w: 4, h: 3.5, fontSize: 16, italic: true, fontFace: "Georgia", color: INK });
    });
  }

  // One slide per state
  STATE_ORDER.forEach((st, idx) => {
    const chapter = o.states[st];
    const m = STATE_META[st];
    const s = pptx.addSlide(); s.background = { color: CREAM };
    s.addText(`STATE ${String(idx + 1).padStart(2, "0")} · ${m.label.toUpperCase()}`, {
      x: 0.6, y: 0.5, w: 12, h: 0.35, fontSize: 11, bold: true, charSpacing: 6, color: m.accent, fontFace: "Calibri",
    });
    s.addShape(pptx.ShapeType.line, { x: 0.6, y: 0.95, w: 12.1, h: 0, line: { color: RULE, width: 0.75 } });
    s.addText(m.role, { x: 0.6, y: 1.1, w: 12, h: 0.7, fontSize: 28, italic: true, fontFace: "Georgia", color: INK });
    s.addText(chapter.intent, { x: 0.6, y: 1.9, w: 12, h: 0.6, fontSize: 16, fontFace: "Calibri", color: INK });
    s.addText(`"${chapter.promptQuestion}"`, {
      x: 0.6, y: 2.6, w: 12, h: 0.8, fontSize: 20, italic: true, fontFace: "Georgia", color: m.accent,
    });
    // Exercises
    chapter.exercises.forEach((e, i) => {
      const x = 0.6 + i * 4.2;
      s.addText(`${String(i + 1).padStart(2, "0")}. ${e.name}`, {
        x, y: 3.8, w: 4, h: 0.4, fontSize: 14, bold: true, fontFace: "Georgia", color: INK,
      });
      s.addText(`${e.timingMin} min`, { x, y: 4.2, w: 4, h: 0.3, fontSize: 9, color: MUTE, fontFace: "Calibri" });
      s.addText(e.intent, { x, y: 4.5, w: 4, h: 0.6, fontSize: 11, italic: true, fontFace: "Calibri", color: INK });
      s.addText(`Prompt: ${e.prompt}`, { x, y: 5.1, w: 4, h: 1.2, fontSize: 10, fontFace: "Calibri", color: INK });
      s.addText(`Debrief: ${e.debrief}`, { x, y: 6.3, w: 4, h: 0.8, fontSize: 9, italic: true, fontFace: "Calibri", color: MUTE });
    });
  });

  // Roadmap
  {
    const s = pptx.addSlide(); s.background = { color: CREAM };
    s.addText("ROADMAP", { x: 0.6, y: 0.5, w: 12, h: 0.35, fontSize: 11, bold: true, charSpacing: 6, color: MUTE, fontFace: "Calibri" });
    s.addShape(pptx.ShapeType.line, { x: 0.6, y: 0.95, w: 12.1, h: 0, line: { color: RULE, width: 0.75 } });
    s.addText("How the arc unfolds.", { x: 0.6, y: 1.1, w: 12, h: 0.7, fontSize: 28, italic: true, fontFace: "Georgia", color: INK });
    o.roadmap.forEach((r, i) => {
      const y = 2.1 + i * 0.78;
      const m = STATE_META[r.focus];
      s.addText(String(i + 1).padStart(2, "0"), { x: 0.6, y, w: 0.8, h: 0.6, fontSize: 24, fontFace: "Georgia", color: MUTE });
      s.addText(r.label, { x: 1.6, y, w: 5, h: 0.4, fontSize: 15, bold: true, fontFace: "Georgia", color: INK });
      s.addText(r.when, { x: 1.6, y: y + 0.4, w: 5, h: 0.3, fontSize: 10, color: MUTE, fontFace: "Calibri" });
      s.addText(m.label, {
        x: 6.8, y: y + 0.1, w: 1.4, h: 0.35, fontSize: 9, bold: true, align: "center", color: "FFFFFF",
        fill: { color: m.accent }, fontFace: "Calibri",
      });
      s.addText(r.outcome, { x: 8.4, y, w: 4.5, h: 0.7, fontSize: 11, italic: true, fontFace: "Calibri", color: INK });
    });
  }

  // Commitment
  {
    const s = pptx.addSlide(); s.background = { color: INK };
    s.addText("COMMITMENT CONTRACT", { x: 0.6, y: 0.5, w: 12, h: 0.35, fontSize: 11, bold: true, charSpacing: 6, color: "D9CFBD", fontFace: "Calibri" });
    s.addText(`"${o.commitmentContract.prompt}"`, {
      x: 0.6, y: 1.5, w: 12, h: 2, fontSize: 32, italic: true, fontFace: "Georgia", color: CREAM,
    });
    s.addText(o.commitmentContract.template, {
      x: 0.6, y: 4, w: 12, h: 2, fontSize: 16, fontFace: "Calibri", color: "D9CFBD",
    });
    s.addText(`Witness — ${o.commitmentContract.witness}`, {
      x: 0.6, y: 6.5, w: 12, h: 0.5, fontSize: 12, italic: true, fontFace: "Calibri", color: "D9CFBD",
    });
  }

  return pptx.writeFile({ fileName: path.join(OUT, `${o.slug}-facilitator-playbook.pptx`) });
}

// ---------- Roadmap (single-slide landscape PPTX) ----------
function buildRoadmap(o) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "R", width: 13.333, height: 7.5 });
  pptx.layout = "R";
  const s = pptx.addSlide();
  s.background = { color: CREAM };
  s.addText(`${o.title} — Roadmap`, { x: 0.6, y: 0.4, w: 12, h: 0.8, fontSize: 32, bold: true, fontFace: "Georgia", color: INK });
  s.addText(o.duration, { x: 0.6, y: 1.15, w: 12, h: 0.4, fontSize: 14, italic: true, color: MUTE, fontFace: "Calibri" });
  const boxW = 12.1 / o.roadmap.length;
  o.roadmap.forEach((r, i) => {
    const m = STATE_META[r.focus];
    const x = 0.6 + i * boxW;
    s.addShape(pptx.ShapeType.rect, {
      x, y: 2.4, w: boxW - 0.15, h: 4.6, fill: { color: "FFFFFF" }, line: { color: m.accent, width: 3 },
    });
    s.addShape(pptx.ShapeType.rect, {
      x, y: 2.4, w: boxW - 0.15, h: 0.5, fill: { color: m.accent }, line: { color: m.accent, width: 0 },
    });
    s.addText(m.label, { x, y: 2.4, w: boxW - 0.15, h: 0.5, fontSize: 11, bold: true, color: "FFFFFF", align: "center", fontFace: "Calibri" });
    s.addText(String(i + 1).padStart(2, "0"), { x: x + 0.2, y: 3.1, w: 1.2, h: 0.7, fontSize: 32, bold: true, color: MUTE, fontFace: "Georgia" });
    s.addText(r.label, { x: x + 0.2, y: 3.85, w: boxW - 0.5, h: 0.7, fontSize: 13, bold: true, fontFace: "Georgia", color: INK });
    s.addText(r.when, { x: x + 0.2, y: 4.55, w: boxW - 0.5, h: 0.35, fontSize: 9, color: MUTE, fontFace: "Calibri" });
    s.addText(r.outcome, { x: x + 0.2, y: 5, w: boxW - 0.5, h: 1.9, fontSize: 11, italic: true, fontFace: "Calibri", color: INK });
  });
  s.addText("Paracosm · The Rehearsal Arc", { x: 0.6, y: 7.15, w: 12, h: 0.3, fontSize: 9, color: MUTE, fontFace: "Calibri", align: "right" });
  return pptx.writeFile({ fileName: path.join(OUT, `${o.slug}-roadmap.pptx`) });
}

// ---------- Program Doc (DOCX) ----------
function border() {
  const b = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
  return { top: b, bottom: b, left: b, right: b };
}
function cell(text, opts = {}) {
  return new TableCell({
    borders: border(),
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text: String(text), font: "Arial", size: 20, ...opts })] })],
  });
}

function buildProgramDoc(o) {
  const tier = TIER_META[o.tier];
  const children = [];
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: o.title, font: "Arial" })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: `${tier.label} · ${tier.phase} · ${o.duration}`, italics: true, font: "Arial", size: 22 })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: o.tagline, font: "Arial", size: 24 })] }));

  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "The three journeys", font: "Arial" })] }));
  [["Narrative", o.narrativePremise], ["Cognitive", o.cognitiveModel], ["Identity", o.identityShift]].forEach(([k, v]) => {
    children.push(new Paragraph({ children: [new TextRun({ text: `${k}. `, bold: true, font: "Arial", size: 22 }), new TextRun({ text: v, font: "Arial", size: 22 })] }));
  });

  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Curriculum by module", font: "Arial" })] }));
  o.roadmap.forEach((r, i) => {
    const m = STATE_META[r.focus];
    const chapter = o.states[r.focus];
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: `Module ${i + 1} — ${r.label}`, font: "Arial" })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `${r.when} · ${m.label} — ${m.role}`, italics: true, font: "Arial", size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Outcome: ${r.outcome}`, font: "Arial", size: 22 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Intent: ${chapter.intent}`, font: "Arial", size: 22 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Prompt question: ${chapter.promptQuestion}`, italics: true, font: "Arial", size: 22 })] }));
    const rows = [
      new TableRow({ children: [cell("Exercise", { bold: true }), cell("Time", { bold: true }), cell("Prompt", { bold: true }), cell("Debrief", { bold: true })] }),
    ];
    chapter.exercises.forEach((e) => {
      rows.push(new TableRow({ children: [cell(e.name), cell(`${e.timingMin}m`), cell(e.prompt), cell(e.debrief)] }));
    });
    children.push(new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: [1800, 800, 3480, 3280],
      rows,
    }));
    children.push(new Paragraph({ children: [new TextRun({ text: `Artifact: ${chapter.artifact}`, italics: true, font: "Arial", size: 20 })] }));
    children.push(new Paragraph({ children: [new TextRun({ text: "", font: "Arial" })] }));
  });

  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: "Commitment contract", font: "Arial" })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: o.commitmentContract.prompt, italics: true, font: "Arial", size: 24 })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: o.commitmentContract.template, font: "Arial", size: 22 })] }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Witness — ${o.commitmentContract.witness}`, italics: true, font: "Arial", size: 20 })] }));

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 22 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 40, bold: true, font: "Arial" }, paragraph: { spacing: { before: 240, after: 240 } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 30, bold: true, font: "Arial" }, paragraph: { spacing: { before: 300, after: 120 } } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 26, bold: true, font: "Arial" }, paragraph: { spacing: { before: 240, after: 120 } } },
      ],
    },
    sections: [{
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children,
    }],
  });
  return Packer.toBuffer(doc).then((buf) => fs.writeFileSync(path.join(OUT, `${o.slug}-program-doc.docx`), buf));
}

// ---------- Run ----------
for (const o of REHEARSAL_ARC_PROGRAM) {
  await buildPlaybook(o);
  await buildRoadmap(o);
  await buildProgramDoc(o);
  console.log("built:", o.slug);
}
console.log("done. 27 source files in", OUT);
