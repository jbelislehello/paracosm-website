import jsPDF from "jspdf";
import { SEASONS } from "./data";
import type { AnswersMap, OverallScore, SeasonId, SeasonScore } from "./types";

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
  text(new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }), {
    size: 9,
    color: [120, 120, 120],
  });
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
  y += 8;
  hr();

  // Per-season
  SEASONS.forEach((season) => {
    const summary = seasonScores.find((s) => s.seasonId === season.seasonId);
    if (!summary || summary.answered === 0) return;

    ensureSpace(60);
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
    y += 6;

    // Open reflections
    const reflections = season.tiles
      .map((tile) => {
        const a = answers[season.seasonId]?.[tile.id];
        if (!a?.openText?.trim()) return null;
        return { tile, text: a.openText.trim() };
      })
      .filter(Boolean) as { tile: (typeof season.tiles)[number]; text: string }[];

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
