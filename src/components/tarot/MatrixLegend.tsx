export default function MatrixLegend() {
  const rows = [
    { label: 'Agendas', sub: 'M — Mindsets', zone: 'inner' },
    { label: 'Lens', sub: 'A — Agilities', zone: 'inner' },
    { label: 'Maps', sub: 'G — Goals', zone: 'inner' },
    { label: 'Glitch', sub: 'I — Intuitions (in Landscape)', zone: 'stretch' },
    { label: 'Drift', sub: 'C — Compasses (in Energy)', zone: 'stretch' },
    { label: 'Tune', sub: 'Synergies', zone: 'stretch' },
    { label: 'Shadow', sub: 'Methodology', zone: 'outer' },
    { label: 'Higher Self', sub: 'Architecture', zone: 'outer' },
  ];

  const cols = [
    { label: 'C', full: 'Chances', desc: 'Risk & experimentation' },
    { label: 'H', full: 'Heart', desc: 'Compassion & values' },
    { label: 'O', full: 'Observer', desc: 'Awareness & perspective' },
    { label: 'R', full: 'Reversal', desc: 'Renewal & pivoting' },
    { label: 'D', full: 'Design', desc: 'Craft & intentionality' },
    { label: 'S', full: 'Seeds', desc: 'Planting & potential' },
  ];

  const zoneColors: Record<string, string> = {
    inner: 'border-purple-500/30 bg-purple-500/5',
    stretch: 'border-amber-500/30 bg-amber-500/5',
    outer: 'border-red-500/20 bg-red-500/5',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-lg font-bold text-center mb-2 text-white/90">Matrix Legend</h3>
      <p className="text-xs text-center text-slate-400 mb-6">
        How the CHORDS dimensions × AGENDAS stages map to the 8×8 Calm Magic board
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Vertical axis: stages */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
            Vertical Axis — 8 Stages (Rows)
          </h4>
          <div className="space-y-1.5">
            {rows.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${zoneColors[r.zone]}`}
              >
                <span className="text-xs font-mono text-slate-400 w-4">{i + 1}</span>
                <div>
                  <span className="text-sm font-medium text-white/90">{r.label}</span>
                  <span className="text-[10px] text-slate-400 ml-2">{r.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal axis: CHORDS */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
            Horizontal Axis — CHORDS (Columns)
          </h4>
          <div className="space-y-1.5">
            {cols.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/10 bg-white/5"
              >
                <span className="text-lg font-black text-purple-400 w-6 text-center">{c.label}</span>
                <div>
                  <span className="text-sm font-medium text-white/90">{c.full}</span>
                  <span className="text-[10px] text-slate-400 ml-2">{c.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Suit boards */}
          <h4 className="text-xs font-semibold text-slate-300 mt-6 mb-3 uppercase tracking-wider">
            5 Boards (Suit Layers)
          </h4>
          <div className="flex flex-wrap gap-2">
            {['LOVE', 'MAGIC', 'CALM', 'OPEN', 'FREE'].map((b) => (
              <span
                key={b}
                className="text-[10px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 font-medium tracking-wider"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
