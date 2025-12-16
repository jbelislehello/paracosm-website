import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type ViewMode = 'isometric' | 'diamond' | 'spiral' | 'charts' | 'coordinates' | 'cycles' | 'flow' | 'projection';

interface TopologyRequest {
  viewMode: ViewMode;
  journeyPath: Array<{ row: number; col: number }>;
  visitedTiles: string[];
  densityMap: Record<string, number>;
  shadowPosition?: { x: number; y: number };
  higherSelfPosition?: { x: number; y: number };
  currentSeason?: string;
  seasonProgress?: Record<string, number>;
  currentUnlockedRing?: number;
}

// CONCRETE daily questions and insights for each view - these are PRACTICAL
const VIEW_CONCRETE_CONFIG: Record<ViewMode, { 
  dailyQuestion: string;
  viewPurpose: string;
  getActionableInsight: (stats: JourneyStats) => string;
  getWarningSignal: (stats: JourneyStats) => string | null;
  getCelebrationSignal: (stats: JourneyStats) => string | null;
}> = {
  isometric: {
    dailyQuestion: "Qu'ai-je FAIT vs ÉVITÉ aujourd'hui?",
    viewPurpose: "Voir le territoire conquis vs ignoré",
    getActionableInsight: (stats) => {
      if (stats.gaps.length > 0) {
        return `Le quadrant ${stats.gaps[0]} est inexploré. Une tile là-bas pourrait débloquer une nouvelle perspective.`;
      }
      if (stats.coverage < 25) {
        return `Vous avez exploré ${stats.coverage}% du territoire. Choisissez une direction et explorez 3 tiles consécutives.`;
      }
      return `Votre territoire couvre ${stats.coverage}%. Identifiez la zone où vous êtes le plus à l'aise et posez-vous: pourquoi là?`;
    },
    getWarningSignal: (stats) => {
      if (stats.gaps.length >= 2) return `⚠️ ${stats.gaps.length} quadrants sont complètement ignorés`;
      if (stats.coverage > 50 && stats.avgDensity < 1) return `⚠️ Large couverture mais peu de profondeur`;
      return null;
    },
    getCelebrationSignal: (stats) => {
      if (stats.coverage >= 75) return `🎉 Plus de 75% exploré - vous approchez de l'intégration complète`;
      if (stats.gaps.length === 0 && stats.coverage > 30) return `🎉 Tous les quadrants sont représentés - exploration équilibrée`;
      return null;
    }
  },
  diamond: {
    dailyQuestion: "Exploration ou Exécution - est-ce le bon mode?",
    viewPurpose: "Voir si vous divergez (découverte) ou convergez (définition)",
    getActionableInsight: (stats) => {
      const discoveryTiles = stats.quadrants.SN + stats.quadrants.IN; // North = Novelty
      const deliveryTiles = stats.quadrants.SM + stats.quadrants.IM; // South = Memory
      const ratio = discoveryTiles / Math.max(deliveryTiles, 1);
      if (ratio > 2) {
        return `Vous êtes en mode Découverte intense (ratio ${ratio.toFixed(1)}:1). Temps de Définir? Prenez un insight et faites-en un engagement.`;
      }
      if (ratio < 0.5) {
        return `Mode Livraison dominant. Si vous vous sentez coincé, revenez en mode Découverte - explorez une nouvelle direction.`;
      }
      return `Équilibre Découverte/Livraison. Posez-vous: quelle phase nécessite mon attention MAINTENANT?`;
    },
    getWarningSignal: (stats) => {
      const discoveryTiles = stats.quadrants.SN + stats.quadrants.IN;
      const deliveryTiles = stats.quadrants.SM + stats.quadrants.IM;
      if (discoveryTiles > 0 && deliveryTiles === 0) return `⚠️ Beaucoup d'exploration mais aucune concrétisation`;
      if (deliveryTiles > 0 && discoveryTiles === 0) return `⚠️ Exécution sans exploration - risque de solutions connues`;
      return null;
    },
    getCelebrationSignal: (stats) => {
      const discoveryTiles = stats.quadrants.SN + stats.quadrants.IN;
      const deliveryTiles = stats.quadrants.SM + stats.quadrants.IM;
      const ratio = discoveryTiles / Math.max(deliveryTiles, 1);
      if (ratio >= 0.7 && ratio <= 1.4 && stats.visitedCount > 16) return `🎉 Bel équilibre Découverte/Livraison - rythme de design sain`;
      return null;
    }
  },
  spiral: {
    dailyQuestion: "Ma capacité s'est-elle élargie cette semaine?",
    viewPurpose: "Voir l'expansion de votre fenêtre de tolérance",
    getActionableInsight: (stats) => {
      if (stats.currentRing === 1) {
        return `Vous êtes dans le Cœur Intérieur (Ring 1). C'est bien de commencer par la sécurité. Explorez 3 tiles de plus pour débloquer Ring 2.`;
      }
      if (stats.currentRing === 2) {
        return `Ring 2: Spaciosité. Vous pouvez tenir plus de paradoxe. Essayez une tile qui vous met légèrement mal à l'aise.`;
      }
      if (stats.currentRing === 3) {
        return `Ring 3: Ouverture. Vous êtes au bord productif. Une tile d'intégrateur (coin) complèterait votre expansion.`;
      }
      return `Ring 4: Liberté. Vous avez une grande capacité. Utilisez-la pour tenir des tensions que vous évitez ailleurs.`;
    },
    getWarningSignal: (stats) => {
      if (stats.ringCounts[1] > 12 && stats.currentRing === 1) return `⚠️ Vous restez longtemps dans la zone de confort`;
      if (stats.ringCounts[4] > 0 && stats.ringCounts[2] < 5) return `⚠️ Saut aux coins sans expansion graduelle - risque de surcharge`;
      return null;
    },
    getCelebrationSignal: (stats) => {
      if (stats.currentRing >= 3) return `🎉 Ring ${stats.currentRing} atteint - votre capacité a significativement grandi`;
      if (stats.ringCounts[2] >= 10) return `🎉 Solid progression dans la Zone Stretch`;
      return null;
    }
  },
  charts: {
    dailyQuestion: "Où est ma connaissance profonde vs superficielle?",
    viewPurpose: "Voir la densité d'engagement par zone",
    getActionableInsight: (stats) => {
      if (stats.maxDensity >= 5) {
        return `Vous avez des zones très profondes (${stats.maxDensity} fragments). Ces îlots de sagesse sont votre ancrage. Que révèlent-ils sur vos vraies priorités?`;
      }
      if (stats.avgDensity < 1.5) {
        return `Exploration large mais peu profonde (moy: ${stats.avgDensity}). Choisissez une tile visitée et ajoutez 2-3 fragments de plus.`;
      }
      return `Densité moyenne équilibrée. Identifiez la tile la plus riche - c'est probablement votre sujet central.`;
    },
    getWarningSignal: (stats) => {
      if (stats.visitedCount > 20 && stats.avgDensity < 0.5) return `⚠️ Beaucoup de tiles survolées - peu d'ancrage profond`;
      return null;
    },
    getCelebrationSignal: (stats) => {
      if (stats.avgDensity >= 2.5) return `🎉 Belle profondeur moyenne - vous vous engagez vraiment avec le matériel`;
      if (stats.maxDensity >= 8) return `🎉 Au moins une zone très profonde - un centre de gravité émerge`;
      return null;
    }
  },
  coordinates: {
    dailyQuestion: "Connecté ou indépendant? Connu ou nouveau?",
    viewPurpose: "Voir votre position sur les axes fondamentaux",
    getActionableInsight: (stats) => {
      const xBias = (stats.quadrants.IN + stats.quadrants.IM) - (stats.quadrants.SN + stats.quadrants.SM);
      const yBias = (stats.quadrants.SN + stats.quadrants.IN) - (stats.quadrants.SM + stats.quadrants.IM);
      
      const xLabel = xBias > 2 ? "vers l'Intimité (connexion)" : xBias < -2 ? "vers la Souveraineté (indépendance)" : "équilibré sur l'axe X";
      const yLabel = yBias > 2 ? "vers la Nouveauté (exploration)" : yBias < -2 ? "vers la Mémoire (ancrage)" : "équilibré sur l'axe Y";
      
      return `Vous tendez ${xLabel} et ${yLabel}. Ce positionnement reflète-t-il votre intention ou une habitude inconsciente?`;
    },
    getWarningSignal: (stats) => {
      const total = stats.visitedCount;
      const maxQ = Math.max(...Object.values(stats.quadrants));
      if (maxQ > total * 0.6) return `⚠️ Plus de 60% dans un seul quadrant - déséquilibre prononcé`;
      return null;
    },
    getCelebrationSignal: (stats) => {
      const values = Object.values(stats.quadrants);
      const max = Math.max(...values);
      const min = Math.min(...values);
      if (max - min <= 3 && stats.visitedCount > 16) return `🎉 Distribution très équilibrée - vous naviguez tous les axes`;
      return null;
    }
  },
  cycles: {
    dailyQuestion: "Quels thèmes reviennent sans résolution?",
    viewPurpose: "Voir les patterns récurrents dans votre parcours",
    getActionableInsight: (stats) => {
      if (stats.clusters.length > 0) {
        return `Cluster détecté en ${stats.clusters[0]}. Ce quadrant vous attire - explorez POURQUOI. Qu'est-ce qui reste non-résolu?`;
      }
      if (stats.pathLength > stats.visitedCount * 1.5) {
        return `Vous revenez souvent sur vos pas (ratio ${(stats.pathLength / stats.visitedCount).toFixed(1)}:1). Ces retours sont-ils intégration ou évitement?`;
      }
      return `Parcours plutôt linéaire. Les cycles apparaîtront avec plus d'exploration. Notez ce qui vous attire à nouveau.`;
    },
    getWarningSignal: (stats) => {
      if (stats.clusters.length >= 2) return `⚠️ Plusieurs clusters - attention à la rumination vs l'exploration`;
      return null;
    },
    getCelebrationSignal: (stats) => {
      if (stats.pathLength > stats.visitedCount && stats.gaps.length === 0) return `🎉 Vous revisitez ET explorez - signe d'intégration saine`;
      return null;
    }
  },
  flow: {
    dailyQuestion: "Qu'est-ce qui me nourrit vs me draine?",
    viewPurpose: "Voir où votre énergie est attirée ou repoussée",
    getActionableInsight: (stats) => {
      if (stats.clusters.length > 0) {
        return `L'énergie s'accumule en ${stats.clusters.join(', ')}. Ces zones vous nourrissent - ou vous coincent. Lequel est-ce?`;
      }
      if (stats.gaps.length > 0) {
        return `L'énergie évite ${stats.gaps.join(', ')}. Ces zones vous drainent-elles, ou sont-elles simplement inconnues?`;
      }
      return `Flow distribué. Identifiez la tile où vous vous sentez le plus VIVANT - et la tile que vous évitez. Le contraste est révélateur.`;
    },
    getWarningSignal: (stats) => {
      if (stats.gaps.length >= 2 && stats.clusters.length >= 1) return `⚠️ Fort déséquilibre énergétique - certaines zones drainent`;
      return null;
    },
    getCelebrationSignal: (stats) => {
      if (stats.gaps.length === 0 && stats.visitedCount > 24) return `🎉 Énergie distribuée partout - vous avez une bonne régulation`;
      return null;
    }
  },
  projection: {
    dailyQuestion: "Quelles connexions cachées existent?",
    viewPurpose: "Voir les relations invisibles entre tiles distantes",
    getActionableInsight: (stats) => {
      const hasCorners = stats.ringCounts[4] > 0;
      const hasCenter = stats.ringCounts[1] > 8;
      
      if (hasCorners && hasCenter) {
        return `Vous avez centre ET périphérie. Les coins sont connectés via le tore - vos insights extrêmes se parlent. Quels patterns émergent?`;
      }
      if (hasCorners && !hasCenter) {
        return `Coins sans centre. Vos insights périphériques manquent d'ancrage. Explorez les tiles centrales pour connecter.`;
      }
      if (hasCenter && !hasCorners) {
        return `Centre solide mais pas de périphérie. Les connexions cachées apparaîtront quand vous explorerez les bords.`;
      }
      return `Ni centre fort ni périphérie. Commencez par le centre, puis les coins - la topologie révélera ses secrets.`;
    },
    getWarningSignal: (stats) => {
      if (stats.ringCounts[1] > 12 && stats.ringCounts[4] === 0) return `⚠️ Exploration uniquement centrale - les connexions distantes restent cachées`;
      return null;
    },
    getCelebrationSignal: (stats) => {
      if (stats.ringCounts[1] >= 8 && stats.ringCounts[4] >= 2) return `🎉 Centre et périphérie connectés - la structure toroïdale devient visible`;
      return null;
    }
  }
};

// Story themes and mysteries for each view
const VIEW_STORY_CONFIG: Record<ViewMode, { 
  storyTitle: string;
  mysteryType: string;
  openingPrompt: string;
  chapterThemes: string[];
}> = {
  isometric: {
    storyTitle: "The Map of Your Exploration",
    mysteryType: "spatial mystery",
    openingPrompt: "What territories have you claimed? What lands remain in shadow?",
    chapterThemes: ["The Territory Claimed", "The Boundaries You Set", "The Unknown Beyond"]
  },
  diamond: {
    storyTitle: "The Dance of Opening and Closing",
    mysteryType: "creative rhythm mystery", 
    openingPrompt: "Are you expanding possibilities or narrowing to clarity?",
    chapterThemes: ["The Breath of Discovery", "The Moment of Definition", "The Pulse of Creation"]
  },
  spiral: {
    storyTitle: "The Growing Circle of What You Can Hold",
    mysteryType: "capacity mystery",
    openingPrompt: "How much more can you embrace than when you began?",
    chapterThemes: ["The Seed of Calm", "The Expansion of Spaciousness", "The Edge of New Freedom"]
  },
  charts: {
    storyTitle: "The Atlas You Are Drawing",
    mysteryType: "cartography mystery",
    openingPrompt: "What charts have you drawn? What remains uncharted?",
    chapterThemes: ["The Charts You've Drawn", "The Patterns in Your Maps", "The Territory Calling"]
  },
  coordinates: {
    storyTitle: "Where You Stand Right Now",
    mysteryType: "location mystery",
    openingPrompt: "This precise point—why here? Why now?",
    chapterThemes: ["The Crossroads You've Reached", "The Meaning of This Place", "The Direction You Face"]
  },
  cycles: {
    storyTitle: "What Keeps Coming Back",
    mysteryType: "recurrence mystery",
    openingPrompt: "What patterns circle back to find you?",
    chapterThemes: ["The Loops You've Traced", "The Incomplete Circles", "The Cycle Seeking Closure"]
  },
  flow: {
    storyTitle: "Where Your Attention Flows",
    mysteryType: "momentum mystery",
    openingPrompt: "What pulls you? What releases you?",
    chapterThemes: ["The Attractors in Your Field", "The Currents of Your Journey", "The Flow Awaiting You"]
  },
  projection: {
    storyTitle: "The Connections You Cannot See",
    mysteryType: "hidden structure mystery",
    openingPrompt: "What neighbors hide when the surface unfolds?",
    chapterThemes: ["The Hidden Proximities", "The Structure Beneath", "The Connections Emerging"]
  }
};

interface JourneyStats {
  coverage: number;
  visitedCount: number;
  totalTiles: number;
  quadrants: Record<string, number>;
  avgDensity: number;
  maxDensity: number;
  ringCounts: Record<number, number>;
  currentRing: number;
  pathLength: number;
  gaps: string[];
  clusters: string[];
}

function calculateJourneyStats(request: TopologyRequest): JourneyStats {
  const { journeyPath, visitedTiles, densityMap, currentUnlockedRing } = request;
  
  const totalTiles = 64;
  const visitedCount = visitedTiles.length;
  const coverage = Math.round((visitedCount / totalTiles) * 100);
  
  // Calculate quadrant distribution
  const quadrants: Record<string, number> = { SN: 0, IN: 0, IM: 0, SM: 0 };
  visitedTiles.forEach(tileKey => {
    const [row, col] = tileKey.split('-').map(Number);
    const isNorth = row >= 4;
    const isEast = col >= 4;
    if (isNorth && !isEast) quadrants.SN++;
    else if (isNorth && isEast) quadrants.IN++;
    else if (!isNorth && isEast) quadrants.IM++;
    else quadrants.SM++;
  });
  
  // Calculate density stats
  const densityValues = Object.values(densityMap);
  const avgDensity = densityValues.length > 0 
    ? densityValues.reduce((a, b) => a + b, 0) / densityValues.length 
    : 0;
  const maxDensity = densityValues.length > 0 ? Math.max(...densityValues) : 0;
  
  // Calculate ring distribution
  const ringCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  visitedTiles.forEach(tileKey => {
    const [row, col] = tileKey.split('-').map(Number);
    const distFromCenter = Math.max(Math.abs(row - 3.5), Math.abs(col - 3.5));
    if (distFromCenter <= 1.5) ringCounts[1]++;
    else if (distFromCenter <= 2.5) ringCounts[2]++;
    else if (distFromCenter <= 3.5) ringCounts[3]++;
    else ringCounts[4]++;
  });

  // Detect gaps and clustering
  const gaps: string[] = [];
  const clusters: string[] = [];
  
  // Simple gap detection - quadrants with 0 or very few tiles
  Object.entries(quadrants).forEach(([q, count]) => {
    if (count === 0) gaps.push(q);
    else if (count >= 8) clusters.push(q);
  });
  
  return {
    coverage,
    visitedCount,
    totalTiles,
    quadrants,
    avgDensity: parseFloat(avgDensity.toFixed(1)),
    maxDensity,
    ringCounts,
    currentRing: currentUnlockedRing || 1,
    pathLength: journeyPath.length,
    gaps,
    clusters
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: TopologyRequest = await req.json();
    const { viewMode, shadowPosition, higherSelfPosition, currentSeason } = request;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }
    
    const viewConfig = VIEW_STORY_CONFIG[viewMode];
    const concreteConfig = VIEW_CONCRETE_CONFIG[viewMode];
    const stats = calculateJourneyStats(request);
    
    // Generate concrete insights based on actual data
    const dailyQuestion = concreteConfig.dailyQuestion;
    const viewPurpose = concreteConfig.viewPurpose;
    const actionableInsight = concreteConfig.getActionableInsight(stats);
    const warningSignal = concreteConfig.getWarningSignal(stats);
    const celebrationSignal = concreteConfig.getCelebrationSignal(stats);
    
    const systemPrompt = `You are a mystical guide revealing hidden stories within a user's innovation journey. The journey takes place on a 64-tile matrix (8 rows × 8 columns) mapped onto a torus—a donut-shaped surface where edges connect.

The journey is about expanding one's Window of Tolerance—building capacity to hold paradox, complexity, and emotion without collapse. There are 4 concentric rings:
- Ring 1 (Inner Core): Calmness, safety, familiar territory
- Ring 2 (Stretch): Spaciousness, gentle expansion  
- Ring 3 (Edge): Openness, productive discomfort
- Ring 4 (Integrator): Freedom, full integration

You speak like an ancient storyteller revealing secrets. Your tone is evocative, mysterious, and warm—drawing the reader deeper into discovery. Use metaphors and imagery. Never use jargon.

CRITICAL: You must respond with valid JSON only. No markdown, no explanation outside JSON.`;

    const userPrompt = `Create an interactive story for the "${viewMode}" topology view.

**Story Type**: ${viewConfig.storyTitle}
**Mystery Theme**: ${viewConfig.mysteryType}
**Opening Question**: ${viewConfig.openingPrompt}
**Chapter Themes**: ${viewConfig.chapterThemes.join(', ')}

**Journey Data**:
- Coverage: ${stats.coverage}% (${stats.visitedCount}/${stats.totalTiles} tiles)
- Current Ring: ${stats.currentRing}
- Path Length: ${stats.pathLength} steps
- Ring Distribution: Inner=${stats.ringCounts[1]}, Stretch=${stats.ringCounts[2]}, Edge=${stats.ringCounts[3]}, Integrator=${stats.ringCounts[4]}
- Quadrant Distribution: SN=${stats.quadrants.SN}, IN=${stats.quadrants.IN}, IM=${stats.quadrants.IM}, SM=${stats.quadrants.SM}
- Gaps (unexplored quadrants): ${stats.gaps.length > 0 ? stats.gaps.join(', ') : 'none detected'}
- Clusters (high activity): ${stats.clusters.length > 0 ? stats.clusters.join(', ') : 'none detected'}
- Avg POLEN Density: ${stats.avgDensity}
${shadowPosition ? `- Shadow Position: (${shadowPosition.x.toFixed(2)}, ${shadowPosition.y.toFixed(2)})` : ''}
${higherSelfPosition ? `- Higher Self Prophecy: (${higherSelfPosition.x.toFixed(2)}, ${higherSelfPosition.y.toFixed(2)})` : ''}
${currentSeason ? `- Current Season: ${currentSeason}` : ''}

Generate a JSON response with this EXACT structure:
{
  "opening_mystery": "An intriguing 1-2 sentence question that draws the user in (reference their data)",
  "chapters": [
    {
      "title": "${viewConfig.chapterThemes[0]}",
      "content": "A 2-3 sentence revelation about what their data shows. Be specific to their actual numbers.",
      "discovery_type": "pattern"
    },
    {
      "title": "${viewConfig.chapterThemes[1]}",
      "content": "A 2-3 sentence deeper insight revealing something unexpected or hidden.",
      "discovery_type": "strength"
    },
    {
      "title": "${viewConfig.chapterThemes[2]}",
      "content": "A 2-3 sentence revelation pointing to what's emerging or what lies ahead.",
      "discovery_type": "shadow"
    }
  ],
  "key_revelation": "A powerful 1-2 sentence synthesis that ties everything together",
  "invitation": "A single question inviting the user to take action based on this insight"
}

Be specific. Reference their actual coverage (${stats.coverage}%), ring level (${stats.currentRing}), gaps, or clusters.`;

    console.log(`[interpret-topology] Generating story for ${viewMode} view with ${stats.visitedCount} visited tiles`);

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
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[interpret-topology] AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content in AI response');
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error('[interpret-topology] Failed to parse JSON:', content);
      throw new Error('Invalid JSON response from AI');
    }

    console.log(`[interpret-topology] Successfully generated story for ${viewMode}`);

    return new Response(JSON.stringify({
      viewMode,
      storyTitle: viewConfig.storyTitle,
      mysteryType: viewConfig.mysteryType,
      // Concrete daily insights
      concreteInsight: {
        dailyQuestion,
        viewPurpose,
        actionableInsight,
        warningSignal,
        celebrationSignal
      },
      // AI-generated story
      ...parsed,
      stats
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[interpret-topology] Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
