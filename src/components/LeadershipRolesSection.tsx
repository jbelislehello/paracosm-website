
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Cog, Lightbulb } from 'lucide-react';

const LeadershipRolesSection = () => {
  const roles = [
    {
      icon: Crown,
      title: "Executive Courage & Emotional Leadership",
      description: "Develop the existential courage and emotional intelligence needed to lead through uncertainty and complexity.",
      details: [
        "Navigate the existential challenges of leadership with authentic presence",
        "Develop emotional intelligence that inspires rather than manages",
        "Create psychological safety for innovation to emerge",
        "Transform fear-based decision making into courage-driven vision"
      ],
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: Cog,
      title: "Technical Co-Creation & Self-Reflection",
      description: "Bridge executive vision with implementation reality through reflective technical leadership.",
      details: [
        "Co-create solutions that honor both vision and technical constraints",
        "Develop self-reflection practices that improve decision quality",
        "Build systems thinking that sees beyond immediate problems",
        "Foster collaborative relationships between business and technical teams"
      ],
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Lightbulb,
      title: "Learning-Oriented Employees",
      description: "Transform performers into learners who create coherence between actions and executive vision.",
      details: [
        "Shift from performance metrics to learning and growth indicators",
        "Create conditions where new ideas can flow freely upward",
        "Develop intrinsic motivation that aligns with organizational purpose",
        "Build capability for continuous adaptation and innovation"
      ],
      color: "from-green-500 to-teal-600"
    }
  ];

  return (
    <section id="leadership-roles" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Three Essential Leadership Roles for Innovation
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg">
            True innovation requires alignment between three distinct leadership capacities. 
            Traditional goal-setting often becomes a deterrent to innovation because it focuses on prediction rather than emergence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {roles.map((role, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${role.color} flex items-center justify-center mb-4`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {role.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {role.description}
                </p>
                <ul className="space-y-2">
                  {role.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h3 className="text-2xl font-bold text-center mb-4">Why Traditional Goal-Setting Often Prevents Innovation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 dark:text-slate-300">
            <div>
              <h4 className="font-semibold mb-2">Goals Create Rigidity</h4>
              <p className="text-sm">Fixed objectives prevent the adaptive thinking necessary for breakthrough innovations.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Systems Enable Emergence</h4>
              <p className="text-sm">Creating conditions and capabilities allows innovations to emerge organically from aligned leadership.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipRolesSection;
