// Convert all per-offering PPTX/DOCX artifacts to PDF via LibreOffice,
// then copy to public/downloads/ so the site serves them.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { pathToFileURL } from "node:url";

const mod = await import(pathToFileURL(path.resolve("src/data/rehearsalArcProgram.ts")).href);
const { REHEARSAL_ARC_PROGRAM } = mod;

const SRC_DIR = "/mnt/documents";
const OUT_DIR = path.resolve("public/downloads");
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "rehearsal-per-offering-"));

fs.mkdirSync(OUT_DIR, { recursive: true });

const suffixes = [
  { in: "facilitator-playbook.pptx", out: "facilitator-playbook.pdf" },
  { in: "roadmap.pptx", out: "roadmap.pdf" },
  { in: "program-doc.docx", out: "program-doc.pdf" },
];

const files = [];
for (const o of REHEARSAL_ARC_PROGRAM) {
  for (const s of suffixes) {
    const f = `${o.slug}-${s.in}`;
    const src = path.join(SRC_DIR, f);
    if (!fs.existsSync(src)) {
      console.warn(`skip missing: ${src}`);
      continue;
    }
    fs.copyFileSync(src, path.join(TMP_DIR, f));
    files.push({ base: f, pdf: f.replace(/\.(pptx|docx)$/, ".pdf") });
  }
}

execSync(
  `soffice --headless --convert-to pdf --outdir "${TMP_DIR}" "${TMP_DIR}"/*.pptx "${TMP_DIR}"/*.docx`,
  { stdio: "inherit", shell: "/bin/bash" },
);

let wrote = 0;
for (const { pdf } of files) {
  const from = path.join(TMP_DIR, pdf);
  if (!fs.existsSync(from)) continue;
  fs.copyFileSync(from, path.join(OUT_DIR, pdf));
  fs.copyFileSync(from, path.join(SRC_DIR, pdf));
  wrote++;
}
console.log(`wrote ${wrote} PDFs to ${OUT_DIR}`);
