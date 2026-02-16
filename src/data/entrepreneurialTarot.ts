
export type TarotSuit = 'love' | 'magic' | 'calm' | 'open' | 'free';
export type ChordsDimension = 'C' | 'H' | 'O' | 'R' | 'D' | 'S';

export interface MajorArcanaCard {
  id: string;
  arcana: 'major';
  suit: TarotSuit;
  letter: string;
  name: string;
  question: string;
  upright: string;
  reversed: string;
}

export interface MinorArcanaCard {
  id: string;
  arcana: 'minor';
  dimension: ChordsDimension;
  dimensionName: string;
  stage: string;
  name: string;
  question: string;
  upright: string;
  reversed: string;
}

export type TarotCard = MajorArcanaCard | MinorArcanaCard;

export const suitColors: Record<TarotSuit, string> = {
  love: '#ef4444',
  magic: '#8b5cf6',
  calm: '#22c55e',
  open: '#3b82f6',
  free: '#f59e0b',
};

export const suitGradients: Record<TarotSuit, string> = {
  love: 'from-red-500 to-rose-600',
  magic: 'from-purple-500 to-violet-600',
  calm: 'from-green-500 to-emerald-600',
  open: 'from-blue-500 to-cyan-600',
  free: 'from-amber-500 to-yellow-600',
};

export const dimensionColors: Record<ChordsDimension, string> = {
  C: '#f97316',
  H: '#ec4899',
  O: '#6366f1',
  R: '#14b8a6',
  D: '#8b5cf6',
  S: '#84cc16',
};

// ─── MAJOR ARCANA: 22 cards (5 suits) ───
export const majorArcana: MajorArcanaCard[] = [
  // MAGIC (M-A-G-I-C)
  { id: 'magic-m', arcana: 'major', suit: 'magic', letter: 'M', name: 'Mindsets', question: 'What fundamental belief is currently shaping your strategy?', upright: 'Cognitive flexibility and growth-oriented leadership.', reversed: 'Rigid frameworks blocking creative possibility.' },
  { id: 'magic-a', arcana: 'major', suit: 'magic', letter: 'A', name: 'Agilities', question: 'Where must you move faster—or slower—to adapt?', upright: 'Responsive pivoting and fluid execution.', reversed: 'Paralysis from over-analysis or reckless haste.' },
  { id: 'magic-g', arcana: 'major', suit: 'magic', letter: 'G', name: 'Goals', question: 'Are your goals aligned with your deepest purpose?', upright: 'Ambitious vision grounded in meaningful direction.', reversed: 'Pursuing metrics that betray your true mission.' },
  { id: 'magic-i', arcana: 'major', suit: 'magic', letter: 'I', name: 'Intuitions', question: 'What does your gut know that data hasn\'t revealed?', upright: 'Trusting embodied wisdom in decision-making.', reversed: 'Ignoring inner signals or confusing fear with intuition.' },
  { id: 'magic-c', arcana: 'major', suit: 'magic', letter: 'C', name: 'Compasses', question: 'Which internal compass guides you when maps fail?', upright: 'Ethical clarity and principled navigation.', reversed: 'Lost bearings, following others\' direction blindly.' },

  // LOVE (L-O-V-E)
  { id: 'love-l', arcana: 'major', suit: 'love', letter: 'L', name: 'Longevity', question: 'What are you building that will outlast you?', upright: 'Legacy thinking and sustainable creation.', reversed: 'Short-termism eroding long-term value.' },
  { id: 'love-o', arcana: 'major', suit: 'love', letter: 'O', name: 'Oscillations', question: 'Where is the rhythm between expansion and contraction?', upright: 'Healthy cycles of growth and rest.', reversed: 'Burnout from relentless pushing or stagnation from inertia.' },
  { id: 'love-v', arcana: 'major', suit: 'love', letter: 'V', name: 'Velocity', question: 'Is your speed serving your vision or sabotaging it?', upright: 'Momentum aligned with purpose.', reversed: 'Speed without direction, or paralytic perfectionism.' },
  { id: 'love-e', arcana: 'major', suit: 'love', letter: 'E', name: 'Elasticity', question: 'How resilient is your organization under pressure?', upright: 'Adaptive strength and bouncing forward.', reversed: 'Brittleness masked as toughness.' },

  // CALM (C-A-L-M)
  { id: 'calm-c', arcana: 'major', suit: 'calm', letter: 'C', name: 'Constraints', question: 'What limitation is actually your greatest creative asset?', upright: 'Elegant solutions born from boundaries.', reversed: 'Feeling trapped by self-imposed limitations.' },
  { id: 'calm-a', arcana: 'major', suit: 'calm', letter: 'A', name: 'Alignment', question: 'Are your actions, values, and vision in harmony?', upright: 'Coherence across all dimensions of leadership.', reversed: 'Saying one thing, doing another—misaligned integrity.' },
  { id: 'calm-l', arcana: 'major', suit: 'calm', letter: 'L', name: 'Landscape', question: 'What terrain are you navigating, and what\'s hidden beyond the ridge?', upright: 'Strategic awareness and reading the environment.', reversed: 'Blind spots in market or relational landscape.' },
  { id: 'calm-m', arcana: 'major', suit: 'calm', letter: 'M', name: 'Methods', question: 'Is your process serving the outcome, or has it become the prison?', upright: 'Disciplined practice with adaptive methodology.', reversed: 'Process worship that kills innovation.' },

  // OPEN (O-P-E-N)
  { id: 'open-o', arcana: 'major', suit: 'open', letter: 'O', name: 'Ontology', question: 'What is the nature of the reality you\'re creating?', upright: 'Deep understanding of being and becoming.', reversed: 'Operating on unexamined assumptions about reality.' },
  { id: 'open-p', arcana: 'major', suit: 'open', letter: 'P', name: 'Protocols', question: 'What agreements hold your ecosystem together?', upright: 'Clear, fair protocols enabling trust and collaboration.', reversed: 'Bureaucratic rules stifling emergence.' },
  { id: 'open-e', arcana: 'major', suit: 'open', letter: 'E', name: 'Energy', question: 'Where is energy flowing freely, and where is it blocked?', upright: 'Vital force channeled into meaningful work.', reversed: 'Energy leaks through unresolved conflicts or misalignment.' },
  { id: 'open-n', arcana: 'major', suit: 'open', letter: 'N', name: 'Networks', question: 'Who are the hidden connectors in your constellation?', upright: 'Rich relational networks amplifying collective intelligence.', reversed: 'Isolation or extractive networking.' },

  // FREE (F-R-E-E)
  { id: 'free-f', arcana: 'major', suit: 'free', letter: 'F', name: 'Flow', question: 'When did you last lose yourself completely in your work?', upright: 'Effortless engagement and creative immersion.', reversed: 'Forcing outcomes instead of allowing emergence.' },
  { id: 'free-r', arcana: 'major', suit: 'free', letter: 'R', name: 'Reversal', question: 'What must be unlearned before new growth can happen?', upright: 'Courageous letting go and creative destruction.', reversed: 'Clinging to what no longer serves.' },
  { id: 'free-e1', arcana: 'major', suit: 'free', letter: 'E', name: 'Emergence', question: 'What is trying to be born through your organization?', upright: 'Sensing and midwifing the new.', reversed: 'Premature closure on what\'s still forming.' },
  { id: 'free-e2', arcana: 'major', suit: 'free', letter: 'E', name: 'Evolution', question: 'How is your leadership evolving to meet the moment?', upright: 'Continuous transformation and adaptive growth.', reversed: 'Resisting necessary evolution out of comfort.' },
];

// ─── MINOR ARCANA: 48 cards (6 CHORDS × 8 stages) ───
const stages = ['Agendas', 'Lens', 'Maps', 'Glitch', 'Drift', 'Tune', 'Shadow', 'Higher Self'];

const chordsData: Record<ChordsDimension, { name: string; theme: string }> = {
  C: { name: 'Chances', theme: 'risk & experimentation' },
  H: { name: 'Heart', theme: 'compassion & values' },
  O: { name: 'Observer', theme: 'awareness & perspective' },
  R: { name: 'Reversal', theme: 'renewal & pivoting' },
  D: { name: 'Design', theme: 'craft & intentionality' },
  S: { name: 'Seeds', theme: 'planting & potential' },
};

const minorArcanaQuestions: Record<ChordsDimension, string[]> = {
  C: [
    'What risk have you been avoiding that could unlock growth?',
    'Through what lens do you evaluate opportunity vs. recklessness?',
    'Where on your map does serendipity appear most often?',
    'What unexpected failure is teaching you to take better chances?',
    'Which drifting experiment deserves more investment?',
    'How can you tune your risk appetite to the current moment?',
    'What shadow fear prevents you from seizing the right chance?',
    'What would your bravest self dare to attempt?',
  ],
  H: [
    'Whose needs are you overlooking in your agenda?',
    'What lens of compassion would change your current challenge?',
    'Where does empathy need to appear on your strategic map?',
    'What heartbreak in your organization reveals a systemic truth?',
    'How is your care for others drifting from authentic to performative?',
    'How do you tune into the emotional frequency of your team?',
    'What shadow resentment is blocking your capacity to lead with love?',
    'What would wholehearted leadership look like today?',
  ],
  O: [
    'What are you choosing not to see in your current agenda?',
    'Which observational lens would reveal a hidden pattern?',
    'From what vantage point does your map look completely different?',
    'What glitch in perception is distorting your judgment?',
    'Where is your attention drifting when it should be focused?',
    'How do you tune your awareness to catch weak signals?',
    'What shadow bias is shaping your observations?',
    'What does the highest version of your awareness perceive?',
  ],
  R: [
    'What agenda item needs to be reversed or abandoned?',
    'Through what lens does this setback become a setup?',
    'Where on your map would a strategic retreat open new territory?',
    'What systemic glitch is calling for a complete reversal?',
    'What drift needs to be reversed before it becomes crisis?',
    'How do you tune the art of the pivot without losing momentum?',
    'What shadow attachment prevents you from reversing course?',
    'What renewal becomes possible when you release the old?',
  ],
  D: [
    'What are you designing on your agenda that doesn\'t serve beauty?',
    'Through what lens does your design philosophy guide decisions?',
    'Where on your map is intentional design most urgently needed?',
    'What design glitch reveals a deeper structural problem?',
    'How is your design thinking drifting from user-centered to ego-centered?',
    'How do you tune craft and speed in your creative process?',
    'What shadow perfectionism is killing good-enough design?',
    'What would mastery look like in your current design challenge?',
  ],
  S: [
    'What seed on your agenda needs more patience before harvest?',
    'Through what lens do you see which seeds have real potential?',
    'Where on your map should you be planting for future seasons?',
    'What glitch is threatening seeds you\'ve already planted?',
    'Which drifting seed deserves your focused attention now?',
    'How do you tune the conditions for your seeds to thrive?',
    'What shadow impatience is pulling up roots too early?',
    'What would full trust in the growth process look like?',
  ],
};

const minorUprightReversed: Record<ChordsDimension, Array<[string, string]>> = {
  C: [
    ['Calculated risk-taking with strategic awareness.', 'Gambling recklessly without due diligence.'],
    ['Clear assessment frameworks for opportunity.', 'Analysis paralysis preventing action.'],
    ['Mapping the landscape of possibility.', 'Blind spots in your opportunity radar.'],
    ['Learning rapidly from experimental failure.', 'Repeating the same failed experiments.'],
    ['Productive wandering toward discovery.', 'Aimless experimentation without learning.'],
    ['Calibrated boldness at the right moment.', 'Missing windows of opportunity.'],
    ['Confronting fear to take necessary risks.', 'Projecting fear onto viable opportunities.'],
    ['Visionary courage creating new markets.', 'Overconfidence disconnected from reality.'],
  ],
  H: [
    ['Stakeholder empathy informing strategy.', 'Neglecting human needs in planning.'],
    ['Compassionate leadership as competitive advantage.', 'Weaponizing empathy for manipulation.'],
    ['Emotional intelligence mapped to team dynamics.', 'Ignoring relational data in strategy.'],
    ['Vulnerability revealing systemic truths.', 'Emotional overwhelm clouding judgment.'],
    ['Authentic care sustaining through change.', 'Performative caring eroding trust.'],
    ['Attuned leadership sensing team needs.', 'Emotional deafness to your team.'],
    ['Processing shadow emotions for growth.', 'Suppressed resentment poisoning culture.'],
    ['Love as the deepest leadership power.', 'Naive idealism ignoring hard realities.'],
  ],
  O: [
    ['Seeing what others miss in the data.', 'Information overload without insight.'],
    ['Multi-perspective analysis revealing truth.', 'Confirmation bias narrowing your view.'],
    ['Strategic foresight and pattern recognition.', 'Tunnel vision missing systemic connections.'],
    ['Using anomalies as doorways to insight.', 'Distorted perception creating false narratives.'],
    ['Mindful attention to emerging patterns.', 'Distraction fracturing your awareness.'],
    ['Refined perception catching weak signals.', 'Over-sensitivity to noise over signal.'],
    ['Integrating shadow for complete awareness.', 'Unconscious bias shaping all decisions.'],
    ['Panoramic awareness guiding wise action.', 'Detached observation without engagement.'],
  ],
  R: [
    ['Strategic courage to abandon failing paths.', 'Stubbornly persisting on dead-end roads.'],
    ['Reframing setbacks as strategic advantages.', 'Denial about the need for change.'],
    ['Tactical retreat opening new possibilities.', 'Retreating from fear, not strategy.'],
    ['Using disruption as catalyst for renewal.', 'Chaos without constructive direction.'],
    ['Correcting course with grace and speed.', 'Drifting too far before course-correcting.'],
    ['Artful pivoting preserving core momentum.', 'Pivoting so often nothing takes root.'],
    ['Releasing attachment to enable rebirth.', 'Clinging to identity over effectiveness.'],
    ['Phoenix renewal from conscious release.', 'Premature destruction of what still works.'],
  ],
  D: [
    ['Beauty and function serving strategic purpose.', 'Over-designing at the expense of delivery.'],
    ['Clear design principles guiding all choices.', 'Aesthetic obsession divorced from outcomes.'],
    ['Intentional architecture of systems and culture.', 'Unplanned growth creating structural chaos.'],
    ['Design failures revealing deeper insights.', 'Band-aid fixes over structural solutions.'],
    ['Evolution of design through experimentation.', 'Design drift losing coherence.'],
    ['Refining craft through disciplined iteration.', 'Perfectionism preventing shipment.'],
    ['Confronting the shadow of over-engineering.', 'Hidden ego in design choices.'],
    ['Masterful simplicity in complex systems.', 'Oversimplification losing critical nuance.'],
  ],
  S: [
    ['Patient investment in long-term potential.', 'Demanding premature returns on seeds.'],
    ['Discernment about which seeds to nurture.', 'Spreading resources too thin across seeds.'],
    ['Strategic planting for future harvest seasons.', 'Planting in depleted soil without renewal.'],
    ['Protecting vulnerable seedlings from disruption.', 'Overprotecting seeds from necessary adversity.'],
    ['Allowing organic growth to find its path.', 'Neglecting seeds that need active tending.'],
    ['Creating optimal conditions for emergence.', 'Forcing growth with artificial acceleration.'],
    ['Trusting the timing of natural development.', 'Impatient harvesting destroying potential.'],
    ['Full faith in the generative process.', 'Blind optimism ignoring signs of failure.'],
  ],
};

export const minorArcana: MinorArcanaCard[] = (Object.keys(chordsData) as ChordsDimension[]).flatMap(
  (dim) =>
    stages.map((stage, idx) => ({
      id: `minor-${dim.toLowerCase()}-${idx}`,
      arcana: 'minor' as const,
      dimension: dim,
      dimensionName: chordsData[dim].name,
      stage,
      name: `${chordsData[dim].name} of ${stage}`,
      question: minorArcanaQuestions[dim][idx],
      upright: minorUprightReversed[dim][idx][0],
      reversed: minorUprightReversed[dim][idx][1],
    }))
);

export const fullDeck: TarotCard[] = [...majorArcana, ...minorArcana];

export function drawCards(count: number): TarotCard[] {
  const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function drawSpread(): { past: TarotCard; present: TarotCard; future: TarotCard } {
  const [past, present, future] = drawCards(3);
  return { past, present, future };
}
