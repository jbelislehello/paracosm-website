import { Book, Sparkles, Film, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ParacosmUniverseSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-amber-500 text-amber-700 dark:text-amber-400">
            <Sparkles className="w-3 h-3 mr-1" />
            The Paracosm Universe
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Where Coaching Meets Storytelling
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paracosm weaves together leadership transformation, AI innovation, and prophetic storytelling 
            into a shared universe of meaning-making tools and narratives.
          </p>
        </div>

        {/* Wuxia the Fox Announcement - Featured */}
        <div className="mb-12 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-3xl p-8 md:p-10 border-2 border-amber-300 dark:border-amber-700 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Visual Element */}
            <div className="flex-shrink-0">
              <div className="w-40 h-40 md:w-56 md:h-56 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="text-center text-white">
                  <span className="text-6xl md:text-8xl">🦊</span>
                  <p className="font-bold text-sm md:text-base mt-2">Wuxia</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
                <Badge className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Film className="w-3 h-3 mr-1" />
                  AI-Enabled Prophetic Movie
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                  <Award className="w-3 h-3 mr-1" />
                  CALQ Funded
                </Badge>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-100 mb-3">
                Wuxia the Fox Returns
              </h3>
              
              <p className="text-amber-800 dark:text-amber-200 mb-4 text-lg">
                The AI-enabled prophetic movie project is coming back with the launch of <strong>five new books</strong>, 
                generously funded by <em>Le Conseil des arts et des lettres du Québec</em>.
              </p>
              
              <p className="text-muted-foreground mb-6">
                Wuxia the Fox is a Story Guide and Consent Guardian — a narrative AI companion that bridges 
                ancient wisdom traditions with contemporary AI ethics, exploring themes of transformation, 
                sovereignty, and the dance between shadow and higher self.
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Badge variant="secondary" className="text-sm">
                  <Book className="w-3 h-3 mr-1" />
                  5 New Books
                </Badge>
                <Badge variant="secondary" className="text-sm">Prophetic Storytelling</Badge>
                <Badge variant="secondary" className="text-sm">AI Companion</Badge>
                <Badge variant="secondary" className="text-sm">Consent-First Design</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Universe Connection - How it all fits together */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">Calm Magic Board</h4>
            <p className="text-sm text-muted-foreground">
              The 260-tile transformation engine that powers both personal journeys and product development through guided dialogue.
            </p>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Book className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">Wuxia's Stories</h4>
            <p className="text-sm text-muted-foreground">
              Prophetic narratives that explore consciousness, AI ethics, and transformation through the lens of the Fox archetype.
            </p>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-lg mb-2">IoTheatre</h4>
            <p className="text-sm text-muted-foreground">
              Interactive theatre experiences where audience members become characters in AI-augmented prophetic stories.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Stay updated on Wuxia the Fox and the Paracosm Universe
          </p>
          <a href="#contact">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white">
              Join the Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ParacosmUniverseSection;
