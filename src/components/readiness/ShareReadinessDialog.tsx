import { useEffect, useState } from "react";
import { Copy, Link2, Loader2, Share2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createShare,
  deleteShare,
  listShares,
  revokeShare,
  shareUrl,
  type ReadinessShareRow,
  type ReadinessSnapshot,
} from "@/lib/readiness/shares";

interface Props {
  sessionId: string | null;
  ownerId: string | null;
  buildSnapshot: () => ReadinessSnapshot | Record<string, unknown>;
  /** Optional override used by the Relational Intelligence variant (no readiness session row). */
  createOverride?: (args: {
    ownerId: string;
    recipients: string[];
    note?: string;
    snapshot: ReadinessSnapshot | Record<string, unknown>;
    expiresInDays: number;
  }) => Promise<{ id: string }>;
}


const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ShareReadinessDialog({ sessionId, ownerId, buildSnapshot }: Props) {
  const [open, setOpen] = useState(false);
  const [recipientsRaw, setRecipientsRaw] = useState("");
  const [note, setNote] = useState("");
  const [expiresDays, setExpiresDays] = useState("7");
  const [creating, setCreating] = useState(false);
  const [shares, setShares] = useState<ReadinessShareRow[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      setShares(await listShares(ownerId));
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) void refresh();
     
  }, [open, ownerId]);

  const parseEmails = (raw: string) =>
    Array.from(
      new Set(
        raw
          .split(/[,\s;]+/)
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
      ),
    );

  const create = async () => {
    if (!sessionId || !ownerId) {
      toast.error("Sign in required.");
      return;
    }
    const emails = parseEmails(recipientsRaw);
    if (emails.length === 0) {
      toast.error("Add at least one recipient email.");
      return;
    }
    const invalid = emails.filter((e) => !emailRe.test(e));
    if (invalid.length) {
      toast.error(`Invalid email(s): ${invalid.join(", ")}`);
      return;
    }
    setCreating(true);
    try {
      const snap = buildSnapshot();
      const res = await createShare({
        sessionId,
        ownerId,
        recipients: emails,
        note: note.trim() || undefined,
        snapshot: snap,
        expiresInDays: Number(expiresDays),
      });
      await navigator.clipboard.writeText(shareUrl(res.id)).catch(() => {});
      toast.success("Share link created and copied.");
      setRecipientsRaw("");
      setNote("");
      await refresh();
    } catch (e) {
      console.error(e);
      toast.error("Could not create share.");
    } finally {
      setCreating(false);
    }
  };

  const copy = async (id: string) => {
    await navigator.clipboard.writeText(shareUrl(id));
    toast.success("Link copied.");
  };

  const revoke = async (id: string) => {
    try {
      await revokeShare(id);
      toast.success("Share revoked.");
      await refresh();
    } catch {
      toast.error("Could not revoke.");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteShare(id);
      toast.success("Share deleted.");
      await refresh();
    } catch {
      toast.error("Could not delete.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Share readiness results</DialogTitle>
          <DialogDescription>
            Recipients receive a one-time code by email each time they open the link. Only the
            emails you list can view the report.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="recipients" className="text-xs uppercase tracking-[0.18em]">
              Recipient emails
            </Label>
            <Input
              id="recipients"
              placeholder="alice@example.com, bob@example.com"
              value={recipientsRaw}
              onChange={(e) => setRecipientsRaw(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="note" className="text-xs uppercase tracking-[0.18em]">
              Note (optional)
            </Label>
            <Textarea
              id="note"
              placeholder="Context you want them to see when opening the report."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={500}
            />
          </div>
          <div>
            <Label className="text-xs uppercase tracking-[0.18em]">Expires in</Label>
            <Select value={expiresDays} onValueChange={setExpiresDays}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">24 hours</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={create} disabled={creating}>
            {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link2 className="mr-2 h-4 w-4" />}
            Create share link
          </Button>
        </div>

        <div className="mt-2">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Existing shares
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {!loading && shares.length === 0 && (
              <p className="text-xs text-muted-foreground">No shares yet.</p>
            )}
            {shares.map((s) => {
              const expired = new Date(s.expires_at).getTime() < Date.now();
              const status = s.revoked_at ? "Revoked" : expired ? "Expired" : "Active";
              return (
                <div
                  key={s.id}
                  className="rounded-lg border border-border p-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono">{s.id.slice(0, 8)}…</span>
                    <span
                      className={
                        status === "Active"
                          ? "text-emerald-600"
                          : status === "Revoked"
                            ? "text-rose-500"
                            : "text-muted-foreground"
                      }
                    >
                      {status}
                    </span>
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    To: {s.recipient_emails.join(", ")}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Expires {new Date(s.expires_at).toLocaleString()}
                  </div>
                  <div className="mt-2 flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => copy(s.id)}>
                      <Copy className="mr-1 h-3 w-3" /> Copy link
                    </Button>
                    {!s.revoked_at && !expired && (
                      <Button size="sm" variant="outline" onClick={() => revoke(s.id)}>
                        <X className="mr-1 h-3 w-3" /> Revoke
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => remove(s.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
