// PRD Export utilities for markdown and PDF export with dimensional analysis

import { PRD_DIMENSIONS } from '@/data/prdDimensions';
import { CALM_MAGIC_DIFFERENTIATOR, WHAT_IS_A_PRD } from '@/data/prdEducation';
import { FUTURES_TYPES, VELOCITY_CONCEPT } from '@/data/futuresNavigation';

interface PrdData {
  id: string;
  title: string;
  status: string;
  prototype_stage: string;
  created_at: string;
  updated_at: string;
  // Dominant patterns
  main_dimension?: string | null;
  main_quadrant?: string | null;
  main_senge_focus?: string | null;
  main_board?: string | null;
  main_oscillation?: string | null;
  // POLLEN layer
  love_signals_summary?: string | null;
  love_decision_to_exist?: string | null;
  // NOEM layer
  magic_storyworld?: string | null;
  magic_prd_outline?: string | null;
  magic_hypotheses?: string | null;
  magic_patterns?: string | null;
  // POEM layer
  calm_requirements?: string | null;
  calm_risks_and_limits?: string | null;
  // TOTEM layer
  open_ontology_and_graph?: string | null;
  open_real_workflow?: string | null;
  open_adjustment_plan?: string | null;
  // ANTHEM layer (execution)
  free_first_poem_description?: string | null;
  free_totem_anthem?: string | null;
  free_success_criteria?: string | null;
  free_next_cycle_hooks?: string | null;
}

const STAGE_LABELS: Record<string, string> = {
  'A_POIETIC': 'A — Poietic',
  'B_DIEGETIC': 'B — Diegetic',
  'C_OPERATIONAL': 'C — Operational',
  'D_MVP': 'D — MVP',
};

const formatContent = (content: string | null | undefined): string => {
  if (!content || !content.trim()) return '_No content yet_';
  return content.trim();
};

// Generate dimensional insights summary based on layer content
const generateDimensionalInsights = (prd: PrdData): Record<string, string> => {
  const insights: Record<string, string> = {};
  
  // Ontological - from POLLEN + TOTEM
  if (prd.love_signals_summary || prd.open_ontology_and_graph) {
    insights.ontological = prd.open_ontology_and_graph || 
      `Emerging from signals: ${(prd.love_signals_summary || '').slice(0, 100)}...`;
  }
  
  // Relational - from POLLEN + NOEM
  if (prd.love_signals_summary || prd.magic_patterns) {
    insights.relational = prd.magic_patterns || 
      `Patterns of connection emerging from initial tensions`;
  }
  
  // Temporal - from POEM + ANTHEM
  if (prd.calm_requirements || prd.free_next_cycle_hooks) {
    insights.temporal = prd.free_next_cycle_hooks || 
      `Evolutionary trajectory defined by requirements`;
  }
  
  // Semantic - from TOTEM
  if (prd.open_ontology_and_graph) {
    insights.semantic = `Ontology and semantic structure established`;
  }
  
  // Ethical - from ANTHEM
  if (prd.free_success_criteria) {
    insights.ethical = `Success criteria include ethical considerations`;
  }
  
  // Ecological - from ANTHEM
  if (prd.free_totem_anthem) {
    insights.ecological = `Anthem captures ecological impact and purpose`;
  }

  return insights;
};

export const generatePrdMarkdown = (prd: PrdData): string => {
  const date = new Date(prd.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const stageLabel = STAGE_LABELS[prd.prototype_stage] || prd.prototype_stage;
  const dimensionalInsights = generateDimensionalInsights(prd);

  let md = `# ${prd.title}

> **${CALM_MAGIC_DIFFERENTIATOR.philosophy}**

**Status:** ${prd.status.charAt(0).toUpperCase() + prd.status.slice(1)}  
**Stage:** ${stageLabel}  
**Last Updated:** ${date}

---

## 📖 About This Document

${WHAT_IS_A_PRD.definition}

### Why This PRD is Different

${CALM_MAGIC_DIFFERENTIATOR.corePromise}

Traditional PRDs focus on **what to build**. This Living PRD tracks **what the system IS, LISTENS to, BECOMES, UNDERSTANDS, REFLECTS, and AFFECTS**.

---

## 🧭 Futures Navigation

| Type | Phase | Question |
|------|-------|----------|
${FUTURES_TYPES.map(f => `| ${f.icon} ${f.name} | ${f.phase} | ${f.question} |`).join('\n')}

**${VELOCITY_CONCEPT.definition}** — ${VELOCITY_CONCEPT.insight}

---

## 📐 6 Dimensional Analysis

`;

  // Add dimensional analysis
  PRD_DIMENSIONS.forEach(dim => {
    const insight = dimensionalInsights[dim.id] || '_Not yet addressed_';
    md += `### ${dim.emoji} ${dim.name} — ${dim.question}

${dim.description}

**Current Status:** ${insight}

| Perspective | View |
|-------------|------|
| 🔧 CTO | ${dim.ctoView} |
| 💰 CFO | ${dim.cfoView} |
| 👔 CEO | ${dim.ceoView} |

---

`;
  });

  // Dominant Patterns
  const patterns: string[] = [];
  if (prd.main_dimension) patterns.push(`Dimension: ${prd.main_dimension}`);
  if (prd.main_quadrant) patterns.push(`Quadrant: ${prd.main_quadrant}`);
  if (prd.main_senge_focus) patterns.push(`Senge Focus: ${prd.main_senge_focus}`);
  if (prd.main_board) patterns.push(`Board: ${prd.main_board}`);
  if (prd.main_oscillation) patterns.push(`Oscillation: ${prd.main_oscillation}`);

  if (patterns.length > 0) {
    md += `## 🎯 Dominant Patterns

${patterns.map(p => `- ${p}`).join('\n')}

---

`;
  }

  // POLLEN Layer
  md += `## 🌱 POLLEN — Raw Signals & Context

_Stage: Real Intelligence | Dimension: Ontological + Relational_

### Signals Summary
${formatContent(prd.love_signals_summary)}

### Decision to Exist
${formatContent(prd.love_decision_to_exist)}

---

`;

  // NOEM Layer
  md += `## 💎 NOEM — Conceptual Atoms

_Stage: Real Intelligence | Dimension: Relational_

### Storyworld
${formatContent(prd.magic_storyworld)}

### PRD Outline
${formatContent(prd.magic_prd_outline)}

### Hypotheses
${formatContent(prd.magic_hypotheses)}

### Patterns
${formatContent(prd.magic_patterns)}

---

`;

  // POEM Layer
  md += `## 📖 POEM — Narrative Structures

_Stage: Knowledge Objects | Dimension: Temporal_

### Requirements
${formatContent(prd.calm_requirements)}

### Risks & Limits
${formatContent(prd.calm_risks_and_limits)}

---

`;

  // TOTEM Layer
  md += `## 🏛️ TOTEM — Semantic Forms

_Stage: Understanding | Dimension: Semantic_

### Ontology & Graph
${formatContent(prd.open_ontology_and_graph)}

### Real Workflow
${formatContent(prd.open_real_workflow)}

### Adjustment Plan
${formatContent(prd.open_adjustment_plan)}

---

`;

  // ANTHEM Layer (Execution)
  md += `## 🎵 ANTHEM — Integration & Execution

_Stage: Understanding | Dimension: Ethical + Ecological_

### First Poem Description
${formatContent(prd.free_first_poem_description)}

### Totem Anthem
${formatContent(prd.free_totem_anthem)}

### Success Criteria
${formatContent(prd.free_success_criteria)}

### Next Cycle Hooks
${formatContent(prd.free_next_cycle_hooks)}

---

## 👔 C-Suite Alignment Summary

| Role | Primary Focus | Key Questions |
|------|---------------|---------------|
| **CEO** | Strategic coherence, cultural alignment | Is this organization learning? Does it transform without losing itself? |
| **CFO** | Investment governance, value tracking | Are we investing in evolutionary architecture? What's the ROI on relational intelligence? |
| **CTO** | Technical architecture, semantic structure | Does this listen before it demands? Is the ontology clear and traceable? |

---

_Generated by Calm Magic Board — Creating Learning Organizations and Relational Intelligence in Humans in the AI Era_
`;

  return md;
};

export const downloadMarkdown = (prd: PrdData): void => {
  const markdown = generatePrdMarkdown(prd);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const filename = `${prd.title.toLowerCase().replace(/\s+/g, '-')}-prd.md`;
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportPrdAsPdf = (prd: PrdData): void => {
  const markdown = generatePrdMarkdown(prd);
  
  // Convert markdown to simple HTML for print
  const html = markdownToHtml(markdown);
  
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export as PDF');
    return;
  }

  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <title>${prd.title} - Living PRD</title>
  <style>
    @media print {
      body { margin: 0.5in; }
      h1 { page-break-after: avoid; }
      h2 { page-break-after: avoid; }
      h3 { page-break-after: avoid; }
      table { page-break-inside: avoid; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      color: #1a1a1a;
    }
    h1 {
      font-size: 2rem;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 0.5rem;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.5rem;
      color: #333;
      margin-top: 2rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.25rem;
    }
    h3 {
      font-size: 1.1rem;
      color: #555;
      margin-top: 1.5rem;
    }
    p {
      margin: 0.75rem 0;
    }
    ul {
      padding-left: 1.5rem;
    }
    li {
      margin: 0.25rem 0;
    }
    hr {
      border: none;
      border-top: 1px solid #e5e5e5;
      margin: 2rem 0;
    }
    em {
      color: #888;
    }
    blockquote {
      border-left: 3px solid #6366f1;
      padding-left: 1rem;
      margin: 1rem 0;
      color: #555;
      font-style: italic;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    th, td {
      border: 1px solid #e5e5e5;
      padding: 0.5rem;
      text-align: left;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
    }
    .meta {
      color: #666;
      font-size: 0.9rem;
    }
  </style>
</head>
<body>
  ${html}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>
  `);
  
  printWindow.document.close();
};

// Enhanced markdown to HTML converter
const markdownToHtml = (md: string): string => {
  return md
    // Tables
    .replace(/\|(.+)\|\n\|[-\s|]+\|\n((?:\|.+\|\n)+)/g, (match, header, body) => {
      const headerCells = header.split('|').filter(Boolean).map((c: string) => `<th>${c.trim()}</th>`).join('');
      const bodyRows = body.trim().split('\n').map((row: string) => {
        const cells = row.split('|').filter(Boolean).map((c: string) => `<td>${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    })
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr>')
    // Line breaks to paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (match) => {
      if (match.startsWith('<')) return match;
      return `<p>${match}</p>`;
    })
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[123]>)/g, '$1')
    .replace(/(<\/h[123]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>)/g, '$1')
    .replace(/(<\/ul>)<\/p>/g, '$1')
    .replace(/<p>(<hr>)<\/p>/g, '$1')
    .replace(/<p>(<table>)/g, '$1')
    .replace(/(<\/table>)<\/p>/g, '$1')
    .replace(/<p>(<blockquote>)/g, '$1')
    .replace(/(<\/blockquote>)<\/p>/g, '$1');
};
