
import React from 'react';
import { productDevelopmentSteps } from './ProductDevelopmentData';

const ProcessTab: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-center">7-Step Relational Healing Process</h3>
      
      <div className="space-y-3">
        <div className="bg-pink-50 dark:bg-pink-950/30 p-3 rounded-lg">
          <h4 className="font-medium text-pink-800 dark:text-pink-200 text-sm mb-2">
            Phase 1: Building Awareness (Steps 1-3)
          </h4>
          {productDevelopmentSteps.slice(0, 3).map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex items-center gap-2 text-xs text-pink-700 dark:text-pink-300 mb-1">
                <IconComponent className="w-4 h-4" />
                <span>{index + 1}. {step.name}</span>
              </div>
            );
          })}
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
          <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-2">
            Phase 2: Creating Transformation (Steps 4-7)
          </h4>
          {productDevelopmentSteps.slice(3, 7).map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300 mb-1">
                <IconComponent className="w-4 h-4" />
                <span>{index + 4}. {step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm">Outcome</h4>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Emotionally-aligned, healed relationships with community support 
          who understand not just what to heal, but why it matters deeply.
        </p>
      </div>
    </div>
  );
};

export default ProcessTab;
