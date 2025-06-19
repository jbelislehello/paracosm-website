
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PartnerToolsProvider } from "./context/PartnerToolsContext";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import RelationalHealing from "./pages/RelationalHealing";
import CaseStudies from "./pages/CaseStudies";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <PartnerToolsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing-page" element={<LandingPage />} />
              <Route path="/calm-magic-assistant" element={<RelationalHealing />} />
              <Route path="/case-studies" element={<CaseStudies />} />
              <Route path="/about-us" element={<AboutUs />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </PartnerToolsProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
