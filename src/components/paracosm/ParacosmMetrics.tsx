import { Card, CardContent } from '@/components/ui/card';
import { Package, Sparkles, Brain, Globe } from 'lucide-react';

interface ParacosmMetricsProps {
  totalSoftware: number;
  recursiveCount: number;
  consciousnessBits: number;
  platforms: string[];
}

export const ParacosmMetrics = ({
  totalSoftware,
  recursiveCount,
  consciousnessBits,
  platforms,
}: ParacosmMetricsProps) => {
  const metrics = [
    {
      label: 'Total Software',
      value: totalSoftware,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Recursive Products',
      value: recursiveCount,
      icon: Sparkles,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'Consciousness Bits',
      value: consciousnessBits.toFixed(1),
      icon: Brain,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      label: 'Platforms Active',
      value: platforms.length,
      icon: Globe,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
