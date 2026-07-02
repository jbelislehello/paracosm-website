import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { checkRateLimit } from "../_shared/rateLimit.ts";
import { requireUser } from "../_shared/requireUser.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// OECD Principles for context
const OECD_PRINCIPLES = [
  { id: 'inclusive-growth', name: 'Inclusive Growth, Sustainable Development and Well-being', category: 'values' },
  { id: 'human-centered', name: 'Human-Centered Values and Fairness', category: 'values' },
  { id: 'transparency', name: 'Transparency and Explainability', category: 'values' },
  { id: 'safety', name: 'Robustness, Security and Safety', category: 'values' },
  { id: 'accountability', name: 'Accountability', category: 'values' },
  { id: 'innovation', name: 'Investing in AI Research and Development', category: 'policy' },
  { id: 'ecosystem', name: 'Fostering a Digital Ecosystem for AI', category: 'policy' },
  { id: 'policy-env', name: 'Shaping an Enabling Policy Environment for AI', category: 'policy' },
  { id: 'capacity', name: 'Building Human Capacity and Preparing for Labour Market Transition', category: 'policy' },
  { id: 'cooperation', name: 'International Co-operation for Trustworthy AI', category: 'policy' },
];

// AI Governance Frameworks for cross-referencing
const FRAMEWORKS = [
  { id: 'eu-ai-act', name: 'EU AI Act', emoji: '🇪🇺' },
  { id: 'nist-ai-rmf', name: 'NIST AI RMF', emoji: '🇺🇸' },
  { id: 'iso-42001', name: 'ISO 42001', emoji: '📋' },
  { id: 'singapore-mf', name: 'Singapore AIGF', emoji: '🇸🇬' },
  { id: 'ieee-7000', name: 'IEEE 7000', emoji: '⚡' },
  { id: 'google-saif', name: 'Google SAIF', emoji: '🔒' },
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Per-IP rate limit to prevent unauthenticated AI credit abuse.
  const _auth = await requireUser(req);
  if (_auth instanceof Response) return _auth;

  const _rl = checkRateLimit(req, { limit: 20, windowMs: 60_000 });
  if (_rl) return _rl;

  try {
    const { prdContent, prdTitle } = await req.json();
    
    if (!prdContent) {
      return new Response(
        JSON.stringify({ error: 'PRD content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing PRD for OECD principles:', prdTitle || 'Untitled');

    const systemPrompt = `You are an expert AI governance analyst specializing in the OECD Framework for Classification of AI Systems. Your task is to analyze product requirements documents (PRDs) and assess their alignment with OECD AI principles and trending governance frameworks.

## OECD AI Principles to Evaluate:
${OECD_PRINCIPLES.map(p => `- ${p.id}: ${p.name} (${p.category})`).join('\n')}

## Governance Frameworks for Cross-Reference:
${FRAMEWORKS.map(f => `- ${f.id}: ${f.emoji} ${f.name}`).join('\n')}

## Analysis Guidelines:
1. Carefully read the PRD content from all layers (POLLENS, NOEMS, POEMS, TOTEMS, ANTHEMS)
2. For each OECD principle, assess how well the PRD addresses it
3. Provide specific evidence from the PRD text
4. Identify gaps where principles are not adequately addressed
5. Cross-reference with relevant governance frameworks
6. Suggest specific improvements

Be thorough but concise. Focus on actionable insights.`;

    const userPrompt = `Analyze this PRD for OECD AI principle alignment:

${prdTitle ? `# ${prdTitle}` : '# PRD Analysis'}

${prdContent}

---

Provide a comprehensive analysis of how this PRD aligns with OECD AI principles and governance frameworks.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'analyze_oecd_alignment',
            description: 'Analyze PRD alignment with OECD AI principles and governance frameworks',
            parameters: {
              type: 'object',
              properties: {
                matches: {
                  type: 'array',
                  description: 'Principles that are well-addressed in the PRD',
                  items: {
                    type: 'object',
                    properties: {
                      principleId: { type: 'string', description: 'OECD principle ID' },
                      score: { type: 'number', description: 'Alignment score 0-100' },
                      reasoning: { type: 'string', description: 'Why this principle is addressed' },
                      matchedConcepts: { 
                        type: 'array', 
                        items: { type: 'string' },
                        description: 'Key concepts from PRD that support this principle'
                      },
                      suggestedLayers: {
                        type: 'array',
                        items: { type: 'string', enum: ['A', 'B', 'C'] },
                        description: 'Governance layers this applies to'
                      },
                      relatedFrameworks: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'IDs of related governance frameworks'
                      }
                    },
                    required: ['principleId', 'score', 'reasoning', 'matchedConcepts', 'suggestedLayers']
                  }
                },
                gaps: {
                  type: 'array',
                  description: 'Principles that are missing or inadequately addressed',
                  items: {
                    type: 'object',
                    properties: {
                      principleId: { type: 'string', description: 'OECD principle ID' },
                      severity: { type: 'string', enum: ['low', 'medium', 'high'] },
                      recommendation: { type: 'string', description: 'How to address this gap' },
                      suggestedContent: { type: 'string', description: 'Example content to add' }
                    },
                    required: ['principleId', 'severity', 'recommendation']
                  }
                },
                frameworkAlignment: {
                  type: 'array',
                  description: 'Alignment with each governance framework',
                  items: {
                    type: 'object',
                    properties: {
                      frameworkId: { type: 'string' },
                      alignment: { type: 'string', enum: ['high', 'medium', 'low', 'none'] },
                      score: { type: 'number', description: 'Alignment score 0-100' },
                      relevantArticles: { 
                        type: 'array', 
                        items: { type: 'string' },
                        description: 'Specific framework articles/principles that apply'
                      }
                    },
                    required: ['frameworkId', 'alignment', 'score']
                  }
                },
                overallScore: { 
                  type: 'number', 
                  description: 'Overall OECD alignment score 0-100' 
                },
                insights: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Key insights and recommendations (3-5 items)'
                }
              },
              required: ['matches', 'gaps', 'frameworkAlignment', 'overallScore', 'insights']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'analyze_oecd_alignment' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract the tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'analyze_oecd_alignment') {
      console.error('Unexpected AI response format:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisResult = JSON.parse(toolCall.function.arguments);
    
    // Enrich with full principle data
    const enrichedResult = {
      ...analysisResult,
      matches: analysisResult.matches.map((m: Record<string, unknown>) => ({
        ...m,
        principle: OECD_PRINCIPLES.find(p => p.id === m.principleId)
      })),
      gaps: analysisResult.gaps.map((g: Record<string, unknown>) => ({
        ...g,
        principle: OECD_PRINCIPLES.find(p => p.id === g.principleId)
      })),
      frameworkAlignment: analysisResult.frameworkAlignment.map((f: Record<string, unknown>) => ({
        ...f,
        framework: FRAMEWORKS.find(fw => fw.id === f.frameworkId)
      })),
      analysisMode: 'ai',
      analyzedAt: new Date().toISOString()
    };

    console.log('Analysis complete. Overall score:', enrichedResult.overallScore);

    return new Response(
      JSON.stringify(enrichedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-oecd-principles:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
