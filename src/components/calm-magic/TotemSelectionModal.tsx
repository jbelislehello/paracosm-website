// TOTEM Selection Modal - Consent-first voice session initiation

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Sparkles } from 'lucide-react';
import type { TotemType } from '@/services/voice-computing';
import { TOTEM_CONFIGS } from '@/services/voice-computing';

interface TotemSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTotem: (totem: TotemType) => void;
}

const TOTEM_OPTIONS: Array<{
  type: TotemType;
  icon: React.ReactNode;
  label: string;
  labelFr: string;
  description: string;
  descriptionFr: string;
  features: string[];
  color: string;
}> = [
  {
    type: 'free',
    icon: <Sparkles className="w-8 h-8" />,
    label: 'Performance',
    labelFr: 'Performance',
    description: 'Full creative mode with optional memory',
    descriptionFr: 'Mode créatif complet avec mémoire optionnelle',
    features: ['Audio optional', 'Memory opt-in', 'Full sharing'],
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30'
  },
  {
    type: 'p1_dignity',
    icon: <Shield className="w-8 h-8" />,
    label: 'Dignity',
    labelFr: 'Dignité',
    description: 'Protected mode - no retention',
    descriptionFr: 'Mode protégé - pas de rétention',
    features: ['No audio retention', 'No memory', 'Sanitized exports'],
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
  },
  {
    type: 'p2_anticoercion',
    icon: <Lock className="w-8 h-8" />,
    label: 'Anti-coercion',
    labelFr: 'Anti-coercition',
    description: 'Maximum protection with correlation prevention',
    descriptionFr: 'Protection maximale avec prévention des corrélations',
    features: ['All P1 protections', 'Correlation protection', 'Full anonymity'],
    color: 'from-purple-500/20 to-violet-500/20 border-purple-500/30'
  }
];

export const TotemSelectionModal: React.FC<TotemSelectionModalProps> = ({
  open,
  onOpenChange,
  onSelectTotem
}) => {
  const handleSelect = (totem: TotemType) => {
    onSelectTotem(totem);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <span className="text-3xl">🦊</span>
          </div>
          <DialogTitle className="text-xl">
            Je suis Wuxia. Choisis ton TOTEM.
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            I am Wuxia. Choose your TOTEM to begin our journey together.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TOTEM_OPTIONS.map((totem) => (
            <Card 
              key={totem.type}
              className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg bg-gradient-to-br ${totem.color}`}
              onClick={() => handleSelect(totem.type)}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-2 text-primary">
                  {totem.icon}
                </div>
                <CardTitle className="text-lg">{totem.label}</CardTitle>
                <Badge variant="outline" className="mx-auto text-xs">
                  {totem.labelFr}
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-xs mb-3">
                  {totem.description}
                </CardDescription>
                <div className="space-y-1">
                  {totem.features.map((feature, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="text-xs block mx-auto w-fit"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>Your TOTEM determines how your voice data is handled.</p>
          <p className="mt-1">Ton TOTEM détermine comment tes données vocales sont traitées.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TotemSelectionModal;
