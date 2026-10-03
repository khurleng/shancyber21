-- Public content, with writes limited to explicitly appointed administrators.
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
create policy "Read own admin membership" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create table public.posts (
  id text primary key default gen_random_uuid()::text,
  title text not null check (char_length(trim(title)) between 1 and 200),
  date text not null default to_char(current_date, 'FMMonth FMDD, YYYY'),
  excerpt text not null check (char_length(trim(excerpt)) between 1 and 2000),
  content text[] not null default '{}',
  image text not null default '/img/hero.png',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id text primary key default gen_random_uuid()::text,
  title text not null check (char_length(trim(title)) between 1 and 200),
  description text not null check (char_length(trim(description)) between 1 and 2000),
  "buttonText" text not null default 'View' check (char_length("buttonText") between 1 and 40),
  image text not null default '/img/hero.png',
  link text not null check (link ~ '^https?://'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger posts_updated before update on public.posts
  for each row execute function public.touch_updated_at();
create trigger products_updated before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.posts enable row level security;
alter table public.products enable row level security;
revoke all on public.posts, public.products from anon, authenticated;
grant select on public.posts, public.products to anon, authenticated;
grant insert, update, delete on public.posts, public.products to authenticated;
create policy "Public posts" on public.posts for select to anon, authenticated using (true);
create policy "Public products" on public.products for select to anon, authenticated using (true);
create policy "Admin writes posts" on public.posts for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create policy "Admin writes products" on public.products for all to authenticated
  using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
  with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));
create index posts_created_at_idx on public.posts (created_at desc);
create index products_created_at_idx on public.products (created_at desc);
