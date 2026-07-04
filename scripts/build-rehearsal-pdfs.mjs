// Convert the rehearsal deck (.pptx) and workbook (.docx) to PDF via LibreOffice,
// then copy the PDFs into public/downloads/ so the site can serve them.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const SRC_DIR = "/mnt/documents";
const OUT_DIR = path.resolve("public/downloads");
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "rehearsal-pdfs-"));

const files = [
  "rehearsal-arc-facilitator-deck.pptx",
  "rehearsal-arc-workbook.docx",
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const f of files) {
  const src = path.join(SRC_DIR, f);
  if (!fs.existsSync(src)) {
    console.warn(`skip: ${src} not found — run build:rehearsal-deck / build:rehearsal-workbook first`);
    continue;
  }
  fs.copyFileSync(src, path.join(TMP_DIR, f));
}

execSync(
  `soffice --headless --convert-to pdf --outdir "${TMP_DIR}" "${TMP_DIR}"/*.pptx "${TMP_DIR}"/*.docx`,
  { stdio: "inherit", shell: "/bin/bash" }
);

for (const f of files) {
  const pdf = f.replace(/\.(pptx|docx)$/, ".pdf");
  const from = path.join(TMP_DIR, pdf);
  const to = path.join(OUT_DIR, pdf);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, to);
    fs.copyFileSync(from, path.join(SRC_DIR, pdf));
    console.log(`wrote: ${to}`);
  }
}
