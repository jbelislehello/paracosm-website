
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { energeticAxes, gardens } from '@/data/gardens';
import { EmotionalState } from '@/types/journal';
import { useLanguage } from '@/contexts/LanguageContext';
import { Brain, Cog, Seedling, Heart, Users, Lightbulb, Shield, Zap, Target } from 'lucide-react';

interface AssessmentStep {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
}

interface ClientNeedsAssessmentProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
  onRecommendationsReady: (recommendations: any) => void;
}

const ClientNeedsAssessment: React.FC<ClientNeedsAssessmentProps> = ({
  emotionalState,
  onStateChange,
  onRecommendationsReady
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({
    primaryGarden: '',
    urgencyLevel: 5,
    availableTime: '',
    learningStyle: '',
    organizationalLevel: '',
    connectorMagnesorBalance: 50,
    transformationReadiness: 5,
    challengeType: '',
    resourceConstraints: []
  });

  const steps: AssessmentStep[] = [
    {
      id: 'emotional-state',
      title: 'État Émotionnel Actuel',
      subtitle: 'Évaluez votre position sur les 5 axes spirituels',
      completed: currentStep > 0
    },
    {
      id: 'garden-selection',
      title: 'Navigation des Jardins',
      subtitle: 'Identifiez votre jardin de transformation prioritaire',
      completed: currentStep > 1
    },
    {
      id: 'relational-dynamics',
      title: 'Dynamiques Relationnelles',
      subtitle: 'Explorez vos patterns Connessor/Magnesor',
      completed: currentStep > 2
    },
    {
      id: 'transformation-context',
      title: 'Contexte de Transformation',
      subtitle: 'Précisez vos objectifs et contraintes',
      completed: currentStep > 3
    },
    {
      id: 'recommendations',
      title: 'Recommandations Personnalisées',
      subtitle: 'Découvrez votre parcours Calm Magic optimal',
      completed: currentStep > 4
    }
  ];

  const handleAxisChange = (axis: string, value: number[]) => {
    onStateChange({
      ...emotionalState,
      [`${axis}_level`]: value[0]
    });
  };

  const handleAssessmentChange = (key: string, value: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateRecommendations = () => {
    const loveLevel = emotionalState.love_level || 50;
    const magicLevel = emotionalState.magic_level || 50;
    const calmLevel = emotionalState.calm_level || 50;
    const openLevel = emotionalState.open_level || 50;
    const freeLevel = emotionalState.free_level || 50;

    const vitalityScore = (loveLevel + magicLevel) / 2;
    const stabilityScore = (calmLevel + openLevel) / 2;
    const integrationLevel = freeLevel;

    // Algorithm based on Calm Magic methodology
    const recommendations = {
      profile: {
        dominantAxis: getDominantAxis(),
        primaryGarden: assessmentData.primaryGarden,
        connectorMagnesorType: assessmentData.connectorMagnesorBalance > 50 ? 'Magnesor' : 'Connessor',
        vitalityScore,
        stabilityScore,
        integrationLevel
      },
      suggestedTools: getSuggestedTools(),
      transformationPath: getTransformationPath(),
      priority: assessmentData.urgencyLevel,
      timeframe: getTimeframe()
    };

    onRecommendationsReady(recommendations);
    setCurrentStep(4);
  };

  const getDominantAxis = () => {
    const axes = [
      { key: 'love', value: emotionalState.love_level || 50 },
      { key: 'magic', value: emotionalState.magic_level || 50 },
      { key: 'calm', value: emotionalState.calm_level || 50 },
      { key: 'open', value: emotionalState.open_level || 50 },
      { key: 'free', value: emotionalState.free_level || 50 }
    ];
    return axes.reduce((max, axis) => axis.value > max.value ? axis : max).key;
  };

  const getSuggestedTools = () => {
    const tools = [];
    const dominantAxis = getDominantAxis();
    
    // Logic based on dominant axis and garden selection
    if (dominantAxis === 'love' || dominantAxis === 'magic') {
      tools.push('CalmMagicCompass', 'EmotionalStagesFramework');
    }
    if (assessmentData.primaryGarden === 'prototypes') {
      tools.push('RitualizedJourneyMap', 'PulseToPatternVisualizer');
    }
    if (assessmentData.primaryGarden === 'systems') {
      tools.push('LearningOrganizationDashboard', 'CulturalUnitTests');
    }
    if (assessmentData.connectorMagnesorBalance < 30 || assessmentData.connectorMagnesorBalance > 70) {
      tools.push('EmotiveCompassWidget');
    }
    
    return tools;
  };

  const getTransformationPath = () => {
    const paths = {
      sovereignty: 'Parcours Souveraineté - Focus sur l\'autonomie créative',
      memory: 'Parcours Mémoire - Intégration des liens historiques',
      intimacy: 'Parcours Intimité - Approfondissement relationnel',
      novelty: 'Parcours Nouveauté - Innovation et découverte'
    };

    if (assessmentData.connectorMagnesorBalance > 60) return paths.novelty;
    if (assessmentData.connectorMagnesorBalance < 40) return paths.memory;
    return paths.sovereignty;
  };

  const getTimeframe = () => {
    const timeframes = {
      immediate: '1-2 semaines - Actions immédiates',
      short: '1-3 mois - Transformation ciblée',
      medium: '3-6 mois - Évolution profonde',
      long: '6-12 mois - Transformation complète'
    };
    
    if (assessmentData.urgencyLevel > 8) return timeframes.immediate;
    if (assessmentData.urgencyLevel > 6) return timeframes.short;
    if (assessmentData.urgencyLevel > 4) return timeframes.medium;
    return timeframes.long;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Évaluation des 5 Axes Spirituels Calm Magic
              </CardTitle>
              <p className="text-sm text-slate-600">
                Positionnez-vous sur chaque axe pour créer votre profil énergétique personnel
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {energeticAxes.map((axis) => {
                const currentValue = emotionalState[`${axis.key}_level` as keyof EmotionalState] as number || 50;
                
                return (
                  <div key={axis.key} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-lg" style={{ color: axis.color }}>
                          {axis.name} - {axis.subtitle}
                        </h4>
                        <p className="text-sm text-slate-600">{axis.description}</p>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: axis.color }}>
                        {currentValue}
                      </div>
                    </div>
                    
                    <Slider
                      value={[currentValue]}
                      onValueChange={(value) => handleAxisChange(axis.key, value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Faible</span>
                      <span>Élevé</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );

      case 1:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Seedling className="w-5 h-5 text-green-500" />
                Sélection du Jardin Prioritaire
              </CardTitle>
              <p className="text-sm text-slate-600">
                Dans quel jardin votre défi principal se situe-t-il ?
              </p>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={assessmentData.primaryGarden}
                onValueChange={(value) => handleAssessmentChange('primaryGarden', value)}
                className="space-y-4"
              >
                {gardens.map((garden) => (
                  <div key={garden.type} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-slate-50">
                    <RadioGroupItem value={garden.type} id={garden.type} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={garden.type} className="flex items-center gap-2 text-base font-medium cursor-pointer">
                        <span className="text-2xl">{garden.icon}</span>
                        {garden.name}
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">{garden.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Dynamiques Relationnelles
              </CardTitle>
              <p className="text-sm text-slate-600">
                Explorez votre équilibre Connessor/Magnesor
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium">Connessor (Connexion/Mémoire)</span>
                  <span className="text-sm font-medium">Magnesor (Innovation/Souveraineté)</span>
                </div>
                <Slider
                  value={[assessmentData.connectorMagnesorBalance]}
                  onValueChange={(value) => handleAssessmentChange('connectorMagnesorBalance', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-center mt-2">
                  <span className="text-lg font-bold">
                    {assessmentData.connectorMagnesorBalance > 50 ? 'Magnesor' : 'Connessor'} ({assessmentData.connectorMagnesorBalance})
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Niveau de préparation à la transformation</h4>
                <Slider
                  value={[assessmentData.transformationReadiness]}
                  onValueChange={(value) => handleAssessmentChange('transformationReadiness', value[0])}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Pas prêt</span>
                  <span>Totalement prêt</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Contexte de Transformation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Niveau d'urgence de votre défi</Label>
                <Slider
                  value={[assessmentData.urgencyLevel]}
                  onValueChange={(value) => handleAssessmentChange('urgencyLevel', value[0])}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Faible urgence</span>
                  <span>Urgence critique</span>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Temps disponible pour la transformation</Label>
                <RadioGroup
                  value={assessmentData.availableTime}
                  onValueChange={(value) => handleAssessmentChange('availableTime', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="minimal" />
                    <Label htmlFor="minimal">1-2h par semaine (accompagnement minimal)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">3-5h par semaine (engagement modéré)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intensive" id="intensive" />
                    <Label htmlFor="intensive">6h+ par semaine (transformation intensive)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Style d'apprentissage préféré</Label>
                <RadioGroup
                  value={assessmentData.learningStyle}
                  onValueChange={(value) => handleAssessmentChange('learningStyle', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visual" id="visual" />
                    <Label htmlFor="visual">Visuel - Schémas, cartes, visualisations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                    <Label htmlFor="kinesthetic">Kinesthésique - Pratique, expérimentation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analytical" id="analytical" />
                    <Label htmlFor="analytical">Analytique - Données, frameworks, logique</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Progression de l'évaluation</span>
          <span>{currentStep + 1}/5</span>
        </div>
        <Progress value={(currentStep / 4) * 100} className="w-full" />
      </div>

      {/* Steps Navigation */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex-1 min-w-40 p-2 text-center rounded-lg border ${
              index === currentStep
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : index < currentStep
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <div className="text-xs font-medium">{step.title}</div>
            <div className="text-xs opacity-70">{step.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Précédent
        </Button>
        
        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (currentStep === 1 && !assessmentData.primaryGarden) ||
              (currentStep === 3 && (!assessmentData.availableTime || !assessmentData.learningStyle))
            }
          >
            Suivant
          </Button>
        ) : currentStep === 3 ? (
          <Button
            onClick={generateRecommendations}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600"
          >
            Générer les Recommandations
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default ClientNeedsAssessment;
