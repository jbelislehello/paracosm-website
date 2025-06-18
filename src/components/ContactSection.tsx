import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, Phone, Users, Building2 } from 'lucide-react';
import CaseStudyRecommendation from './CaseStudyRecommendation';

const ContactSection = () => {
  const { toast } = useToast();
  const [selectedClientType, setSelectedClientType] = useState('');

  const getRelevantCaseStudies = (clientType: string) => {
    switch (clientType) {
      case 'ai-solutions':
        return [
          {
            title: 'IA Conversationnelle',
            description: 'Assistant virtuel pour le courtage immobilier québécois',
            caseStudyId: 'oaciq-elise',
            caseStudyTitle: 'Élise - Assistant virtuel OACIQ'
          }
        ];
      case 'digital-transformation':
        return [
          {
            title: 'Innovation Muséale',
            description: 'Installation interactive au Musée de la civilisation',
            caseStudyId: 'simulateur-genial',
            caseStudyTitle: 'Simulateur Génial!'
          }
        ];
      case 'smart-cities':
        return [
          {
            title: 'Art Public Urbain',
            description: 'Expérience narrative urbaine à Montréal',
            caseStudyId: 'lachine-passages',
            caseStudyTitle: 'Lachine Passages'
          }
        ];
      case 'business-leadership':
        return [
          {
            title: 'Méthodologie Créative',
            description: 'Framework technopoétique pour le design transformationnel',
            caseStudyId: 'codemagic-methodology',
            caseStudyTitle: 'CodeMagic Methodology'
          }
        ];
      case 'professional-development':
        return [
          {
            title: 'Laboratoire d\'Innovation',
            description: 'Résidence créative franco-canadienne au Banff Centre',
            caseStudyId: 'banff-residence',
            caseStudyTitle: 'Banff Emergence Lab'
          }
        ];
      default:
        return [];
    }
  };

  const createMailtoLink = (formData: FormData) => {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const clientType = formData.get('clientType') as string;
    const message = formData.get('message') as string;
    
    const subject = `Contact Form Submission from ${name}`;
    const body = `
Hello,

You have received a new contact form submission:

Name: ${name}
Email: ${email}
Interest: ${clientType}

Message:
${message}

Best regards,
Contact Form System
    `.trim();
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    return `mailto:jbelisle@helloarchitekt.com?subject=${encodedSubject}&body=${encodedBody}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const contactData = {
      name: formData.get('name'),
      email: formData.get('email'),
      clientType: formData.get('clientType'),
      message: formData.get('message'),
      recipientEmail: 'jbelisle@helloarchitekt.com'
    };
    
    console.log('Contact form submission:', contactData);
    
    // Create and trigger mailto link
    const mailtoLink = createMailtoLink(formData);
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening Email Client",
      description: "Your email client should open with the message pre-filled. If it doesn't open, please email jbelisle@helloarchitekt.com directly.",
      duration: 7000,
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
    setSelectedClientType('');
  };

  const handleClientTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientType(e.target.value);
  };

  const relevantCaseStudies = getRelevantCaseStudies(selectedClientType);

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Get In Touch</h2>
        <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
          Whether you're a professional seeking strategic development or an organization pursuing digital innovation, 
          let's discuss how we can help bridge the gap between your vision and reality.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Send us a message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input id="name" name="name" required />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>
              
              <div>
                <label htmlFor="clientType" className="block text-sm font-medium mb-1">I'm interested in...</label>
                <select 
                  id="clientType" 
                  name="clientType" 
                  value={selectedClientType}
                  onChange={handleClientTypeChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="business-leadership">Business Leadership Development</option>
                  <option value="professional-development">Professional Development & Growth</option>
                  <option value="ai-solutions">AI Solutions & Automation</option>
                  <option value="digital-transformation">Digital Transformation</option>
                  <option value="ai-governance">AI Governance & Compliance</option>
                  <option value="smart-cities">Smart Cities & Urban Platforms</option>
                  <option value="retail-innovation">Retail & Shopping Experience</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Case Study Recommendations */}
              {relevantCaseStudies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Related Work:</h4>
                  {relevantCaseStudies.map((study, index) => (
                    <CaseStudyRecommendation
                      key={index}
                      title={study.title}
                      description={study.description}
                      caseStudyId={study.caseStudyId}
                      caseStudyTitle={study.caseStudyTitle}
                    />
                  ))}
                </div>
              )}
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <Textarea id="message" name="message" rows={6} placeholder="Tell us about your goals, challenges, or how we can help..." required />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Right Column - Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Let's Connect</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-slate-600 dark:text-slate-300">jbelisle@helloarchitekt.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Response Time</h4>
                    <p className="text-slate-600 dark:text-slate-300">We typically respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Consultation</h4>
                    <p className="text-slate-600 dark:text-slate-300">Free 30-minute discovery calls available</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-blue-800 dark:text-blue-200">Professionals</h4>
                </div>
                <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  <li>• Strategic leadership development</li>
                  <li>• Professional growth consulting</li>
                  <li>• Team dynamics improvement</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-purple-800 dark:text-purple-200">Organizations</h4>
                </div>
                <ul className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
                  <li>• AI solutions & automation</li>
                  <li>• Digital transformation</li>
                  <li>• Governance & compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
