import React from 'react';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { AXIS_META, type DreamAxis } from '@/data/dreamPrompts';
import GlossaryTerm from './GlossaryTerm';

export interface SavedAxis {
  key: DreamAxis;
  narration: string;
  tile_keys: string[];
  tile_ids?: number[];
  maturity?: number;
}

interface DreamBoardViewProps {
  question: string;
  filename?: string | null;
  axes: SavedAxis[];
  summary?: string | null;
  createdAt?: string;
}

const AXIS_ORDER: DreamAxis[] = ['love', 'magic', 'calm', 'open', 'free'];

const DreamBoardView: React.FC<DreamBoardViewProps> = ({
  question, filename, axes, summary, createdAt,
}) => {
  const byKey = Object.fromEntries(axes.map(a => [a.key, a])) as Record<DreamAxis, SavedAxis>;

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">A dream of the board</p>
        <p className="text-sm italic">"{question}"</p>
        {(filename || createdAt) && (
          <p className="text-[10px] text-muted-foreground">
            {filename}{filename && createdAt ? ' · ' : ''}{createdAt && new Date(createdAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {AXIS_ORDER.map((key) => {
          const meta = AXIS_META[key];
          const a = byKey[key];
          const lit = !!a;
          const maturity = a?.maturity ?? 0;
          return (
            <Card
              key={key}
              className="p-3 relative overflow-hidden"
              style={{ borderColor: lit ? meta.color : undefined }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-10`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" style={{ color: meta.color }}>{meta.symbol}</span>
                    <GlossaryTerm term={key} className="text-xs font-bold tracking-widest cursor-help" >
                      <span style={{ color: meta.color }}>{meta.label}</span>
                    </GlossaryTerm>
                  </div>
                  <span className="text-[10px] tabular-nums font-mono" style={{ color: meta.color }}>
                    {Math.round(maturity * 100)}%
                  </span>
                </div>
                <div className="h-1 w-full rounded-full bg-muted overflow-hidden mb-2">
                  <div className="h-full" style={{ width: `${maturity * 100}%`, backgroundColor: meta.color }} />
                </div>
                <div className="space-y-1 min-h-[3rem]">
                  {a?.tile_keys?.map((t, i) => (
                    <div key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 inline-block mr-1 mb-1">
                      {t}
                    </div>
                  ))}
                  {a?.tile_ids && a.tile_ids.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {a.tile_ids.map((id) => (
                        <span
                          key={id}
                          className="text-[9px] font-mono tabular-nums px-1 py-0.5 rounded border"
                          style={{ borderColor: meta.color, color: meta.color }}
                          title={`Tile #${id}`}
                        >
                          #{id}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4 bg-muted/20">
        <div className="space-y-4">
          {axes.map((a) => {
            const meta = AXIS_META[a.key];
            return (
              <div key={a.key} className="space-y-1">
                <div className="text-xs font-bold tracking-widest" style={{ color: meta.color }}>
                  {meta.symbol} {meta.label}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed">
                  <ReactMarkdown>{a.narration}</ReactMarkdown>
                </div>
              </div>
            );
          })}
          {summary && (
            <div className="pt-3 border-t border-border/50 text-sm italic text-muted-foreground">
              {summary}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DreamBoardView;
