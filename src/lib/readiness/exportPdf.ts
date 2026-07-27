import jsPDF from "jspdf";
import { SEASONS } from "./data";
import { normalize } from "./scoring";
import type { AnswersMap, OverallScore, SeasonId, SeasonScore, Tile, TileAnswer, Zone } from "./types";

const ZONE_WEIGHTS: Record<Zone, number> = { inner: 3, stretch: 2, edge: 1 };

interface ExportInput {
  answers: AnswersMap;
  seasonScores: {
    seasonId: SeasonId;
    complete: boolean;
    score: SeasonScore;
    answered: number;
  }[];
  overall: OverallScore;
  userEmail?: string | null;
}

function tileRaw(tile: Tile, a: TileAnswer | undefined) {
  if (!a) return { p: 0, o: 0, pw: 0, ow: 0, w: ZONE_WEIGHTS[tile.zone] };
  const w = ZONE_WEIGHTS[tile.zone];
  const p = a.personal >= 0 ? normalize(a.personal, tile.personal.type) : 0;
  const o = a.organizational >= 0 ? normalize(a.organizational, tile.organizational.type) : 0;
  return { p, o, pw: p * w, ow: o * w, w };
}

export function exportReadinessPdf({ answers, seasonScores, overall, userEmail }: ExportInput) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const text = (
    str: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; indent?: number } = {},
  ) => {
    const size = opts.size ?? 10;
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    const [r, g, b] = opts.color ?? [20, 20, 20];
    doc.setTextColor(r, g, b);
    const x = margin + (opts.indent ?? 0);
    const lines = doc.splitTextToSize(str, pageW - x - margin);
    ensureSpace(size * 1.3 * lines.length);
    doc.text(lines, x, y);
    y += size * 1.3 * lines.length;
  };

  const hr = () => {
    ensureSpace(12);
    doc.setDrawColor(200);
    doc.line(margin, y, pageW - margin, y);
    y += 10;
  };

  // Cover
  text("Calm Magic", { size: 10, color: [120, 120, 120] });
  text("Readiness Assessment Report", { size: 22, bold: true });
  y += 6;
  text(
    new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }),
    { size: 9, color: [120, 120, 120] },
  );
  if (userEmail) text(userEmail, { size: 9, color: [120, 120, 120] });
  y += 10;
  hr();

  // Overall snapshot
  text("Overall snapshot", { size: 14, bold: true });
  y += 4;
  const stats: [string, string | number][] = [
    ["Personal readiness", overall.personal],
    ["Organizational maturity", overall.organizational],
    ["Gap (org − personal)", `${overall.gap > 0 ? "+" : ""}${overall.gap}`],
    ["Composite", overall.composite],
  ];
  stats.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90);
    ensureSpace(14);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20);
    doc.text(String(value), pageW - margin, y, { align: "right" });
    y += 14;
  });
  y += 4;
  text(
    "Raw scoring: each tile is answered on two 1–5 scales (personal, organizational), weighted by zone (Inner ×3, Stretch ×2, Edge ×1). Season and overall percentages normalize weighted totals against the maximum possible.",
    { size: 8, color: [120, 120, 120] },
  );
  y += 4;
  hr();

  // Per-season with per-tile table
  SEASONS.forEach((season) => {
    const summary = seasonScores.find((s) => s.seasonId === season.seasonId);
    if (!summary || summary.answered === 0) return;

    ensureSpace(80);
    const rgb = hexToRgb(season.color);
    text(`${season.season} · ${season.axis}`, { size: 13, bold: true, color: rgb });
    text(season.description, { size: 9, color: [100, 100, 100] });
    y += 2;
    text(
      `Personal ${summary.score.personal} · Organizational ${summary.score.organizational} · Gap ${
        summary.score.gap > 0 ? "+" : ""
      }${summary.score.gap} · Composite ${summary.score.composite}`,
      { size: 10, bold: true },
    );
    text(`Signal: ${summary.score.interpretation.label} — ${summary.score.interpretation.signal}`, {
      size: 9,
      color: [80, 80, 80],
    });
    text(`AI readiness: ${summary.score.interpretation.aiReadiness.toUpperCase()}`, {
      size: 9,
      color: [80, 80, 80],
    });
    text(`${summary.answered}/${season.tiles.length} tiles answered`, {
      size: 9,
      color: [120, 120, 120],
    });

    if (summary.score.zones) {
      const z = summary.score.zones;
      text(
        `Zones — Personal: Inner ${z.personal.inner} · Stretch ${z.personal.stretch} · Edge ${z.personal.edge}   |   Org: Inner ${z.organizational.inner} · Stretch ${z.organizational.stretch} · Edge ${z.organizational.edge}`,
        { size: 8, color: [110, 110, 110] },
      );
    }
    y += 8;

    // Per-tile table
    const cols = [
      { key: "tile", label: "Tile", w: 46 },
      { key: "pair", label: "Row × Column", w: 150 },
      { key: "zone", label: "Zone", w: 44 },
      { key: "p", label: "Personal", w: 130 },
      { key: "o", label: "Organizational", w: 130 },
    ];
    const rowLeft = margin;
    const drawHeader = () => {
      ensureSpace(20);
      doc.setFillColor(245, 245, 245);
      doc.rect(rowLeft, y - 2, pageW - margin * 2, 16, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(80);
      let x = rowLeft + 4;
      cols.forEach((c) => {
        doc.text(c.label, x, y + 9);
        x += c.w;
      });
      y += 18;
    };
    drawHeader();

    season.tiles.forEach((tile) => {
      const a = answers[season.seasonId]?.[tile.id];
      const raw = tileRaw(tile, a);
      const personalLabel =
        a && a.personal >= 0
          ? `${tile.personal.labels[a.personal] ?? "—"}  (${raw.p}·w${raw.w}=${raw.pw})`
          : "—";
      const orgLabel =
        a && a.organizational >= 0
          ? `${tile.organizational.labels[a.organizational] ?? "—"}  (${raw.o}·w${raw.w}=${raw.ow})`
          : "—";

      const cells = [
        tile.tileCode,
        `${tile.row.full} × ${tile.col.full}`,
        tile.zone,
        personalLabel,
        orgLabel,
      ];

      // Measure row height by wrapping every column
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const wrapped = cols.map((c, i) =>
        doc.splitTextToSize(String(cells[i]), c.w - 6) as string[],
      );
      const lineH = 10;
      const rowH = Math.max(...wrapped.map((w) => w.length)) * lineH + 4;

      ensureSpace(rowH + 4);
      if (y > pageH - margin - rowH) {
        doc.addPage();
        y = margin;
        drawHeader();
      }

      doc.setDrawColor(230);
      doc.line(rowLeft, y - 2, pageW - margin, y - 2);
      doc.setTextColor(30);
      let x = rowLeft + 4;
      wrapped.forEach((lines, i) => {
        doc.text(lines, x, y + 7);
        x += cols[i].w;
      });
      y += rowH;
    });
    doc.setDrawColor(230);
    doc.line(rowLeft, y - 2, pageW - margin, y - 2);
    y += 8;

    // Open reflections
    const reflections = season.tiles
      .map((tile) => {
        const t = answers[season.seasonId]?.[tile.id]?.openText?.trim();
        return t ? { tile, text: t } : null;
      })
      .filter(Boolean) as { tile: Tile; text: string }[];

    if (reflections.length > 0) {
      text("Reflections", { size: 10, bold: true });
      reflections.forEach((r) => {
        text(`${r.tile.tileCode} · ${r.tile.row.full} × ${r.tile.col.full}`, {
          size: 9,
          bold: true,
          color: [60, 60, 60],
        });
        text(r.text, { size: 9, color: [40, 40, 40], indent: 8 });
        y += 2;
      });
    }

    y += 6;
    hr();
  });

  // Footer on every page
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.text("Paracosm · Calm Magic Readiness", margin, pageH - 20);
    doc.text(`${i} / ${pages}`, pageW - margin, pageH - 20, { align: "right" });
  }

  doc.save(`calm-magic-readiness-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "");
  const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}
