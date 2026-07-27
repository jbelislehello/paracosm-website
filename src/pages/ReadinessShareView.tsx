import { useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePageSeo } from "@/hooks/usePageSeo";
import EditorialSiteHeader from "@/components/editorial/EditorialSiteHeader";
import Footer from "@/components/Footer";
import SeasonResultCard from "@/components/readiness/SeasonResultCard";
import { SEASONS, SEASON_BY_ID } from "@/lib/readiness/data";
import { exportReadinessPdf } from "@/lib/readiness/exportPdf";
import {
  requestShareCode,
  verifyShareCode,
  type ReadinessSnapshot,
} from "@/lib/readiness/shares";

type Stage = "email" | "code" | "view";

export default function ReadinessShareView() {
  const { shareId = "" } = useParams();
  usePageSeo({
    title: "Shared readiness report | Paracosm",
    description: "View a Calm Magic readiness report shared with you.",
    path: `/r/${shareId}`,
  });

  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [snapshot, setSnapshot] = useState<ReadinessSnapshot | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const requestCode = async () => {
    if (!shareId) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Enter a valid email address.");
      return;
    }
    setBusy(true);
    try {
      await requestShareCode(shareId, email.trim());
      toast.success("Check your email for a 6-digit code.");
      setStage("code");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "";
      if (msg.includes("not_authorized"))
        toast.error("This email is not on the recipient list.");
      else if (msg.includes("expired") || msg.includes("revoked"))
        toast.error("This share link is no longer valid.");
      else if (msg.includes("rate_limited"))
        toast.error("Too many code requests. Try again later.");
      else toast.error("Could not send code. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    if (!/^\d{6}$/.test(code)) {
      toast.error("Enter the 6-digit code from the email.");
      return;
    }
    setBusy(true);
    try {
      const res = await verifyShareCode(shareId, email.trim(), code);
      setSnapshot(res.snapshot);
      setNote(res.note);
      setStage("view");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "";
      if (msg.includes("invalid_code")) toast.error("Incorrect code.");
      else if (msg.includes("code_expired")) toast.error("Code expired. Request a new one.");
      else if (msg.includes("too_many_attempts")) toast.error("Too many attempts. Request a new code.");
      else toast.error("Could not verify.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-10">
        {stage !== "view" && (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card/40 p-8">
            <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure share
            </div>
            <h1 className="font-serif text-2xl">Readiness report</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This report was shared with specific recipients. Enter your email to receive a
              one-time code.
            </p>

            {stage === "email" && (
              <div className="mt-5 space-y-3">
                <div>
                  <Label htmlFor="email" className="text-xs uppercase tracking-[0.18em]">
                    Your email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <Button onClick={requestCode} disabled={busy} className="w-full">
                  {busy ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Send me a code
                </Button>
              </div>
            )}

            {stage === "code" && (
              <div className="mt-5 space-y-3">
                <div className="text-xs text-muted-foreground">
                  We sent a 6-digit code to <span className="font-mono">{email}</span>. It expires
                  in 15 minutes.
                </div>
                <div>
                  <Label htmlFor="code" className="text-xs uppercase tracking-[0.18em]">
                    Access code
                  </Label>
                  <Input
                    id="code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="text-center font-mono text-lg tracking-[0.4em]"
                  />
                </div>
                <Button onClick={verify} disabled={busy} className="w-full">
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Unlock report
                </Button>
                <button
                  type="button"
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => setStage("email")}
                >
                  Use a different email
                </button>
              </div>
            )}
          </div>
        )}

        {stage === "view" && snapshot && (
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Shared readiness snapshot
                </div>
                <h1 className="mt-2 font-serif text-3xl">Calm Magic Readiness Report</h1>
                {snapshot.ownerEmail && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    From {snapshot.ownerEmail}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  exportReadinessPdf({
                    answers: snapshot.answers,
                    seasonScores: snapshot.seasonScores,
                    overall: snapshot.overall,
                    userEmail: snapshot.ownerEmail,
                  })
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>

            {note && (
              <div className="mb-6 rounded-xl border border-border bg-card/40 p-4 text-sm">
                <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Note from sender
                </div>
                {note}
              </div>
            )}

            <div className="mb-8 grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card/60 p-5 sm:grid-cols-4">
              <Stat label="Personal" value={snapshot.overall.personal} />
              <Stat label="Organizational" value={snapshot.overall.organizational} />
              <Stat
                label="Gap"
                value={`${snapshot.overall.gap > 0 ? "+" : ""}${snapshot.overall.gap}`}
              />
              <Stat label="Composite" value={snapshot.overall.composite} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {SEASONS.map((s) => {
                const summary = snapshot.seasonScores.find((x) => x.seasonId === s.seasonId);
                if (!summary || summary.answered === 0) return null;
                return <SeasonResultCard key={s.seasonId} season={SEASON_BY_ID[s.seasonId]} score={summary.score} />;
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-2xl">{value}</div>
    </div>
  );
}
