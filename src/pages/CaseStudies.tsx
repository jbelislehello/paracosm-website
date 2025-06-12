
import React from 'react';
import CaseStudiesSection from '@/components/case-studies/CaseStudiesSection';

const CaseStudies: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <CaseStudiesSection />
      </div>
    </div>
  );
};

export default CaseStudies;
