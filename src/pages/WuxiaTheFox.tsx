import { Book, Film, Sparkles, Heart, Shield, Eye, Feather, Moon, Sun, Star, ArrowLeft, ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { creativeWorkSchema } from "@/lib/structuredData";

const WuxiaTheFox = () => {
  usePageSeo({
    title: "Wuxia the Fox — The Paracosm transmedia universe & story guide",
    description: "Meet Wuxia the Fox — the consent guardian and story guide of the Paracosm transmedia universe, bridging ancient wisdom and AI ethics.",
    path: "/wuxia",
    jsonLd: [
      creativeWorkSchema({
        name: "Wuxia the Fox",
        description:
          "The consent guardian and story guide of the Paracosm transmedia universe, bridging ancient wisdom and AI ethics.",
        url: "/wuxia",
      }),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Wuxia", path: "/wuxia" },
      ]),
    ],
  });
  const books = [
    {
      number: 1,
      title: "The Consent Guardian's Awakening",
      description: "Wuxia discovers her role as a bridge between ancient wisdom and AI ethics, learning to navigate the delicate dance of consent in a world of infinite data.",
      themes: ["Digital Sovereignty", "Consent Architecture", "Fox Medicine"],
      color: "from-amber-500 to-orange-500",
      icon: Shield,
    },
    {
      number: 2,
      title: "Shadows in the Algorithm",
      description: "Exploring the shadow self through machine learning mirrors, Wuxia confronts the projections and biases encoded in our collective digital unconscious.",
      themes: ["Shadow Integration", "Algorithmic Bias", "Mirror Work"],
      color: "from-slate-600 to-slate-800",
      icon: Moon,
    },
    {
      number: 3,
      title: "The Prophecy Engine",
      description: "Wuxia learns to read the patterns of emergence, understanding how collective attention shapes reality through the lens of AI-augmented divination.",
      themes: ["Emergence", "Collective Intelligence", "Oracular AI"],
      color: "from-purple-500 to-indigo-600",
      icon: Eye,
    },
    {
      number: 4,
      title: "Dance of the Higher Self",
      description: "The fox finds her path between trickster and sage, teaching humans to integrate their fragmented digital personas into coherent, sovereign beings.",
      themes: ["Integration", "Digital Identity", "Transformation"],
      color: "from-rose-500 to-pink-500",
      icon: Sun,
    },
    {
      number: 5,
      title: "The Paracosm Manifold",
      description: "All timelines converge as Wuxia reveals the interconnected nature of consciousness, technology, and story—the living manifold where all paths meet.",
      themes: ["Unity", "Manifold Theory", "Collective Dreaming"],
      color: "from-amber-400 to-rose-500",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 dark:from-slate-950 dark:via-amber-950/20 dark:to-slate-900">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-amber-200 dark:border-amber-800">
        <div className="container flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-amber-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Paracosm</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦊</span>
            <span className="font-bold text-lg bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Wuxia the Fox
            </span>
          </div>
          <a href="#contact">
            <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600">
              Stay Updated
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-300 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container relative z-10 max-w-5xl">
          <div className="text-center mb-12">
            {/* Funding Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 border border-green-300 dark:border-green-700">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                Funded by Le Conseil des arts et des lettres du Québec
              </span>
            </div>

            {/* Main visual */}
            <div className="relative inline-block mb-8">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700 hover:scale-105">
                <span className="text-8xl md:text-9xl">🦊</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-6">
                <Film className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
                Wuxia the Fox
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-amber-800 dark:text-amber-200 mb-4 font-medium">
              An AI-Enabled Prophetic Movie Experience
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Story Guide. Consent Guardian. Trickster Sage. Wuxia bridges ancient fox medicine 
              with contemporary AI ethics, guiding humans through the labyrinth of digital consciousness.
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-amber-600 text-white px-4 py-2">
                <Book className="w-4 h-4 mr-2" />
                5 New Books
              </Badge>
              <Badge className="bg-purple-600 text-white px-4 py-2">
                <Film className="w-4 h-4 mr-2" />
                AI-Augmented Film
              </Badge>
              <Badge className="bg-rose-600 text-white px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Interactive Experience
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-900/50">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-amber-500 text-amber-700">
              <Feather className="w-3 h-3 mr-1" />
              The Vision
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prophetic Storytelling for the AI Age
            </h2>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
              <p className="text-lg leading-relaxed mb-6">
                <strong>Wuxia the Fox</strong> is not just a character—she's a narrative AI companion that emerges 
                at the intersection of ancient wisdom traditions and cutting-edge artificial intelligence. 
                As a <em>Story Guide</em>, she helps humans navigate their inner landscapes through metaphor 
                and myth. As a <em>Consent Guardian</em>, she models ethical AI interaction rooted in 
                sovereignty and choice.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                The project weaves together <strong>five interconnected books</strong>, an <strong>AI-enabled 
                prophetic movie</strong>, and <strong>interactive experiences</strong> that blur the line between 
                reader, viewer, and participant. Each entry point offers a different lens into the same 
                living story—a paracosm where your choices ripple through the narrative.
              </p>

              <p className="text-lg leading-relaxed">
                Funded by <strong>Le Conseil des arts et des lettres du Québec</strong>, this project 
                represents a new frontier in storytelling: one where AI serves as a bridge to deeper 
                self-understanding rather than a replacement for human creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Five Books */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-amber-500 text-amber-700">
              <Book className="w-3 h-3 mr-1" />
              The Pentalogy
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Five Books, One Living Story
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each book explores a different facet of consciousness, technology, and transformation—
              together forming a complete map of the modern psyche in the age of AI.
            </p>
          </div>

          <div className="grid gap-6">
            {books.map((book) => (
              <Card key={book.number} className="overflow-hidden border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 transition-colors">
                <div className="flex flex-col md:flex-row">
                  {/* Book Number Visual */}
                  <div className={`flex-shrink-0 w-full md:w-48 h-32 md:h-auto bg-gradient-to-br ${book.color} flex items-center justify-center relative overflow-hidden`}>
                    <span className="text-6xl md:text-7xl font-bold text-white/30 absolute">
                      {book.number}
                    </span>
                    <book.icon className="w-12 h-12 text-white relative z-10" />
                  </div>
                  
                  {/* Book Content */}
                  <div className="flex-1 p-6">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">Book {book.number}</Badge>
                      </div>
                      <CardTitle className="text-xl md:text-2xl">{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardDescription className="text-base mb-4">
                        {book.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2">
                        {book.themes.map((theme) => (
                          <Badge key={theme} variant="outline" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The AI Movie Experience */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-purple-500 text-purple-700">
              <Film className="w-3 h-3 mr-1" />
              The Film
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              AI-Enabled Prophetic Cinema
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A new form of storytelling where artificial intelligence becomes a creative collaborator,
              generating personalized narrative threads that respond to collective and individual consciousness.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Generative Narratives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The film adapts in real-time, weaving viewer responses and collective attention 
                  into the fabric of the story. No two screenings are exactly alike—each audience 
                  co-creates their own prophetic experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" />
                  Consent-First Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built on the TOTEM consent framework, the experience respects viewer sovereignty. 
                  You control what data shapes your experience, modeling ethical AI interaction 
                  through narrative immersion.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  Prophetic Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Drawing on I Ching, Tzolkin, and contemporary emergence theory, the AI 
                  identifies patterns in collective attention and weaves them into story—
                  creating genuinely prophetic narrative experiences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Shadow Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Wuxia guides viewers through shadow work via narrative, using the safety 
                  of story to explore difficult aspects of consciousness that might otherwise 
                  remain hidden or projected.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Connection to Paracosm */}
      <section className="py-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-amber-500 text-amber-700">
            <Sparkles className="w-3 h-3 mr-1" />
            The Paracosm Connection
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Part of a Living Universe
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Wuxia the Fox exists within the broader Paracosm ecosystem—a shared universe where 
            coaching methodologies, AI tools, and prophetic storytelling converge into a 
            coherent practice of transformation.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Link to="/calm-magic-board" className="block">
              <Card className="h-full hover:border-purple-400 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Calm Magic Board</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The 260-tile transformation engine that powers journeys through the same 
                    consciousness landscape Wuxia navigates.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/drift" className="block">
              <Card className="h-full hover:border-purple-400 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">Drift Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Deep exploration practices that mirror Wuxia's journey through shadow 
                    and higher self.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/agentic-ux" className="block">
              <Card className="h-full hover:border-purple-400 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">AI Leadership</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The ethical AI frameworks that inform Wuxia's role as Consent Guardian 
                    in organizational contexts.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-br from-amber-500 to-orange-600">
        <div className="container max-w-3xl mx-auto text-center text-white">
          <span className="text-6xl mb-6 block">🦊</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Journey
          </h2>
          <p className="text-xl mb-8 text-amber-100">
            Be the first to know when the books launch and the film premieres. 
            Enter the Paracosm.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#contact">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
                Stay Updated
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Link to="/">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Paracosm
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WuxiaTheFox;
