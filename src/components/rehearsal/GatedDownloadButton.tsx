import { useEffect, useState } from "react";
import { Download, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SignupPromptModal from "@/components/SignupPromptModal";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  filename: string;
  label: string;
  sublabel?: string;
  offeringSlug?: string;
  className?: string;
}

export default function GatedDownloadButton({
  href,
  filename,
  label,
  sublabel,
  offeringSlug,
  className,
}: Props) {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setSignedIn(!!session?.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (mounted) setSignedIn(!!session?.user);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const trigger = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!signedIn) {
      e.preventDefault();
      setShowModal(true);
      return;
    }
    // Fire-and-forget analytics ping
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("analytics_events").insert({
          user_id: user.id,
          event_name: "rehearsal_download",
          path: window.location.pathname,
          properties: { asset: filename, offering_slug: offeringSlug ?? null },
        });
      }
    } catch {
      /* non-blocking */
    }
  };

  const locked = signedIn === false;

  return (
    <>
      <a
        href={href}
        download={filename}
        onClick={trigger}
        className={cn(
          "group flex items-center gap-4 rounded-2xl border border-current/15 bg-current/5 p-5 transition-colors hover:bg-current/10",
          className,
        )}
      >
        <div className="shrink-0 w-11 h-11 rounded-full border border-current/20 flex items-center justify-center">
          {locked ? <Lock className="w-4 h-4 opacity-70" /> : <Download className="w-4 h-4 opacity-80" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{label}</div>
          {sublabel && (
            <div className="text-xs opacity-60 mt-0.5">
              {locked ? "Free account required · " : ""}
              {sublabel}
            </div>
          )}
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 shrink-0">
          PDF
        </span>
      </a>
      <SignupPromptModal
        open={showModal}
        onOpenChange={setShowModal}
        context="rehearsal-download"
      />
    </>
  );
}
