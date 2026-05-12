// Admin-only: extract text from a file already uploaded to the
// `book-manuscript` storage bucket and save it to book_uploads.extracted_text.
// Supported: text/plain, text/markdown, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document (docx).

import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  upload_id: z.string().uuid(),
});

async function extractText(bytes: Uint8Array, mime: string, name: string): Promise<string> {
  const lower = (mime || "").toLowerCase();
  const ext = (name.split(".").pop() || "").toLowerCase();

  if (lower.startsWith("text/") || ext === "txt" || ext === "md" || ext === "markdown") {
    return new TextDecoder("utf-8").decode(bytes);
  }

  if (lower === "application/pdf" || ext === "pdf") {
    try {
      const { extractText: extractPdfText, getDocumentProxy } = await import(
        "https://esm.sh/unpdf@0.12.1"
      );
      const pdf = await getDocumentProxy(bytes);
      const { text } = await extractPdfText(pdf, { mergePages: true });
      return Array.isArray(text) ? text.join("\n\n") : String(text ?? "");
    } catch (e) {
      console.error("pdf extract failed", e);
      throw new Error("Failed to extract PDF text: " + (e as Error).message);
    }
  }

  if (
    lower.includes("officedocument.wordprocessingml") ||
    ext === "docx"
  ) {
    try {
      const mammoth = await import("https://esm.sh/mammoth@1.8.0?bundle");
      const buffer = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      );
      const result = await (mammoth as any).extractRawText({ arrayBuffer: buffer });
      return result?.value ?? "";
    } catch (e) {
      console.error("docx extract failed", e);
      throw new Error("Failed to extract DOCX text: " + (e as Error).message);
    }
  }

  // Best effort: try to decode as utf-8
  try {
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    throw new Error(`Unsupported file type: ${mime || ext || "unknown"}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );
    const { data: userData } = await supabaseUser.auth.getUser();
    const user = userData.user;
    if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: roleCheck } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!roleCheck) {
      return new Response("Forbidden", { status: 403, headers: corsHeaders });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { upload_id } = parsed.data;

    const { data: upload, error: upErr } = await supabase
      .from("book_uploads")
      .select("id, file_path, mime, original_name")
      .eq("id", upload_id)
      .maybeSingle();

    if (upErr || !upload) {
      return new Response(JSON.stringify({ error: "Upload not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: file, error: dlErr } = await supabase.storage
      .from("book-manuscript")
      .download(upload.file_path);
    if (dlErr || !file) {
      return new Response(JSON.stringify({ error: dlErr?.message ?? "Download failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    const text = await extractText(bytes, upload.mime ?? "", upload.original_name ?? "");
    const trimmed = text.replace(/\u0000/g, "").slice(0, 200_000);

    const { error: updErr } = await supabase
      .from("book_uploads")
      .update({ extracted_text: trimmed })
      .eq("id", upload_id);

    if (updErr) {
      return new Response(JSON.stringify({ error: updErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ ok: true, length: trimmed.length, preview: trimmed.slice(0, 500) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
