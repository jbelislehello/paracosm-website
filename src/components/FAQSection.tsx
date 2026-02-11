import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is Building Learning Organizations?",
    answer: "Building Learning Organizations is a transformational approach that combines AI systems mastery with relational intelligence to help executives and innovators develop adaptive, future-ready leadership capabilities."
  },
  {
    question: "Who is leadership coaching for?",
    answer: "Our coaching is designed for executives, technical leaders, founders, and innovators who want to navigate complexity, build learning organizations, and develop both strategic AI capabilities and deep relational intelligence."
  },
  {
    question: "What coaching pathways do you offer?",
    answer: "We offer two main pathways: AI Systems & Leadership for strategic AI innovation leadership, and Relational Intelligence & Innovation for developing deep interpersonal and organizational capabilities."
  },
  {
    question: "How do I get started with coaching?",
    answer: "Start with a free discovery call where we explore your unique challenges and goals. This helps us understand your context and recommend the best pathway for your transformation journey."
  },
  {
    question: "What is the Calm Magic Framework?",
    answer: "The Calm Magic Framework is our proprietary methodology that integrates somatic and narrative design practices for expansive leadership development. It helps leaders process complexity while maintaining presence and effectiveness."
  }
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Common Questions</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about our coaching services and methodology
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-purple-600 transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-300 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
