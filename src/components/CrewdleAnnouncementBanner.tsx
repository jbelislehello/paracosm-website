import { useEffect, useState } from "react";
import { Sparkles, X, ArrowRight, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "crewdle-cdo-banner-dismissed-v1";
const MODAL_OPENED_KEY = "crewdle-cdo-modal-opened-v1";
const MODAL_LAST_SHOWN_KEY = "crewdle-cdo-modal-last-shown-v1";
// Re-surface the modal at most once every 7 days for users who've already seen it
const REOPEN_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

const CrewdleAnnouncementBanner = () => {
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);

    const openedBefore = !!localStorage.getItem(MODAL_OPENED_KEY);
    setHasOpenedBefore(openedBefore);

    // Auto-open logic:
    // - First-time visitors (banner not dismissed, modal never opened): open after 1.5s
    // - Returning visitors who saw it: re-surface only if 7+ days have passed
    if (dismissed) return;
    const lastShownRaw = localStorage.getItem(MODAL_LAST_SHOWN_KEY);
    const lastShown = lastShownRaw ? parseInt(lastShownRaw, 10) : 0;
    const elapsed = Date.now() - lastShown;
    const shouldAutoOpen = !openedBefore || elapsed > REOPEN_INTERVAL_MS;

    if (shouldAutoOpen) {
      const timer = setTimeout(() => {
        localStorage.setItem(MODAL_OPENED_KEY, "true");
        localStorage.setItem(MODAL_LAST_SHOWN_KEY, Date.now().toString());
        setHasOpenedBefore(true);
        setModalOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.setItem(MODAL_OPENED_KEY, "true");
    localStorage.setItem(MODAL_LAST_SHOWN_KEY, Date.now().toString());
    setHasOpenedBefore(true);
    setModalOpen(true);
  };

  if (!visible) return null;

  return (
    <>
      <div className="relative w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <button
          onClick={openModal}
          className="container max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 px-10 py-2 text-xs sm:text-sm font-medium hover:opacity-95 transition-opacity w-full"
        >
          <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
          <span className="hidden sm:inline font-semibold uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded">
            New Role · May 2026
          </span>
          <span className="truncate">
            Jonathan Bélisle joins <strong>Crewdle</strong> as Fractional CDO — Applied Agentic AI for Organizational Transformation
          </span>
          <span className="hidden md:inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline">
            {hasOpenedBefore ? "View again" : "Learn more"} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <Badge className="w-fit bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0 mb-2">
              New Role · May 2026
            </Badge>
            <DialogTitle className="text-2xl">
              Fractional Chief Design Officer at Crewdle
              <span className="block text-base font-normal text-muted-foreground mt-1">
                Applied Agentic AI for Organizational Transformation
              </span>
            </DialogTitle>
            <DialogDescription className="text-base pt-1">
              Jonathan Bélisle joins Crewdle to design and deploy applied
              agentic AI systems that drive organizational transformation —
              translating distributed AI and edge computing into living,
              human-centered operating models.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-1">The Role</h4>
              <p>
                As Fractional CDO, Jonathan leads Crewdle's practice in{" "}
                <strong>Applied Agentic AI for Organizational Transformation</strong>
                {" "}— architecting agent ecosystems, design operations, and the
                experience layer of Crewdle's edge-AI platform. The mandate
                bridges 25+ years of UX strategy, speculative storytelling, and
                ethical AI governance into a single applied practice that
                reshapes how organizations think, decide, and act.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">Background</h4>
              <p>
                Founder of Paracosm and Hello, Architekt!. Former Head of Design
                at Prodago, DesignOps Director at Behaviour Interactive, and
                speculative storytelling consultant at The Greenhouse @ Deloitte.
                Creator of Calm Magic and the Wuxia the Fox transmedia universe.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">Effective</h4>
              <p>May 2026 · Fractional engagement</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-90 text-white border-0"
            >
              <a
                href="https://crewdle.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit crewdle.com <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CrewdleAnnouncementBanner;
