// Rehearsal Arc — facilitator deck
// Palette: cream + charcoal + per-state accents. Georgia headers, Calibri body.
import PptxGenJS from "pptxgenjs";
import { REHEARSAL_ARC_PROGRAM } from "../src/data/rehearsalArcProgram.ts";
import {
  STATE_META,
  STATE_ORDER,
  JOURNEY_META,
  TIER_META,
} from "../src/data/rehearsalArcMeta.ts";

const CREAM = "F4EFE6";
const INK = "1B1B1B";
const MUTE = "6B6154";
const RULE = "C9BFB0";

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pptx.defineLayout({ name: "REH", width: 13.333, height: 7.5 });
pptx.layout = "REH";

const H = { fontFace: "Georgia", color: INK };
const B = { fontFace: "Calibri", color: INK };

function bgSlide(color = CREAM) {
  const s = pptx.addSlide();
  s.background = { color };
  return s;
}
function kicker(s, text, color = MUTE) {
  s.addText(text.toUpperCase(), {
    x: 0.6, y: 0.5, w: 12, h: 0.35,
    fontSize: 11, bold: true, charSpacing: 6, color, fontFace: "Calibri",
  });
}
function rule(s, y = 0.95) {
  s.addShape(pptx.ShapeType.line, {
    x: 0.6, y, w: 12.1, h: 0, line: { color: RULE, width: 0.75 },
  });
}
function pageNo(s, n, total) {
  s.addText(`${String(n).padStart(2, "0")} / ${total}`, {
    x: 11.6, y: 7.05, w: 1.2, h: 0.3, fontSize: 9, color: MUTE,
    fontFace: "Calibri", align: "right",
  });
}

const slides = [];

// --- Cover
{
  const s = bgSlide(INK);
  s.addText("The Rehearsal Arc", {
    x: 0.8, y: 2.4, w: 12, h: 1.6, fontSize: 68, bold: true,
    fontFace: "Georgia", color: CREAM,
  });
  s.addText("A facilitator's field guide — Trainings · Retreats · Residencies", {
    x: 0.8, y: 4.1, w: 12, h: 0.6, fontSize: 22, italic: true,
    fontFace: "Georgia", color: "D9CFBD",
  });
  s.addText("Paracosm × Crewdle", {
    x: 0.8, y: 6.7, w: 8, h: 0.4, fontSize: 12, bold: true, charSpacing: 8,
    fontFace: "Calibri", color: "D9CFBD",
  });
  slides.push(s);
}

// --- What is the Rehearsal Arc
{
  const s = bgSlide();
  kicker(s, "Chapter I · Orientation");
  rule(s);
  s.addText("Rehearse the shift before the stakes get real.", {
    x: 0.6, y: 1.2, w: 12, h: 1.3, fontSize: 40, ...H, bold: true,
  });
  s.addText(
    [
      { text: "Nine offerings.", options: { bold: true, ...B, fontSize: 20 } },
      { text: " Three tiers. Two coordinates.\n\n", options: { ...B, fontSize: 20 } },
      { text: "Every session moves through the same 5 states — LOVE · MAGIC · CALM · OPEN · FREE — while running three simultaneous journeys: what people will remember, what they will learn, and who they will become.", options: { ...B, fontSize: 18 } },
    ],
    { x: 0.6, y: 3, w: 11, h: 3 },
  );
  slides.push(s);
}

// --- 3 journeys
{
  const s = bgSlide();
  kicker(s, "Chapter II · Three simultaneous journeys");
  rule(s);
  const cols = ["narrative", "cognitive", "identity"];
  cols.forEach((k, i) => {
    const meta = JOURNEY_META[k];
    const x = 0.6 + i * 4.15;
    s.addShape(pptx.ShapeType.rect, {
      x, y: 1.4, w: 3.9, h: 5.2, fill: { color: "FFFFFF" },
      line: { color: RULE, width: 0.75 },
    });
    s.addText(meta.label.toUpperCase(), {
      x: x + 0.3, y: 1.6, w: 3.5, h: 0.4, fontSize: 12, bold: true,
      charSpacing: 6, ...B,
    });
    s.addText(meta.question, {
      x: x + 0.3, y: 2.1, w: 3.5, h: 2, fontSize: 22, italic: true, ...H,
    });
    s.addText("Artefact", {
      x: x + 0.3, y: 5.4, w: 3.5, h: 0.3, fontSize: 10, bold: true,
      charSpacing: 4, color: MUTE, fontFace: "Calibri",
    });
    s.addText(meta.artefact, {
      x: x + 0.3, y: 5.7, w: 3.5, h: 0.8, fontSize: 14, ...B,
    });
  });
  slides.push(s);
}

// --- One slide per state
STATE_ORDER.forEach((st, i) => {
  const meta = STATE_META[st];
  const s = bgSlide();
  kicker(s, `Chapter III · State ${i + 1} of 5`);
  rule(s);
  s.addShape(pptx.ShapeType.rect, {
    x: 0.6, y: 1.2, w: 0.35, h: 5.4, fill: { color: meta.accent.replace("#", "") },
    line: { color: meta.accent.replace("#", ""), width: 0 },
  });
  s.addText(meta.label.toUpperCase(), {
    x: 1.2, y: 1.2, w: 11, h: 0.6, fontSize: 14, bold: true,
    charSpacing: 8, color: meta.accent.replace("#", ""), fontFace: "Calibri",
  });
  s.addText(meta.role, {
    x: 1.2, y: 1.75, w: 11, h: 1, fontSize: 44, ...H, bold: true,
  });
  s.addText([
    { text: "Intent — ", options: { bold: true, ...B, fontSize: 16 } },
    { text: meta.intent + "\n\n", options: { ...B, fontSize: 16 } },
    { text: "Facilitator move — ", options: { bold: true, ...B, fontSize: 16 } },
    { text: meta.facilitatorMove, options: { italic: true, ...B, fontSize: 16 } },
  ], { x: 1.2, y: 3.6, w: 11, h: 2.6 });
  slides.push(s);
});

// --- Tier chapters
const tierOrder = ["foreplay", "foresight", "forecast"];
tierOrder.forEach((tierKey, tIdx) => {
  const tier = TIER_META[tierKey];
  const offerings = REHEARSAL_ARC_PROGRAM.filter((o) => o.tier === tierKey);

  // Chapter opener
  {
    const s = bgSlide(INK);
    s.addText(`Chapter ${["IV", "V", "VI"][tIdx]}`.toUpperCase(), {
      x: 0.8, y: 2.4, w: 12, h: 0.5, fontSize: 14, bold: true,
      charSpacing: 8, color: "D9CFBD", fontFace: "Calibri",
    });
    s.addText(`${tier.label} — ${tier.phase}`, {
      x: 0.8, y: 3, w: 12, h: 1.4, fontSize: 60, bold: true,
      fontFace: "Georgia", color: CREAM,
    });
    s.addText(tier.blurb, {
      x: 0.8, y: 4.6, w: 12, h: 1, fontSize: 24, italic: true,
      fontFace: "Georgia", color: "D9CFBD",
    });
    slides.push(s);
  }

  offerings.forEach((o) => {
    // Offering overview
    {
      const s = bgSlide();
      kicker(s, `${tier.label} · ${o.duration}`);
      rule(s);
      s.addText(o.title, {
        x: 0.6, y: 1.15, w: 12, h: 1.1, fontSize: 40, bold: true, ...H,
      });
      s.addText(o.tagline, {
        x: 0.6, y: 2.35, w: 12, h: 1, fontSize: 20, italic: true, ...B,
      });
      const journeys = [
        ["Narrative", o.narrativePremise],
        ["Cognitive", o.cognitiveModel],
        ["Identity", o.identityShift],
      ];
      journeys.forEach(([label, txt], i) => {
        const y = 3.7 + i * 1.1;
        s.addText(label.toUpperCase(), {
          x: 0.6, y, w: 2.5, h: 0.4, fontSize: 11, bold: true,
          charSpacing: 6, color: MUTE, fontFace: "Calibri",
        });
        s.addText(txt, {
          x: 3.2, y, w: 9.5, h: 1, fontSize: 15, ...B,
        });
      });
      slides.push(s);
    }

    // Signature exercises per offering (one slide summarising the arc)
    {
      const s = bgSlide();
      kicker(s, `${o.title} · Signature moves`);
      rule(s);
      s.addText("One move per state", {
        x: 0.6, y: 1.15, w: 12, h: 0.8, fontSize: 30, ...H, bold: true,
      });
      STATE_ORDER.forEach((st, i) => {
        const meta = STATE_META[st];
        const chapter = o.states[st];
        const y = 2.3 + i * 0.93;
        s.addShape(pptx.ShapeType.rect, {
          x: 0.6, y: y + 0.05, w: 0.15, h: 0.75,
          fill: { color: meta.accent.replace("#", "") },
          line: { color: meta.accent.replace("#", ""), width: 0 },
        });
        s.addText(meta.label.toUpperCase(), {
          x: 0.95, y, w: 1.4, h: 0.9, fontSize: 12, bold: true,
          charSpacing: 5, ...B,
        });
        s.addText(chapter.exercises[0].name, {
          x: 2.5, y, w: 5, h: 0.4, fontSize: 15, bold: true, ...B,
        });
        s.addText(chapter.exercises[0].prompt, {
          x: 2.5, y: y + 0.4, w: 5, h: 0.5, fontSize: 11, italic: true,
          color: MUTE, fontFace: "Calibri",
        });
        s.addText(`${chapter.exercises[0].timingMin} min`, {
          x: 7.7, y, w: 1.2, h: 0.4, fontSize: 12, bold: true, ...B,
        });
        s.addText(chapter.journeys.identity, {
          x: 9, y, w: 3.8, h: 0.9, fontSize: 11, italic: true, color: MUTE,
          fontFace: "Calibri",
        });
      });
      slides.push(s);
    }
  });
});

// --- Facilitation cues
{
  const s = bgSlide();
  kicker(s, "Chapter VII · Facilitation cues");
  rule(s);
  s.addText("Move slowly. Name what you see. Ask for the smallest brave promise.", {
    x: 0.6, y: 1.2, w: 12, h: 1.4, fontSize: 34, ...H, bold: true,
  });
  const cues = STATE_ORDER.map((st) => `${STATE_META[st].label.toUpperCase()} — ${STATE_META[st].facilitatorMove}`);
  s.addText(cues.map((t) => ({ text: t + "\n\n", options: { ...B, fontSize: 17 } })), {
    x: 0.6, y: 3.2, w: 12, h: 3.5,
  });
  slides.push(s);
}

// --- Commitment contract template
{
  const s = bgSlide(INK);
  s.addText("Commitment Contract", {
    x: 0.8, y: 1, w: 12, h: 0.6, fontSize: 14, bold: true, charSpacing: 8,
    color: "D9CFBD", fontFace: "Calibri",
  });
  s.addText("The smallest brave promise.", {
    x: 0.8, y: 1.7, w: 12, h: 1.2, fontSize: 44, bold: true,
    fontFace: "Georgia", color: CREAM,
  });
  s.addText([
    { text: "By _____________ I will _____________.\n\n", options: { fontSize: 22, color: CREAM, fontFace: "Georgia" } },
    { text: "My witness is _____________.\n\n", options: { fontSize: 22, color: CREAM, fontFace: "Georgia" } },
    { text: "If by day 30 _____________ is true, I will stop and re-open the question.", options: { fontSize: 22, italic: true, color: "D9CFBD", fontFace: "Georgia" } },
  ], { x: 0.8, y: 3.4, w: 12, h: 3.5 });
  slides.push(s);
}

// --- Close
{
  const s = bgSlide();
  kicker(s, "End of deck");
  rule(s);
  s.addText("Rehearse. Then perform.", {
    x: 0.6, y: 2.5, w: 12, h: 1.5, fontSize: 60, ...H, italic: true, bold: true,
  });
  s.addText("Paracosm · calm-magic.com · jbelisle@helloarchitekt.com", {
    x: 0.6, y: 6.7, w: 12, h: 0.4, fontSize: 12, color: MUTE,
    fontFace: "Calibri",
  });
  slides.push(s);
}

// Number pages
slides.forEach((s, i) => pageNo(s, i + 1, slides.length));

await pptx.writeFile({ fileName: "/mnt/documents/rehearsal-arc-facilitator-deck.pptx" });
console.log(`Wrote deck: ${slides.length} slides.`);
