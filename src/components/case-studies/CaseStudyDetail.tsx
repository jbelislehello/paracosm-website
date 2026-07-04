
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CaseStudy, categories, caseStudies } from '@/data/caseStudies';
import { cn } from '@/lib/utils';
import { ArrowLeft, ExternalLink, Award, Users, Target, Lightbulb } from 'lucide-react';

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
  onBack: () => void;
}

const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({ caseStudy, onBack }) => {
  const categoryInfo = categories[caseStudy.category];
  const relatedCases = caseStudies.filter(cs => 
    caseStudy.relatedProjects?.includes(cs.id) && cs.id !== caseStudy.id
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline" className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Case Studies
      </Button>

      <Card>
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <img
              src={/^(https?:)?\//.test(caseStudy.image) ? caseStudy.image : `https://images.unsplash.com/${caseStudy.image}?auto=format&fit=crop&w=1200&q=80`}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={cn(
            "absolute top-6 left-6 px-4 py-2 rounded-full text-white font-medium bg-gradient-to-r",
            categoryInfo.color
          )}>
            {categoryInfo.icon} {categoryInfo.name}
          </div>
          <div className="absolute top-6 right-6 bg-white dark:bg-slate-800 px-3 py-2 rounded font-medium">
            {caseStudy.year}
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-3xl mb-2">{caseStudy.title}</CardTitle>
          <p className="text-xl text-muted-foreground font-medium">{caseStudy.subtitle}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">{caseStudy.description}</p>
          </div>

          {caseStudy.videos && caseStudy.videos.length > 0 && (
            <div className={cn("grid gap-4", caseStudy.videos.length > 1 ? "md:grid-cols-2" : "grid-cols-1")}>
              {caseStudy.videos.map((v) => (
                <div key={`${v.provider}-${v.id}`} className="space-y-2">
                  <div className="aspect-video overflow-hidden rounded-md bg-black">
                    <iframe
                      src={v.provider === 'vimeo'
                        ? `https://player.vimeo.com/video/${v.id}`
                        : `https://www.youtube-nocookie.com/embed/${v.id}`}
                      title={v.title}
                      className="w-full h-full"
                      loading="lazy"
                      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{v.title}</p>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Role & Approach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{caseStudy.role}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Methods Used:</h4>
                  <div className="flex flex-wrap gap-1">
                    {caseStudy.methods.map((method) => (
                      <Badge key={method} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5" />
                  Results & Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Deliverables:</h4>
                    <p className="text-sm text-muted-foreground">{caseStudy.results}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Impact:</h4>
                    <p className="text-sm text-muted-foreground">{caseStudy.impact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {caseStudy.technologies && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Lightbulb className="w-5 h-5" />
                Technologies & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {caseStudy.awards && caseStudy.awards.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Award className="w-5 h-5" />
                Awards & Recognition
              </h3>
              <div className="space-y-2">
                {caseStudy.awards.map((award) => (
                  <div key={award} className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <span className="text-xl">🏆</span>
                    <span className="font-medium">{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {caseStudy.links && caseStudy.links.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">External Links</h3>
              <div className="space-y-2">
                {caseStudy.links.map((link) => (
                  <Button key={link.url} variant="outline" size="sm" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {link.title}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {relatedCases.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Related Projects</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {relatedCases.map((relatedCase) => (
                  <Card key={relatedCase.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-1">{relatedCase.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{relatedCase.subtitle}</p>
                      <Badge variant="outline">
                        {categories[relatedCase.category].name}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseStudyDetail;
