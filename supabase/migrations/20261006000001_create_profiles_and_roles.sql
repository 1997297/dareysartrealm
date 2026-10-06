-- DAREY'S ARTREALM — PHASE 7A: IDENTITY, PROFILES & ROLE-BASED ACCESS CONTROL
-- Migration: 20261006000001_create_profiles_and_roles.sql
-- Description: Establishes public.profiles linked to auth.users, row-level security,
--              automatic profile provisioning trigger, and security-definer role helpers.

-- 1. Create Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  display_name text,
  phone text,
  avatar_url text,
  role text not null default 'collector' check (role in ('collector', 'admin')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  country text,
  city text,
  preferred_contact_method text default 'email' check (preferred_contact_method in ('email', 'whatsapp', 'phone')),
  address_line1 text,
  state_region text,
  postal_code text,
  delivery_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookup by email and role
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_role on public.profiles(role);

-- 2. Security Definer Helper Functions
-- Used in RLS policies to safely verify administrator privileges without recursive policy evaluation.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

-- 3. Automatic updated_at Timestamp Trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 4. Automatic Profile Creation Trigger on Auth User Signup
-- Extracts user metadata from signup payload while enforcing strict role = 'collector'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_first_name text;
  v_last_name text;
  v_phone text;
  v_display_name text;
begin
  v_first_name := coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1));
  v_last_name := coalesce(new.raw_user_meta_data->>'last_name', 'Collector');
  v_phone := new.raw_user_meta_data->>'phone';
  v_display_name := trim(v_first_name || ' ' || v_last_name);

  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    display_name,
    phone,
    role,
    status
  )
  values (
    new.id,
    new.email,
    v_first_name,
    v_last_name,
    v_display_name,
    v_phone,
    'collector', -- STRICT: Never allow self-assigned administrator role
    'active'
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

-- Drop trigger if it already exists to ensure idempotency
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Row Level Security (RLS) Configuration
alter table public.profiles enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Collectors can view own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Collectors can update own profile fields" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;

-- Policy A: Collectors can only view their own profile
create policy "Collectors can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy B: Verified active Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles
  for select
  using (public.is_admin());

-- Policy C: Collectors can update their own profile EXCEPT role and status
-- Prevents role escalation attacks: with check enforces existing role & status must remain unchanged.
create policy "Collectors can update own profile fields"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and status = (select p.status from public.profiles p where p.id = auth.uid())
  );

-- Policy D: Admins can update any profile including roles and status
create policy "Admins can update all profiles"
  on public.profiles
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Note: Anonymous users (not logged in) have zero access to profiles table (denied by default).

-- ==============================================================================
-- SAFE ADMIN PROMOTION INSTRUCTIONS (FOR STUDIO OWNER / DATABASE ADMINISTRATOR):
-- To promote an authenticated user to administrator, execute the following SQL in the
-- Supabase SQL Editor using project owner privileges:
--
--   UPDATE public.profiles
--   SET role = 'admin', status = 'active'
--   WHERE email = 'studio@dareysartrealm.com';
-- ==============================================================================
