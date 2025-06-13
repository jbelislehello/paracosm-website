
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Target, Brain, Sparkles } from 'lucide-react';

const WhoWeServeSection = () => {
  const professionalServices = [
    {
      title: "Business Leaders & Managers",
      description: "Elevate workplace connection and improve team dynamics through strategic development",
      icon: Target
    },
    {
      title: "Therapists & Coaches",
      description: "Professional development, practice growth, and reconnecting with colleagues in your field",
      icon: Users
    }
  ];

  const organizationServices = [
    {
      title: "AI Solutions & Automation",
      description: "Cut costs, automate workflows, reduce customer acquisition cost",
      icon: Brain
    },
    {
      title: "AI Governance & Compliance",
      description: "Responsible AI toolkits for enterprises and government institutions",
      icon: Building2
    },
    {
      title: "Digital Transformation",
      description: "Data-driven strategies, AI innovation, platform modernization",
      icon: Sparkles
    },
    {
      title: "Smart Cities & Retail",
      description: "Urban digital platforms, personalized experiences, market intelligence",
      icon: Target
    }
  ];

  return (
    <section id="who-we-serve" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Serve</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg">
            We partner with professionals seeking strategic development and organizations pursuing digital innovation. 
            Our approach bridges human development with technological advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Professionals Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Professionals</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Strategic leadership development and professional growth consulting
              </p>
            </div>

            <div className="space-y-4">
              {professionalServices.map((service, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <service.icon className="w-5 h-5 text-blue-600" />
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center lg:text-left">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600">
                Professional Consultation
              </Button>
            </div>
          </div>

          {/* Organizations Section */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Organizations</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                AI transformation, digital innovation, and organizational development
              </p>
            </div>

            <div className="space-y-4">
              {organizationServices.map((service, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <service.icon className="w-5 h-5 text-purple-600" />
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription>{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center lg:text-left">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-cyan-600 hover:to-purple-600">
                Enterprise Consultation
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
            <h4 className="text-xl font-bold mb-4">Ready to Get Started?</h4>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Whether you're a professional seeking strategic development or an organization pursuing innovation, 
              we're here to bridge the gap between vision and reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600">
                Schedule Discovery Call
              </Button>
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeServeSection;
