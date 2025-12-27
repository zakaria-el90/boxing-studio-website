-- Phase 2: Members table and basic RLS policies for Supabase.
-- Adjust policies to match your admin role strategy.

create table if not exists public.members (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    status text not null check (status in ('Active', 'Paused', 'Inactive')),
    plan text not null,
    payment_status text not null check (payment_status in ('Up to Date', 'Needs Follow-up', 'Past Due')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.members enable row level security;
-- Create the authenticated role
CREATE ROLE authenticated;
-- Allow authenticated admins to read/write members.
-- Replace this with role-based checks if you use custom claims.
create policy "Members are readable by authenticated users"
    on public.members
    for select
    to authenticated
    using (true);

create policy "Members are writable by authenticated users"
    on public.members
    for insert
    to authenticated
    with check (true);

create policy "Members are updatable by authenticated users"
    on public.members
    for update
    to authenticated
    using (true);
