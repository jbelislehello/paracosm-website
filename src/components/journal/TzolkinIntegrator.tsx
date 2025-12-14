import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTilePosition } from '@/types/journal-expansion';
import { useMode } from '@/components/calm-magic/context/ModeContext';
import { getTerminology } from '@/data/modeAwareTerminology';

interface TzolkinIntegratorProps {
  tileId: number;
  hexagramNumber?: number;
  tzolkinKin?: number;
}

// Tzolkin Solar Seals
const SOLAR_SEALS = [
  'Dragon', 'Wind', 'Night', 'Seed', 'Serpent',
  'World-Bridger', 'Hand', 'Star', 'Moon', 'Dog',
  'Monkey', 'Human', 'Skywalker', 'Wizard', 'Eagle',
  'Warrior', 'Earth', 'Mirror', 'Storm', 'Sun'
];

// I Ching Hexagram Names (simplified)
const HEXAGRAMS = [
  'The Creative', 'The Receptive', 'Difficulty', 'Youthful Folly', 'Waiting',
  'Conflict', 'The Army', 'Holding Together', 'Small Taming', 'Treading',
  'Peace', 'Standstill', 'Fellowship', 'Great Possession', 'Modesty',
  'Enthusiasm', 'Following', 'Work on Decay', 'Approach', 'Contemplation',
  'Biting Through', 'Grace', 'Splitting Apart', 'Return', 'Innocence',
  'Great Taming', 'Nourishment', 'Great Preponderance', 'The Abysmal', 'The Clinging',
  'Influence', 'Duration', 'Retreat', 'Great Power', 'Progress',
  'Darkening', 'The Family', 'Opposition', 'Obstruction', 'Deliverance',
  'Decrease', 'Increase', 'Breakthrough', 'Coming to Meet', 'Gathering',
  'Pushing Upward', 'Oppression', 'The Well', 'Revolution', 'The Cauldron',
  'Arousing', 'Keeping Still', 'Development', 'Marrying Maiden', 'Abundance',
  'The Wanderer', 'The Gentle', 'The Joyous', 'Dispersion', 'Limitation',
  'Inner Truth', 'Small Preponderance', 'After Completion', 'Before Completion'
];

export const TzolkinIntegrator: React.FC<TzolkinIntegratorProps> = ({
  tileId,
  hexagramNumber,
  tzolkinKin
}) => {
  // Calculate default mappings if not provided
  const { row, col } = getTilePosition(tileId);
  const defaultHexagram = ((tileId - 1) % 64) + 1;
  const defaultKin = ((tileId - 1) % 260) + 1;

  const hexagram = hexagramNumber || defaultHexagram;
  const kin = tzolkinKin || defaultKin;

  // Tzolkin calculations
  const sealIndex = (kin - 1) % 20;
  const tone = ((kin - 1) % 13) + 1;
  const seal = SOLAR_SEALS[sealIndex];
  const hexagramName = HEXAGRAMS[hexagram - 1];
  
  const { mode } = useMode();
  const terms = getTerminology(mode);

  const getToneEmoji = (t: number) => {
    const tones = ['•', '••', '•••', '••••', '—', '•—', '••—', '•••—', '••••—', '—•', '—••', '—•••', '—••••'];
    return tones[t - 1] || '•';
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border-purple-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="text-purple-300">{terms.cosmologicalMapping}</span>
          <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
            Tile {tileId}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hexagram / Wild Guess */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-amber-900/30 border border-amber-600/30 flex items-center justify-center">
            <span className="text-2xl font-bold text-amber-400">{hexagram}</span>
          </div>
          <div>
            <div className="text-xs text-amber-400/70">{terms.iChing} {terms.hexagram}</div>
            <div className="text-sm font-medium text-amber-200">{hexagramName}</div>
          </div>
        </div>

        {/* Tzolkin / Sync */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-cyan-900/30 border border-cyan-600/30 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-cyan-400">{kin}</span>
            <span className="text-[10px] text-cyan-500">{getToneEmoji(tone)}</span>
          </div>
          <div>
            <div className="text-xs text-cyan-400/70">{terms.tzolkinKin}</div>
            <div className="text-sm font-medium text-cyan-200">
              {seal} <span className="text-cyan-400/70">({mode === 'professional' ? 'Rhythm' : 'Tone'} {tone})</span>
            </div>
          </div>
        </div>

        {/* Position Info */}
        <div className="pt-2 border-t border-purple-500/20 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Grid Position</span>
            <span className="font-mono">Row {row}, Col {col}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TzolkinIntegrator;
