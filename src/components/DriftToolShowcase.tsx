
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { driftTools, DriftToolAxis } from '@/data/driftTools';
import { axisColors, axisLabels } from '@/data/driftMonthlyDiscoveries';
import { getMonthName } from '@/data/driftMonthlyDiscoveries';

type FilterAxis = DriftToolAxis | 'all';

const DriftToolShowcase: React.FC = () => {
  const [filter, setFilter] = useState<FilterAxis>('all');

  const filtered = filter === 'all' ? driftTools : driftTools.filter(t => t.axis === filter);

  const filters: { key: FilterAxis; label: string; color?: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'love', label: axisLabels.love, color: axisColors.love },
    { key: 'magic', label: axisLabels.magic, color: axisColors.magic },
    { key: 'calm', label: axisLabels.calm, color: axisColors.calm },
    { key: 'open', label: axisLabels.open, color: axisColors.open },
    { key: 'free', label: axisLabels.free, color: axisColors.free },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Tool Showcase
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tools we use and love, mapped to the Calm Magic compass. Each one has earned its place in our workflows.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
                filter === f.key
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-background border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
              }`}
              style={filter === f.key && f.color ? { backgroundColor: f.color, borderColor: f.color } : undefined}
            >
              {f.color && <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: filter === f.key ? '#fff' : f.color }} />}
              {f.label}
            </button>
          ))}
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(tool => {
            const color = axisColors[tool.axis];
            return (
              <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="block group">
                <Card className="h-full border-2 hover:shadow-lg transition-all duration-300" style={{ borderColor: `${color}30` }}>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                      <Badge variant="outline" className="shrink-0 text-xs font-semibold">
                        {tool.startingPrice}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-medium" style={{ color }}>{axisLabels[tool.axis]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{getMonthName(tool.month)} {tool.year}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DriftToolShowcase;
