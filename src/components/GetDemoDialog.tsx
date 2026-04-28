import { useEffect, useRef, useState } from "react";
import { z } from "zod";
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
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

const FormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

interface GetDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GetDemoDialog = ({ open, onOpenChange }: GetDemoDialogProps) => {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const openedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (open) openedAtRef.current = Date.now();
  }, [open]);

  const reset = () => {
    setForm({ name: "", email: "", company: "", message: "" });
    setWebsite("");
    setErrors({});
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = FormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (v && v[0]) fieldErrors[k] = v[0];
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-demo-request", {
        body: {
          ...parsed.data,
          website, // honeypot — must stay empty
          elapsedMs: Date.now() - openedAtRef.current,
        },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Submission failed");
      setSuccess(true);
      toast.success("Demo request sent");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setTimeout(reset, 200);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        {success ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-xl">Request received</DialogTitle>
            <DialogDescription className="mt-2 max-w-sm">
              Thanks {form.name.split(" ")[0]} — we'll be in touch within
              one business day to schedule your Agentic Ecosystems demo.
            </DialogDescription>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Get a demo
              </DialogTitle>
              <DialogDescription>
                Tell us a little about your context and we'll tailor the walkthrough.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="demo-name">Name *</Label>
                <Input
                  id="demo-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={120}
                  required
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-email">Email *</Label>
                <Input
                  id="demo-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  required
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-company">Company</Label>
                <Input
                  id="demo-company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  maxLength={200}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-message">What would you like to explore? *</Label>
                <Textarea
                  id="demo-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={2000}
                  rows={4}
                  required
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Request demo"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GetDemoDialog;
