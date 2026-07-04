
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CaseStudy, categories } from '@/data/caseStudies';
import { cn } from '@/lib/utils';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onViewDetails: (id: string) => void;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ caseStudy, onViewDetails }) => {
  const categoryInfo = categories[caseStudy.category];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <img
            src={/^(https?:)?\//.test(caseStudy.image) ? caseStudy.image : `https://images.unsplash.com/${caseStudy.image}?auto=format&fit=crop&w=800&q=80`}
            alt={caseStudy.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className={cn(
          "absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r",
          categoryInfo.color
        )}>
          {categoryInfo.icon} {categoryInfo.name}
        </div>
        <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 px-2 py-1 rounded text-sm font-medium">
          {caseStudy.year}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl mb-2">{caseStudy.title}</CardTitle>
        <p className="text-muted-foreground font-medium">{caseStudy.subtitle}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {caseStudy.description}
        </p>

        {caseStudy.technologies && (
          <div className="flex flex-wrap gap-1">
            {caseStudy.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {caseStudy.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{caseStudy.technologies.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {caseStudy.awards && caseStudy.awards.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
            <span>🏆</span>
            <span className="font-medium">Award Winner</span>
          </div>
        )}

        <Button 
          onClick={() => onViewDetails(caseStudy.id)}
          className="w-full"
          variant="outline"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default CaseStudyCard;
