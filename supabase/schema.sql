-- Hospital Portal: Phase 1 schema (Supabase SQL Editor mein run karein)

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  role text not null default 'nurse' check (role in ('admin','hr','doctor','nurse')),
  department text,
  designation text,
  phone text,
  salary_basic numeric(12,2) default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  status text not null default 'present' check (status in ('present','late')),
  created_at timestamptz not null default now(),
  unique (user_id, work_date)
);

-- Helper: kya current user admin ya HR hai?
create or replace function public.is_manager()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','hr') and active = true
  );
$$;

-- Naya auth user banay to profile khud ban jaye
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, department, designation, phone)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'nurse'),
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'designation',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.attendance enable row level security;

create policy "profiles: apna ya manager" on public.profiles
  for select using (auth.uid() = id or public.is_manager());
create policy "profiles: manager update" on public.profiles
  for update using (public.is_manager());

create policy "attendance: apni ya manager" on public.attendance
  for select using (user_id = auth.uid() or public.is_manager());
create policy "attendance: apni insert" on public.attendance
  for insert with check (user_id = auth.uid());
create policy "attendance: apni update" on public.attendance
  for update using (user_id = auth.uid());
