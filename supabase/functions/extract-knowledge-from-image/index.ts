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
                  url: `data:image/png;base64,${imageBase64}` 
                } 
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
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

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content.trim();
    
    // Remove markdown code block wrappers if present
    // Handle: ```json\n{...}\n``` or ```\n{...}\n```
    if (jsonStr.startsWith('```')) {
      // Find the end of the opening code fence
      const firstNewline = jsonStr.indexOf('\n');
      if (firstNewline !== -1) {
        jsonStr = jsonStr.substring(firstNewline + 1);
      }
      // Remove trailing code fence
      const lastFence = jsonStr.lastIndexOf('```');
      if (lastFence !== -1) {
        jsonStr = jsonStr.substring(0, lastFence);
      }
      jsonStr = jsonStr.trim();
    }
    
    // Also try regex as fallback
    if (!jsonStr.startsWith('{') && !jsonStr.startsWith('[')) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
    }
    
    console.log('Cleaned JSON starts with:', jsonStr.substring(0, 50));

    let extraction: KnowledgeExtraction;
    try {
      extraction = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('JSON parse error, attempting cleanup...', parseError);
      // Try to fix common JSON issues
      jsonStr = jsonStr
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
        .replace(/'/g, '"');
      extraction = JSON.parse(jsonStr);
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
