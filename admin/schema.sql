-- ===========================================================================
-- QV fits — admin console backend
--
-- Paste this whole file into the Supabase SQL editor and run it once.
-- Supabase project → SQL Editor → New query → paste → Run.
--
-- It creates: one table holding the whole editable site as a single JSON
-- document, an allowlist of who may edit it, and a public bucket for photos.
-- ===========================================================================


-- ---------------------------------------------------------------- the data
-- One row, id = 1. Everything the shop can edit lives in `doc` as JSON:
-- products, prices, delivery fees, opening time, offers. One row means a save
-- is atomic — the site can never read half an update.
create table if not exists public.site (
  id         int primary key default 1,
  doc        jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  constraint site_single_row check (id = 1)
);

insert into public.site (id, doc) values (1, '{}'::jsonb)
on conflict (id) do nothing;


-- ---------------------------------------------------------------- who may edit
-- Being signed in is not enough — the account has to be listed here. If email
-- signups are ever switched on by accident, a stranger still cannot write.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email   text,
  added_at timestamptz not null default now()
);


-- ---------------------------------------------------------------- policies
alter table public.site   enable row level security;
alter table public.admins enable row level security;

-- Anyone may read the shop. This is a public website.
drop policy if exists site_public_read on public.site;
create policy site_public_read
  on public.site for select
  using (true);

-- Only a listed admin may change it.
drop policy if exists site_admin_write on public.site;
create policy site_admin_write
  on public.site for update
  using    (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- An admin may see the admin list (so the console can confirm who is signed
-- in). Nobody can change it from the browser — add people in the dashboard.
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read
  on public.admins for select
  using (auth.uid() = user_id);


-- ---------------------------------------------------------------- stamp
create or replace function public.touch_site() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end $$;

drop trigger if exists site_touch on public.site;
create trigger site_touch before update on public.site
  for each row execute function public.touch_site();


-- ---------------------------------------------------------------- photos
-- Public read so the website can show them; writes only from a listed admin.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write
  on storage.objects for insert
  with check (bucket_id = 'media'
              and exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists media_admin_update on storage.objects;
create policy media_admin_update
  on storage.objects for update
  using (bucket_id = 'media'
         and exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists media_admin_delete on storage.objects;
create policy media_admin_delete
  on storage.objects for delete
  using (bucket_id = 'media'
         and exists (select 1 from public.admins a where a.user_id = auth.uid()));


-- ===========================================================================
-- AFTER RUNNING THIS
--
-- 1. Authentication → Providers → Email: turn ON "Confirm email" and turn
--    OFF "Enable sign ups". Nobody should be able to create their own login.
--
-- 2. Authentication → Users → "Add user" → her email, set a password,
--    tick "Auto confirm user". Give her the password privately and tell her
--    to change it on first sign-in.
--
-- 3. Copy her new user's UID from that same screen, then run:
--
--       insert into public.admins (user_id, email)
--       values ('PASTE-HER-UID-HERE', 'her@email.com');
--
--    Until that row exists she can sign in but cannot save anything.
--
-- 4. Settings → API: copy the Project URL and the `anon` public key into
--    js/admin-config.js. The anon key is meant to be public and is safe in
--    the site. NEVER put the `service_role` key anywhere near it.
-- ===========================================================================
