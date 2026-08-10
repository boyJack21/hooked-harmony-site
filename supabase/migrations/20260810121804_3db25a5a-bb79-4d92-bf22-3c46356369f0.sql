create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

grant insert on public.newsletter to anon, authenticated;
grant select on public.newsletter to authenticated;
grant all on public.newsletter to service_role;

alter table public.newsletter enable row level security;

create policy "Anyone can subscribe"
on public.newsletter
for insert to anon, authenticated
with check (true);

create policy "Signed-in users can view subscribers"
on public.newsletter
for select to authenticated
using (true);

create table if not exists public.patterns (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  difficulty text,
  yardage text,
  gauge text,
  tool text,
  yarn text,
  description text,
  is_featured boolean default false,
  emoji text,
  tone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.patterns to anon, authenticated;
grant all on public.patterns to service_role;

alter table public.patterns enable row level security;

create policy "Public read patterns"
on public.patterns
for select to anon, authenticated
using (true);

create table if not exists public.tutorials (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  technique text,
  level text,
  minutes integer,
  emoji text,
  tone text,
  created_at timestamptz not null default now()
);

grant select on public.tutorials to anon, authenticated;
grant all on public.tutorials to service_role;

alter table public.tutorials enable row level security;

create policy "Public read tutorials"
on public.tutorials
for select to anon, authenticated
using (true);

create table if not exists public.makers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  specialty text,
  bio text,
  website text,
  initials text,
  tone text,
  created_at timestamptz not null default now()
);

grant select on public.makers to anon, authenticated;
grant all on public.makers to service_role;

alter table public.makers enable row level security;

create policy "Public read makers"
on public.makers
for select to anon, authenticated
using (true);