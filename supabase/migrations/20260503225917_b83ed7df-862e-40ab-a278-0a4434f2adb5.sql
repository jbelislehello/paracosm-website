create table public.dream_runs (
  id uuid primary key default gen_random_uuid(),
  share_slug text unique not null default replace(replace(replace(encode(gen_random_bytes(9), 'base64'), '+', '-'), '/', '_'), '=', ''),
  user_id uuid,
  question text not null,
  filename text,
  axes jsonb not null default '[]'::jsonb,
  summary text,
  overall_maturity jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create index dream_runs_share_slug_idx on public.dream_runs(share_slug);
create index dream_runs_user_id_idx on public.dream_runs(user_id);

alter table public.dream_runs enable row level security;

create policy "Anyone can read public dream runs"
  on public.dream_runs for select
  using (is_public = true);

create policy "Owners can read own dream runs"
  on public.dream_runs for select
  using (auth.uid() = user_id);

create policy "Anyone can insert dream runs"
  on public.dream_runs for insert
  with check (user_id is null or auth.uid() = user_id);

create policy "Owners can update own dream runs"
  on public.dream_runs for update
  using (auth.uid() = user_id);

create policy "Owners can delete own dream runs"
  on public.dream_runs for delete
  using (auth.uid() = user_id);