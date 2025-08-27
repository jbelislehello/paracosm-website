
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
