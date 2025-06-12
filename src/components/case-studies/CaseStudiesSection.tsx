
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { caseStudies, categories, CaseStudy } from '@/data/caseStudies';
import CaseStudyCard from './CaseStudyCard';
import CaseStudyDetail from './CaseStudyDetail';
import { Grid, List, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const CaseStudiesSection: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCaseStudies = useMemo(() => {
    let filtered = caseStudies;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cs => cs.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(cs => 
        cs.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cs.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  const handleViewDetails = (id: string) => {
    const caseStudy = caseStudies.find(cs => cs.id === id);
    if (caseStudy) {
      setSelectedCase(caseStudy);
    }
  };

  const handleBack = () => {
    setSelectedCase(null);
  };

  if (selectedCase) {
    return <CaseStudyDetail caseStudy={selectedCase} onBack={handleBack} />;
  }

  const categoryStats = Object.entries(categories).map(([key, category]) => ({
    key,
    ...category,
    count: caseStudies.filter(cs => cs.category === key).length
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Portfolio de projets
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Jonathan Bélisle (Paracosm) - Découvrez une collection de projets innovants alliant technologie, 
          poésie et design d'expérience pour créer des récits interactifs transformationnels.
        </p>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categoryStats.map((category) => (
          <Card 
            key={category.key} 
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              selectedCategory === category.key && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedCategory(category.key)}
          >
            <CardContent className="p-4 text-center">
              <div className={cn(
                "w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-white text-xl bg-gradient-to-r",
                category.color
              )}>
                {category.icon}
              </div>
              <h3 className="font-medium text-sm mb-1">{category.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {category.count} projects
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </span>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categories).map(([key, category]) => (
                  <SelectItem key={key} value={key}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedCategory !== 'all' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtered by:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories[selectedCategory as keyof typeof categories].icon}
                {categories[selectedCategory as keyof typeof categories].name}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 hover:bg-destructive hover:text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Projects ({filteredCaseStudies.length})
          </h2>
        </div>

        {filteredCaseStudies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No projects match your current filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          )}>
            {filteredCaseStudies.map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy.id}
                caseStudy={caseStudy}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseStudiesSection;
