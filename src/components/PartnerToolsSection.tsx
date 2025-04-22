
import React from 'react';
import { usePartnerTools } from '@/context/PartnerToolsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PartnerToolsSection: React.FC = () => {
  const { tools } = usePartnerTools();
  
  const categoryColors: Record<string, string> = {
    ai: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    database: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    development: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    integration: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    collaboration: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  };

  return (
    <section className="py-16 px-4 bg-slate-100 dark:bg-slate-800/50">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Partner Tools & Services</h2>
        <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
          Explore our ecosystem of trusted partner tools and services to enhance your agent workflows.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <Badge className={categoryColors[tool.category]}>
                    {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                  </Badge>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href={tool.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-agent-purple hover:underline"
                >
                  Learn more →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerToolsSection;
