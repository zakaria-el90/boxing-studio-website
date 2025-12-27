-- This schema is intended for Supabase.
-- It relies on Supabase Auth (auth.users, auth.uid()).
-- Do NOT run on plain PostgreSQL.


create table if not exists public.members
(
    id             uuid primary key     default gen_random_uuid(),
    full_name      text        not null,
    status         text        not null check (status in ('Active', 'Paused', 'Inactive')),
    plan           text        not null,
    payment_status text        not null check (payment_status in ('Up to Date', 'Needs Follow-up', 'Past Due')),
    created_at     timestamptz not null default now(),
    updated_at     timestamptz not null default now()
);

alter table public.members
    enable row level security;

--
create table public.profiles
(
    id   uuid primary key references auth.users (id) on delete cascade,
    role text not null check (role in ('admin'))
);

alter table public.profiles
    enable row level security;


create policy "Admins can read members"
    on public.members
    for select
    using (
    exists (select 1
            from public.profiles
            where profiles.id = auth.uid()
              and profiles.role = 'admin')
    );


create policy "Admins can insert members"
    on public.members
    for insert
    with check (
    exists (select 1
            from public.profiles
            where profiles.id = auth.uid()
              and profiles.role = 'admin')
    );


create policy "Admins can update members"
    on public.members
    for update
    using (
    exists (select 1
            from public.profiles
            where profiles.id = auth.uid()
              and profiles.role = 'admin')
    );

insert into public.profiles (id, role)
values ('USER_ID_HERE', 'admin');
