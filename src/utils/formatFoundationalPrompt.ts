// Rich Foundational Prompt formatter for Garden Expansion Mode
// Updated to use new PRD field structure with all 5 seasons

import { GARDEN_THEMES, GardenTheme } from '@/data/gardenConnections';

interface PrdData {
  id?: string;
  title?: string;
  status?: string;
  prototype_stage?: string;
  // POLLENS (new structure)
  pollens_aspirations?: string | null;
  pollens_team_dynamics?: string | null;
  pollens_cultural_elements?: string | null;
  pollens_relational_patterns?: string | null;
  pollens_constraints?: string | null;
  pollens_stakes?: string | null;
  // NOEMS (new structure)
  noems_concepts?: string | null;
  noems_shared_ideas?: string | null;
  noems_intuitions?: string | null;
  noems_mental_models?: string | null;
  // POEMS (new structure)
  poems_people?: string | null;
  poems_objects?: string | null;
  poems_environments?: string | null;
  poems_messages?: string | null;
  poems_systems?: string | null;
  poems_prototypes?: string | null;
  // TOTEMS (new structure)
  totems_data_architecture?: string | null;
  totems_security_policies?: string | null;
  totems_access_controls?: string | null;
  totems_system_requirements?: string | null;
  totems_integration_points?: string | null;
  totems_technical_debt?: string | null;
  // ANTHEMS (new structure)
  anthems_market_positioning?: string | null;
  anthems_brand_narrative?: string | null;
  anthems_go_to_market?: string | null;
  anthems_audience_segments?: string | null;
  anthems_success_signals?: string | null;
  anthems_storytelling_assets?: string | null;
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
  // Consciousness geometry
  consciousness_geometry?: any;
  // Legacy fields (backwards compatibility)
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
  return `**${title}:**\n${content.trim()}\n\n`;
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
  
  // Check new field structure for content
  const hasPollenContent = hasContent(prd.pollens_aspirations) || hasContent(prd.pollens_team_dynamics) || 
                           hasContent(prd.pollens_cultural_elements) || hasContent(prd.pollens_constraints);
  const hasNoemContent = hasContent(prd.noems_concepts) || hasContent(prd.noems_shared_ideas) || 
                         hasContent(prd.noems_intuitions) || hasContent(prd.noems_mental_models);
  const hasPoemContent = hasContent(prd.poems_people) || hasContent(prd.poems_objects) || 
                         hasContent(prd.poems_environments) || hasContent(prd.poems_systems);
  const hasTotemContent = hasContent(prd.totems_data_architecture) || hasContent(prd.totems_security_policies) || 
                          hasContent(prd.totems_system_requirements);
  const hasAnthemContent = hasContent(prd.anthems_market_positioning) || hasContent(prd.anthems_brand_narrative) || 
                           hasContent(prd.anthems_success_signals);
  
  const hasMeaningfulContent = hasPollenContent || hasNoemContent || hasPoemContent || hasTotemContent || hasAnthemContent;
  
  if (!hasMeaningfulContent) {
    return generateBasicTemplate(metrics, projectName, theme);
  }

  // Build rich foundational prompt
  let prompt = `# ${prd.title || projectName} — Foundational Prompt

> Generated through Calm Magic Board's ${theme.name}
> Creating Learning Organizations and Relational Intelligence in Humans in the AI Era

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

  // POLLENS Layer - Relational & Cultural Aspirations
  if (hasPollenContent) {
    prompt += `## 🌸 POLLENS — Relational & Cultural Aspirations

`;
    prompt += formatSection('Aspirations', prd.pollens_aspirations);
    prompt += formatSection('Team Dynamics', prd.pollens_team_dynamics);
    prompt += formatSection('Cultural Elements', prd.pollens_cultural_elements);
    prompt += formatSection('Relational Patterns', prd.pollens_relational_patterns);
    prompt += formatSection('Constraints', prd.pollens_constraints);
    prompt += formatSection('Stakes', prd.pollens_stakes);
    prompt += '---\n\n';
  }

  // NOEMS Layer - Conceptual Ideation
  if (hasNoemContent) {
    prompt += `## 💡 NOEMS — Conceptual Ideation & Mental Models

`;
    prompt += formatSection('Core Concepts', prd.noems_concepts);
    prompt += formatSection('Shared Ideas', prd.noems_shared_ideas);
    prompt += formatSection('Intuitions', prd.noems_intuitions);
    prompt += formatSection('Mental Models', prd.noems_mental_models);
    prompt += '---\n\n';
  }

  // POEMS Layer - P.O.E.M.S. Framework
  if (hasPoemContent) {
    prompt += `## 📖 POEMS — P.O.E.M.S. Experiential Design

> People • Objects • Environments • Messages • Systems

`;
    prompt += formatSection('People (Users & Stakeholders)', prd.poems_people);
    prompt += formatSection('Objects (Artifacts & Tools)', prd.poems_objects);
    prompt += formatSection('Environments (Contexts & Spaces)', prd.poems_environments);
    prompt += formatSection('Messages (Information Flows)', prd.poems_messages);
    prompt += formatSection('Systems (Processes & Components)', prd.poems_systems);
    prompt += formatSection('Prototypes (Early Designs)', prd.poems_prototypes);
    prompt += '---\n\n';
  }

  // TOTEMS Layer - Technical Infrastructure
  if (hasTotemContent) {
    prompt += `## 💎 TOTEMS — Technical Infrastructure & Security

`;
    prompt += formatSection('Data Architecture', prd.totems_data_architecture);
    prompt += formatSection('Security Policies', prd.totems_security_policies);
    prompt += formatSection('Access Controls', prd.totems_access_controls);
    prompt += formatSection('System Requirements', prd.totems_system_requirements);
    prompt += formatSection('Integration Points', prd.totems_integration_points);
    prompt += formatSection('Technical Debt', prd.totems_technical_debt);
    prompt += '---\n\n';
  }

  // ANTHEMS Layer - Market & Storytelling
  if (hasAnthemContent) {
    prompt += `## 🎵 ANTHEMS — Market Positioning & Storytelling

`;
    prompt += formatSection('Market Positioning', prd.anthems_market_positioning);
    prompt += formatSection('Brand Narrative', prd.anthems_brand_narrative);
    prompt += formatSection('Go-to-Market Strategy', prd.anthems_go_to_market);
    prompt += formatSection('Audience Segments', prd.anthems_audience_segments);
    prompt += formatSection('Success Signals', prd.anthems_success_signals);
    prompt += formatSection('Storytelling Assets', prd.anthems_storytelling_assets);
    prompt += '---\n\n';
  }

  // Consciousness Geometry (if available)
  if (prd.consciousness_geometry) {
    const cg = prd.consciousness_geometry;
    prompt += `## 🧠 Consciousness Geometry

| Metric | Value |
|--------|-------|
| Complexity Bits | ${cg.complexityBits || 'N/A'} |
| Threshold Progress | ${cg.thresholdPercentage || 0}% |
| Consciousness State | ${cg.consciousnessState || 'pre-conscious'} |
| Thermodynamic Efficiency | ${((cg.thermodynamicEfficiency || 0) * 100).toFixed(1)}% |
| Integration Strength | ${((cg.integrationStrength || 0) * 100).toFixed(1)}% |

${cg.geometricNarrative ? `**Geometric Narrative:** ${cg.geometricNarrative}\n\n` : ''}
${cg.recursiveNarrative ? `**Recursive Narrative:** ${cg.recursiveNarrative}\n\n` : ''}
---

`;
  }

  // Prompt Hooks (for AI agents)
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
    prompt += `## 🔧 8-Layer Agentic Architecture

| Layer | Requirements |
|-------|--------------|
`;
    if (hasContent(prd.stack_implications_pollens)) {
      prompt += `| L1-L2 Infrastructure/Agent Internet | ${prd.stack_implications_pollens} |\n`;
    }
    if (hasContent(prd.stack_implications_noems)) {
      prompt += `| L5-L6 Cognition/Memory | ${prd.stack_implications_noems} |\n`;
    }
    if (hasContent(prd.stack_implications_poems)) {
      prompt += `| L4-L7 Tooling/Application | ${prd.stack_implications_poems} |\n`;
    }
    if (hasContent(prd.stack_implications_totems)) {
      prompt += `| L3 Protocol | ${prd.stack_implications_totems} |\n`;
    }
    if (hasContent(prd.stack_implications_anthems)) {
      prompt += `| L8 Governance | ${prd.stack_implications_anthems} |\n`;
    }
    prompt += '\n---\n\n';
  }

  prompt += `---

_Generated by Calm Magic Board — Creating Learning Organizations and Relational Intelligence in Humans in the AI Era_

_This Foundational Prompt is designed to be consumed by agentic AI systems as a system prompt or context injection._
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
