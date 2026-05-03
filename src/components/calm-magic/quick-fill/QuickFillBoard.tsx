import { QUICK_FILL_TILES, PHASE_COLOR, type QuickFillTile } from './quickFillTiles';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Props {
  answers: Record<number, string>;
  loadingTileIds?: Set<number>;
}

export const QuickFillBoard = ({ answers, loadingTileIds }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {QUICK_FILL_TILES.map((tile) => (
        <TileCell
          key={tile.id}
          tile={tile}
          answer={answers[tile.id]}
          loading={loadingTileIds?.has(tile.id) ?? false}
        />
      ))}
    </div>
  );
};

const TileCell = ({ tile, answer, loading }: { tile: QuickFillTile; answer?: string; loading: boolean }) => (
  <Card className={cn('p-3 border-l-4 flex flex-col gap-2 min-h-[140px]', PHASE_COLOR[tile.phase])}>
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] font-mono text-muted-foreground">
        #{tile.id} · {tile.rowName} × {tile.colName}
      </span>
      <span className="text-[10px] font-semibold text-muted-foreground">{tile.phase}</span>
    </div>
    <div className="text-sm font-semibold leading-tight">{tile.name}</div>
    {loading && !answer ? (
      <div className="space-y-1.5 mt-1">
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="h-2.5 w-5/6" />
        <Skeleton className="h-2.5 w-2/3" />
      </div>
    ) : answer ? (
      <p className="text-xs text-muted-foreground leading-snug whitespace-pre-wrap">{answer}</p>
    ) : (
      <p className="text-xs text-muted-foreground/40 italic">Empty</p>
    )}
  </Card>
);
