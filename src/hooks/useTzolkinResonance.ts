import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SOLAR_SEALS, GALACTIC_TONES, getTileCosmology } from '@/data/cosmologicalMapping';

export interface ResonanceMatch {
  tileId: number;
  sealName: string;
  sealMeaning: string;
  toneName: string;
  tonePower: string;
  resonanceScore: number;
  matchedKeywords: string[];
  affirmation: string;
}

export interface ResonanceResult {
  topMatches: ResonanceMatch[];
  dominantSeal: string;
  dominantTone: string;
  overallResonance: number;
  insights: string;
}

export const useTzolkinResonance = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ResonanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeResonance = useCallback(async (
    userText: string,
    season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS' = 'POLLENS'
  ): Promise<ResonanceResult | null> => {
    if (!userText.trim()) {
      setError('Please enter text to analyze');
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Build seal/tone keyword maps for matching
      const sealKeywords = SOLAR_SEALS.map(seal => ({
        id: seal.id,
        name: seal.name,
        meaning: seal.meaning,
        keywords: seal.meaning.toLowerCase().split(/\s+/)
      }));

      const toneKeywords = GALACTIC_TONES.map(tone => ({
        number: tone.number,
        name: tone.name,
        power: tone.power,
        keywords: [tone.power.toLowerCase(), tone.action.toLowerCase(), tone.essence.toLowerCase()]
      }));

      // Local keyword matching for immediate feedback
      const userWords = userText.toLowerCase().split(/\s+/);
      const matches: ResonanceMatch[] = [];

      for (let tileId = 1; tileId <= 64; tileId++) {
        const cosmology = getTileCosmology(tileId, season);
        const seal = cosmology.seal;
        const tone = cosmology.tone;

        // Calculate keyword overlap
        const sealWords = seal.meaning.toLowerCase().split(/\s+/);
        const toneWords = [tone.power.toLowerCase(), tone.action.toLowerCase(), tone.essence.toLowerCase()];
        
        const matchedSealWords = userWords.filter(w => 
          sealWords.some(sw => sw.includes(w) || w.includes(sw))
        );
        const matchedToneWords = userWords.filter(w => 
          toneWords.some(tw => tw.includes(w) || w.includes(tw))
        );

        const matchedKeywords = [...new Set([...matchedSealWords, ...matchedToneWords])];
        const resonanceScore = (matchedKeywords.length / Math.max(userWords.length, 1)) * 100;

        if (resonanceScore > 0 || tileId <= 5) {
          matches.push({
            tileId,
            sealName: seal.name,
            sealMeaning: seal.meaning,
            toneName: tone.name,
            tonePower: tone.power,
            resonanceScore: Math.min(resonanceScore, 100),
            matchedKeywords,
            affirmation: cosmology.affirmation
          });
        }
      }

      // Sort by resonance score
      matches.sort((a, b) => b.resonanceScore - a.resonanceScore);
      const topMatches = matches.slice(0, 5);

      // Calculate dominant seal/tone
      const sealCounts: Record<string, number> = {};
      const toneCounts: Record<string, number> = {};
      
      topMatches.forEach(m => {
        sealCounts[m.sealName] = (sealCounts[m.sealName] || 0) + m.resonanceScore;
        toneCounts[m.toneName] = (toneCounts[m.toneName] || 0) + m.resonanceScore;
      });

      const dominantSeal = Object.entries(sealCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Dragon';
      const dominantTone = Object.entries(toneCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Magnetic';

      // Call AI for deeper insights
      let insights = '';
      try {
        const { data, error: fnError } = await supabase.functions.invoke('analyze-resonance', {
          body: {
            userText,
            topMatches: topMatches.slice(0, 3),
            dominantSeal,
            dominantTone
          }
        });

        if (!fnError && data?.insights) {
          insights = data.insights;
        } else {
          insights = `Your energy resonates strongly with the ${dominantSeal} seal and ${dominantTone} tone. ` +
            `Key themes: ${topMatches[0]?.matchedKeywords.join(', ') || 'transformation, growth'}.`;
        }
      } catch {
        insights = `Your words carry the essence of ${dominantSeal} (${topMatches[0]?.sealMeaning || 'primal force'}). ` +
          `The ${dominantTone} tone amplifies your intention with its power of ${topMatches[0]?.tonePower || 'unity'}.`;
      }

      const overallResonance = topMatches.length > 0 
        ? topMatches.reduce((sum, m) => sum + m.resonanceScore, 0) / topMatches.length 
        : 0;

      const resonanceResult: ResonanceResult = {
        topMatches,
        dominantSeal,
        dominantTone,
        overallResonance,
        insights
      };

      setResult(resonanceResult);
      return resonanceResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      setError(message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    analyzeResonance,
    clearResult,
    isAnalyzing,
    result,
    error
  };
};
