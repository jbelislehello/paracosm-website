
import React from 'react';
import { bridgeElements } from './ProductDevelopmentData';

const BridgeTab: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-center">Healing Bridge Elements</h3>
      
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

      <div className="bg-pink-50 dark:bg-pink-950/30 p-3 rounded-lg">
        <h4 className="font-medium text-pink-800 dark:text-pink-200 text-sm">
          Awareness to Transformation
        </h4>
        <p className="text-xs text-pink-700 dark:text-pink-300">
          This framework ensures that healing awareness successfully transitions 
          into transformed relationships without losing emotional depth 
          and authentic connection during the healing process.
        </p>
      </div>
    </div>
  );
};

export default BridgeTab;
