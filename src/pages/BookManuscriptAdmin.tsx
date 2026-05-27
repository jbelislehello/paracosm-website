import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Upload, FileText, Plus, Sparkles, Trash2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { useUserSession } from "@/hooks/useUserSession";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Chapter = {
  id: string;
  slug: string;
  order_index: number;
  title: string;
  phase: string;
  summary: string | null;
  status: string;
  is_free_sample: boolean;
  published_excerpt: string | null;
};

type Source = {
  id: string;
  chapter_id: string;
  kind: string;
  ref: string;
  title: string | null;
  excerpt: string | null;
  weight: number;
  included: boolean;
};

type UploadRow = {
  id: string;
  chapter_id: string | null;
  file_path: string;
  mime: string | null;
  original_name: string | null;
  extracted_text: string | null;
  created_at: string;
};

type Lead = {
  id: string;
  email: string;
  name: string;
  interest: string | null;
  tier: string;
  chapter_slug: string | null;
  source: string | null;
  created_at: string;
};

type Audience = "general" | "practitioner" | "executive" | "pragmatic";
const AUDIENCES: Audience[] = ["general", "practitioner", "executive", "pragmatic"];
const AUDIENCE_LABEL: Record<Audience, string> = {
  general: "General",
  practitioner: "Practitioner",
  executive: "Executive",
  pragmatic: "Operator's Cut",
};

type Draft = {
  id: string;
  chapter_id: string;
  model: string;
  draft_md: string;
  is_current: boolean;
  audience: Audience;
  created_at: string;
};

export default function BookManuscriptAdmin() {
  const { user, isLoading: sessionLoading } = useUserSession();
  const { isAdmin, isLoading: adminLoading } = useAdminStatus();

  if (sessionLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Manuscript Console</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Curate sources, upload manuscript material, synthesize chapter drafts, and watch the funnel.
          </p>
        </header>

        <Tabs defaultValue="chapters" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="batch">Batch drafting</TabsTrigger>
            <TabsTrigger value="uploads">Uploads</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters"><ChaptersTab /></TabsContent>
          <TabsContent value="batch"><BatchTab /></TabsContent>
          <TabsContent value="uploads"><UploadsTab /></TabsContent>
          <TabsContent value="sources"><SourcesTab /></TabsContent>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

/* ───────── Chapters ───────── */
function ChaptersTab() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [synth, setSynth] = useState(false);
  const [guidance, setGuidance] = useState("");
  const [audience, setAudience] = useState<Audience>("practitioner");

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("book_chapters")
      .select("*")
      .order("order_index");
    setChapters((data as Chapter[]) ?? []);
    setLoading(false);
  }, []);

  const loadDrafts = useCallback(async (chapterId: string) => {
    const { data } = await supabase
      .from("book_chapter_drafts")
      .select("*")
      .eq("chapter_id", chapterId)
      .order("created_at", { ascending: false });
    setDrafts((data as Draft[]) ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (activeChapter) loadDrafts(activeChapter.id); }, [activeChapter, loadDrafts]);

  const updateChapter = async (id: string, patch: Partial<Chapter>) => {
    const { error } = await supabase.from("book_chapters").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Chapter updated");
    load();
    if (activeChapter?.id === id) setActiveChapter({ ...activeChapter, ...patch });
  };

  const synthesize = async () => {
    if (!activeChapter) return;
    setSynth(true);
    const { data, error } = await supabase.functions.invoke("book-synthesize-chapter", {
      body: { chapter_id: activeChapter.id, audience, guidance: guidance || undefined },
    });
    setSynth(false);
    if (error) return toast.error(error.message);
    toast.success("Draft generated");
    setGuidance("");
    loadDrafts(activeChapter.id);
    load();
    void data;
  };

  const promoteDraft = async (draft: Draft) => {
    if (!activeChapter) return;
    const excerpt = draft.draft_md.slice(0, 12000);
    await updateChapter(activeChapter.id, {
      published_excerpt: excerpt,
      status: "published",
      ...(activeChapter.published_excerpt ? {} : {}),
    } as Partial<Chapter>);
    // mark published_at
    await supabase.from("book_chapters")
      .update({ published_at: new Date().toISOString() })
      .eq("id", activeChapter.id);
  };

  if (loading) return <Loader2 className="w-5 h-5 animate-spin" />;

  return (
    <div className="grid md:grid-cols-[1fr_1.4fr] gap-6">
      <div className="space-y-2">
        {chapters.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveChapter(c)}
            className={`w-full text-left p-3 rounded border transition ${
              activeChapter?.id === c.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Badge variant="outline" className="shrink-0">{c.phase}</Badge>
                <span className="font-medium truncate">{c.title}</span>
              </div>
              <Badge variant={c.status === "published" ? "default" : "secondary"} className="shrink-0">
                {c.status}
              </Badge>
            </div>
            {c.is_free_sample && <span className="text-[10px] uppercase text-primary">Free sample</span>}
          </button>
        ))}
      </div>

      <Card className="p-5 space-y-4">
        {!activeChapter ? (
          <p className="text-sm text-muted-foreground">Select a chapter to manage.</p>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold">{activeChapter.title}</h3>
              <p className="text-xs text-muted-foreground">/{activeChapter.slug}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Status</Label>
                <select
                  className="w-full h-9 rounded border border-input bg-background px-2 text-sm"
                  value={activeChapter.status}
                  onChange={(e) => updateChapter(activeChapter.id, { status: e.target.value })}
                >
                  {["outline", "drafting", "review", "published"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={activeChapter.is_free_sample}
                    onChange={(e) => updateChapter(activeChapter.id, { is_free_sample: e.target.checked })}
                  />
                  Free sample
                </label>
              </div>
            </div>

            <div>
              <Label className="text-xs">Summary</Label>
              <Textarea
                rows={3}
                value={activeChapter.summary ?? ""}
                onChange={(e) => setActiveChapter({ ...activeChapter, summary: e.target.value })}
                onBlur={() => updateChapter(activeChapter.id, { summary: activeChapter.summary })}
              />
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <Label className="text-xs">Audience voice</Label>
                  <select
                    className="block h-9 rounded border border-input bg-background px-2 text-sm"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as Audience)}
                  >
                    {AUDIENCES.map(a => <option key={a} value={a}>{AUDIENCE_LABEL[a]}</option>)}
                  </select>
                </div>
                <Button onClick={synthesize} disabled={synth} size="sm">
                  {synth ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Synthesize {AUDIENCE_LABEL[audience]} draft
                </Button>
              </div>
              <Label className="text-xs">Author guidance for the next draft (optional)</Label>
              <Textarea rows={2} value={guidance} onChange={(e) => setGuidance(e.target.value)} />
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold mb-2">Drafts ({drafts.length})</h4>
              {drafts.length === 0 && <p className="text-xs text-muted-foreground">No drafts yet.</p>}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {drafts.map(d => (
                  <details key={d.id} className="border border-border rounded p-2 text-sm">
                    <summary className="cursor-pointer flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{AUDIENCE_LABEL[d.audience] ?? d.audience}</Badge>
                        {new Date(d.created_at).toLocaleString()}
                        {d.is_current && <Badge variant="default">current</Badge>}
                      </span>
                      <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); promoteDraft(d); }}>
                        Promote → published_excerpt
                      </Button>
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground max-h-72 overflow-y-auto">
                      {d.draft_md}
                    </pre>
                  </details>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <Label className="text-xs">Published excerpt (markdown — what readers see)</Label>
              <Textarea
                rows={8}
                value={activeChapter.published_excerpt ?? ""}
                onChange={(e) => setActiveChapter({ ...activeChapter, published_excerpt: e.target.value })}
                onBlur={() => updateChapter(activeChapter.id, { published_excerpt: activeChapter.published_excerpt })}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

/* ───────── Uploads ───────── */
function UploadsTab() {
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [u, c] = await Promise.all([
      supabase.from("book_uploads").select("*").order("created_at", { ascending: false }),
      supabase.from("book_chapters").select("id, slug, title, phase, order_index, status, summary, is_free_sample, published_excerpt").order("order_index"),
    ]);
    setUploads((u.data as UploadRow[]) ?? []);
    setChapters((c.data as Chapter[]) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("book-manuscript").upload(path, file);
      if (upErr) throw upErr;
      const { data: row, error: insErr } = await supabase
        .from("book_uploads")
        .insert({ file_path: path, mime: file.type, original_name: file.name })
        .select("id")
        .maybeSingle();
      if (insErr) throw insErr;
      toast.success("Uploaded — extracting text…");
      const { error: fnErr } = await supabase.functions.invoke("book-ingest-upload", {
        body: { upload_id: row!.id },
      });
      if (fnErr) toast.error("Extraction failed: " + fnErr.message);
      else toast.success("Text extracted");
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const reextract = async (id: string) => {
    const { error } = await supabase.functions.invoke("book-ingest-upload", { body: { upload_id: id } });
    if (error) toast.error(error.message);
    else { toast.success("Re-extracted"); load(); }
  };

  const remove = async (u: UploadRow) => {
    if (!confirm("Delete this upload?")) return;
    await supabase.storage.from("book-manuscript").remove([u.file_path]);
    await supabase.from("book_uploads").delete().eq("id", u.id);
    load();
  };

  const linkChapter = async (id: string, chapter_id: string | null) => {
    await supabase.from("book_uploads").update({ chapter_id }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Label className="text-sm flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload manuscript file (pdf, docx, md, txt)
        </Label>
        <Input type="file" accept=".pdf,.docx,.md,.txt,.markdown" onChange={onUpload} disabled={busy} className="mt-2" />
      </Card>

      <div className="space-y-2">
        {uploads.map((u) => (
          <Card key={u.id} className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium truncate">{u.original_name ?? u.file_path}</span>
                  <Badge variant="outline">{u.mime ?? "?"}</Badge>
                  {u.extracted_text ? (
                    <Badge variant="default">{u.extracted_text.length.toLocaleString()} chars</Badge>
                  ) : (
                    <Badge variant="secondary">no text</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  className="h-8 rounded border border-input bg-background px-2 text-xs"
                  value={u.chapter_id ?? ""}
                  onChange={(e) => linkChapter(u.id, e.target.value || null)}
                >
                  <option value="">— no chapter —</option>
                  {chapters.map(c => <option key={c.id} value={c.id}>{c.phase} · {c.title}</option>)}
                </select>
                <Button size="sm" variant="outline" onClick={() => reextract(u.id)}>
                  <RefreshCw className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(u)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            {u.extracted_text && (
              <details className="mt-2">
                <summary className="text-xs text-muted-foreground cursor-pointer">Preview extracted text</summary>
                <pre className="mt-2 max-h-60 overflow-y-auto whitespace-pre-wrap text-xs text-muted-foreground">
                  {u.extracted_text.slice(0, 4000)}
                </pre>
              </details>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ───────── Sources ───────── */
function SourcesTab() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [form, setForm] = useState({
    chapter_id: "",
    kind: "site_page",
    ref: "",
    title: "",
    excerpt: "",
    weight: 3,
  });

  const load = useCallback(async () => {
    const [c, s] = await Promise.all([
      supabase.from("book_chapters").select("*").order("order_index"),
      supabase.from("book_sources").select("*").order("created_at", { ascending: false }),
    ]);
    setChapters((c.data as Chapter[]) ?? []);
    setSources((s.data as Source[]) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!form.chapter_id || !form.ref) return toast.error("Chapter and ref required");
    const { error } = await supabase.from("book_sources").insert(form);
    if (error) return toast.error(error.message);
    setForm({ ...form, ref: "", title: "", excerpt: "" });
    load();
  };

  const toggle = async (id: string, included: boolean) => {
    await supabase.from("book_sources").update({ included }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("book_sources").delete().eq("id", id);
    load();
  };

  const [seeding, setSeeding] = useState(false);
  const seedFromCorpus = async () => {
    setSeeding(true);
    try {
      const { fullDeck } = await import("@/data/entrepreneurialTarot");
      const { driftTools } = await import("@/data/driftTools");
      const { driftMonthlyDiscoveries } = await import("@/data/driftMonthlyDiscoveries");

      const tarot = fullDeck.map((c) => ({
        ref: `tarot:${c.id}`,
        title: `${c.name}${"suit" in c ? ` · ${c.suit}` : ""}`,
        excerpt: `${c.question}\n\nUpright: ${c.upright}\nReversed: ${c.reversed}`,
        hint: ("suit" in c ? c.suit : c.dimensionName) ?? "",
      }));

      const drift: Array<{ ref: string; title: string; excerpt: string; hint: string }> = [];
      for (const t of driftTools) {
        drift.push({ ref: `drift-tool:${t.url}`, title: t.name, excerpt: t.description, hint: t.axis });
      }
      for (const m of driftMonthlyDiscoveries) {
        const tag = `${m.year}-${m.month}${m.theme ? ` · ${m.theme}` : ""}`;
        for (const b of m.books ?? []) drift.push({ ref: `drift-book:${b.amazonUrl}`, title: `${b.title} — ${b.author}`, excerpt: `${tag}\n${b.description}`, hint: b.axis });
        for (const v of m.videos ?? []) drift.push({ ref: `drift-video:${v.youtubeId}`, title: `${v.title} — ${v.speaker}`, excerpt: `${tag}\n${v.description}`, hint: v.axis });
        for (const s of m.songs ?? []) drift.push({ ref: `drift-song:${s.url}`, title: `${s.title} — ${s.artist}`, excerpt: `${tag}\n${s.description}`, hint: s.axis });
        for (const p of m.podcasts ?? []) drift.push({ ref: `drift-pod:${p.url}`, title: `${p.title} — ${p.host}`, excerpt: `${tag}\n${p.description}`, hint: p.axis });
        for (const a of m.articles ?? []) drift.push({ ref: `drift-article:${a.url}`, title: `${a.title} — ${a.author}`, excerpt: `${tag}\n${a.description}`, hint: a.axis });
      }

      toast.message("Seeding corpus…", { description: `Deep crawl (up to 200 pages) + ingesting ${tarot.length} tarot · ${drift.length} drift items · all 64 board tiles with full ontology.` });
      const { data, error } = await supabase.functions.invoke("book-seed-from-corpus", { body: { tarot, drift, siteLimit: 200 } });
      if (error) throw error;
      const counts = (data as { counts?: Record<string, number>; inserted?: number })?.counts ?? {};
      toast.success(`Seeded ${(data as { inserted?: number })?.inserted ?? 0} sources`, {
        description: `web ${counts.web ?? 0} · tile ${counts.tile ?? 0} · tarot ${counts.tarot ?? 0} · drift ${counts.drift ?? 0}`,
      });
      load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4" /> Seed from corpus</h3>
          <p className="text-xs text-muted-foreground mt-1">Deep-crawl calm-magic.com (up to 200 pages, 6k-char excerpts) + ingest all 64 Calm Magic Board tiles with full ontology (hexagram · tzolkin · Senge · Wu-Wei · VL path · mindfulness focus) + tarot deck + Drift library. Auto-mapped to chapters by phase.</p>
        </div>
        <Button onClick={seedFromCorpus} disabled={seeding} size="sm">
          {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Seed corpus"}
        </Button>
      </Card>

      <Card className="p-4 space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Tag a source</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <select
            className="h-9 rounded border border-input bg-background px-2 text-sm"
            value={form.chapter_id}
            onChange={(e) => setForm({ ...form, chapter_id: e.target.value })}
          >
            <option value="">— chapter —</option>
            {chapters.map(c => <option key={c.id} value={c.id}>{c.phase} · {c.title}</option>)}
          </select>
          <select
            className="h-9 rounded border border-input bg-background px-2 text-sm"
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
          >
            {["site_page", "prd", "drift", "journal", "polen", "url"].map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <Input placeholder="ref (route, id, or URL)" value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} />
          <Input placeholder="title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input
            type="number" min={1} max={5}
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
          />
          <div />
        </div>
        <Textarea placeholder="excerpt or notes (optional)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
        <Button onClick={add} size="sm">Add source</Button>
      </Card>

      <div className="space-y-2">
        {sources.map((s) => {
          const chapter = chapters.find(c => c.id === s.chapter_id);
          return (
            <Card key={s.id} className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{s.kind}</Badge>
                    <Badge>{chapter?.phase ?? "?"}</Badge>
                    <span className="font-medium truncate">{s.title || s.ref}</span>
                    <span className="text-xs text-muted-foreground">w{s.weight}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{s.ref}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={s.included} onChange={(e) => toggle(s.id, e.target.checked)} />
                    in
                  </label>
                  <Button size="sm" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Leads ───────── */
function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("book_preorders")
      .select("id, email, name, interest, tier, chapter_slug, source, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    setLeads((data as Lead[]) ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const exportCsv = () => {
    const header = "created_at,email,name,interest,tier,chapter_slug,source\n";
    const rows = leads.map(l =>
      [l.created_at, l.email, l.name, l.interest ?? "", l.tier, l.chapter_slug ?? "", l.source ?? ""]
        .map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "book-leads.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = leads.filter(l =>
    !filter || [l.email, l.name, l.interest, l.tier].some(v => (v ?? "").toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input placeholder="filter…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
        <Button variant="ghost" onClick={load}><RefreshCw className="w-4 h-4" /></Button>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs text-left">
            <tr>
              <th className="p-2">When</th>
              <th className="p-2">Email</th>
              <th className="p-2">Name</th>
              <th className="p-2">Interest</th>
              <th className="p-2">Tier</th>
              <th className="p-2">Chapter</th>
              <th className="p-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-t border-border">
                <td className="p-2 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                <td className="p-2">{l.email}</td>
                <td className="p-2">{l.name}</td>
                <td className="p-2">{l.interest ?? "—"}</td>
                <td className="p-2">{l.tier}</td>
                <td className="p-2 text-xs">{l.chapter_slug ?? "—"}</td>
                <td className="p-2 text-xs text-muted-foreground">{l.source ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="text-xs text-muted-foreground">{filtered.length} of {leads.length} leads</p>
    </div>
  );
}

/* ───────── Batch drafting (parallel subagent fan-out) ───────── */
type BatchJobStatus = "pending" | "running" | "done" | "error";
type BatchCell = {
  status: BatchJobStatus;
  draft_id?: string;
  error?: string;
};

function BatchTab() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set());
  const [selectedAudiences, setSelectedAudiences] = useState<Set<Audience>>(
    new Set<Audience>(["general", "practitioner", "executive"]),
  );
  const [guidance, setGuidance] = useState("");
  const [concurrency, setConcurrency] = useState(3);
  const [running, setRunning] = useState(false);
  const [cells, setCells] = useState<Record<string, BatchCell>>({});

  useEffect(() => {
    supabase
      .from("book_chapters")
      .select("id, slug, title, phase, order_index, status, summary, is_free_sample, published_excerpt")
      .order("order_index")
      .then(({ data }) => setChapters((data as Chapter[]) ?? []));
  }, []);

  const cellKey = (chapterId: string, audience: Audience) => `${chapterId}:${audience}`;
  const toggleChapter = (id: string) => {
    const next = new Set(selectedChapters);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedChapters(next);
  };
  const toggleAudience = (a: Audience) => {
    const next = new Set(selectedAudiences);
    next.has(a) ? next.delete(a) : next.add(a);
    setSelectedAudiences(next);
  };
  const selectAllChapters = () => setSelectedChapters(new Set(chapters.map(c => c.id)));
  const clearChapters = () => setSelectedChapters(new Set());

  const runBatch = async () => {
    const chapter_ids = Array.from(selectedChapters);
    const audiences = Array.from(selectedAudiences);
    if (!chapter_ids.length || !audiences.length) {
      toast.error("Select at least one chapter and one audience");
      return;
    }
    setRunning(true);
    const initial: Record<string, BatchCell> = {};
    for (const cid of chapter_ids) for (const a of audiences) initial[cellKey(cid, a)] = { status: "running" };
    setCells(initial);

    const { data, error } = await supabase.functions.invoke("book-synthesize-batch", {
      body: {
        chapter_ids,
        audiences,
        guidance: guidance || undefined,
        concurrency,
      },
    });
    setRunning(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    const results = (data as { results?: Array<{ chapter_id: string; audience: Audience; ok: boolean; draft_id?: string; error?: string }> })?.results ?? [];
    const next: Record<string, BatchCell> = { ...initial };
    for (const r of results) {
      next[cellKey(r.chapter_id, r.audience)] = r.ok
        ? { status: "done", draft_id: r.draft_id }
        : { status: "error", error: r.error };
    }
    setCells(next);
    const summary = (data as { summary?: { succeeded: number; failed: number } })?.summary;
    if (summary) {
      toast.success(`Batch complete: ${summary.succeeded} succeeded, ${summary.failed} failed`);
    }
  };

  const audiencesArr = Array.from(selectedAudiences);

  return (
    <div className="space-y-6">
      <Card className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Parallel chapter drafting</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Fan out subagent workers across chapters and audience voices. Each cell is one independent
            draft saved to <code className="text-xs">book_chapter_drafts</code> with its own audience.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div>
            <Label className="text-xs">Audiences</Label>
            <div className="flex gap-2 mt-1">
              {AUDIENCES.map(a => (
                <label key={a} className={`px-3 py-1.5 rounded border text-sm cursor-pointer transition ${
                  selectedAudiences.has(a) ? "border-primary bg-primary/10" : "border-border"
                }`}>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedAudiences.has(a)}
                    onChange={() => toggleAudience(a)}
                  />
                  {AUDIENCE_LABEL[a]}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-xs">Concurrency</Label>
            <Input
              type="number"
              min={1}
              max={6}
              value={concurrency}
              onChange={(e) => setConcurrency(Math.max(1, Math.min(6, Number(e.target.value) || 1)))}
              className="w-20"
            />
          </div>
          <div className="flex-1 min-w-[240px]">
            <Label className="text-xs">Shared guidance (optional)</Label>
            <Input value={guidance} onChange={(e) => setGuidance(e.target.value)} placeholder="e.g. emphasize the threshold crossing" />
          </div>
          <Button onClick={runBatch} disabled={running}>
            {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Draft {selectedChapters.size} × {audiencesArr.length} = {selectedChapters.size * audiencesArr.length}
          </Button>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Chapters</h4>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={selectAllChapters}>Select all</Button>
            <Button size="sm" variant="ghost" onClick={clearChapters}>Clear</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="p-2 w-8"></th>
                <th className="p-2">Chapter</th>
                <th className="p-2">Phase</th>
                {audiencesArr.map(a => (
                  <th key={a} className="p-2">{AUDIENCE_LABEL[a]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chapters.map(c => (
                <tr key={c.id} className="border-b border-border/50">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedChapters.has(c.id)}
                      onChange={() => toggleChapter(c.id)}
                    />
                  </td>
                  <td className="p-2">
                    <div className="font-medium truncate max-w-xs">{c.title}</div>
                    <div className="text-xs text-muted-foreground">/{c.slug}</div>
                  </td>
                  <td className="p-2"><Badge variant="outline">{c.phase}</Badge></td>
                  {audiencesArr.map(a => {
                    const cell = cells[`${c.id}:${a}`];
                    if (!cell) return <td key={a} className="p-2 text-xs text-muted-foreground">—</td>;
                    if (cell.status === "running")
                      return <td key={a} className="p-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /></td>;
                    if (cell.status === "done")
                      return <td key={a} className="p-2"><Badge variant="default" className="text-[10px]">done</Badge></td>;
                    if (cell.status === "error")
                      return <td key={a} className="p-2"><Badge variant="destructive" className="text-[10px]" title={cell.error}>error</Badge></td>;
                    return <td key={a} className="p-2 text-xs text-muted-foreground">pending</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
