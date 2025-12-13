// I Ching + Tzolkin Cosmological Mapping for Calm Magic Board
// Maps the 260-day Tzolkin cycle to the 64-tile board with Castle/Wavespell structure

// 20 Solar Seals (Day Signs)
export const SOLAR_SEALS = [
  { id: 1, name: 'Dragon', glyph: '🐉', meaning: 'Nurtures Birth', color: 'red' },
  { id: 2, name: 'Wind', glyph: '🌬️', meaning: 'Communicates Spirit', color: 'white' },
  { id: 3, name: 'Night', glyph: '🌙', meaning: 'Dreams Abundance', color: 'blue' },
  { id: 4, name: 'Seed', glyph: '🌱', meaning: 'Targets Flowering', color: 'yellow' },
  { id: 5, name: 'Serpent', glyph: '🐍', meaning: 'Survives Life Force', color: 'red' },
  { id: 6, name: 'World-Bridger', glyph: '🌉', meaning: 'Equalizes Death', color: 'white' },
  { id: 7, name: 'Hand', glyph: '✋', meaning: 'Knows Accomplishment', color: 'blue' },
  { id: 8, name: 'Star', glyph: '⭐', meaning: 'Beautifies Elegance', color: 'yellow' },
  { id: 9, name: 'Moon', glyph: '🌕', meaning: 'Purifies Flow', color: 'red' },
  { id: 10, name: 'Dog', glyph: '🐕', meaning: 'Loves Heart', color: 'white' },
  { id: 11, name: 'Monkey', glyph: '🐒', meaning: 'Plays Magic', color: 'blue' },
  { id: 12, name: 'Human', glyph: '👤', meaning: 'Influences Wisdom', color: 'yellow' },
  { id: 13, name: 'Skywalker', glyph: '🚀', meaning: 'Explores Wakefulness', color: 'red' },
  { id: 14, name: 'Wizard', glyph: '🧙', meaning: 'Enchants Timelessness', color: 'white' },
  { id: 15, name: 'Eagle', glyph: '🦅', meaning: 'Creates Vision', color: 'blue' },
  { id: 16, name: 'Warrior', glyph: '⚔️', meaning: 'Questions Intelligence', color: 'yellow' },
  { id: 17, name: 'Earth', glyph: '🌍', meaning: 'Evolves Navigation', color: 'red' },
  { id: 18, name: 'Mirror', glyph: '🪞', meaning: 'Reflects Endlessness', color: 'white' },
  { id: 19, name: 'Storm', glyph: '⛈️', meaning: 'Catalyzes Energy', color: 'blue' },
  { id: 20, name: 'Sun', glyph: '☀️', meaning: 'Enlightens Life', color: 'yellow' },
];

// 13 Galactic Tones
export const GALACTIC_TONES = [
  { number: 1, name: 'Magnetic', power: 'Unify', action: 'Attract', essence: 'Purpose' },
  { number: 2, name: 'Lunar', power: 'Polarize', action: 'Stabilize', essence: 'Challenge' },
  { number: 3, name: 'Electric', power: 'Activate', action: 'Bond', essence: 'Service' },
  { number: 4, name: 'Self-Existing', power: 'Define', action: 'Measure', essence: 'Form' },
  { number: 5, name: 'Overtone', power: 'Empower', action: 'Command', essence: 'Radiance' },
  { number: 6, name: 'Rhythmic', power: 'Organize', action: 'Balance', essence: 'Equality' },
  { number: 7, name: 'Resonant', power: 'Channel', action: 'Inspire', essence: 'Attunement' },
  { number: 8, name: 'Galactic', power: 'Harmonize', action: 'Model', essence: 'Integrity' },
  { number: 9, name: 'Solar', power: 'Pulse', action: 'Realize', essence: 'Intention' },
  { number: 10, name: 'Planetary', power: 'Perfect', action: 'Produce', essence: 'Manifestation' },
  { number: 11, name: 'Spectral', power: 'Dissolve', action: 'Release', essence: 'Liberation' },
  { number: 12, name: 'Crystal', power: 'Dedicate', action: 'Universalize', essence: 'Cooperation' },
  { number: 13, name: 'Cosmic', power: 'Endure', action: 'Transcend', essence: 'Presence' },
];

// 52 Portal Days (Galactic Activation Portals) - form the mystical column pattern
export const PORTAL_DAYS: number[] = [
  1, 20, 22, 39, 43, 50, 51, 58, 64, 69, 72, 77, 85, 88, 93, 96, 
  106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119,
  146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
  165, 168, 173, 176, 184, 189, 192, 197, 203, 210, 211, 222, 239, 241, 260
];

// 5 Castles with their properties and season mappings
export interface Castle {
  id: number;
  name: string;
  theme: string;
  season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  color: string;
  kinRange: [number, number]; // [start, end] inclusive
  wavespells: number[]; // 4 wavespell IDs
  gardenAffinity: 'intelligence' | 'systems' | 'prototypes';
  uncurlingPattern: 'radial' | 'spiral' | 'crystalline' | 'organic' | 'fractal';
}

export const CASTLES: Castle[] = [
  { 
    id: 1, 
    name: 'Red Castle of Turning', 
    theme: 'Birth/Initiation',
    season: 'POLLENS', 
    color: '#dc2626', 
    kinRange: [1, 52],
    wavespells: [1, 2, 3, 4], 
    gardenAffinity: 'intelligence',
    uncurlingPattern: 'radial'
  },
  { 
    id: 2, 
    name: 'White Castle of Crossing', 
    theme: 'Refine/Crossroads',
    season: 'NOEMS', 
    color: '#f5f5f4', 
    kinRange: [53, 104],
    wavespells: [5, 6, 7, 8], 
    gardenAffinity: 'intelligence',
    uncurlingPattern: 'crystalline'
  },
  { 
    id: 3, 
    name: 'Blue Castle of Burning', 
    theme: 'Transform/Alchemy',
    season: 'POEMS', 
    color: '#2563eb', 
    kinRange: [105, 156],
    wavespells: [9, 10, 11, 12], 
    gardenAffinity: 'systems',
    uncurlingPattern: 'spiral'
  },
  { 
    id: 4, 
    name: 'Yellow Castle of Giving', 
    theme: 'Ripen/Harvest',
    season: 'TOTEMS', 
    color: '#eab308', 
    kinRange: [157, 208],
    wavespells: [13, 14, 15, 16], 
    gardenAffinity: 'prototypes',
    uncurlingPattern: 'organic'
  },
  { 
    id: 5, 
    name: 'Green Castle of Enchantment', 
    theme: 'Matrix/Magic',
    season: 'ANTHEMS', 
    color: '#16a34a', 
    kinRange: [209, 260],
    wavespells: [17, 18, 19, 20], 
    gardenAffinity: 'prototypes',
    uncurlingPattern: 'fractal'
  }
];

// 20 Wavespells (13 days each)
export interface Wavespell {
  id: number;
  seal: string;
  sealId: number;
  kinRange: [number, number];
  castle: number;
  theme: string;
}

export const WAVESPELLS: Wavespell[] = [
  { id: 1, seal: 'Dragon', sealId: 1, kinRange: [1, 13], castle: 1, theme: 'Nurturing Birth' },
  { id: 2, seal: 'Wizard', sealId: 14, kinRange: [14, 26], castle: 1, theme: 'Timeless Enchantment' },
  { id: 3, seal: 'Hand', sealId: 7, kinRange: [27, 39], castle: 1, theme: 'Healing Accomplishment' },
  { id: 4, seal: 'Sun', sealId: 20, kinRange: [40, 52], castle: 1, theme: 'Universal Fire' },
  { id: 5, seal: 'Skywalker', sealId: 13, kinRange: [53, 65], castle: 2, theme: 'Prophecy Awakening' },
  { id: 6, seal: 'World-Bridger', sealId: 6, kinRange: [66, 78], castle: 2, theme: 'Death Crossing' },
  { id: 7, seal: 'Storm', sealId: 19, kinRange: [79, 91], castle: 2, theme: 'Self-Generation' },
  { id: 8, seal: 'Human', sealId: 12, kinRange: [92, 104], castle: 2, theme: 'Free Will' },
  { id: 9, seal: 'Serpent', sealId: 5, kinRange: [105, 117], castle: 3, theme: 'Life Force' },
  { id: 10, seal: 'Mirror', sealId: 18, kinRange: [118, 130], castle: 3, theme: 'Endlessness' },
  { id: 11, seal: 'Monkey', sealId: 11, kinRange: [131, 143], castle: 3, theme: 'Magic Play' },
  { id: 12, seal: 'Seed', sealId: 4, kinRange: [144, 156], castle: 3, theme: 'Flowering Awareness' },
  { id: 13, seal: 'Earth', sealId: 17, kinRange: [157, 169], castle: 4, theme: 'Navigation Sync' },
  { id: 14, seal: 'Dog', sealId: 10, kinRange: [170, 182], castle: 4, theme: 'Heart Loyalty' },
  { id: 15, seal: 'Night', sealId: 3, kinRange: [183, 195], castle: 4, theme: 'Dreaming Abundance' },
  { id: 16, seal: 'Warrior', sealId: 16, kinRange: [196, 208], castle: 4, theme: 'Fearless Intelligence' },
  { id: 17, seal: 'Moon', sealId: 9, kinRange: [209, 221], castle: 5, theme: 'Universal Water' },
  { id: 18, seal: 'Wind', sealId: 2, kinRange: [222, 234], castle: 5, theme: 'Spirit Communication' },
  { id: 19, seal: 'Eagle', sealId: 15, kinRange: [235, 247], castle: 5, theme: 'Vision Creation' },
  { id: 20, seal: 'Star', sealId: 8, kinRange: [248, 260], castle: 5, theme: 'Beauty Elegance' },
];

// 64 I Ching Hexagrams with trigrams
export interface Hexagram {
  number: number;
  name: string;
  chineseName: string;
  upperTrigram: string;
  lowerTrigram: string;
  meaning: string;
  keywords: string[];
  lines: boolean[]; // true = solid (yang), false = broken (yin), bottom to top
}

export const HEXAGRAMS: Hexagram[] = [
  { number: 1, name: 'The Creative', chineseName: '乾', upperTrigram: 'Heaven', lowerTrigram: 'Heaven', meaning: 'Pure creative force', keywords: ['initiative', 'power', 'dragon'], lines: [true, true, true, true, true, true] },
  { number: 2, name: 'The Receptive', chineseName: '坤', upperTrigram: 'Earth', lowerTrigram: 'Earth', meaning: 'Pure receptive force', keywords: ['receptivity', 'devotion', 'mare'], lines: [false, false, false, false, false, false] },
  { number: 3, name: 'Difficulty at the Beginning', chineseName: '屯', upperTrigram: 'Water', lowerTrigram: 'Thunder', meaning: 'Initial difficulty', keywords: ['birth', 'chaos', 'growth'], lines: [true, false, false, false, true, false] },
  { number: 4, name: 'Youthful Folly', chineseName: '蒙', upperTrigram: 'Mountain', lowerTrigram: 'Water', meaning: 'Inexperience', keywords: ['learning', 'innocence', 'foolishness'], lines: [false, true, false, false, false, true] },
  { number: 5, name: 'Waiting', chineseName: '需', upperTrigram: 'Water', lowerTrigram: 'Heaven', meaning: 'Patience', keywords: ['nourishment', 'patience', 'timing'], lines: [true, true, true, false, true, false] },
  { number: 6, name: 'Conflict', chineseName: '訟', upperTrigram: 'Heaven', lowerTrigram: 'Water', meaning: 'Dispute', keywords: ['contention', 'opposition', 'lawsuit'], lines: [false, true, false, true, true, true] },
  { number: 7, name: 'The Army', chineseName: '師', upperTrigram: 'Earth', lowerTrigram: 'Water', meaning: 'Discipline', keywords: ['discipline', 'leadership', 'organization'], lines: [false, true, false, false, false, false] },
  { number: 8, name: 'Holding Together', chineseName: '比', upperTrigram: 'Water', lowerTrigram: 'Earth', meaning: 'Union', keywords: ['alliance', 'cooperation', 'seeking'], lines: [false, false, false, false, true, false] },
  { number: 9, name: 'Small Taming', chineseName: '小畜', upperTrigram: 'Wind', lowerTrigram: 'Heaven', meaning: 'Restraint', keywords: ['restraint', 'gentle', 'accumulation'], lines: [true, true, true, false, true, true] },
  { number: 10, name: 'Treading', chineseName: '履', upperTrigram: 'Heaven', lowerTrigram: 'Lake', meaning: 'Conduct', keywords: ['conduct', 'caution', 'propriety'], lines: [false, true, true, true, true, true] },
  { number: 11, name: 'Peace', chineseName: '泰', upperTrigram: 'Earth', lowerTrigram: 'Heaven', meaning: 'Harmony', keywords: ['harmony', 'prosperity', 'flow'], lines: [true, true, true, false, false, false] },
  { number: 12, name: 'Standstill', chineseName: '否', upperTrigram: 'Heaven', lowerTrigram: 'Earth', meaning: 'Stagnation', keywords: ['stagnation', 'withdrawal', 'obstruction'], lines: [false, false, false, true, true, true] },
  { number: 13, name: 'Fellowship', chineseName: '同人', upperTrigram: 'Heaven', lowerTrigram: 'Fire', meaning: 'Community', keywords: ['community', 'fellowship', 'common goal'], lines: [true, false, true, true, true, true] },
  { number: 14, name: 'Great Possession', chineseName: '大有', upperTrigram: 'Fire', lowerTrigram: 'Heaven', meaning: 'Abundance', keywords: ['abundance', 'wealth', 'success'], lines: [true, true, true, true, false, true] },
  { number: 15, name: 'Modesty', chineseName: '謙', upperTrigram: 'Earth', lowerTrigram: 'Mountain', meaning: 'Humility', keywords: ['humility', 'modesty', 'balance'], lines: [false, false, true, false, false, false] },
  { number: 16, name: 'Enthusiasm', chineseName: '豫', upperTrigram: 'Thunder', lowerTrigram: 'Earth', meaning: 'Excitement', keywords: ['enthusiasm', 'momentum', 'devotion'], lines: [false, false, false, true, false, false] },
  { number: 17, name: 'Following', chineseName: '隨', upperTrigram: 'Lake', lowerTrigram: 'Thunder', meaning: 'Adaptation', keywords: ['following', 'adaptation', 'responsiveness'], lines: [true, false, false, false, true, true] },
  { number: 18, name: 'Work on Decay', chineseName: '蠱', upperTrigram: 'Mountain', lowerTrigram: 'Wind', meaning: 'Repair', keywords: ['repair', 'renewal', 'correction'], lines: [false, true, true, false, false, true] },
  { number: 19, name: 'Approach', chineseName: '臨', upperTrigram: 'Earth', lowerTrigram: 'Lake', meaning: 'Advance', keywords: ['approach', 'advance', 'influence'], lines: [false, true, true, false, false, false] },
  { number: 20, name: 'Contemplation', chineseName: '觀', upperTrigram: 'Wind', lowerTrigram: 'Earth', meaning: 'Observation', keywords: ['viewing', 'observation', 'reflection'], lines: [false, false, false, false, true, true] },
  { number: 21, name: 'Biting Through', chineseName: '噬嗑', upperTrigram: 'Fire', lowerTrigram: 'Thunder', meaning: 'Decisive action', keywords: ['decision', 'determination', 'justice'], lines: [true, false, false, true, false, true] },
  { number: 22, name: 'Grace', chineseName: '賁', upperTrigram: 'Mountain', lowerTrigram: 'Fire', meaning: 'Beauty', keywords: ['beauty', 'grace', 'adornment'], lines: [true, false, true, false, false, true] },
  { number: 23, name: 'Splitting Apart', chineseName: '剝', upperTrigram: 'Mountain', lowerTrigram: 'Earth', meaning: 'Decay', keywords: ['splitting', 'decay', 'erosion'], lines: [false, false, false, false, false, true] },
  { number: 24, name: 'Return', chineseName: '復', upperTrigram: 'Earth', lowerTrigram: 'Thunder', meaning: 'Renewal', keywords: ['return', 'renewal', 'turning point'], lines: [true, false, false, false, false, false] },
  { number: 25, name: 'Innocence', chineseName: '無妄', upperTrigram: 'Heaven', lowerTrigram: 'Thunder', meaning: 'Naturalness', keywords: ['innocence', 'spontaneity', 'unexpected'], lines: [true, false, false, true, true, true] },
  { number: 26, name: 'Great Taming', chineseName: '大畜', upperTrigram: 'Mountain', lowerTrigram: 'Heaven', meaning: 'Great accumulation', keywords: ['restraint', 'accumulation', 'power'], lines: [true, true, true, false, false, true] },
  { number: 27, name: 'Nourishment', chineseName: '頤', upperTrigram: 'Mountain', lowerTrigram: 'Thunder', meaning: 'Sustenance', keywords: ['nourishment', 'sustenance', 'speech'], lines: [true, false, false, false, false, true] },
  { number: 28, name: 'Great Exceeding', chineseName: '大過', upperTrigram: 'Lake', lowerTrigram: 'Wind', meaning: 'Critical mass', keywords: ['excess', 'pressure', 'breakthrough'], lines: [false, true, true, true, true, false] },
  { number: 29, name: 'The Abysmal', chineseName: '坎', upperTrigram: 'Water', lowerTrigram: 'Water', meaning: 'Danger', keywords: ['danger', 'depth', 'water'], lines: [false, true, false, false, true, false] },
  { number: 30, name: 'The Clinging', chineseName: '離', upperTrigram: 'Fire', lowerTrigram: 'Fire', meaning: 'Clarity', keywords: ['clarity', 'fire', 'brilliance'], lines: [true, false, true, true, false, true] },
  { number: 31, name: 'Influence', chineseName: '咸', upperTrigram: 'Lake', lowerTrigram: 'Mountain', meaning: 'Attraction', keywords: ['influence', 'courtship', 'attraction'], lines: [false, false, true, false, true, true] },
  { number: 32, name: 'Duration', chineseName: '恆', upperTrigram: 'Thunder', lowerTrigram: 'Wind', meaning: 'Perseverance', keywords: ['endurance', 'perseverance', 'marriage'], lines: [false, true, true, true, false, false] },
  { number: 33, name: 'Retreat', chineseName: '遯', upperTrigram: 'Heaven', lowerTrigram: 'Mountain', meaning: 'Withdrawal', keywords: ['retreat', 'withdrawal', 'timing'], lines: [false, false, true, true, true, true] },
  { number: 34, name: 'Great Power', chineseName: '大壯', upperTrigram: 'Thunder', lowerTrigram: 'Heaven', meaning: 'Strength', keywords: ['power', 'strength', 'vigor'], lines: [true, true, true, true, false, false] },
  { number: 35, name: 'Progress', chineseName: '晉', upperTrigram: 'Fire', lowerTrigram: 'Earth', meaning: 'Advancement', keywords: ['progress', 'advancement', 'dawn'], lines: [false, false, false, true, false, true] },
  { number: 36, name: 'Darkening of Light', chineseName: '明夷', upperTrigram: 'Earth', lowerTrigram: 'Fire', meaning: 'Adversity', keywords: ['adversity', 'concealment', 'perseverance'], lines: [true, false, true, false, false, false] },
  { number: 37, name: 'The Family', chineseName: '家人', upperTrigram: 'Wind', lowerTrigram: 'Fire', meaning: 'Household', keywords: ['family', 'clan', 'roles'], lines: [true, false, true, false, true, true] },
  { number: 38, name: 'Opposition', chineseName: '睽', upperTrigram: 'Fire', lowerTrigram: 'Lake', meaning: 'Divergence', keywords: ['opposition', 'estrangement', 'diversity'], lines: [false, true, true, true, false, true] },
  { number: 39, name: 'Obstruction', chineseName: '蹇', upperTrigram: 'Water', lowerTrigram: 'Mountain', meaning: 'Difficulty', keywords: ['obstruction', 'hardship', 'limping'], lines: [false, false, true, false, true, false] },
  { number: 40, name: 'Deliverance', chineseName: '解', upperTrigram: 'Thunder', lowerTrigram: 'Water', meaning: 'Release', keywords: ['release', 'liberation', 'untangling'], lines: [false, true, false, true, false, false] },
  { number: 41, name: 'Decrease', chineseName: '損', upperTrigram: 'Mountain', lowerTrigram: 'Lake', meaning: 'Reduction', keywords: ['decrease', 'sacrifice', 'simplify'], lines: [false, true, true, false, false, true] },
  { number: 42, name: 'Increase', chineseName: '益', upperTrigram: 'Wind', lowerTrigram: 'Thunder', meaning: 'Expansion', keywords: ['increase', 'benefit', 'growth'], lines: [true, false, false, false, true, true] },
  { number: 43, name: 'Breakthrough', chineseName: '夬', upperTrigram: 'Lake', lowerTrigram: 'Heaven', meaning: 'Resolution', keywords: ['breakthrough', 'resolution', 'decision'], lines: [true, true, true, true, true, false] },
  { number: 44, name: 'Coming to Meet', chineseName: '姤', upperTrigram: 'Heaven', lowerTrigram: 'Wind', meaning: 'Encounter', keywords: ['encounter', 'temptation', 'meeting'], lines: [false, true, true, true, true, true] },
  { number: 45, name: 'Gathering Together', chineseName: '萃', upperTrigram: 'Lake', lowerTrigram: 'Earth', meaning: 'Assembly', keywords: ['gathering', 'assembly', 'collection'], lines: [false, false, false, false, true, true] },
  { number: 46, name: 'Pushing Upward', chineseName: '升', upperTrigram: 'Earth', lowerTrigram: 'Wind', meaning: 'Ascent', keywords: ['ascending', 'growth', 'effort'], lines: [false, true, true, false, false, false] },
  { number: 47, name: 'Oppression', chineseName: '困', upperTrigram: 'Lake', lowerTrigram: 'Water', meaning: 'Exhaustion', keywords: ['exhaustion', 'adversity', 'confinement'], lines: [false, true, false, false, true, true] },
  { number: 48, name: 'The Well', chineseName: '井', upperTrigram: 'Water', lowerTrigram: 'Wind', meaning: 'Source', keywords: ['well', 'source', 'nourishment'], lines: [false, true, true, false, true, false] },
  { number: 49, name: 'Revolution', chineseName: '革', upperTrigram: 'Lake', lowerTrigram: 'Fire', meaning: 'Change', keywords: ['revolution', 'molting', 'transformation'], lines: [true, false, true, false, true, true] },
  { number: 50, name: 'The Cauldron', chineseName: '鼎', upperTrigram: 'Fire', lowerTrigram: 'Wind', meaning: 'Transformation', keywords: ['cauldron', 'nourishment', 'sacrifice'], lines: [false, true, true, true, false, true] },
  { number: 51, name: 'The Arousing', chineseName: '震', upperTrigram: 'Thunder', lowerTrigram: 'Thunder', meaning: 'Shock', keywords: ['shock', 'thunder', 'awakening'], lines: [true, false, false, true, false, false] },
  { number: 52, name: 'Keeping Still', chineseName: '艮', upperTrigram: 'Mountain', lowerTrigram: 'Mountain', meaning: 'Stillness', keywords: ['stillness', 'meditation', 'stopping'], lines: [false, false, true, false, false, true] },
  { number: 53, name: 'Development', chineseName: '漸', upperTrigram: 'Wind', lowerTrigram: 'Mountain', meaning: 'Gradual progress', keywords: ['gradual', 'development', 'marriage'], lines: [false, false, true, false, true, true] },
  { number: 54, name: 'The Marrying Maiden', chineseName: '歸妹', upperTrigram: 'Thunder', lowerTrigram: 'Lake', meaning: 'Transition', keywords: ['subordinate', 'affection', 'impulsiveness'], lines: [false, true, true, true, false, false] },
  { number: 55, name: 'Abundance', chineseName: '豐', upperTrigram: 'Thunder', lowerTrigram: 'Fire', meaning: 'Fullness', keywords: ['abundance', 'fullness', 'zenith'], lines: [true, false, true, true, false, false] },
  { number: 56, name: 'The Wanderer', chineseName: '旅', upperTrigram: 'Fire', lowerTrigram: 'Mountain', meaning: 'Travel', keywords: ['travel', 'stranger', 'transience'], lines: [false, false, true, true, false, true] },
  { number: 57, name: 'The Gentle', chineseName: '巽', upperTrigram: 'Wind', lowerTrigram: 'Wind', meaning: 'Penetration', keywords: ['gentle', 'wind', 'penetrating'], lines: [false, true, true, false, true, true] },
  { number: 58, name: 'The Joyous', chineseName: '兌', upperTrigram: 'Lake', lowerTrigram: 'Lake', meaning: 'Joy', keywords: ['joy', 'pleasure', 'openness'], lines: [false, true, true, false, true, true] },
  { number: 59, name: 'Dispersion', chineseName: '渙', upperTrigram: 'Wind', lowerTrigram: 'Water', meaning: 'Dissolution', keywords: ['dispersion', 'dissolution', 'unity'], lines: [false, true, false, false, true, true] },
  { number: 60, name: 'Limitation', chineseName: '節', upperTrigram: 'Water', lowerTrigram: 'Lake', meaning: 'Restraint', keywords: ['limitation', 'moderation', 'articulation'], lines: [false, true, true, false, true, false] },
  { number: 61, name: 'Inner Truth', chineseName: '中孚', upperTrigram: 'Wind', lowerTrigram: 'Lake', meaning: 'Sincerity', keywords: ['truth', 'sincerity', 'confidence'], lines: [false, true, true, false, true, true] },
  { number: 62, name: 'Small Exceeding', chineseName: '小過', upperTrigram: 'Thunder', lowerTrigram: 'Mountain', meaning: 'Attention to detail', keywords: ['small', 'exceeding', 'caution'], lines: [false, false, true, true, false, false] },
  { number: 63, name: 'After Completion', chineseName: '既濟', upperTrigram: 'Water', lowerTrigram: 'Fire', meaning: 'Fulfillment', keywords: ['completion', 'order', 'vigilance'], lines: [true, false, true, false, true, false] },
  { number: 64, name: 'Before Completion', chineseName: '未濟', upperTrigram: 'Fire', lowerTrigram: 'Water', meaning: 'Transition', keywords: ['incompletion', 'transition', 'potential'], lines: [false, true, false, true, false, true] },
];

// Helper functions
export const isPortalDay = (kin: number): boolean => {
  return PORTAL_DAYS.includes(kin);
};

export const getCastleForKin = (kin: number): Castle | undefined => {
  return CASTLES.find(castle => kin >= castle.kinRange[0] && kin <= castle.kinRange[1]);
};

export const getWavespellForKin = (kin: number): Wavespell | undefined => {
  return WAVESPELLS.find(ws => kin >= ws.kinRange[0] && kin <= ws.kinRange[1]);
};

export const getSealForKin = (kin: number): typeof SOLAR_SEALS[0] => {
  const sealIndex = ((kin - 1) % 20);
  return SOLAR_SEALS[sealIndex];
};

export const getToneForKin = (kin: number): typeof GALACTIC_TONES[0] => {
  const toneIndex = ((kin - 1) % 13);
  return GALACTIC_TONES[toneIndex];
};

export const getHexagramForTile = (tileId: number): Hexagram => {
  // Map tile 1-64 to hexagram 1-64
  const hexNumber = ((tileId - 1) % 64) + 1;
  return HEXAGRAMS[hexNumber - 1];
};

// Get kin for a tile based on season and tile position
export const getKinForTile = (tileId: number, season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS'): number => {
  const seasonOffsets: Record<string, number> = {
    POLLENS: 0,    // Kins 1-52 (Red Castle)
    NOEMS: 52,     // Kins 53-104 (White Castle)
    POEMS: 104,    // Kins 105-156 (Blue Castle)
    TOTEMS: 156,   // Kins 157-208 (Yellow Castle)
    ANTHEMS: 208,  // Kins 209-260 (Green Castle)
  };
  const offset = seasonOffsets[season] || 0;
  // Each season has 52 kins, map 64 tiles to 52 kins
  const kinWithinCastle = Math.floor((tileId - 1) * (52 / 64)) + 1;
  return offset + kinWithinCastle;
};

// Generate the galactic signature affirmation
export const generateAffirmation = (kin: number): string => {
  const seal = getSealForKin(kin);
  const tone = getToneForKin(kin);
  
  return `I ${tone.action} in Order to ${seal.meaning.split(' ')[0]}
${tone.power}ing ${tone.essence}
I seal the ${seal.meaning.split(' ')[1] || 'Gate'} of ${seal.name}
With the ${tone.name} tone of ${tone.essence}
I am guided by the power of ${seal.glyph}`;
};

// Calculate diagonal movement eligibility
export interface DiagonalPath {
  from: { row: number; col: number };
  to: { row: number; col: number };
  type: 'portal' | 'resonance' | 'castle_bridge';
  kin: number;
}

export const canMoveDiagonally = (
  tileId: number, 
  season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS',
  resonanceScore: number = 0
): boolean => {
  const kin = getKinForTile(tileId, season);
  
  // Portal days always allow diagonal movement
  if (isPortalDay(kin)) return true;
  
  // High resonance (>0.7) allows diagonal movement
  if (resonanceScore > 0.7) return true;
  
  return false;
};

export const calculateDiagonalPaths = (
  currentTile: { row: number; col: number },
  tileId: number,
  season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS'
): DiagonalPath[] => {
  const paths: DiagonalPath[] = [];
  const kin = getKinForTile(tileId, season);
  
  if (!isPortalDay(kin)) return paths;
  
  // Calculate diagonal destinations (NE, NW, SE, SW)
  const diagonals = [
    { dr: 1, dc: 1 },   // NE
    { dr: 1, dc: -1 },  // NW
    { dr: -1, dc: 1 },  // SE
    { dr: -1, dc: -1 }, // SW
  ];
  
  diagonals.forEach(({ dr, dc }) => {
    const newRow = currentTile.row + dr;
    const newCol = currentTile.col + dc;
    
    // Check bounds
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      paths.push({
        from: currentTile,
        to: { row: newRow, col: newCol },
        type: 'portal',
        kin,
      });
    }
  });
  
  return paths;
};

// Get cosmological data for a specific tile
export interface TileCosmology {
  kin: number;
  seal: typeof SOLAR_SEALS[0];
  tone: typeof GALACTIC_TONES[0];
  castle: Castle;
  wavespell: Wavespell;
  hexagram: Hexagram;
  isPortalDay: boolean;
  affirmation: string;
  diagonalPaths: DiagonalPath[];
}

export const getTileCosmology = (
  tileId: number,
  season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS'
): TileCosmology => {
  const kin = getKinForTile(tileId, season);
  const seal = getSealForKin(kin);
  const tone = getToneForKin(kin);
  const castle = getCastleForKin(kin)!;
  const wavespell = getWavespellForKin(kin)!;
  const hexagram = getHexagramForTile(tileId);
  const portal = isPortalDay(kin);
  const affirmation = generateAffirmation(kin);
  
  // Calculate tile position from tileId
  const row = Math.floor((tileId - 1) / 8);
  const col = (tileId - 1) % 8;
  const diagonalPaths = calculateDiagonalPaths({ row, col }, tileId, season);
  
  return {
    kin,
    seal,
    tone,
    castle,
    wavespell,
    hexagram,
    isPortalDay: portal,
    affirmation,
    diagonalPaths,
  };
};

// Get hexagram by number (1-64)
export const getHexagramByNumber = (num: number): Hexagram => {
  const hexagram = HEXAGRAMS.find(h => h.number === num);
  return hexagram || HEXAGRAMS[0];
};
