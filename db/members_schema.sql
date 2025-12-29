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
    role text not null check (role in ('admin', 'staff'))
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
              and profiles.role in ('admin', 'staff'))
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

create table if not exists public.audit_logs
(
    id         uuid primary key default gen_random_uuid(),
    actor_id   uuid             not null references auth.users (id) on delete cascade,
    actor_role text             not null check (actor_role in ('admin', 'staff')),
    action     text             not null,
    entity     text             not null,
    metadata   jsonb            not null default '{}'::jsonb,
    created_at timestamptz      not null default now()
);

alter table public.audit_logs
    enable row level security;

create policy "Staff can insert audit logs"
    on public.audit_logs
    for insert
    with check (
    exists (select 1
            from public.profiles
            where profiles.id = auth.uid()
              and profiles.role in ('admin', 'staff'))
    );

create policy "Admins can read audit logs"
    on public.audit_logs
    for select
    using (
    exists (select 1
            from public.profiles
            where profiles.id = auth.uid()
              and profiles.role = 'admin')
    );

insert into public.profiles (id, role)
values ('USER_ID_HERE', 'admin');
