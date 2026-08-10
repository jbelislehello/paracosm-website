import { jsPDF } from "jspdf";
import { DIMENSIONS, RELATIONAL_SCALE } from "./data";
import { strongestAndWeakest } from "./scoring";
import type {
  DimensionScore,
  Lang,
  RelationalAnswersMap,
  RelationalOverall,
} from "./types";

interface Input {
  answers: RelationalAnswersMap;
  dimensionScores: Record<string, DimensionScore>;
  overall: RelationalOverall;
  userEmail?: string | null;
  lang?: Lang;
}

const M = 44;

export function exportRelationalPdf({
  answers,
  dimensionScores,
  overall,
  userEmail,
  lang = "en",
}: Input) {
  const fr = lang === "fr";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const scale = RELATIONAL_SCALE[lang];
  let y = M;

  const ensure = (needed = 60) => {
    if (y + needed > H - M) {
      doc.addPage();
      y = M;
    }
  };

  const heading = (text: string, size = 16) => {
    ensure(size + 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(20);
    doc.text(text, M, y);
    y += size + 8;
  };

  const body = (text: string, size = 10) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(70);
    const lines = doc.splitTextToSize(text, W - M * 2);
    for (const line of lines) {
      ensure(size + 6);
      doc.text(line, M, y);
      y += size + 4;
    }
  };

  // ---------- Cover ----------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(20);
  doc.text(fr ? "Intelligence relationnelle" : "Relational Intelligence", M, y);
  y += 30;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(110);
  doc.text(
    fr
      ? "Une carte de la façon dont vous et votre équipe gérez le lien, la pression et le conflit."
      : "A map of how you and your team handle connection, pressure, and conflict.",
    M,
    y,
  );
  y += 18;
  doc.text(
    `${fr ? "Généré" : "Generated"}: ${new Date().toLocaleString()}${
      userEmail ? `  ·  ${userEmail}` : ""
    }`,
    M,
    y,
  );
  y += 28;

  // Overall stats
  const stats: Array<[string, string]> = [
    [fr ? "Moi" : "Me", String(overall.self)],
    [fr ? "Mon équipe" : "My team", String(overall.team)],
    [fr ? "Écart" : "Gap", `${overall.gap > 0 ? "+" : ""}${overall.gap}`],
    [fr ? "Global" : "Composite", String(overall.composite)],
  ];
  const colW = (W - M * 2) / stats.length;
  stats.forEach(([label, value], i) => {
    const x = M + i * colW;
    doc.setFontSize(8);
    doc.setTextColor(130);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(20);
    doc.text(value, x, y + 22);
    doc.setFont("helvetica", "normal");
  });
  y += 46;

  const { strongest, weakest } = strongestAndWeakest(dimensionScores);
  if (strongest) {
    const s = DIMENSIONS.find((d) => d.id === strongest)!;
    body(`${fr ? "Point fort" : "Strongest"}: ${s.name[lang]} (${dimensionScores[strongest].composite})`);
  }
  if (weakest && weakest !== strongest) {
    const w = DIMENSIONS.find((d) => d.id === weakest)!;
    body(`${fr ? "Levier principal" : "Biggest lever"}: ${w.name[lang]} (${dimensionScores[weakest].composite})`);
  }
  y += 6;
  body(
    fr
      ? "Les scores vont de 0 à 100 : ils correspondent à la moyenne de vos réponses (1 à 5) sur les six questions de chaque dimension. L'écart est le score « équipe » moins le score « moi »."
      : "Scores run 0–100: the mean of your 1–5 answers across the six questions in each dimension. Gap is the team score minus the me score.",
    9,
  );
  y += 10;

  // ---------- Per dimension ----------
  for (const dim of DIMENSIONS) {
    const score = dimensionScores[dim.id];
    if (!score || score.answered === 0) continue;
    ensure(120);
    y += 8;
    heading(dim.name[lang], 14);
    body(dim.blurb[lang], 9.5);
    body(
      `${fr ? "Moi" : "Me"} ${score.self}  ·  ${fr ? "Équipe" : "Team"} ${score.team}  ·  ${
        fr ? "Écart" : "Gap"
      } ${score.gap > 0 ? "+" : ""}${score.gap}  ·  ${score.answered}/${score.total} ${
        fr ? "répondu" : "answered"
      }`,
      10,
    );
    body(`${score.reading.label[lang]} — ${score.reading.signal[lang]}`, 9.5);

    // per-question table
    y += 6;
    ensure(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(fr ? "QUESTION" : "QUESTION", M, y);
    doc.text(fr ? "MOI" : "ME", W - M - 150, y);
    doc.text(fr ? "ÉQUIPE" : "TEAM", W - M - 70, y);
    y += 12;
    doc.setFont("helvetica", "normal");

    for (const q of dim.questions) {
      const a = answers[dim.id]?.[q.id];
      if (!a) continue;
      const qLines = doc.splitTextToSize(q.self[lang], W - M * 2 - 170);
      ensure(qLines.length * 11 + 8);
      doc.setFontSize(8.5);
      doc.setTextColor(60);
      qLines.forEach((line: string, i: number) => {
        doc.text(line, M, y + i * 11);
      });
      doc.setTextColor(30);
      doc.text(a.self >= 0 ? `${a.self + 1} · ${scale[a.self]}` : "—", W - M - 150, y, {
        maxWidth: 78,
      });
      doc.text(a.team >= 0 ? `${a.team + 1} · ${scale[a.team]}` : "—", W - M - 70, y, {
        maxWidth: 70,
      });
      y += Math.max(qLines.length * 11, 22);
    }

    // open reflection
    const open = Object.values(answers[dim.id] ?? {}).find((a) => a.openText?.trim());
    if (open?.openText) {
      y += 6;
      body(`${fr ? "Réflexion" : "Reflection"}: ${open.openText}`, 9.5);
    }

    // practices for low dimensions
    if (score.composite < 70) {
      y += 4;
      body(fr ? "À essayer ensuite :" : "Try next:", 9.5);
      for (const p of dim.practices[lang]) body(`•  ${p}`, 9.5);
    }
    y += 8;
  }

  doc.save(`relational-intelligence-${new Date().toISOString().slice(0, 10)}.pdf`);
}
