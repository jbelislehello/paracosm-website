import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface PolenEntry {
  id: string;
  content: string;
  season_context: string | null;
  created_at: string;
  tags: string[] | null;
}

interface HexagramReading {
  id: string;
  question: string;
  primary_hexagram: number;
  relating_hexagram: number | null;
  reflection: string | null;
  created_at: string;
}

interface JourneySummaryExportProps {
  projectName: string;
  gardenName: string;
  seasonCounts: Record<Season, number>;
  foundationalPrompt: string;
}

const HEXAGRAM_NAMES: Record<number, string> = {
  1: 'The Creative', 2: 'The Receptive', 3: 'Difficulty at the Beginning', 4: 'Youthful Folly',
  5: 'Waiting', 6: 'Conflict', 7: 'The Army', 8: 'Holding Together', 9: 'Small Taming',
  10: 'Treading', 11: 'Peace', 12: 'Standstill', 13: 'Fellowship', 14: 'Great Possession',
  15: 'Modesty', 16: 'Enthusiasm', 17: 'Following', 18: 'Work on the Decayed', 19: 'Approach',
  20: 'Contemplation', 21: 'Biting Through', 22: 'Grace', 23: 'Splitting Apart', 24: 'Return',
  25: 'Innocence', 26: 'Great Taming', 27: 'Nourishment', 28: 'Great Exceeding', 29: 'The Abysmal',
  30: 'The Clinging', 31: 'Influence', 32: 'Duration', 33: 'Retreat', 34: 'Great Power',
  35: 'Progress', 36: 'Darkening of the Light', 37: 'The Family', 38: 'Opposition',
  39: 'Obstruction', 40: 'Deliverance', 41: 'Decrease', 42: 'Increase', 43: 'Breakthrough',
  44: 'Coming to Meet', 45: 'Gathering Together', 46: 'Pushing Upward', 47: 'Oppression',
  48: 'The Well', 49: 'Revolution', 50: 'The Cauldron', 51: 'The Arousing', 52: 'Keeping Still',
  53: 'Development', 54: 'The Marrying Maiden', 55: 'Abundance', 56: 'The Wanderer',
  57: 'The Gentle', 58: 'The Joyous', 59: 'Dispersion', 60: 'Limitation', 61: 'Inner Truth',
  62: 'Small Exceeding', 63: 'After Completion', 64: 'Before Completion',
};

const SEASON_ORDER: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const JourneySummaryExport = ({
  projectName,
  gardenName,
  seasonCounts,
  foundationalPrompt
}: JourneySummaryExportProps) => {
  const [entries, setEntries] = useState<PolenEntry[]>([]);
  const [readings, setReadings] = useState<HexagramReading[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        // Fetch entries
        const { data: polenData } = await supabase
          .from('polen_entries')
          .select('id, content, season_context, created_at, tags')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: true });

        if (polenData && polenData.length > 0) {
          setEntries(polenData);
          setDateRange({
            start: polenData[0].created_at,
            end: polenData[polenData.length - 1].created_at
          });
        }

        // Fetch hexagram readings
        const { data: hexData } = await supabase
          .from('hexagram_readings')
          .select('id, question, primary_hexagram, relating_hexagram, reflection, created_at')
          .eq('user_id', userData.user.id)
          .order('created_at', { ascending: true });

        if (hexData) {
          setReadings(hexData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open]);

  const totalCount = Object.values(seasonCounts).reduce((a, b) => a + b, 0);

  const getTopEntriesBySeason = (season: Season, count: number = 3) => {
    return entries
      .filter(e => e.season_context === season)
      .sort((a, b) => b.content.length - a.content.length)
      .slice(0, count);
  };

  const generateMarkdown = () => {
    let md = `# ${projectName} — Journey Summary\n\n`;
    md += `**Garden:** ${gardenName}\n`;
    if (dateRange) {
      md += `**Journey Period:** ${format(new Date(dateRange.start), 'MMMM d, yyyy')} — ${format(new Date(dateRange.end), 'MMMM d, yyyy')}\n`;
    }
    md += `**Total Fragments:** ${totalCount}\n\n`;
    md += `---\n\n`;

    // Season Statistics
    md += `## Season Statistics\n\n`;
    SEASON_ORDER.forEach(season => {
      const count = seasonCounts[season];
      const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      const bar = '█'.repeat(Math.round(percent / 5)) + '░'.repeat(20 - Math.round(percent / 5));
      md += `**${season}:** ${count} fragments (${percent}%) \`${bar}\`\n\n`;
    });
    md += `---\n\n`;

    // Oracle Readings
    if (readings.length > 0) {
      md += `## Oracle Readings (${readings.length})\n\n`;
      readings.forEach((reading, i) => {
        const primary = HEXAGRAM_NAMES[reading.primary_hexagram] || `Hexagram ${reading.primary_hexagram}`;
        md += `### ${i + 1}. ${primary} (#${reading.primary_hexagram})`;
        if (reading.relating_hexagram) {
          const relating = HEXAGRAM_NAMES[reading.relating_hexagram] || `Hexagram ${reading.relating_hexagram}`;
          md += ` → ${relating} (#${reading.relating_hexagram})`;
        }
        md += `\n\n`;
        md += `**Question:** ${reading.question}\n\n`;
        if (reading.reflection) {
          md += `**Reflection:** ${reading.reflection}\n\n`;
        }
        md += `*${format(new Date(reading.created_at), 'MMMM d, yyyy')}*\n\n`;
      });
      md += `---\n\n`;
    }

    // Key Excerpts by Season
    md += `## Key Excerpts by Season\n\n`;
    SEASON_ORDER.forEach(season => {
      const topEntries = getTopEntriesBySeason(season);
      if (topEntries.length === 0) return;
      
      md += `### ${season}\n\n`;
      topEntries.forEach((entry, i) => {
        const excerpt = entry.content.length > 300 
          ? entry.content.slice(0, 300) + '...' 
          : entry.content;
        md += `${i + 1}. ${excerpt}\n\n`;
        if (entry.tags && entry.tags.length > 0) {
          md += `   *Tags: ${entry.tags.join(', ')}*\n\n`;
        }
      });
    });
    md += `---\n\n`;

    // Foundational Prompt
    md += `## Foundational Prompt\n\n`;
    md += `\`\`\`\n${foundationalPrompt.slice(0, 2000)}${foundationalPrompt.length > 2000 ? '\n...[truncated]' : ''}\n\`\`\`\n`;

    return md;
  };

  const handleDownloadMarkdown = () => {
    const markdown = generateMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-journey-summary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Journey summary downloaded');
  };

  const handlePrint = () => {
    const markdown = generateMarkdown();
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return;
    }

    // Simple markdown to HTML conversion
    const html = markdown
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```\n?([\s\S]*?)\n?```/g, '<pre><code>$1</code></pre>')
      .replace(/^---$/gm, '<hr>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^\d+\. /gm, '• ');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${projectName} - Journey Summary</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
            h1 { border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
            h2 { margin-top: 2rem; color: #444; }
            h3 { color: #666; }
            code { background: #f4f4f4; padding: 0.1rem 0.3rem; border-radius: 3px; font-size: 0.9em; }
            pre { background: #f4f4f4; padding: 1rem; border-radius: 6px; overflow-x: auto; }
            pre code { background: none; padding: 0; }
            hr { border: none; border-top: 1px solid #ddd; margin: 2rem 0; }
            @media print { body { max-width: none; } }
          </style>
        </head>
        <body><p>${html}</p></body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Export Summary
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Journey Summary Export</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Preparing summary...
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <ScrollArea className="h-[400px] border rounded-lg p-4 bg-muted/30">
              <div className="space-y-4 text-sm">
                <div>
                  <h2 className="text-lg font-bold">{projectName}</h2>
                  <p className="text-muted-foreground">Garden of {gardenName}</p>
                  {dateRange && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(dateRange.start), 'MMM d')} — {format(new Date(dateRange.end), 'MMM d, yyyy')}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <h3 className="font-semibold mb-2">Season Statistics</h3>
                  {SEASON_ORDER.map(season => {
                    const count = seasonCounts[season];
                    const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                    return (
                      <div key={season} className="flex items-center gap-2 mb-1">
                        <span className="w-20 text-xs">{season}</span>
                        <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                          <div 
                            className="h-full bg-primary/60 rounded"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs w-16 text-right">{count} ({percent}%)</span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t">
                  <h3 className="font-semibold mb-1">Oracle Readings</h3>
                  <p className="text-muted-foreground">{readings.length} readings captured</p>
                </div>

                <div className="pt-2 border-t">
                  <h3 className="font-semibold mb-1">Key Excerpts</h3>
                  <p className="text-muted-foreground">Top 3 fragments per season included</p>
                </div>

                <div className="pt-2 border-t">
                  <h3 className="font-semibold mb-1">Foundational Prompt</h3>
                  <p className="text-muted-foreground">Compiled prompt included</p>
                </div>
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Print / Save as PDF
              </Button>
              <Button onClick={handleDownloadMarkdown} className="gap-2">
                <Download className="w-4 h-4" />
                Download Markdown
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JourneySummaryExport;
