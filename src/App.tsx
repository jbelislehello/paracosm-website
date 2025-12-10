import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { PartnerToolsProvider } from "./context/PartnerToolsContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ModeProvider } from "./components/calm-magic/context/ModeContext";
import { ProjectsProvider } from "./context/ProjectsContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import DriftLanding from "./pages/DriftLanding";
import RelationalHealing from "./pages/RelationalHealing";
import CaseStudies from "./pages/CaseStudies";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import CalmMagicBoard from "./pages/CalmMagicBoard";
import CalmMagicAuth from "./pages/CalmMagicAuth";
import GlitchAuth from "./pages/GlitchAuth";
import GlitchEvents from "./pages/GlitchEvents";
import GlitchInsights from "./pages/GlitchInsights";
import GlitchLog from "./pages/GlitchLog";
import Drift from "./pages/Drift";
import PrdEditor from "./pages/PrdEditor";
import PrdsDashboard from "./pages/PrdsDashboard";
import CalmMagicVisualization from "./pages/CalmMagicVisualization";
import CalmMagicJournal from "./pages/CalmMagicJournal";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import Pricing from "./pages/Pricing";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PartnerToolsProvider>
          <ModeProvider>
            <ProjectsProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/drift" element={<DriftLanding />} />
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
                  <Route path="/calm-magic-board/prds/:id" element={<ProtectedRoute><PrdEditor /></ProtectedRoute>} />
                  <Route path="/prd-editor/:id" element={<ProtectedRoute><PrdEditor /></ProtectedRoute>} />
                  <Route path="/calm-magic-visualization" element={<CalmMagicVisualization />} />
                  <Route path="/calm-magic-journal" element={<CalmMagicJournal />} />
                  <Route path="/projects" element={<ProjectsDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
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
