
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModeType } from '../context/ModeContext';
import TorusEnergyField from './TorusEnergyField';
import ExperienceDotsVisualization from './ExperienceDotsVisualization';

interface EnhancedTorusEnergyFieldProps {
  mode: ModeType;
}

const EnhancedTorusEnergyField: React.FC<EnhancedTorusEnergyFieldProps> = ({ mode }) => {
  return (
    <Tabs defaultValue="energy-field" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="energy-field">🌀 Energy Field</TabsTrigger>
        <TabsTrigger value="experience-paths">✨ Experience Paths</TabsTrigger>
      </TabsList>

      <TabsContent value="energy-field" className="space-y-4">
        <TorusEnergyField mode={mode} />
      </TabsContent>

      <TabsContent value="experience-paths" className="space-y-4">
        <ExperienceDotsVisualization mode={mode} />
      </TabsContent>
    </Tabs>
  );
};

export default EnhancedTorusEnergyField;
