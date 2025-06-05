
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gardens } from '@/data/gardens';
import { GardenType } from '@/types/journal';

interface GardenSelectorProps {
  selectedGarden: GardenType | null;
  onSelectGarden: (garden: GardenType) => void;
}

const GardenSelector: React.FC<GardenSelectorProps> = ({ selectedGarden, onSelectGarden }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">🌱 The Gardens of Exploration</h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          At Paracosm, every project begins with three fertile gardens. 
          Choose your garden to begin your exploration and reflection.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {gardens.map((garden) => (
          <Card 
            key={garden.type}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedGarden === garden.type 
                ? 'ring-2 ring-offset-2' 
                : 'hover:scale-105'
            }`}
            style={{
              '--ring-color': selectedGarden === garden.type ? garden.color : undefined,
              borderColor: selectedGarden === garden.type ? garden.color : undefined
            } as React.CSSProperties}
            onClick={() => onSelectGarden(garden.type)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div 
                  className="text-4xl p-3 rounded-full"
                  style={{ backgroundColor: `${garden.color}20` }}
                >
                  {garden.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{garden.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {garden.description}
              </CardDescription>
              {selectedGarden === garden.type && (
                <Button 
                  className="mt-4 w-full"
                  style={{ backgroundColor: garden.color }}
                >
                  Enter Garden
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GardenSelector;
