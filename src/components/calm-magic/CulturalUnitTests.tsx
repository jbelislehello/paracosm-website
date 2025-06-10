
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, Play, RefreshCw, TestTube, Code, Users } from 'lucide-react';

interface CulturalTest {
  id: string;
  name: string;
  description: string;
  category: 'dissolve' | 'integrate' | 'reinvent';
  status: 'pending' | 'running' | 'passed' | 'failed';
  culturalReadiness: number;
  methodCall: string;
  parameters: Record<string, any>;
  returnValue?: any;
  executionTime?: number;
}

const CulturalUnitTests: React.FC = () => {
  const [tests, setTests] = useState<CulturalTest[]>([]);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [autoRun, setAutoRun] = useState(false);

  useEffect(() => {
    // Initialize cultural unit tests
    const initialTests: CulturalTest[] = [
      // Dissolve Tests
      {
        id: 'dissolve_1',
        name: 'Hierarchy Dissolution Test',
        description: 'Tests organizational capacity to dissolve rigid hierarchical structures',
        category: 'dissolve',
        status: 'pending',
        culturalReadiness: Math.floor(Math.random() * 100),
        methodCall: 'culture.dissolve_hierarchy()',
        parameters: { 
          structure_type: 'command_control',
          dissolution_rate: 'gradual',
          safety_measures: true 
        }
      },
      {
        id: 'dissolve_2',
        name: 'Legacy Pattern Breakdown',
        description: 'Validates ability to identify and dissolve outdated organizational patterns',
        category: 'dissolve',
        status: 'pending',
        culturalReadiness: Math.floor(Math.random() * 100),
        methodCall: 'pattern_analyzer.identify_legacy_constraints()',
        parameters: { 
          pattern_age: '>5_years',
          adaptation_resistance: 'high',
          stakeholder_attachment: 'moderate'
        }
      },
      // Integrate Tests
      {
        id: 'integrate_1',
        name: 'Intelligence Integration Test',
        description: 'Tests capacity to integrate AI and collective intelligence systems',
        category: 'integrate',
        status: 'pending',
        culturalReadiness: Math.floor(Math.random() * 100),
        methodCall: 'intelligence_system.integrate_new_forms()',
        parameters: { 
          ai_readiness: 'moderate',
          collective_capacity: 'developing',
          integration_speed: 'adaptive'
        }
      },
      {
        id: 'integrate_2',
        name: 'Cross-Boundary Collaboration',
        description: 'Validates ability to integrate across organizational boundaries',
        category: 'integrate',
        status: 'pending',
        culturalReadiness: Math.floor(Math.random() * 100),
        methodCall: 'boundary_system.enable_cross_pollination()',
        parameters: { 
          boundary_permeability: 'selective',
          trust_mechanisms: 'peer_validation',
          knowledge_sharing: 'open'
        }
      },
      // Reinvent Tests
      {
        id: 'reinvent_1',
        name: 'Cultural Regeneration Test',
        description: 'Tests capacity to reinvent organizational culture for emergence',
        category: 'reinvent',
        status: 'pending',
        culturalReadiness: Math.floor(Math.random() * 100),
        methodCall: 'culture.regenerate_for_emergence()',
        parameters: { 
          emergence_readiness: 'high',
          adaptation_mechanisms: 'built_in',
          learning_orientation: 'continuous'
        }
      },
      {
        id: 'reinvent_2',
        name: 'Innovation Ecosystem Design',
        description: 'Validates ability to reinvent as a learning ecosystem',
        category: 'reinvent',
        status: 'pending',
        culturalReadiness: Math.floor(Math.random() * 100),
        methodCall: 'ecosystem.design_for_continuous_innovation()',
        parameters: { 
          innovation_frequency: 'high',
          failure_tolerance: 'learning_oriented',
          experimentation_budget: '15%'
        }
      }
    ];

    setTests(initialTests);
  }, []);

  const runTest = async (testId: string) => {
    if (runningTests.has(testId)) return;

    setRunningTests(prev => new Set([...prev, testId]));
    
    // Update test status to running
    setTests(prev => prev.map(test => 
      test.id === testId 
        ? { ...test, status: 'running' as const }
        : test
    ));

    // Simulate test execution (2-4 seconds)
    const executionTime = 2000 + Math.random() * 2000;
    
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      const returnValue = success 
        ? { status: 'transformation_ready', confidence: Math.floor(Math.random() * 40) + 60 }
        : { status: 'resistance_detected', blockers: ['legacy_attachment', 'fear_of_change'] };

      setTests(prev => prev.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              status: success ? 'passed' : 'failed',
              returnValue,
              executionTime: Math.round(executionTime)
            }
          : test
      ));

      setRunningTests(prev => {
        const updated = new Set(prev);
        updated.delete(testId);
        return updated;
      });
    }, executionTime);
  };

  const runAllTests = () => {
    tests.forEach(test => {
      if (test.status === 'pending' || test.status === 'failed') {
        setTimeout(() => runTest(test.id), Math.random() * 1000);
      }
    });
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({
      ...test,
      status: 'pending' as const,
      returnValue: undefined,
      executionTime: undefined
    })));
    setRunningTests(new Set());
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'dissolve':
        return { icon: RefreshCw, color: '#ef4444', label: 'DISSOLVE' };
      case 'integrate':
        return { icon: Users, color: '#8b5cf6', label: 'INTEGRATE' };
      case 'reinvent':
        return { icon: TestTube, color: '#10b981', label: 'REINVENT' };
      default:
        return { icon: Code, color: '#64748b', label: 'UNKNOWN' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Play className="w-4 h-4 text-slate-400" />;
    }
  };

  const passedTests = tests.filter(t => t.status === 'passed').length;
  const totalTests = tests.length;
  const organizationalReadiness = Math.round((passedTests / totalTests) * 100);

  return (
    <div className="space-y-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5 text-purple-600" />
          Cultural Unit Tests
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Method calls as cultural transformation readiness tests
        </p>
      </CardHeader>

      {/* Test Suite Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-semibold">
                Organizational Learning Readiness: {organizationalReadiness}%
              </div>
              <div className="text-sm text-slate-600">
                {passedTests}/{totalTests} tests passing
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={runAllTests} size="sm" variant="outline">
                <Play className="w-3 h-3 mr-1" />
                Run All
              </Button>
              <Button onClick={resetTests} size="sm" variant="outline">
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-green-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${organizationalReadiness}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Individual Tests */}
      <div className="space-y-3">
        {tests.map(test => {
          const categoryInfo = getCategoryInfo(test.category);
          const CategoryIcon = categoryInfo.icon;

          return (
            <Card key={test.id} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(test.status)}
                      <CategoryIcon 
                        className="w-4 h-4" 
                        style={{ color: categoryInfo.color }} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{test.name}</h4>
                        <Badge 
                          variant="outline" 
                          style={{ 
                            color: categoryInfo.color,
                            borderColor: categoryInfo.color + '40'
                          }}
                        >
                          {categoryInfo.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                        {test.description}
                      </p>
                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {test.methodCall}
                      </code>
                    </div>
                  </div>
                  <Button 
                    onClick={() => runTest(test.id)}
                    disabled={test.status === 'running'}
                    size="sm"
                    variant="ghost"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </div>

                {/* Test Results */}
                {test.returnValue && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded text-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Return Value:</span>
                      {test.executionTime && (
                        <span className="text-slate-500">{test.executionTime}ms</span>
                      )}
                    </div>
                    <code className="text-xs">
                      {JSON.stringify(test.returnValue, null, 2)}
                    </code>
                  </div>
                )}

                {/* Cultural Readiness Indicator */}
                <div className="absolute top-2 right-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: test.culturalReadiness > 70 
                        ? '#10b981' 
                        : test.culturalReadiness > 40 
                          ? '#f59e0b' 
                          : '#ef4444'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CulturalUnitTests;
