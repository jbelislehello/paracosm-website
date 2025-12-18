import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExtractedEntity {
  name: string;
  type: 'concept' | 'term' | 'category' | 'relationship' | 'property';
  description?: string;
}

interface ExtractedRelation {
  from: string;
  to: string;
  type: 'parent_of' | 'child_of' | 'associated_with' | 'simpler_than' | 'richer_than' | 'part_of' | 'scope';
}

interface PlaybookSeed {
  title: string;
  description: string;
  targetLayer?: 'A' | 'B' | 'C';
  complexity: 'low' | 'medium' | 'high';
}

interface KnowledgeExtraction {
  entities: ExtractedEntity[];
  relations: ExtractedRelation[];
  knowledgeType: 'pick-list' | 'taxonomy' | 'thesaurus' | 'ontology';
  governanceLayer?: 'A' | 'B' | 'C';
  properties: Record<string, string[]>;
  playbookSeeds: PlaybookSeed[];
  summary: string;
}

function cleanupJsonString(input: string): string {
  return input
    .trim()
    // Remove trailing commas
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']')
    // Replace smart quotes
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    // Remove JS-style comments (rare but happens)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

function extractFirstJsonObject(content: string): string {
  // Strip code fences if present
  let s = content.trim();
  if (s.startsWith('```')) {
    const firstNewline = s.indexOf('\n');
    if (firstNewline !== -1) s = s.slice(firstNewline + 1);
    const lastFence = s.lastIndexOf('```');
    if (lastFence !== -1) s = s.slice(0, lastFence);
    s = s.trim();
  }

  // Find first object/array start
  const startObj = s.indexOf('{');
  const startArr = s.indexOf('[');
  let start = -1;
  if (startObj !== -1 && startArr !== -1) start = Math.min(startObj, startArr);
  else start = startObj !== -1 ? startObj : startArr;

  if (start === -1) {
    // Last resort: return whole string; JSON.parse will throw with context.
    return s;
  }

  // Brace/Bracket matching with string/escape awareness
  let inString = false;
  let stringQuote: '"' | "'" | null = null;
  let escape = false;
  const stack: string[] = [];

  for (let i = start; i < s.length; i++) {
    const ch = s[i];

    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (ch === '\\') {
        escape = true;
        continue;
      }
      if (stringQuote && ch === stringQuote) {
        inString = false;
        stringQuote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringQuote = ch as '"' | "'";
      continue;
    }

    if (ch === '{') stack.push('}');
    else if (ch === '[') stack.push(']');
    else if (ch === '}' || ch === ']') {
      const expected = stack.pop();
      if (expected !== ch) {
        // Mismatched close, break and let JSON.parse complain.
        break;
      }
      if (stack.length === 0) {
        return s.slice(start, i + 1).trim();
      }
    }
  }

  // If we couldn't find a balanced end, fall back to greedy object match.
  const greedy = s.match(/\{[\s\S]*\}/);
  return (greedy?.[0] ?? s).trim();
}

async function repairJsonViaModel(
  lovableApiKey: string,
  candidateJson: string,
): Promise<string> {
  console.log('Attempting JSON repair via model...');

  const repairResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${lovableApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content:
            'You fix invalid JSON. Return ONLY valid JSON (no markdown). Use double quotes for keys/strings. Remove trailing commas. Escape newlines in strings as \\n. Do not truncate output; ensure all arrays/objects are properly closed.',
        },
        {
          role: 'user',
          content:
            'Fix this to be valid JSON. Do not change the schema/meaning; only correct JSON syntax. Output ONLY JSON.\n\n' +
            candidateJson,
        },
      ],
      temperature: 0,
      max_tokens: 7000,
    }),
  });

  if (!repairResponse.ok) {
    const t = await repairResponse.text();
    console.error('JSON repair call failed:', repairResponse.status, t);
    throw new Error(`JSON repair failed: ${repairResponse.status}`);
  }

  const repairData = await repairResponse.json();
  const repairedContent = repairData.choices?.[0]?.message?.content;
  if (!repairedContent) throw new Error('No content from JSON repair');

  const extracted = extractFirstJsonObject(repairedContent);
  return cleanupJsonString(extracted);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, context } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ success: false, error: 'No image provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'LOVABLE_API_KEY not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const systemPrompt = `You are a knowledge extraction specialist for PRODAGO - an ontological framework for data and AI governance created by Mario Cantin.

Your task is to analyze images (diagrams, frameworks, mind maps, organizational charts, process flows) and extract structured knowledge objects.

PRODAGO Context:
- Focuses on organizing knowledge from simple Pick-Lists to complex Ontologies
- Uses a 3-layer AI Governance model:
  - Layer A (Environmental): Hard Law, Standards, Business Objectives, Principles, Risk Tolerance
  - Layer B (Governance): AI Readiness, Governance Operations
  - Layer C (AI Systems): Data Operations, Risk Management, Cyber Security, Ethics & Privacy, Systems & Models
- Creates actionable Playbooks for AI governance

${context ? `Additional Context: ${context}` : ''}

EXTRACTION RULES:
1. Identify ALL named entities (concepts, terms, categories, relationships, properties)
2. Map relationships between entities (hierarchies, associations, scopes)
3. Determine the Knowledge System Type:
   - Pick-List: Simple enumeration
   - Taxonomy: Hierarchical classification
   - Thesaurus: Taxonomy + synonyms + relationships
   - Ontology: Full semantic model with inference rules
4. Identify applicable Governance Layer (A, B, or C)
5. Generate Playbook Seeds - actionable governance playbook ideas

Return ONLY valid JSON matching this exact structure.`;

    const userPrompt = `Analyze this image and extract knowledge objects.

Return a JSON object with this exact structure:
{
  "entities": [{"name": "string", "type": "concept|term|category|relationship|property", "description": "optional string"}],
  "relations": [{"from": "entity name", "to": "entity name", "type": "parent_of|child_of|associated_with|simpler_than|richer_than|part_of|scope"}],
  "knowledgeType": "pick-list|taxonomy|thesaurus|ontology",
  "governanceLayer": "A|B|C or null",
  "properties": {"entity name": ["property1", "property2"]},
  "playbookSeeds": [{"title": "string", "description": "string", "targetLayer": "A|B|C or null", "complexity": "low|medium|high"}],
  "summary": "Brief summary of the extracted knowledge"
}`;

    console.log('Calling Lovable AI Gateway for knowledge extraction...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/png;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0,
        max_tokens: 3200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: 'Rate limit exceeded. Please try again later.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: 'API credits exhausted. Please add credits.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 402 }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI response received, parsing JSON...');
    console.log('Raw content length:', content.length);

    // Extract and sanitize JSON from the model output.
    // Models sometimes return extra prose, code fences, or comments; we defensively extract the first JSON object.
    const jsonStr = extractFirstJsonObject(content);

    console.log('Extracted JSON length:', jsonStr.length);
    console.log('Extracted JSON preview:', jsonStr.substring(0, 120));

    let extraction: KnowledgeExtraction;
    try {
      extraction = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error. Attempting cleanup...', parseError);

      const cleaned = cleanupJsonString(jsonStr);
      try {
        extraction = JSON.parse(cleaned);
      } catch (parseError2) {
        console.error('JSON parse still failing after cleanup.', parseError2);
        // Helpful context for debugging without logging the full payload.
        console.error('Failing JSON tail:', cleaned.substring(Math.max(0, cleaned.length - 400)));

        // Last resort: ask the model to repair to strict JSON.
        const repaired = await repairJsonViaModel(lovableApiKey, cleaned.substring(0, 20000));
        console.log('Repaired JSON length:', repaired.length);

        try {
          extraction = JSON.parse(repaired);
        } catch (repairParseError) {
          console.error('Repaired JSON still invalid, attempting cleanup parse...', repairParseError);
          extraction = JSON.parse(cleanupJsonString(repaired));
        }
      }
    }

    // Validate and set defaults
    extraction = {
      entities: extraction.entities || [],
      relations: extraction.relations || [],
      knowledgeType: extraction.knowledgeType || 'taxonomy',
      governanceLayer: extraction.governanceLayer || undefined,
      properties: extraction.properties || {},
      playbookSeeds: extraction.playbookSeeds || [],
      summary: extraction.summary || 'Knowledge extracted from image'
    };

    console.log(`Extraction complete: ${extraction.entities.length} entities, ${extraction.playbookSeeds.length} playbook seeds`);

    return new Response(
      JSON.stringify({ success: true, extraction }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Knowledge extraction error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
