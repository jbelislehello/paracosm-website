// Rich Foundational Prompt formatter for Garden Expansion Mode

import { GARDEN_THEMES, GardenTheme } from '@/data/gardenConnections';

interface PrdData {
  id: string;
  title: string;
  status: string;
  prototype_stage: string;
  // Layers
  love_signals_summary?: string | null;
  love_decision_to_exist?: string | null;
  magic_storyworld?: string | null;
  magic_prd_outline?: string | null;
  magic_hypotheses?: string | null;
  magic_patterns?: string | null;
  calm_requirements?: string | null;
  calm_risks_and_limits?: string | null;
  open_ontology_and_graph?: string | null;
  open_real_workflow?: string | null;
  open_adjustment_plan?: string | null;
  free_first_poem_description?: string | null;
  free_totem_anthem?: string | null;
  free_success_criteria?: string | null;
  free_next_cycle_hooks?: string | null;
  // Prompt hooks
  prompt_hooks_pollens?: string | null;
  prompt_hooks_noems?: string | null;
  prompt_hooks_poems?: string | null;
  prompt_hooks_totems?: string | null;
  prompt_hooks_anthems?: string | null;
  // Stack implications
  stack_implications_pollens?: string | null;
  stack_implications_noems?: string | null;
  stack_implications_poems?: string | null;
  stack_implications_totems?: string | null;
  stack_implications_anthems?: string | null;
}

interface GardenMetrics {
  polenCount: number;
  noemsCount: number;
  completedSeasons: number;
  tilesVisited: number;
  coherence: number;
  connections: number;
}

const formatSection = (title: string, content: string | null | undefined): string => {
  if (!content?.trim()) return '';
  return `### ${title}\n${content.trim()}\n\n`;
};

const hasContent = (content: string | null | undefined): boolean => {
  return Boolean(content?.trim());
};

export const formatFoundationalPrompt = (
  prd: PrdData | null,
  metrics: GardenMetrics,
  projectName: string,
  garden: 'intelligence' | 'systems' | 'prototypes'
): string => {
  const theme = GARDEN_THEMES[garden];
  
  // If no PRD data, return basic template
  if (!prd) {
    return generateBasicTemplate(metrics, projectName, theme);
  }
  
  // Check if PRD has any meaningful content
  const hasPollenContent = hasContent(prd.love_signals_summary) || hasContent(prd.love_decision_to_exist);
  const hasNoemContent = hasContent(prd.magic_storyworld) || hasContent(prd.magic_patterns);
  const hasPoemContent = hasContent(prd.calm_requirements);
  const hasTotemContent = hasContent(prd.open_ontology_and_graph);
  const hasAnthemContent = hasContent(prd.free_totem_anthem) || hasContent(prd.free_success_criteria);
  
  const hasMeaningfulContent = hasPollenContent || hasNoemContent || hasPoemContent || hasTotemContent || hasAnthemContent;
  
  if (!hasMeaningfulContent) {
    return generateBasicTemplate(metrics, projectName, theme);
  }

  // Build rich foundational prompt
  let prompt = `# ${prd.title || projectName} — Foundational Prompt

> Generated through Calm Magic Board's ${theme.name}

---

## 🎯 Project Identity

**Status:** ${prd.status || 'In Progress'}
**Stage:** ${prd.prototype_stage || 'B_DIEGETIC'}
**Garden:** ${theme.icon} ${theme.name}

---

## 📊 Journey Metrics

| Metric | Value |
|--------|-------|
| Polen Collected | ${metrics.polenCount} |
| Noems Crystallized | ${metrics.noemsCount} |
| Seasons Completed | ${metrics.completedSeasons}/5 |
| Tiles Explored | ${metrics.tilesVisited}/64 |
| Coherence Score | ${metrics.coherence}% |

---

`;

  // POLLENS Layer
  if (hasPollenContent) {
    prompt += `## 🌱 POLLENS — Raw Signals & Context

`;
    prompt += formatSection('Signals Summary', prd.love_signals_summary);
    prompt += formatSection('Decision to Exist', prd.love_decision_to_exist);
    prompt += '---\n\n';
  }

  // NOEMS Layer
  if (hasNoemContent) {
    prompt += `## 💎 NOEMS — Conceptual Atoms

`;
    prompt += formatSection('Storyworld', prd.magic_storyworld);
    prompt += formatSection('PRD Outline', prd.magic_prd_outline);
    prompt += formatSection('Hypotheses', prd.magic_hypotheses);
    prompt += formatSection('Patterns', prd.magic_patterns);
    prompt += '---\n\n';
  }

  // POEMS Layer
  if (hasPoemContent) {
    prompt += `## 📖 POEMS — Narrative Structures

`;
    prompt += formatSection('Requirements', prd.calm_requirements);
    prompt += formatSection('Risks & Limits', prd.calm_risks_and_limits);
    prompt += '---\n\n';
  }

  // TOTEMS Layer
  if (hasTotemContent) {
    prompt += `## 🏛️ TOTEMS — Semantic Forms

`;
    prompt += formatSection('Ontology & Graph', prd.open_ontology_and_graph);
    prompt += formatSection('Real Workflow', prd.open_real_workflow);
    prompt += formatSection('Adjustment Plan', prd.open_adjustment_plan);
    prompt += '---\n\n';
  }

  // ANTHEMS Layer
  if (hasAnthemContent) {
    prompt += `## 🎵 ANTHEMS — Integration & Execution

`;
    prompt += formatSection('First Poem', prd.free_first_poem_description);
    prompt += formatSection('Totem Anthem', prd.free_totem_anthem);
    prompt += formatSection('Success Criteria', prd.free_success_criteria);
    prompt += formatSection('Next Cycle Hooks', prd.free_next_cycle_hooks);
    prompt += '---\n\n';
  }

  // Prompt Hooks (for AI)
  const hasPromptHooks = hasContent(prd.prompt_hooks_pollens) || 
                         hasContent(prd.prompt_hooks_noems) || 
                         hasContent(prd.prompt_hooks_poems) || 
                         hasContent(prd.prompt_hooks_totems) || 
                         hasContent(prd.prompt_hooks_anthems);

  if (hasPromptHooks) {
    prompt += `## 🤖 Agentic Configuration

### Prompt Hooks for AI Agents

`;
    if (hasContent(prd.prompt_hooks_pollens)) {
      prompt += `**POLLENS (Role & Identity):**\n${prd.prompt_hooks_pollens}\n\n`;
    }
    if (hasContent(prd.prompt_hooks_noems)) {
      prompt += `**NOEMS (Knowledge & Ontology):**\n${prd.prompt_hooks_noems}\n\n`;
    }
    if (hasContent(prd.prompt_hooks_poems)) {
      prompt += `**POEMS (Core Behaviors):**\n${prd.prompt_hooks_poems}\n\n`;
    }
    if (hasContent(prd.prompt_hooks_totems)) {
      prompt += `**TOTEMS (Rules & Guardrails):**\n${prd.prompt_hooks_totems}\n\n`;
    }
    if (hasContent(prd.prompt_hooks_anthems)) {
      prompt += `**ANTHEMS (Evolution & Roadmap):**\n${prd.prompt_hooks_anthems}\n\n`;
    }
    prompt += '---\n\n';
  }

  // Stack Implications
  const hasStackImplications = hasContent(prd.stack_implications_pollens) || 
                               hasContent(prd.stack_implications_noems) || 
                               hasContent(prd.stack_implications_poems) || 
                               hasContent(prd.stack_implications_totems) || 
                               hasContent(prd.stack_implications_anthems);

  if (hasStackImplications) {
    prompt += `## 🔧 Tech Stack Requirements

| Layer | Requirements |
|-------|--------------|
`;
    if (hasContent(prd.stack_implications_pollens)) {
      prompt += `| POLLENS | ${prd.stack_implications_pollens} |\n`;
    }
    if (hasContent(prd.stack_implications_noems)) {
      prompt += `| NOEMS | ${prd.stack_implications_noems} |\n`;
    }
    if (hasContent(prd.stack_implications_poems)) {
      prompt += `| POEMS | ${prd.stack_implications_poems} |\n`;
    }
    if (hasContent(prd.stack_implications_totems)) {
      prompt += `| TOTEMS | ${prd.stack_implications_totems} |\n`;
    }
    if (hasContent(prd.stack_implications_anthems)) {
      prompt += `| ANTHEMS | ${prd.stack_implications_anthems} |\n`;
    }
    prompt += '\n---\n\n';
  }

  prompt += `---

_Generated by Calm Magic Board — Creating Learning Organizations and Relational Intelligence in Humans in the AI Era_
`;

  return prompt;
};

const generateBasicTemplate = (
  metrics: GardenMetrics, 
  projectName: string, 
  theme: GardenTheme
): string => {
  return `# ${projectName} — Foundational Prompt

> Generated through Calm Magic Board's ${theme.name}

---

## ⚠️ PRD Content Pending

No Relational Intelligence-rich AI-first PRD has been generated yet.

**To generate your PRD:**
1. Complete your journey through the 64-tile matrix
2. Capture POLEN fragments during each season
3. Let insights crystallize into NOEMS
4. Build narrative structures in POEMS
5. Define technical architecture in TOTEMS
6. Create your ANTHEM for market positioning

---

## 📊 Current Journey Metrics

| Metric | Value |
|--------|-------|
| Polen Collected | ${metrics.polenCount} |
| Noems Crystallized | ${metrics.noemsCount} |
| Seasons Completed | ${metrics.completedSeasons}/5 |
| Tiles Explored | ${metrics.tilesVisited}/64 |
| Coherence Score | ${metrics.coherence}% |

---

## 🌱 ${theme.icon} ${theme.name}

Your project is rooted in the ${theme.name}, which emphasizes:
${theme.id === 'intelligence' ? '- Real (Relational) Intelligence\n- Intuitions and shared ideas\n- Cultural patterns and biases' : ''}
${theme.id === 'systems' ? '- Knowledge Objects\n- Content sources and data nodes\n- API and integration patterns' : ''}
${theme.id === 'prototypes' ? '- Understanding\n- Processes and maps\n- Three Graph Model and semantic architecture' : ''}

---

_Continue your journey to unlock the full Foundational Prompt_

_Generated by Calm Magic Board_
`;
};

export default formatFoundationalPrompt;
