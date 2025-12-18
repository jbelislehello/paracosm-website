import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

export interface SearchFilters {
  query: string;
  tags: string[];
  dateRange: DateRange | undefined;
}

interface SearchFilterToolbarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableTags: string[];
  totalCount: number;
  filteredCount: number;
  className?: string;
}

const SearchFilterToolbar = ({
  filters,
  onFiltersChange,
  availableTags,
  totalCount,
  filteredCount,
  className
}: SearchFilterToolbarProps) => {
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  const hasActiveFilters = filters.query || filters.tags.length > 0 || filters.dateRange?.from;

  const filteredTags = useMemo(() => {
    if (!tagSearchQuery) return availableTags.slice(0, 20);
    return availableTags
      .filter(tag => tag.toLowerCase().includes(tagSearchQuery.toLowerCase()))
      .slice(0, 20);
  }, [availableTags, tagSearchQuery]);

  const handleClearFilters = () => {
    onFiltersChange({
      query: '',
      tags: [],
      dateRange: undefined
    });
  };

  const handleToggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleRemoveTag = (tag: string) => {
    onFiltersChange({ ...filters, tags: filters.tags.filter(t => t !== tag) });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search fragments..."
            value={filters.query}
            onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Tag Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Tags
              {filters.tags.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {filters.tags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" align="end">
            <div className="space-y-3">
              <Input
                placeholder="Search tags..."
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                className="h-8 text-sm"
              />
              <ScrollArea className="h-48">
                <div className="space-y-1">
                  {filteredTags.map(tag => (
                    <label
                      key={tag}
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={() => handleToggleTag(tag)}
                      />
                      <span className="text-sm truncate">{tag}</span>
                    </label>
                  ))}
                  {filteredTags.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No tags found
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <span className="text-xs">
                    {format(filters.dateRange.from, 'MMM d')} - {format(filters.dateRange.to, 'MMM d')}
                  </span>
                ) : (
                  <span className="text-xs">From {format(filters.dateRange.from, 'MMM d')}</span>
                )
              ) : (
                'Dates'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange?.from}
              selected={filters.dateRange}
              onSelect={(range) => onFiltersChange({ ...filters, dateRange: range })}
              numberOfMonths={1}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearFilters}
            className="shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Showing {filteredCount} of {totalCount}
          </span>
          {filters.tags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="gap-1 pl-2 pr-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag}
              <X className="w-3 h-3" />
            </Badge>
          ))}
          {filters.dateRange?.from && (
            <Badge
              variant="secondary"
              className="gap-1 pl-2 pr-1 cursor-pointer hover:bg-secondary/80"
              onClick={() => onFiltersChange({ ...filters, dateRange: undefined })}
            >
              {format(filters.dateRange.from, 'MMM d')}
              {filters.dateRange.to && ` - ${format(filters.dateRange.to, 'MMM d')}`}
              <X className="w-3 h-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilterToolbar;
