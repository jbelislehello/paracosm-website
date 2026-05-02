import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { PartnerToolsProvider } from "./context/PartnerToolsContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ModeProvider } from "./components/calm-magic/context/ModeContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./App.css";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Index = lazy(() => import("./pages/Index"));
const DriftLanding = lazy(() => import("./pages/DriftLanding"));
const DriftMonthlyDiscovery = lazy(() => import("./pages/DriftMonthlyDiscovery"));
const DriftLibrary = lazy(() => import("./pages/DriftLibrary"));
const ParacosmRetreatLanding = lazy(() => import("./pages/ParacosmRetreatLanding"));
const WuxiaTheFox = lazy(() => import("./pages/WuxiaTheFox"));
const RelationalHealing = lazy(() => import("./pages/RelationalHealing"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CalmMagicBoard = lazy(() => import("./pages/CalmMagicBoard"));
const CalmMagicAuth = lazy(() => import("./pages/CalmMagicAuth"));
const GlitchAuth = lazy(() => import("./pages/GlitchAuth"));
const GlitchEvents = lazy(() => import("./pages/GlitchEvents"));
const GlitchInsights = lazy(() => import("./pages/GlitchInsights"));
const GlitchLog = lazy(() => import("./pages/GlitchLog"));
const Drift = lazy(() => import("./pages/Drift"));
const PrdEditor = lazy(() => import("./pages/PrdEditor"));
const PrdsDashboard = lazy(() => import("./pages/PrdsDashboard"));
const GardenExpansionMode = lazy(() => import("./pages/GardenExpansionMode"));
const CalmMagicVisualization = lazy(() => import("./pages/CalmMagicVisualization"));
const CalmMagicJournal = lazy(() => import("./pages/CalmMagicJournal"));
const ProjectsDashboard = lazy(() => import("./pages/ProjectsDashboard"));
const Pricing = lazy(() => import("./pages/Pricing"));
const DesignSystemShowcase = lazy(() => import("./pages/DesignSystemShowcase"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const SubscriptionCanceled = lazy(() => import("./pages/SubscriptionCanceled"));
const PatternEncyclopedia = lazy(() => import("./pages/PatternEncyclopedia"));
const ParacosmDashboard = lazy(() => import("./pages/ParacosmDashboard"));
const GlitchMethodology = lazy(() => import("./pages/GlitchMethodology"));
const Tonalli = lazy(() => import("./pages/Tonalli"));
const EntrepreneurialTarot = lazy(() => import("./pages/EntrepreneurialTarot"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminSubscriptions = lazy(() => import("./pages/AdminSubscriptions"));
const BookLaunch = lazy(() => import("./pages/BookLaunch"));
const DreamAndLearn = lazy(() => import("./pages/DreamAndLearn"));
const CalmMagicDemo = lazy(() => import("./pages/CalmMagicDemo"));
const Lineage = lazy(() => import("./pages/Lineage"));
const AgenticEcosystemDeck = lazy(() => import("./pages/AgenticEcosystemDeck"));
const ResonanceDemo = lazy(() => import("./pages/ResonanceDemo"));

const queryClient = new QueryClient();

const RouteLoadingFallback = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
    <div className="w-full max-w-sm rounded-2xl border border-border bg-card/80 p-6 text-center shadow-sm backdrop-blur-sm">
      <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-primary/15" />
      <p className="text-sm font-medium text-foreground">Loading experience…</p>
      <p className="mt-1 text-xs text-muted-foreground">Preparing the next layer of Calm Magic.</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PartnerToolsProvider>
          <ModeProvider>
            <ProjectsProvider>
              <Router>
                <Suspense fallback={<RouteLoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/drift" element={<DriftLanding />} />
                    <Route path="/drift/:year/:month" element={<DriftMonthlyDiscovery />} />
                    <Route path="/drift/library/:axis" element={<DriftLibrary />} />
                    <Route path="/paracosm-retreat" element={<ParacosmRetreatLanding />} />
                    <Route path="/wuxia" element={<WuxiaTheFox />} />
                    <Route path="/agentic-ux" element={<Index />} />
                    <Route path="/calm-magic-assistant" element={<RelationalHealing />} />
                    <Route path="/case-studies" element={<CaseStudies />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/auth" element={<CalmMagicAuth />} />
                    <Route path="/glitch-auth" element={<GlitchAuth />} />
                    <Route path="/calm-magic-board" element={<ProtectedRoute><CalmMagicBoard /></ProtectedRoute>} />
                    <Route path="/calm-magic-board/log" element={<ProtectedRoute><GlitchLog /></ProtectedRoute>} />
                    <Route path="/calm-magic-board/events" element={<ProtectedRoute><GlitchEvents /></ProtectedRoute>} />
                    <Route path="/calm-magic-board/insights" element={<ProtectedRoute><GlitchInsights /></ProtectedRoute>} />
                    <Route path="/calm-magic-board/drift" element={<ProtectedRoute><Drift /></ProtectedRoute>} />
                    <Route path="/calm-magic-board/prds" element={<ProtectedRoute><PrdsDashboard /></ProtectedRoute>} />
                    <Route path="/calm-magic-board/garden" element={<ProtectedRoute><GardenExpansionMode /></ProtectedRoute>} />
                    <Route path="/calm-magic-board/paracosm" element={<ProtectedRoute><ParacosmDashboard /></ProtectedRoute>} />
                    <Route path="/calm-magic-board/prds/:id" element={<ProtectedRoute><PrdEditor /></ProtectedRoute>} />
                    <Route path="/prd-editor/:id" element={<ProtectedRoute><PrdEditor /></ProtectedRoute>} />
                    <Route path="/calm-magic-visualization" element={<CalmMagicVisualization />} />
                    <Route path="/calm-magic-journal" element={<CalmMagicJournal />} />
                    <Route path="/projects" element={<ProjectsDashboard />} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/admin/subscriptions" element={<ProtectedRoute><AdminSubscriptions /></ProtectedRoute>} />
                    <Route path="/subscription-success" element={<SubscriptionSuccess />} />
                    <Route path="/subscription-canceled" element={<SubscriptionCanceled />} />
                    <Route path="/pattern-encyclopedia" element={<PatternEncyclopedia />} />
                    <Route path="/glitch-methodology" element={<GlitchMethodology />} />
                    <Route path="/tonalli" element={<Tonalli />} />
                    <Route path="/tarot" element={<EntrepreneurialTarot />} />
                    <Route path="/book" element={<BookLaunch />} />
                    <Route path="/dream-and-learn" element={<DreamAndLearn />} />
                    <Route path="/design-system" element={<DesignSystemShowcase />} />
                    <Route path="/calm-magic-demo" element={<CalmMagicDemo />} />
                    <Route path="/lineage" element={<Lineage />} />
                    <Route path="/agentic-ecosystem-deck" element={<AgenticEcosystemDeck />} />
                    <Route path="/resonance" element={<ResonanceDemo />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </Router>
            </ProjectsProvider>
          </ModeProvider>
        </PartnerToolsProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
