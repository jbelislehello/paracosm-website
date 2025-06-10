
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
          Imagineering to Engineering
        </h4>
        <p className="text-xs text-purple-700 dark:text-purple-300">
          This framework ensures that creative product ideas successfully transition 
          into technical implementation without losing user value 
          and product vision during the development process.
        </p>
      </div>
    </div>
  );
};

export default BridgeTab;
