
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { PartnerToolsProvider } from "./context/PartnerToolsContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import DriftLanding from "./pages/DriftLanding";
import RelationalHealing from "./pages/RelationalHealing";
import CaseStudies from "./pages/CaseStudies";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import CalmMagicBoard from "./pages/CalmMagicBoard";
import GlitchAuth from "./pages/GlitchAuth";
import GlitchEvents from "./pages/GlitchEvents";
import GlitchInsights from "./pages/GlitchInsights";
import GlitchLog from "./pages/GlitchLog";
import Drift from "./pages/Drift";
import PrdEditor from "./pages/PrdEditor";
import PrdsDashboard from "./pages/PrdsDashboard";
import CalmMagicVisualization from "./pages/CalmMagicVisualization";
import CalmMagicJournal from "./pages/CalmMagicJournal";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <PartnerToolsProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/drift" element={<DriftLanding />} />
              <Route path="/agentic-ux" element={<Index />} />
              <Route path="/calm-magic-assistant" element={<RelationalHealing />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/calm-magic-board" element={<CalmMagicBoard />} />
              <Route path="/calm-magic-board/log" element={<GlitchLog />} />
              <Route path="/calm-magic-board/events" element={<GlitchEvents />} />
              <Route path="/calm-magic-board/insights" element={<GlitchInsights />} />
              <Route path="/calm-magic-board/drift" element={<Drift />} />
              <Route path="/calm-magic-board/prds" element={<PrdsDashboard />} />
              <Route path="/calm-magic-board/prds/:id" element={<PrdEditor />} />
              <Route path="/prd-editor/:id" element={<PrdEditor />} />
              <Route path="/glitch-auth" element={<GlitchAuth />} />
              <Route path="/auth" element={<GlitchAuth />} />
              <Route path="/calm-magic-visualization" element={<CalmMagicVisualization />} />
              <Route path="/calm-magic-journal" element={<CalmMagicJournal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </PartnerToolsProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
