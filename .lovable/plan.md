## Goal

Make the `map-question-to-board` edge function response provably safe: the model can never inject arbitrary content into the response, and no DB column beyond a tight allowlist can ever leak — even if upstream code changes later.

## Scope

Single file: `supabase/functions/map-question-to-board/index.ts`.
No client changes; the response shape stays compatible with `ResonanceMapData` in `src/lib/resonance.ts`.

## Allowlist contract

The function will only ever respond with this exact shape (anything else is dropped):

```ts
{
  question: string,                       // sanitized echo of user input
  axes: Array<{
    axis: "MAGIC" | "LOVE" | "CALM" | "OPEN" | "FREE",
    score: number,                        // integer 0..100
    rationale: string,                    // ≤ 240 chars, plain text
    tile_hints: string[],                 // ≤ 3 items, each ≤ 80 chars, plain text
    tiles: Array<{ id: number, prompt: string }>  // from our `tiles` table only
  }>
}
```

Always exactly 5 axes, in fixed order. Missing axes from the model are filled with score 0 and empty arrays.

## Implementation

### 1. Tool-call argument validation (model output)

Replace the loose `JSON.parse(...) as { axes: ... }` cast with a strict validator.

```ts
const ALLOWED_AXES = new Set(AXES);

function parseModelArgs(raw: string) {
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return null; }
  if (!parsed || typeof parsed !== "object") return null;
  const axesRaw = (parsed as Record<string, unknown>).axes;
  if (!Array.isArray(axesRaw)) return null;

  const out = new Map<Axis, {
    score: number; rationale: string; tile_hints: string[];
  }>();

  for (const item of axesRaw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const axis = typeof o.axis === "string" ? o.axis.toUpperCase() : "";
    if (!ALLOWED_AXES.has(axis as Axis)) continue;            // drop unknown
    const score = clampScore(o.score);
    const rationale = sanitizeText(o.rationale, 240);
    const hintsRaw = Array.isArray(o.tile_hints) ? o.tile_hints : [];
    const tile_hints = hintsRaw
      .slice(0, 3)
      .map((h) => sanitizeText(h, 80))
      .filter(Boolean);
    out.set(axis as Axis, { score, rationale, tile_hints });
  }
  return out;
}
```

Helpers (already planned in the previous step, repeated here for clarity):

```ts
function sanitizeText(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s
    .replace(/[\u0000-\u001F\u007F]/g, " ")  // control chars
    .replace(/<[^>]*>/g, "")                 // strip HTML/script
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}
```

If `parseModelArgs` returns `null` → respond `502 { error: "Mapping failed." }`. Detail goes to `console.error` only.

### 2. Tile lookup — allowlist columns explicitly

Tighten the existing query and shape:

```ts
const { data: tilesRows } = await supabase
  .from("tiles")
  .select("id, board, short_prompt");   // already only these 3 — keep as the explicit allowlist
```

When building `tiles` for the response, only emit `{ id: number, prompt: string }`. Never spread the row.

```ts
matched.push({ id: Number(tile.id), prompt: sanitizeText(tile.prompt, 200) });
```

This guarantees that even if the `tiles` table later gains sensitive columns (e.g., internal notes, draft content), they cannot leak through this endpoint.

### 3. Final response — built from scratch

Replace the current spread-style return with a fully reconstructed object:

```ts
const safeAxes = AXES.map((axis) => {
  const m = parsedAxes.get(axis) ?? { score: 0, rationale: "", tile_hints: [] };
  const matched = matchTiles(axis, m.tile_hints);  // existing token-overlap logic
  return {
    axis,
    score: m.score,
    rationale: m.rationale,
    tile_hints: m.tile_hints,
    tiles: matched,
  };
});

return new Response(
  JSON.stringify({ question: sanitizedQuestion, axes: safeAxes }),
  { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
);
```

No `...spread` of model data anywhere. No DB row spread. Everything is field-by-field copying.

### 4. Generic error surface

Catch-all returns `{ error: "Mapping failed." }` with status `500`. Existing 400 / 402 / 429 passthroughs preserved. Internal details only via `console.error`.

## What this guarantees

- Model cannot inject extra keys (e.g., `__proto__`, `system`, `internal_notes`) into the response — they are not in the allowlist and are dropped.
- Model cannot inject HTML / scripts into rationale or hints — sanitized.
- Model cannot inflate scores above 100 or set non-numeric scores — clamped.
- Model cannot fabricate tile IDs or prompts — those come from our `tiles` table by token-overlap matching, never from the model.
- Future additions to the `tiles` table cannot accidentally leak — the response builder explicitly emits only `{ id, prompt }`.

## Out of scope

- Rate limiting (covered by separate previous plan).
- Auth requirement (Learn module is intentionally anonymous).
- Frontend changes — `ResonanceMapData` already matches this allowlist shape.
