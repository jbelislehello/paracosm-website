import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  source: string;
  interest?: "sample" | "waitlist" | "cohort" | "org";
  chapterSlug?: string;
  language?: "en" | "fr";
  cta?: string;
  placeholder?: string;
  successTitle?: string;
  successMessage?: string;
  variant?: "inline" | "stacked";
}

export default function BookLeadCaptureForm({
  source,
  interest = "waitlist",
  chapterSlug,
  language = "en",
  cta = "Join the waitlist",
  placeholder = "you@company.com",
  successTitle = "You're on the list",
  successMessage = "Watch for the next chapter and launch news.",
  variant = "inline",
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [mountedAt] = useState(() => Date.now());
  const [utm, setUtm] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const collected: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => {
      const v = params.get(k);
      if (v) collected[k] = v;
    });
    if (Object.keys(collected).length) setUtm(collected);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return; // bot
    if (Date.now() - mountedAt < 1500) return; // too fast
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("book-lead-capture", {
        body: {
          name: name.trim() || email.split("@")[0],
          email: email.trim(),
          interest,
          chapter_slug: chapterSlug,
          language,
          source,
          utm,
        },
      });
      if (error || (data as { error?: unknown })?.error) {
        throw new Error((data as { error?: string })?.error ?? error?.message ?? "Failed");
      }
      setDone(true);
      toast.success(successTitle, { description: successMessage });
    } catch (err) {
      toast.error("Could not submit", {
        description: (err as Error).message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Card className="border-white/15 bg-white/[0.06] p-5 text-sm text-white/80">
        <div className="font-semibold text-white">{successTitle}</div>
        <div className="mt-1 text-white/60">{successMessage}</div>
      </Card>
    );
  }

  if (variant === "stacked") {
    return (
      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
        />
        <Input
          type="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden
        />
        <Button type="submit" disabled={submitting} className="w-full bg-white text-slate-900 hover:bg-white/90">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : cta}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        required
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-white/5 border-white/15 text-white placeholder:text-white/40"
      />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        className="hidden"
        aria-hidden
      />
      <Button
        type="submit"
        disabled={submitting}
        className="bg-white font-semibold text-slate-900 hover:bg-white/90"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : cta}
      </Button>
    </form>
  );
}
