import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function EnrollDialog({
  trainingSlug,
  trainingTitle,
  triggerLabel,
}: {
  trainingSlug: string;
  trainingTitle: string;
  triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    role: "",
    productivity_style: "",
    data_maturity: "" as string | "",
    goals: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("training_enrollments").insert({
      training_slug: trainingSlug,
      name: form.name.trim(),
      email: form.email.trim(),
      org: form.org || null,
      role: form.role || null,
      productivity_style: form.productivity_style || null,
      data_maturity: form.data_maturity ? Number(form.data_maturity) : null,
      goals: form.goals || null,
      language: "en",
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please check your details.");
      return;
    }
    toast.success("Enrollment received — we'll be in touch at jbelisle@helloarchitekt.com.");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enroll — {trainingTitle}</DialogTitle>
          <DialogDescription>
            Tell us a little about you and how you work. We tailor cohorts to maturity and intent.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="org">Organization</Label>
              <Input id="org" value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="ps">Productivity style</Label>
            <Input
              id="ps"
              placeholder="e.g. deep-work mornings, async collaborator…"
              value={form.productivity_style}
              onChange={(e) => setForm({ ...form, productivity_style: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dm">Data maturity (1–5)</Label>
            <Input
              id="dm"
              type="number"
              min={1}
              max={5}
              value={form.data_maturity}
              onChange={(e) => setForm({ ...form, data_maturity: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="goals">What do you want to walk away with?</Label>
            <Textarea
              id="goals"
              rows={3}
              value={form.goals}
              onChange={(e) => setForm({ ...form, goals: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting…" : "Submit enrollment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
