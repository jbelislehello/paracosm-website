
import React from 'react';
import { bridgeElements } from './ProductDevelopmentData';

const BridgeTab: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-center">Product Bridge Elements</h3>
      
      {bridgeElements.map((element, index) => (
        <div key={index} className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
            {element.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {element.description}
          </p>
        </div>
      ))}

      <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm">
          Bridging Ideas to Implementation
        </h4>
        <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
          Most projects fail because there's a gap between "good idea" and "working product." 
          This process creates a bridge that prevents the common problem where engineering teams 
          receive vague requirements and build something technically correct but practically useless.
        </p>
        <p className="text-xs text-purple-800 dark:text-purple-200 font-medium">
          Bottom line: A structured way to go from "we should build something" to 
          "here's exactly what to build and why it matters."
        </p>
      </div>
    </div>
  );
};

export default BridgeTab;
