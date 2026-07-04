import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { cn } from "@/lib/utils";

type SubLink = { label: string; to: string; note?: string };
type NavItem =
  | { label: string; to: string }
  | { label: string; children: SubLink[] };

const NAV: NavItem[] = [
  {
    label: "Trainings",
    children: [
      { label: "Crewdle Connect", to: "/trainings#crewdle-connect" },
      { label: "Crewdle Forge", to: "/trainings#crewdle-forge" },
      { label: "GL!TCH — Clarity Reset", to: "/trainings/glitch" },
      { label: "Drift — Decision Sprint", to: "/trainings/drift" },
      { label: "Tune — Founder Companion", to: "/trainings/tune" },
    ],
  },
  {
    label: "Retreats",
    children: [
      { label: "Paracosm Summit — Azores 2026", to: "/paracosm-retreat" },
      { label: "GL!TCH — Learning Organizations", to: "/programs/rehearsal-arc/glitch" },
      { label: "Drift — Co-Assisted Exploration", to: "/programs/rehearsal-arc/drift" },
      { label: "Tune — Relational Intelligence Summit", to: "/programs/rehearsal-arc/relational-intelligence-summit" },
      { label: "Stories of a Near Future", to: "/programs/rehearsal-arc/stories-of-a-near-future" },
      { label: "Think Like a Forest", to: "/events-and-retreats#think-like-a-forest" },
    ],
  },
  {
    label: "Residencies",
    children: [
      { label: "GL!TCH — Diagnostic Sprint", to: "/agentic-ux/residencies/diagnostic-sprint" },
      { label: "Drift — Prototype Residency", to: "/agentic-ux/residencies/prototype-residency" },
      { label: "Tune — Ecosystem Build", to: "/agentic-ux/residencies/ecosystem-build" },
    ],
  },
  {
    label: "Products",
    children: [
      { label: "Tonalli", to: "/tonalli" },
      { label: "Wuxia", to: "/wuxia" },
      { label: "Satori & Kensho", to: "/paracosm-retreat" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Drift", to: "/drift" },
      { label: "How It Works", to: "/design-system" },
      { label: "Agentic UX", to: "/agentic-ux" },
      { label: "Calm Magic Assistant", to: "/calm-magic-assistant" },
    ],
  },
  {
    label: "Methods",
    children: [
      { label: "Calm Magic", to: "/calm-magic-demo" },
      { label: "GL!TCH", to: "/glitch-methodology" },
    ],
  },
  { label: "Program", to: "/programs/rehearsal-arc" },
  { label: "Book", to: "/book" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Contact", to: "/contact" },
];

export default function EditorialSiteHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSignedIn(!!session?.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session?.user),
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-6 py-2.5 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logoParacosm}
            alt="Paracosm"
            className="h-7 w-7 rounded-md bg-white p-1 object-contain"
          />
          <div className="leading-none">
            <div className="font-serif text-[13px] tracking-tight">Paracosm</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-5">
          {NAV.map((item) => {
            if ("to" in item) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-[10px] uppercase tracking-[0.25em] font-medium opacity-70 hover:opacity-100 transition-opacity"
                >
                  {item.label}
                </Link>
              );
            }
            const open = openMenu === item.label;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  className={cn(
                    "text-[10px] uppercase tracking-[0.25em] font-medium opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1",
                    open && "opacity-100",
                  )}
                >
                  {item.label}
                  <ChevronDown className="w-2.5 h-2.5" />
                </button>
                {open && (
                  <div className="absolute right-0 top-full pt-3 min-w-[220px]">
                    <div className="border border-border bg-background shadow-lg py-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.label}
                          to={c.to}
                          className="block px-4 py-2 text-xs tracking-wide hover:bg-muted/60 transition-colors"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <button
          className="lg:hidden p-1.5 opacity-70 hover:opacity-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/60 bg-background max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto max-w-7xl px-6 py-4 flex flex-col divide-y divide-border/40">
            {NAV.map((item) => {
              if ("to" in item) {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="py-3 text-xs uppercase tracking-[0.25em] font-medium"
                  >
                    {item.label}
                  </Link>
                );
              }
              return (
                <div key={item.label} className="py-3">
                  <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-2">
                    {item.label}
                  </div>
                  <div className="flex flex-col gap-2 pl-2">
                    {item.children.map((c) => (
                      <Link key={c.label} to={c.to} className="text-sm">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
