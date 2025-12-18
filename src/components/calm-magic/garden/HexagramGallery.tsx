import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface HexagramReading {
  id: string;
  question: string;
  primary_hexagram: number;
  relating_hexagram: number | null;
  changing_lines: number[] | null;
  interpretation: string | null;
  reflection: string | null;
  tags: string[] | null;
  created_at: string;
  tile_id: number | null;
}

interface HexagramGalleryProps {
  className?: string;
}

// Simplified hexagram names - just the essentials
const HEXAGRAM_NAMES: Record<number, string> = {
  1: 'The Creative',
  2: 'The Receptive',
  3: 'Difficulty at the Beginning',
  4: 'Youthful Folly',
  5: 'Waiting',
  6: 'Conflict',
  7: 'The Army',
  8: 'Holding Together',
  9: 'Small Taming',
  10: 'Treading',
  11: 'Peace',
  12: 'Standstill',
  13: 'Fellowship',
  14: 'Great Possession',
  15: 'Modesty',
  16: 'Enthusiasm',
  17: 'Following',
  18: 'Work on the Decayed',
  19: 'Approach',
  20: 'Contemplation',
  21: 'Biting Through',
  22: 'Grace',
  23: 'Splitting Apart',
  24: 'Return',
  25: 'Innocence',
  26: 'Great Taming',
  27: 'Nourishment',
  28: 'Great Exceeding',
  29: 'The Abysmal',
  30: 'The Clinging',
  31: 'Influence',
  32: 'Duration',
  33: 'Retreat',
  34: 'Great Power',
  35: 'Progress',
  36: 'Darkening of the Light',
  37: 'The Family',
  38: 'Opposition',
  39: 'Obstruction',
  40: 'Deliverance',
  41: 'Decrease',
  42: 'Increase',
  43: 'Breakthrough',
  44: 'Coming to Meet',
  45: 'Gathering Together',
  46: 'Pushing Upward',
  47: 'Oppression',
  48: 'The Well',
  49: 'Revolution',
  50: 'The Cauldron',
  51: 'The Arousing',
  52: 'Keeping Still',
  53: 'Development',
  54: 'The Marrying Maiden',
  55: 'Abundance',
  56: 'The Wanderer',
  57: 'The Gentle',
  58: 'The Joyous',
  59: 'Dispersion',
  60: 'Limitation',
  61: 'Inner Truth',
  62: 'Small Exceeding',
  63: 'After Completion',
  64: 'Before Completion',
};

const HexagramGallery = ({ className }: HexagramGalleryProps) => {
  const [readings, setReadings] = useState<HexagramReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        const { data, error } = await supabase
          .from('hexagram_readings')
          .select('*')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching readings:', error);
          return;
        }

        setReadings(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, []);

  if (loading) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        Loading oracle readings...
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">
          No oracle readings captured yet
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Oracle Gallery
        </h3>
        <p className="text-sm text-muted-foreground">
          {readings.length} {readings.length === 1 ? 'reading' : 'readings'} from your journey
        </p>
      </div>

      <ScrollArea className="max-h-[500px]">
        <div className="grid gap-4 md:grid-cols-2">
          {readings.map((reading) => (
            <Card 
              key={reading.id}
              className="p-4 bg-background/50 border-amber-500/20 hover:border-amber-500/40 transition-colors"
            >
              {/* Hexagram Display */}
              <div className="flex items-start gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {reading.primary_hexagram}
                    </span>
                  </div>
                  {reading.relating_hexagram && (
                    <>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <div className="w-10 h-10 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-center justify-center">
                        <span className="text-lg font-semibold text-amber-600/70 dark:text-amber-400/70">
                          {reading.relating_hexagram}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {HEXAGRAM_NAMES[reading.primary_hexagram] || `Hexagram ${reading.primary_hexagram}`}
                  </p>
                  {reading.relating_hexagram && (
                    <p className="text-xs text-muted-foreground">
                      → {HEXAGRAM_NAMES[reading.relating_hexagram] || `Hexagram ${reading.relating_hexagram}`}
                    </p>
                  )}
                </div>
              </div>

              {/* Question */}
              <div className="mb-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">
                    {reading.question}
                  </p>
                </div>
              </div>

              {/* Changing lines */}
              {reading.changing_lines && reading.changing_lines.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Changing lines:</p>
                  <div className="flex gap-1">
                    {reading.changing_lines.map(line => (
                      <Badge key={line} variant="outline" className="text-xs">
                        Line {line}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Reflection preview */}
              {reading.reflection && (
                <div className="mb-3 p-2 rounded bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground italic line-clamp-2">
                    "{reading.reflection}"
                  </p>
                </div>
              )}

              {/* Footer: Tags and Date */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex gap-1 flex-wrap">
                  {reading.tags?.slice(0, 3).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(reading.created_at), 'MMM d')}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HexagramGallery;
