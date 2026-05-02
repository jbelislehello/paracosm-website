import PptxGenJS from "pptxgenjs";

export interface DeckSlide {
  id: string;
  type: "title" | "bullets" | "two-column" | "quote" | "stat" | "closing-cta";
  title: string;
  subtitle?: string;
  bullets?: string[];
  body?: string;
  speakerNotes?: string;
  sourceUrls?: string[];
}

export interface DeckOutline {
  title: string;
  subtitle: string;
  slides: DeckSlide[];
}

const PRIMARY = "1E2761";
const ACCENT = "F96167";
const INK = "1A1A1A";
const MUTED = "5F6B7A";
const SURFACE = "F8F7F4";

export function exportDeckToPptx(deck: DeckOutline) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pptx.title = deck.title;
  pptx.author = "Paracosm";

  for (const slide of deck.slides) {
    const s = pptx.addSlide();
    s.background = { color: slide.type === "title" || slide.type === "closing-cta" ? PRIMARY : SURFACE };
    const titleColor = slide.type === "title" || slide.type === "closing-cta" ? "FFFFFF" : INK;
    const bodyColor = slide.type === "title" || slide.type === "closing-cta" ? "CADCFC" : MUTED;

    if (slide.type === "title") {
      s.addText("PARACOSM · AGENTIC ECOSYSTEM", {
        x: 0.6, y: 0.5, w: 12, h: 0.4,
        fontSize: 14, color: ACCENT, bold: true, fontFace: "Calibri",
      });
      s.addText(slide.title, {
        x: 0.6, y: 2.2, w: 12, h: 2,
        fontSize: 54, bold: true, color: titleColor, fontFace: "Georgia",
      });
      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 0.6, y: 4.4, w: 12, h: 1.2,
          fontSize: 22, color: bodyColor, fontFace: "Calibri",
        });
      }
    } else if (slide.type === "stat") {
      s.addText(slide.title, {
        x: 0.6, y: 0.5, w: 12, h: 0.7,
        fontSize: 22, bold: true, color: ACCENT, fontFace: "Calibri",
      });
      s.addText(slide.body || "", {
        x: 0.6, y: 1.6, w: 12, h: 3,
        fontSize: 96, bold: true, color: titleColor, fontFace: "Georgia",
      });
      s.addText(slide.subtitle || "", {
        x: 0.6, y: 5.0, w: 12, h: 1.5,
        fontSize: 20, color: bodyColor, fontFace: "Calibri",
      });
    } else if (slide.type === "quote") {
      s.addText(`"${slide.body || slide.title}"`, {
        x: 1, y: 1.8, w: 11.3, h: 3,
        fontSize: 36, italic: true, color: titleColor, fontFace: "Georgia",
      });
      s.addText(slide.subtitle || "", {
        x: 1, y: 5.2, w: 11.3, h: 0.6,
        fontSize: 16, color: bodyColor, fontFace: "Calibri",
      });
    } else if (slide.type === "two-column") {
      s.addText(slide.title, {
        x: 0.6, y: 0.5, w: 12, h: 0.8,
        fontSize: 32, bold: true, color: titleColor, fontFace: "Georgia",
      });
      const half = (slide.bullets || []).length;
      const left = (slide.bullets || []).slice(0, Math.ceil(half / 2));
      const right = (slide.bullets || []).slice(Math.ceil(half / 2));
      s.addText(left.map((t) => ({ text: t, options: { bullet: true } })), {
        x: 0.6, y: 1.7, w: 5.8, h: 5,
        fontSize: 18, color: INK, fontFace: "Calibri", paraSpaceAfter: 8,
      });
      s.addText(right.map((t) => ({ text: t, options: { bullet: true } })), {
        x: 6.8, y: 1.7, w: 5.8, h: 5,
        fontSize: 18, color: INK, fontFace: "Calibri", paraSpaceAfter: 8,
      });
    } else if (slide.type === "closing-cta") {
      s.addText(slide.title, {
        x: 0.6, y: 2.2, w: 12, h: 1.6,
        fontSize: 48, bold: true, color: titleColor, fontFace: "Georgia",
      });
      s.addText(slide.body || "", {
        x: 0.6, y: 4.0, w: 12, h: 1.5,
        fontSize: 22, color: bodyColor, fontFace: "Calibri",
      });
      s.addText("jbelisle@helloarchitekt.com", {
        x: 0.6, y: 5.8, w: 12, h: 0.6,
        fontSize: 20, bold: true, color: ACCENT, fontFace: "Calibri",
      });
    } else {
      // bullets
      s.addText(slide.title, {
        x: 0.6, y: 0.5, w: 12, h: 0.8,
        fontSize: 32, bold: true, color: titleColor, fontFace: "Georgia",
      });
      if (slide.subtitle) {
        s.addText(slide.subtitle, {
          x: 0.6, y: 1.3, w: 12, h: 0.5,
          fontSize: 16, color: bodyColor, italic: true, fontFace: "Calibri",
        });
      }
      s.addText(
        (slide.bullets || []).map((t) => ({ text: t, options: { bullet: true } })),
        {
          x: 0.6, y: 2.0, w: 12, h: 5,
          fontSize: 20, color: INK, fontFace: "Calibri", paraSpaceAfter: 10,
        },
      );
    }

    // Footer
    s.addText("paracosm.helloarchitekt.com", {
      x: 0.6, y: 7.05, w: 12, h: 0.3,
      fontSize: 10, color: bodyColor, fontFace: "Calibri",
    });

    if (slide.speakerNotes) s.addNotes(slide.speakerNotes);
  }

  const ts = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  pptx.writeFile({ fileName: `agentic-ecosystem-deck-${ts}.pptx` });
}
