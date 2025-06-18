
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CaseStudyRecommendationProps {
  title: string;
  description: string;
  caseStudyId: string;
  caseStudyTitle: string;
}

const CaseStudyRecommendation: React.FC<CaseStudyRecommendationProps> = ({
  title,
  description,
  caseStudyId,
  caseStudyTitle
}) => {
  return (
    <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-purple-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{description}</p>
        <Link 
          to={`/case-studies#${caseStudyId}`} 
          className="inline-flex items-center gap-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
        >
          Voir le projet: {caseStudyTitle}
          <ExternalLink size={12} />
        </Link>
      </CardContent>
    </Card>
  );
};

export default CaseStudyRecommendation;
