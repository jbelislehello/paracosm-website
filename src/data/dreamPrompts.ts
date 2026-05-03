export interface DreamPrompt {
  id: string;
  text: string;
  hint: string;
}

export const DREAM_PROMPTS: DreamPrompt[] = [
  { id: 'afraid', text: 'What is your product secretly afraid of?', hint: 'Listen for what the PRD avoids saying out loud.' },
  { id: 'roadmap', text: 'Where does your roadmap stop listening?', hint: 'Find the moment plans replace people.' },
  { id: 'pain', text: 'Which user pain are you avoiding naming?', hint: 'The unspoken thing that everyone feels.' },
  { id: 'dream', text: 'What would your PRD say if it could dream?', hint: 'Beyond features — its longing.' },
  { id: 'aliveness', text: 'Where is aliveness leaking out of this product?', hint: 'Find the places that have gone numb.' },
  { id: 'coping', text: 'Which feature is actually a coping mechanism?', hint: 'Notice what compensates for what is missing.' },
  { id: 'truth', text: 'What truth does your PRD almost tell?', hint: 'The half-spoken sentence underneath the bullets.' },
  { id: 'rhythm', text: 'What rhythm has your team lost?', hint: 'Cadence, breath, season.' },
  { id: 'edge', text: 'Where is the edge of what you can imagine?', hint: 'The horizon the document refuses to cross.' },
  { id: 'gift', text: 'What gift wants to come through this work?', hint: 'Bigger than the deliverable.' },
  { id: 'weight', text: 'What is too heavy to carry as written?', hint: 'Scope that secretly drains the system.' },
  { id: 'home', text: 'Where would your users feel most at home?', hint: 'The atmosphere the product is reaching for.' },
];

export function pickThree(seed = Date.now()): DreamPrompt[] {
  const arr = [...DREAM_PROMPTS];
  // Simple deterministic shuffle from seed
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3);
}

export const DREAM_AXES = ['love', 'magic', 'calm', 'open', 'free'] as const;
export type DreamAxis = typeof DREAM_AXES[number];

export const AXIS_META: Record<DreamAxis, { label: string; symbol: string; color: string; gradient: string }> = {
  love:  { label: 'LOVE',  symbol: '♥', color: 'hsl(340 80% 60%)', gradient: 'from-rose-400 to-pink-500' },
  magic: { label: 'MAGIC', symbol: '✦', color: 'hsl(280 70% 65%)', gradient: 'from-purple-400 to-fuchsia-500' },
  calm:  { label: 'CALM',  symbol: '◯', color: 'hsl(200 70% 60%)', gradient: 'from-sky-400 to-blue-500' },
  open:  { label: 'OPEN',  symbol: '△', color: 'hsl(140 60% 55%)', gradient: 'from-emerald-400 to-teal-500' },
  free:  { label: 'FREE',  symbol: '✶', color: 'hsl(40 90% 60%)',  gradient: 'from-amber-400 to-orange-500' },
};
