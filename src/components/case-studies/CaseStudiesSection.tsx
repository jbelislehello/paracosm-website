
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { caseStudies } from '@/data/caseStudies';
import { useLanguage } from '@/contexts/LanguageContext';

const CaseStudiesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t("page_titles.case_studies");
  }, [t]);

  const categories = [
    { id: 'all', label: t("case_studies.all_categories") },
    { id: 'ai_leadership', label: t("case_studies.categories.ai_leadership") },
    { id: 'relational_innovation', label: t("case_studies.categories.relational_innovation") },
    { id: 'organizational_transformation', label: t("case_studies.categories.organizational_transformation") },
    { id: 'creative_technology', label: t("case_studies.categories.creative_technology") },
    { id: 'public_art', label: t("case_studies.categories.public_art") },
    { id: 'interactive_design', label: t("case_studies.categories.interactive_design") }
  ];

  const filteredStudies = selectedCategory === 'all' 
    ? caseStudies 
    : caseStudies.filter(study => study.category === selectedCategory);

  const selectedStudyData = selectedStudy 
    ? caseStudies.find(study => study.id === selectedStudy)
    : null;

  if (selectedStudy && selectedStudyData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedStudy(null)}
            className="mb-6"
          >
            ← {t("case_studies.back_to_studies")}
          </Button>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <div className="mb-6">
              <Badge variant="outline" className="mb-4">
                {t(`case_studies.categories.${selectedStudyData.category}`)}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{selectedStudyData.title}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {selectedStudyData.description}
              </p>
            </div>

            {selectedStudyData.image && (
              <div className="mb-8">
                <img 
                  src={selectedStudyData.image} 
                  alt={selectedStudyData.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Challenge</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedStudyData.challenge}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Solution</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedStudyData.solution}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <p className="text-slate-600 dark:text-slate-300">
                {selectedStudyData.results}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedStudyData.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {t("case_studies.page_title")}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            {t("case_studies.subtitle")}
          </p>

          <div className="flex justify-center mb-8">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder={t("case_studies.filter_by_category")} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudies.map((study) => (
            <Card key={study.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">
                    {t(`case_studies.categories.${study.category}`)}
                  </Badge>
                </div>
                <CardTitle className="group-hover:text-purple-600 transition-colors">
                  {study.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                  {study.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {study.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {study.technologies.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{study.technologies.length - 3}
                    </Badge>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors"
                  onClick={() => setSelectedStudy(study.id)}
                >
                  {t("case_studies.view_details")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudiesSection;
