
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';

const TransformationJourney = () => {
  const journeySteps = [
    {
      phase: "Discovery",
      title: "Assess Current Leadership Alignment",
      description: "Understand where gaps exist between executive vision, technical capability, and employee engagement.",
      outcomes: [
        "Identify leadership alignment gaps",
        "Assess innovation readiness",
        "Understand systemic barriers"
      ]
    },
    {
      phase: "Development",
      title: "Build Individual Leadership Capacities",
      description: "Develop the specific capabilities needed for each leadership role through targeted coaching.",
      outcomes: [
        "Executive courage and emotional intelligence",
        "Technical co-creation skills",
        "Learning-oriented culture building"
      ]
    },
    {
      phase: "Integration",
      title: "Create Systemic Coherence",
      description: "Align all three leadership roles to create conditions where innovation emerges naturally.",
      outcomes: [
        "Coherent leadership alignment",
        "Emergent innovation processes",
        "Sustainable transformation culture"
      ]
    },
    {
      phase: "Evolution",
      title: "Continuous Learning & Adaptation",
      description: "Maintain and evolve your innovation capabilities as your organization and market context changes.",
      outcomes: [
        "Adaptive leadership practices",
        "Continuous innovation flow",
        "Resilient organizational culture"
      ]
    }
  ];

  return (
    <section id="transformation" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Transformation Journey
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg">
            A structured approach to developing the leadership alignment that makes innovation inevitable.
            This isn't about setting goals—it's about creating the conditions for breakthrough thinking.
          </p>
        </div>

        <div className="relative">
          {/* Journey Timeline */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>

          {/* Journey Steps */}
          <div className="space-y-12">
            {journeySteps.map((step, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Step Number Circle */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full items-center justify-center text-white font-bold text-lg shadow-lg">
                  {index + 1}
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                          {step.phase}
                        </span>
                        <div className="md:hidden w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold">
                        {step.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600 dark:text-slate-300">
                        {step.description}
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Key Outcomes:</h4>
                        <ul className="space-y-1">
                          {step.outcomes.map((outcome, outcomeIndex) => (
                            <li key={outcomeIndex} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Arrow for mobile */}
                <div className="md:hidden flex justify-center my-4">
                  <ArrowRight className="w-6 h-6 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Metrics */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h3 className="text-2xl font-bold text-center mb-6">What Success Looks Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h4 className="font-semibold mb-2">Executive Transformation</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Leaders who navigate uncertainty with courage and create psychological safety for innovation
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <h4 className="font-semibold mb-2">Technical Excellence</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Technical leaders who bridge vision and implementation through reflective co-creation
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <h4 className="font-semibold mb-2">Learning Culture</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Teams that prioritize learning over performance, creating coherence between actions and vision
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationJourney;
