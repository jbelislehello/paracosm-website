
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const ContactSection: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, you would send the form data to a server
    toast({
      title: "Message Sent",
      description: "Thanks for reaching out! We'll get back to you soon.",
      duration: 5000,
    });
    
    // Reset form
    (e.target as HTMLFormElement).reset();
  };
  
  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Ready to Get Started?</h2>
        <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-16">
          Contact us to learn more about how our agentic ecosystem platform can transform your AI capabilities.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Get In Touch</h3>
            
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
                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                <Input id="subject" name="subject" required />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <Textarea id="message" name="message" rows={5} required />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-agent-blue to-agent-purple hover:from-agent-purple hover:to-agent-blue transition-all duration-300"
              >
                Send Message
              </Button>
            </form>
          </div>
          
          {/* Right Column - Info */}
          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">Why Choose AgenticVerse</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-agent-blue/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-agent-blue"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Modular Architecture</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Build custom agent networks tailored to your specific use cases.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-agent-purple/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-agent-purple"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Advanced Visualization</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      See exactly how your agents interact and optimize their communication.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-agent-pink/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-agent-pink"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Enterprise Ready</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Secure, scalable infrastructure built for mission-critical applications.
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-agent-green/20 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-agent-green"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Expert Support</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Our team of specialists provides guidance at every step of your journey.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h4 className="font-semibold mb-2">Email Us</h4>
                <a href="mailto:contact@agenticverse.ai" className="text-agent-blue hover:underline">
                  contact@agenticverse.ai
                </a>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                <h4 className="font-semibold mb-2">Call Us</h4>
                <a href="tel:+15551234567" className="text-agent-blue hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
