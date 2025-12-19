import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, addDays, parseISO, differenceInWeeks, subWeeks } from 'date-fns';
import { cn } from '@/lib/utils';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface DayData {
  date: string;
  count: number;
  seasonBreakdown: Record<Season, number>;
}

interface FragmentHeatmapProps {
  projectId?: string | null;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const SEASON_COLORS: Record<Season, string> = {
  POLLENS: 'text-rose-500',
  NOEMS: 'text-amber-500',
  POEMS: 'text-purple-500',
  TOTEMS: 'text-blue-500',
  ANTHEMS: 'text-emerald-500',
};

const FragmentHeatmap: React.FC<FragmentHeatmapProps> = ({ projectId, onDateSelect, className }) => {
  const [dayData, setDayData] = useState<Record<string, DayData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [maxCount, setMaxCount] = useState(1);

  // Fetch fragment data grouped by day
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        let query = supabase
          .from('polen_entries')
          .select('created_at, season_context')
          .eq('user_id', userData.user.id);
        
        // Filter by project_id if provided
        if (projectId) {
          query = query.eq('project_id', projectId);
        }
        
        const { data: entries } = await query.order('created_at', { ascending: true });

        if (!entries) return;

        const grouped: Record<string, DayData> = {};
        let max = 1;

        entries.forEach(entry => {
          const dateKey = format(parseISO(entry.created_at), 'yyyy-MM-dd');
          const season = entry.season_context as Season;

          if (!grouped[dateKey]) {
            grouped[dateKey] = {
              date: dateKey,
              count: 0,
              seasonBreakdown: { POLLENS: 0, NOEMS: 0, POEMS: 0, TOTEMS: 0, ANTHEMS: 0 }
            };
          }

          grouped[dateKey].count++;
          if (season && grouped[dateKey].seasonBreakdown[season] !== undefined) {
            grouped[dateKey].seasonBreakdown[season]++;
          }

          if (grouped[dateKey].count > max) {
            max = grouped[dateKey].count;
          }
        });

        setDayData(grouped);
        setMaxCount(max);
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // Generate weeks array (last 16 weeks)
  const weeks = useMemo(() => {
    const today = new Date();
    const weeksToShow = 16;
    const result: Date[][] = [];

    for (let w = weeksToShow - 1; w >= 0; w--) {
      const weekStart = startOfWeek(subWeeks(today, w), { weekStartsOn: 0 });
      const week: Date[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(addDays(weekStart, d));
      }
      result.push(week);
    }

    return result;
  }, []);

  // Get intensity class based on count
  const getIntensityClass = (count: number): string => {
    if (count === 0) return 'bg-muted/30';
    const intensity = count / maxCount;
    if (intensity < 0.25) return 'bg-primary/20';
    if (intensity < 0.5) return 'bg-primary/40';
    if (intensity < 0.75) return 'bg-primary/60';
    return 'bg-primary/80';
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  if (isLoading) {
    return (
      <Card className={cn("border-border/50", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-32 bg-muted/30 rounded" />
        </CardContent>
      </Card>
    );
  }

  const totalFragments = Object.values(dayData).reduce((sum, d) => sum + d.count, 0);
  const activeDays = Object.keys(dayData).length;

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-primary" />
            Activity Heatmap
          </CardTitle>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{totalFragments} fragments</span>
            <span>•</span>
            <span>{activeDays} active days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-1">
              {dayLabels.map((label, i) => (
                <div 
                  key={i} 
                  className="h-3 w-3 text-[9px] text-muted-foreground flex items-center justify-center"
                >
                  {i % 2 === 1 ? label : ''}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex gap-1 overflow-x-auto">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const data = dayData[dateKey];
                    const count = data?.count || 0;
                    const isToday = format(new Date(), 'yyyy-MM-dd') === dateKey;

                    return (
                      <Tooltip key={dayIndex}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => count > 0 && onDateSelect?.(day)}
                            className={cn(
                              "h-3 w-3 rounded-sm transition-all",
                              getIntensityClass(count),
                              count > 0 && "hover:ring-2 hover:ring-primary/50 cursor-pointer",
                              isToday && "ring-1 ring-foreground/30"
                            )}
                            disabled={count === 0}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <div className="space-y-1">
                            <p className="font-medium">{format(day, 'MMM d, yyyy')}</p>
                            {count > 0 ? (
                              <>
                                <p>{count} fragment{count > 1 ? 's' : ''}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(Object.entries(data?.seasonBreakdown || {}) as [Season, number][])
                                    .filter(([_, c]) => c > 0)
                                    .map(([season, c]) => (
                                      <span key={season} className={cn("text-[10px]", SEASON_COLORS[season])}>
                                        {season}: {c}
                                      </span>
                                    ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-muted-foreground">No activity</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-sm bg-muted/30" />
              <div className="h-3 w-3 rounded-sm bg-primary/20" />
              <div className="h-3 w-3 rounded-sm bg-primary/40" />
              <div className="h-3 w-3 rounded-sm bg-primary/60" />
              <div className="h-3 w-3 rounded-sm bg-primary/80" />
            </div>
            <span>More</span>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};

export default FragmentHeatmap;
