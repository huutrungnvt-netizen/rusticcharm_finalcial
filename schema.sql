-- Enable extension for UUID generation
create extension if not exists "pgcrypto";

-- =========================================
-- Table: profiles
-- =========================================
-- Not used yet (no login flow wired up). Kept ready for when auth is added.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Profiles are deletable by owner"
  on public.profiles for delete
  using (auth.uid() = id);

-- =========================================
-- Table: categories
-- =========================================
-- TEMPORARY: no login flow yet, so user_id has no FK to auth.users and RLS
-- is disabled — the anon key can read/write freely. Run migrations/001_enable_auth.sql
-- once login is wired up to lock this back down per-user.
-- Only used for EXPENSE transactions now — INCOME uses product_type instead (see below).
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  type text not null check (type in ('INCOME', 'EXPENSE')),
  icon text,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories (user_id);

alter table public.categories disable row level security;

-- =========================================
-- Table: transactions
-- =========================================
-- TEMPORARY: same as categories above — open access until auth is added back.
-- EXPENSE rows use category_id + amount (entered directly).
-- INCOME rows use order_code/product_type/unit_price/quantity/discount/extra_fee,
-- with amount computed server-side as unit_price * quantity - discount - extra_fee.
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  type text not null check (type in ('INCOME', 'EXPENSE')),
  category_id uuid references public.categories (id) on delete set null,
  order_code text,
  product_type text check (product_type in ('Mơ', 'Mận', 'Táo mèo')),
  unit_price numeric,
  quantity numeric,
  discount numeric not null default 0,
  extra_fee numeric not null default 0,
  amount numeric not null,
  transaction_date date not null default current_date,
  note text,
  payment_method text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_category_id_idx on public.transactions (category_id);
create index if not exists transactions_type_idx on public.transactions (type);

alter table public.transactions disable row level security;
