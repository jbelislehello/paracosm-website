/**
 * Blunt Quote Extraction Utility
 * Identifies pithy, direct statements from POLEN fragments
 * for transformation into geological features (rocks) in the garden
 */

import { RockFormation as NatureRockFormation } from '@/data/natureTaxonomy';

// Re-export for convenience
export type RockFormation = NatureRockFormation;

export interface BluntQuote {
  content: string;
  tile: { row: number; col: number };
  rockType: RockFormation;
  weight: number; // 0-1 indicating importance/size
  category: 'wisdom' | 'observation' | 'declaration' | 'question' | 'metaphor';
}

/**
 * Patterns that indicate a quote is "blunt" - direct, pithy, memorable
 */
const BLUNT_PATTERNS = {
  // Short declarative statements
  declaration: /^[A-Z][^.!?]*[.!]$/,
  // Definitive statements with "is", "are", "must", "should"
  definitive: /\b(is|are|must|should|always|never|everything|nothing)\b/i,
  // Imperative/directive statements
  imperative: /^(Do|Don't|Never|Always|Remember|Stop|Start|Let|Make)\b/i,
  // Metaphorical statements with "like", "as"
  metaphor: /\b(like a|as a|is a|are the)\b/i,
  // Wisdom patterns
  wisdom: /\b(truth|wisdom|key|secret|answer|meaning|purpose)\b/i,
};

/**
 * Content patterns that disqualify a fragment from being a "blunt quote"
 */
const DISQUALIFY_PATTERNS = [
  /\?$/, // Questions (for rock formation, not blunt)
  /^(I think|Maybe|Perhaps|It seems|I wonder)/i, // Hedging language
  /\b(etc|e\.g\.|i\.e\.|for example)\b/i, // Explanatory markers
  /^\s*[-•]\s/, // List items
  /\d{4}/, // Dates/numbers (likely not pithy)
];

/**
 * Determine if content qualifies as a blunt quote
 */
export function isBluntQuote(content: string): boolean {
  // Must be short enough to be pithy
  if (content.length > 120 || content.length < 10) return false;
  
  // Check for disqualifying patterns
  for (const pattern of DISQUALIFY_PATTERNS) {
    if (pattern.test(content)) return false;
  }
  
  // Check for qualifying patterns
  for (const [_, pattern] of Object.entries(BLUNT_PATTERNS)) {
    if (pattern.test(content)) return true;
  }
  
  // Short sentences without commas are often blunt
  if (content.length < 60 && !content.includes(',') && content.endsWith('.')) {
    return true;
  }
  
  return false;
}

/**
 * Categorize the blunt quote
 */
export function categorizeQuote(content: string): BluntQuote['category'] {
  if (BLUNT_PATTERNS.metaphor.test(content)) return 'metaphor';
  if (BLUNT_PATTERNS.wisdom.test(content)) return 'wisdom';
  if (BLUNT_PATTERNS.imperative.test(content)) return 'declaration';
  if (content.endsWith('?')) return 'question';
  return 'observation';
}

/**
 * Determine rock formation type based on quote characteristics
 */
export function getRockType(content: string, category: BluntQuote['category']): RockFormation {
  const length = content.length;
  
  // Foundational wisdom → boulder
  if (category === 'wisdom' && length > 40) return 'boulder';
  
  // Pivotal insights → standing stone
  if (category === 'declaration' || category === 'metaphor') return 'standing_stone';
  
  // Defining statements → monolith
  if (BLUNT_PATTERNS.definitive.test(content) && length > 50) return 'monolith';
  
  // Stacked observations → cairn
  if (category === 'observation' && length > 30) return 'cairn';
  
  // Small observations → pebbles
  return 'pebbles';
}

/**
 * Calculate weight/importance of the quote
 */
export function calculateQuoteWeight(content: string, category: BluntQuote['category']): number {
  let weight = 0.5;
  
  // Wisdom and declarations are heavier
  if (category === 'wisdom') weight += 0.3;
  if (category === 'declaration') weight += 0.2;
  if (category === 'metaphor') weight += 0.15;
  
  // Longer quotes (up to a point) are weightier
  const lengthFactor = Math.min(content.length / 80, 1) * 0.2;
  weight += lengthFactor;
  
  // Definitive language adds weight
  if (BLUNT_PATTERNS.definitive.test(content)) weight += 0.1;
  
  return Math.min(weight, 1);
}

/**
 * Extract blunt quotes from a collection of POLEN fragments
 */
export interface PolenFragment {
  id: string;
  content: string;
  tile_id?: number | null;
  tags?: string[] | null;
}

export function extractBluntQuotes(
  fragments: PolenFragment[],
  tileIdToPosition: (tileId: number) => { row: number; col: number }
): BluntQuote[] {
  const bluntQuotes: BluntQuote[] = [];
  
  for (const fragment of fragments) {
    // Skip fragments without tile association
    if (!fragment.tile_id) continue;
    
    // Check if content qualifies as blunt quote
    if (!isBluntQuote(fragment.content)) continue;
    
    const category = categorizeQuote(fragment.content);
    const rockType = getRockType(fragment.content, category);
    const weight = calculateQuoteWeight(fragment.content, category);
    const position = tileIdToPosition(fragment.tile_id);
    
    bluntQuotes.push({
      content: fragment.content,
      tile: position,
      rockType,
      weight,
      category
    });
  }
  
  return bluntQuotes;
}

/**
 * Group quotes by tile for rendering
 */
export function groupQuotesByTile(quotes: BluntQuote[]): Map<string, BluntQuote[]> {
  const grouped = new Map<string, BluntQuote[]>();
  
  for (const quote of quotes) {
    const key = `${quote.tile.row}-${quote.tile.col}`;
    const existing = grouped.get(key) || [];
    existing.push(quote);
    grouped.set(key, existing);
  }
  
  return grouped;
}

/**
 * Get dominant rock formation for a tile with multiple quotes
 */
export function getDominantRockFormation(quotes: BluntQuote[]): RockFormation {
  if (quotes.length === 0) return 'pebbles';
  
  // Priority order for rock formations
  const priority: RockFormation[] = ['monolith', 'boulder', 'standing_stone', 'cairn', 'pebbles'];
  
  for (const formation of priority) {
    if (quotes.some(q => q.rockType === formation)) {
      return formation;
    }
  }
  
  return 'pebbles';
}
