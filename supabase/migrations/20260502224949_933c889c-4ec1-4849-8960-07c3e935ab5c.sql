create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  session_id text,
  user_id uuid,
  path text,
  referrer text,
  created_at timestamptz not null default now()
);

create index analytics_events_event_name_created_at_idx
  on public.analytics_events (event_name, created_at desc);

alter table public.analytics_events enable row level security;

create policy "anyone can insert analytics events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

create policy "admins can read analytics events"
  on public.analytics_events for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));