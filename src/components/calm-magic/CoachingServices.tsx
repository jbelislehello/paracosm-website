
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Compass, Sparkles, Users, Clock, Video, Calendar, BookOpen } from 'lucide-react';

const CoachingServices: React.FC = () => {
  const coachingPackages = [
    {
      title: "Inner Life Exploration",
      subtitle: "6-Week Individual Coaching",
      description: "Deep dive into your emotional patterns using the Calm Magic framework to uncover your authentic self and relationship dynamics.",
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      features: [
        "Weekly 90-minute 1:1 sessions",
        "Calm Magic quadrant assessment",
        "Personal freedom compass tracking",
        "Journaling exercises & prompts",
        "Email support between sessions"
      ],
      price: "$1,200",
      duration: "6 weeks"
    },
    {
      title: "Creative Relationship Design",
      subtitle: "8-Week Transformation Program",
      description: "Design innovative and playful relationships using creative expression and the Calm Magic forces to build deeper connections.",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600",
      features: [
        "Bi-weekly 2-hour creative sessions",
        "Relationship pattern mapping",
        "Creative expression exercises",
        "Freedom arrow progression tracking",
        "Custom relationship rituals design"
      ],
      price: "$1,800",
      duration: "8 weeks"
    },
    {
      title: "Calm Magic Intensive",
      subtitle: "3-Month Deep Transformation",
      description: "Comprehensive coaching journey through all four forces with ongoing support for lasting change in your inner life and relationships.",
      icon: Compass,
      color: "from-blue-500 to-cyan-600",
      features: [
        "12 weekly coaching sessions",
        "Monthly progress assessments",
        "Access to group practice sessions",
        "Personalized meditation practices",
        "Ongoing email & text support"
      ],
      price: "$3,200",
      duration: "12 weeks",
      popular: true
    }
  ];

  const coachingFeatures = [
    {
      icon: Video,
      title: "Virtual Sessions",
      description: "Connect from anywhere with secure video coaching sessions"
    },
    {
      icon: BookOpen,
      title: "Calm Magic Journaling",
      description: "Structured journaling using the four forces framework"
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Sessions that fit your schedule and time zone"
    },
    {
      icon: Users,
      title: "Community Access",
      description: "Connect with other Calm Magic practitioners"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Coaching Packages */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">One-on-One Coaching Programs</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Personalized coaching journeys using the Calm Magic framework to explore your inner life 
            and develop innovative, creative relationships that bring you freedom and joy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {coachingPackages.map((pkg, index) => (
            <Card key={index} className={`relative ${pkg.popular ? 'ring-2 ring-purple-600' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mb-4`}>
                  <pkg.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{pkg.title}</CardTitle>
                <p className="text-purple-600 font-medium">{pkg.subtitle}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{pkg.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{pkg.price}</span>
                  <span className="text-slate-500">/ {pkg.duration}</span>
                </div>

                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600">
                  Start Your Journey
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coaching Features */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-center mb-8">Why Choose Calm Magic Coaching?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coachingFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachingServices;
