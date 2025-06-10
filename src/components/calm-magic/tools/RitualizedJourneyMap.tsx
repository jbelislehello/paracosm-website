
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const RitualizedJourneyMap: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [reflections, setReflections] = useState<string[]>(['', '', '', '', '']);

  const journeySteps = [
    {
      title: 'Initiation',
      subtitle: 'From stuckness / entropy',
      quote: '"Every ending is a doorway to new becoming." - Rumi',
      caseSnippet: 'A tech startup CEO felt overwhelmed by rapid growth chaos. Through our initiation process, they discovered their leadership essence.',
      question: 'What patterns of stuckness are you ready to transform?',
      color: 'bg-red-500'
    },
    {
      title: 'Opening',
      subtitle: 'The creative unknown (MAGIC)',
      quote: '"In the beginner\'s mind there are many possibilities." - Shunryu Suzuki',
      caseSnippet: 'A healthcare team opened to new care models by embracing uncertainty as creative potential rather than threat.',
      question: 'What creative possibility wants to emerge through you?',
      color: 'bg-purple-500'
    },
    {
      title: 'Stabilizing',
      subtitle: 'Team nervous system coherence (CALM)',
      quote: '"Between stimulus and response there is a space. In that space is our power to choose." - Viktor Frankl',
      caseSnippet: 'A nonprofit leadership team learned to regulate collective stress, creating psychological safety for innovation.',
      question: 'How can you create more spaciousness in your team dynamics?',
      color: 'bg-blue-500'
    },
    {
      title: 'Expanding',
      subtitle: 'Safe disruption and collective design (OPEN)',
      quote: '"The way to make the world a better place is to start by making yourself a better person." - Unknown',
      caseSnippet: 'An education organization redesigned their culture by empowering every team member as a change agent.',
      question: 'What boundaries need to dissolve for your team to thrive?',
      color: 'bg-green-500'
    },
    {
      title: 'Integrating',
      subtitle: 'Purpose and structural change (FREE)',
      quote: '"Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it." - Rumi',
      caseSnippet: 'A consulting firm integrated new values into every process, creating alignment between purpose and practice.',
      question: 'How will you anchor this transformation in your daily operations?',
      color: 'bg-yellow-500'
    }
  ];

  const handleReflectionChange = (index: number, value: string) => {
    const newReflections = [...reflections];
    newReflections[index] = value;
    setReflections(newReflections);
  };

  const progress = ((currentStep + 1) / journeySteps.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ritualized Journey Map</CardTitle>
          <Progress value={progress} className="w-full" />
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {journeySteps.length}: {journeySteps[currentStep].title}
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className={`text-white p-4 rounded-t ${journeySteps[currentStep].color}`}>
            {journeySteps[currentStep].title}: {journeySteps[currentStep].subtitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
            <p className="italic text-gray-700">
              {journeySteps[currentStep].quote}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Client Story</h4>
            <p className="text-blue-700 text-sm">
              {journeySteps[currentStep].caseSnippet}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">Film Placeholder</h4>
            <div className="bg-gray-200 h-32 rounded flex items-center justify-center">
              <span className="text-gray-500">🎬 Journey Step Video</span>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h4 className="font-semibold text-green-800 mb-3">Reflection Question</h4>
            <p className="text-green-700 mb-3">{journeySteps[currentStep].question}</p>
            <Input
              placeholder="Share your reflection..."
              value={reflections[currentStep]}
              onChange={(e) => handleReflectionChange(currentStep, e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(journeySteps.length - 1, currentStep + 1))}
              disabled={currentStep === journeySteps.length - 1}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RitualizedJourneyMap;
