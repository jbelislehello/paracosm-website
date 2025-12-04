import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CalmMagic25DVisualization from '@/components/calm-magic/CalmMagic25DVisualization';

const CalmMagicVisualization: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Calm Magic Process
            </h1>
            <p className="text-muted-foreground">
              Exploration visuelle 2.5D du processus de transformation
            </p>
          </div>
        </div>

        <CalmMagic25DVisualization />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <h3 className="font-semibold text-foreground mb-2">À propos de cette visualisation</h3>
            <p className="text-sm text-muted-foreground">
              Cette représentation 2.5D utilise p5.js en mode WEBGL pour créer une vue isométrique 
              du processus Calm Magic. Les cinq phases (LOVE → MAGIC → CALM → OPEN → FREE) sont 
              représentées comme des plateformes hexagonales connectées par des spirales énergétiques.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <h3 className="font-semibold text-foreground mb-2">Interactions</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• La rotation automatique révèle chaque phase en séquence</li>
              <li>• Les particules d'énergie illustrent le flux entre les phases</li>
              <li>• Les spirales connectent les étapes de transformation</li>
              <li>• Chaque orbe pulse selon son propre rythme</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalmMagicVisualization;
