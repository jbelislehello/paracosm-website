import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface DailyActivity {
  date: Date;
  dateStr: string;
  counts: Record<Season, number>;
  total: number;
}

interface JourneyTimelineProps {
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const SEASON_COLORS: Record<Season, string> = {
  POLLENS: 'hsl(346 77% 50%)', // rose
  NOEMS: 'hsl(270 60% 55%)', // violet
  POEMS: 'hsl(234 89% 60%)', // indigo
  TOTEMS: 'hsl(186 77% 45%)', // cyan
  ANTHEMS: 'hsl(152 76% 40%)', // emerald
};

const SEASON_ORDER: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const JourneyTimeline = ({ onDateSelect, className }: JourneyTimelineProps) => {
  const [dailyData, setDailyData] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        const { data: entries, error } = await supabase
          .from('polen_entries')
          .select('created_at, season_context')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: true });

        if (error || !entries || entries.length === 0) {
          setLoading(false);
          return;
        }

        // Get date range
        const firstDate = startOfDay(parseISO(entries[0].created_at));
        const lastDate = endOfDay(parseISO(entries[entries.length - 1].created_at));
        const allDays = eachDayOfInterval({ start: firstDate, end: lastDate });

        // Group entries by day and season
        const dayMap = new Map<string, Record<Season, number>>();
        
        allDays.forEach(day => {
          const dayStr = format(day, 'yyyy-MM-dd');
          dayMap.set(dayStr, { POLLENS: 0, NOEMS: 0, POEMS: 0, TOTEMS: 0, ANTHEMS: 0 });
        });

        entries.forEach(entry => {
          const dayStr = format(parseISO(entry.created_at), 'yyyy-MM-dd');
          const season = entry.season_context as Season;
          if (dayMap.has(dayStr) && season && SEASON_ORDER.includes(season)) {
            dayMap.get(dayStr)![season]++;
          }
        });

        // Convert to array
        const timeline: DailyActivity[] = Array.from(dayMap.entries()).map(([dateStr, counts]) => ({
          date: parseISO(dateStr),
          dateStr,
          counts,
          total: Object.values(counts).reduce((a, b) => a + b, 0)
        }));

        setDailyData(timeline);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  const maxDailyCount = useMemo(() => {
    return Math.max(...dailyData.map(d => d.total), 1);
  }, [dailyData]);

  const totalDays = dailyData.length;
  const activeDays = dailyData.filter(d => d.total > 0).length;
  const totalFragments = dailyData.reduce((sum, d) => sum + d.total, 0);

  const handleDateClick = (day: DailyActivity) => {
    setSelectedDate(day.dateStr);
    onDateSelect?.(day.date);
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center py-8", className)}>
        <div className="text-sm text-muted-foreground">Loading timeline...</div>
      </div>
    );
  }

  if (dailyData.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <Calendar className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">No journey data yet</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Journey Timeline</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {activeDays} active days • {totalFragments} fragments
        </div>
      </div>

      {/* Timeline Visualization */}
      <Card className="p-4 bg-background/50">
        <TooltipProvider>
          <div className="space-y-3">
            {/* Date Labels */}
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{format(dailyData[0].date, 'MMM d')}</span>
              {totalDays > 1 && (
                <span>{format(dailyData[dailyData.length - 1].date, 'MMM d, yyyy')}</span>
              )}
            </div>

            {/* Stacked Bar Chart */}
            <div className="flex gap-1 items-end h-32">
              {dailyData.map((day) => {
                const heightPercent = (day.total / maxDailyCount) * 100;
                const isSelected = selectedDate === day.dateStr;
                
                return (
                  <Tooltip key={day.dateStr}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleDateClick(day)}
                        className={cn(
                          "flex-1 min-w-[8px] max-w-[40px] flex flex-col justify-end rounded-t transition-all",
                          "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/50",
                          isSelected && "ring-2 ring-primary"
                        )}
                        style={{ height: '100%' }}
                      >
                        {day.total > 0 ? (
                          <div 
                            className="w-full flex flex-col rounded-t overflow-hidden"
                            style={{ height: `${Math.max(heightPercent, 5)}%` }}
                          >
                            {SEASON_ORDER.map(season => {
                              const count = day.counts[season];
                              if (count === 0) return null;
                              const segmentHeight = (count / day.total) * 100;
                              return (
                                <div
                                  key={season}
                                  style={{ 
                                    height: `${segmentHeight}%`,
                                    backgroundColor: SEASON_COLORS[season],
                                    minHeight: count > 0 ? '2px' : 0
                                  }}
                                />
                              );
                            })}
                          </div>
                        ) : (
                          <div className="w-full h-1 bg-muted/30 rounded" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1.5">
                        <p className="font-medium">{format(day.date, 'EEEE, MMMM d')}</p>
                        {day.total > 0 ? (
                          <>
                            <p className="text-xs text-muted-foreground">{day.total} fragments</p>
                            <div className="space-y-0.5 text-xs">
                              {SEASON_ORDER.map(season => {
                                const count = day.counts[season];
                                if (count === 0) return null;
                                return (
                                  <div key={season} className="flex items-center gap-2">
                                    <div 
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: SEASON_COLORS[season] }}
                                    />
                                    <span>{season}: {count}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-muted-foreground">No activity</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 pt-2 border-t border-border/50">
              {SEASON_ORDER.map(season => (
                <div key={season} className="flex items-center gap-1.5">
                  <div 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: SEASON_COLORS[season] }}
                  />
                  <span className="text-xs text-muted-foreground">{season}</span>
                </div>
              ))}
            </div>
          </div>
        </TooltipProvider>
      </Card>
    </div>
  );
};

export default JourneyTimeline;
