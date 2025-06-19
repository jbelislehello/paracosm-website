
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
    { id: 'interactive-storytelling', label: t("case_studies.categories.interactive_storytelling") },
    { id: 'spatial-installations', label: t("case_studies.categories.spatial_installations") },
    { id: 'educational-tech', label: t("case_studies.categories.educational_tech") },
    { id: 'public-art', label: t("case_studies.categories.public_art") },
    { id: 'speaking', label: t("case_studies.categories.speaking") },
    { id: 'methodology', label: t("case_studies.categories.methodology") }
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
                {t(`case_studies.categories.${selectedStudyData.category.replace('-', '_')}`)}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{selectedStudyData.title}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {selectedStudyData.description}
              </p>
            </div>

            {selectedStudyData.image && (
              <div className="mb-8">
                <img 
                  src={`https://images.unsplash.com/${selectedStudyData.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={selectedStudyData.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">{t("case_studies.role")}</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedStudyData.role}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">{t("case_studies.methods")}</h2>
                <ul className="text-slate-600 dark:text-slate-300 list-disc list-inside">
                  {selectedStudyData.methods.map((method, index) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t("case_studies.results")}</h2>
              <p className="text-slate-600 dark:text-slate-300">
                {selectedStudyData.results}
              </p>
            </div>

            {selectedStudyData.impact && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t("case_studies.impact")}</h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {selectedStudyData.impact}
                </p>
              </div>
            )}

            {selectedStudyData.awards && selectedStudyData.awards.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t("case_studies.awards")}</h2>
                <ul className="text-slate-600 dark:text-slate-300 list-disc list-inside">
                  {selectedStudyData.awards.map((award, index) => (
                    <li key={index}>{award}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedStudyData.technologies && selectedStudyData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <h2 className="text-xl font-semibold mb-4 w-full">{t("case_studies.technologies")}</h2>
                {selectedStudyData.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
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
                    {t(`case_studies.categories.${study.category.replace('-', '_')}`)}
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
                {study.technologies && study.technologies.length > 0 && (
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
                )}
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
