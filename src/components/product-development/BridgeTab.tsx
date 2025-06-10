
import React from 'react';
import { bridgeElements } from './ProductDevelopmentData';

const BridgeTab: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-center">Bridge Elements</h3>
      
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

      <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
        <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
          Concept to Product
        </h4>
        <p className="text-xs text-amber-700 dark:text-amber-300">
          This framework ensures that innovative concepts successfully transition 
          into working products without losing their essential user value 
          and problem-solving power during development.
        </p>
      </div>
    </div>
  );
};

export default BridgeTab;
