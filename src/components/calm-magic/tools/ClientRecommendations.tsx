
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  Clock, 
  Zap, 
  Users, 
  Brain, 
  Cog, 
  Seedling, 
  Heart,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

interface Recommendation {
  profile: {
    dominantAxis: string;
    primaryGarden: string;
    connectorMagnesorType: string;
    vitalityScore: number;
    stabilityScore: number;
    integrationLevel: number;
  };
  suggestedTools: string[];
  transformationPath: string;
  priority: number;
  timeframe: string;
}

interface ClientRecommendationsProps {
  recommendations: Recommendation;
  onStartJourney: (toolName: string) => void;
}

const ClientRecommendations: React.FC<ClientRecommendationsProps> = ({
  recommendations,
  onStartJourney
}) => {
  const getAxisColor = (axis: string) => {
    const colors: { [key: string]: string } = {
      love: '#ef4444',
      magic: '#8b5cf6',
      calm: '#06b6d4',
      open: '#10b981',
      free: '#f59e0b'
    };
    return colors[axis] || '#64748b';
  };

  const getAxisIcon = (axis: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      love: <Heart className="w-4 h-4" />,
      magic: <Zap className="w-4 h-4" />,
      calm: <Brain className="w-4 h-4" />,
      open: <TrendingUp className="w-4 h-4" />,
      free: <Target className="w-4 h-4" />
    };
    return icons[axis] || <Target className="w-4 h-4" />;
  };

  const getGardenIcon = (garden: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      intelligence: <Brain className="w-5 h-5" />,
      systems: <Cog className="w-5 h-5" />,
      prototypes: <Seedling className="w-5 h-5" />
    };
    return icons[garden] || <Target className="w-5 h-5" />;
  };

  const getToolDisplayName = (toolName: string) => {
    const names: { [key: string]: string } = {
      'CalmMagicCompass': 'Boussole Calm Magic',
      'EmotionalStagesFramework': 'Cadre des Étapes Émotionnelles',
      'RitualizedJourneyMap': 'Carte de Voyage Ritualisé',
      'PulseToPatternVisualizer': 'Visualiseur Pouls-Pattern',
      'LearningOrganizationDashboard': 'Tableau de Bord Organisation Apprenante',
      'CulturalUnitTests': 'Tests Unitaires Culturels',
      'EmotiveCompassWidget': 'Widget Boussole Émotive'
    };
    return names[toolName] || toolName;
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-500';
    if (priority >= 6) return 'bg-orange-500';
    if (priority >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Profile Summary */}
      <Card className="border-gradient-to-r from-purple-200 to-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: getAxisColor(recommendations.profile.dominantAxis) }}
            >
              {getAxisIcon(recommendations.profile.dominantAxis)}
            </div>
            Votre Profil Calm Magic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-slate-600">AXE DOMINANT</h4>
              <Badge 
                style={{ 
                  backgroundColor: getAxisColor(recommendations.profile.dominantAxis),
                  color: 'white'
                }}
                className="text-sm"
              >
                {recommendations.profile.dominantAxis.toUpperCase()}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-slate-600">JARDIN PRIORITAIRE</h4>
              <div className="flex items-center gap-2">
                {getGardenIcon(recommendations.profile.primaryGarden)}
                <span className="text-sm font-medium capitalize">
                  {recommendations.profile.primaryGarden}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-slate-600">TYPE RELATIONNEL</h4>
              <Badge variant="outline" className="text-sm">
                {recommendations.profile.connectorMagnesorType}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {Math.round(recommendations.profile.vitalityScore)}
              </div>
              <div className="text-xs text-slate-600">Score Vitalité</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {Math.round(recommendations.profile.stabilityScore)}
              </div>
              <div className="text-xs text-slate-600">Score Stabilité</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">
                {Math.round(recommendations.profile.integrationLevel)}
              </div>
              <div className="text-xs text-slate-600">Niveau Intégration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transformation Path */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Parcours de Transformation Recommandé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{recommendations.transformationPath}</h3>
              <p className="text-sm text-slate-600 mt-1">
                Basé sur votre profil {recommendations.profile.connectorMagnesorType} et votre axe dominant {recommendations.profile.dominantAxis.toUpperCase()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full ${getPriorityColor(recommendations.priority)}`}
              />
              <span className="text-sm font-medium">Priorité {recommendations.priority}/10</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="font-medium">Timeframe suggéré:</span>
              <span>{recommendations.timeframe}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            Outils Calm Magic Recommandés
          </CardTitle>
          <p className="text-sm text-slate-600">
            Outils sélectionnés spécifiquement pour votre profil et vos objectifs
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.suggestedTools.map((tool, index) => (
              <div 
                key={tool}
                className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">{getToolDisplayName(tool)}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Priorité {index + 1}
                      </Badge>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onStartJourney(tool)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600"
                  >
                    Démarrer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Target className="w-5 h-5" />
            Prochaines Étapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <strong>Commencez par l'outil prioritaire:</strong> {getToolDisplayName(recommendations.suggestedTools[0])}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <strong>Explorez votre jardin prioritaire:</strong> Concentrez-vous sur le jardin {recommendations.profile.primaryGarden}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <strong>Suivez votre parcours:</strong> {recommendations.transformationPath}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
              <div>
                <strong>Réévaluez régulièrement:</strong> Refaites cette évaluation dans {recommendations.timeframe.split(' ')[0]} pour ajuster votre parcours
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRecommendations;
