
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Clock, Target } from 'lucide-react';
import { EmotionalState, JournalEntry } from '@/types/journal';

interface QualityMetrics {
  completeness: number;
  consistency: number;
  traceability: number;
  integration: number;
}

interface EngineeringQualityFrameworkProps {
  emotionalState?: EmotionalState | null;
  journalEntry?: JournalEntry | null;
  qualityMetrics?: QualityMetrics;
}

const EngineeringQualityFramework: React.FC<EngineeringQualityFrameworkProps> = ({
  emotionalState,
  journalEntry,
  qualityMetrics = {
    completeness: 0,
    consistency: 0,
    traceability: 0,
    integration: 0
  }
}) => {
  const calculateOverallQuality = () => {
    const metrics = Object.values(qualityMetrics);
    return Math.round(metrics.reduce((sum, val) => sum + val, 0) / metrics.length);
  };

  const getQualityStatus = (score: number) => {
    if (score >= 80) return { color: 'green', icon: CheckCircle, label: 'Excellent' };
    if (score >= 60) return { color: 'yellow', icon: Clock, label: 'Good' };
    if (score >= 40) return { color: 'orange', icon: AlertCircle, label: 'Needs Improvement' };
    return { color: 'red', icon: AlertCircle, label: 'Critical' };
  };

  const validateEmotionalStateCompleteness = () => {
    if (!emotionalState) return 0;
    
    const requiredFields = ['love_level', 'magic_level', 'calm_level', 'open_level', 'free_level'];
    const completedFields = requiredFields.filter(field => 
      emotionalState[field as keyof EmotionalState] !== undefined && 
      emotionalState[field as keyof EmotionalState] !== null
    );
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const validateJournalEntryQuality = () => {
    if (!journalEntry) return 0;
    
    let score = 0;
    if (journalEntry.title && journalEntry.title.length >= 5) score += 20;
    if (journalEntry.content && journalEntry.content.length >= 50) score += 30;
    if (journalEntry.situation_context && journalEntry.situation_context.length >= 20) score += 20;
    if (journalEntry.rising_question && journalEntry.rising_question.length >= 10) score += 15;
    if (journalEntry.insights && journalEntry.insights.length >= 20) score += 15;
    
    return score;
  };

  const overallQuality = calculateOverallQuality();
  const qualityStatus = getQualityStatus(overallQuality);
  const StatusIcon = qualityStatus.icon;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Engineering Quality Framework
          </CardTitle>
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 text-${qualityStatus.color}-500`} />
            <Badge variant={qualityStatus.color === 'green' ? 'default' : 'destructive'}>
              {qualityStatus.label} ({overallQuality}%)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Process Validation */}
          <div>
            <h3 className="font-semibold mb-3">Process Validation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Emotional State Completeness</span>
                  <span>{validateEmotionalStateCompleteness()}%</span>
                </div>
                <Progress value={validateEmotionalStateCompleteness()} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Journal Entry Quality</span>
                  <span>{validateJournalEntryQuality()}%</span>
                </div>
                <Progress value={validateJournalEntryQuality()} className="h-2" />
              </div>
            </div>
          </div>

          {/* Quality Metrics */}
          <div>
            <h3 className="font-semibold mb-3">Quality Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completeness</span>
                  <span>{qualityMetrics.completeness}%</span>
                </div>
                <Progress value={qualityMetrics.completeness} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Consistency</span>
                  <span>{qualityMetrics.consistency}%</span>
                </div>
                <Progress value={qualityMetrics.consistency} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Traceability</span>
                  <span>{qualityMetrics.traceability}%</span>
                </div>
                <Progress value={qualityMetrics.traceability} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Integration</span>
                  <span>{qualityMetrics.integration}%</span>
                </div>
                <Progress value={qualityMetrics.integration} className="h-2" />
              </div>
            </div>
          </div>

          {/* Engineering Standards Checklist */}
          <div>
            <h3 className="font-semibold mb-3">Engineering Standards Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Garden context established</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">5-axis emotional mapping complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Shadow/Higher self integration</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Version control enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Traceability matrix active</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Team collaboration pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transformation Readiness */}
          <div>
            <h3 className="font-semibold mb-3">Transformation Readiness Score</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={overallQuality} className="h-4" />
              </div>
              <Badge variant={overallQuality >= 70 ? 'default' : 'outline'}>
                {overallQuality >= 70 ? 'Ready for Integration' : 'Needs Refinement'}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {overallQuality >= 70 
                ? 'Process meets engineering standards for organizational transformation.'
                : 'Additional work needed to meet quality thresholds for effective transformation.'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EngineeringQualityFramework;
