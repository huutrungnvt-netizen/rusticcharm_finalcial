-- Enable extension for UUID generation
create extension if not exists "pgcrypto";

-- =========================================
-- Table: profiles
-- =========================================
-- Not currently used by the app (no profile UI), but kept ready in case a
-- display-name/settings feature is added later.
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
-- Only used for EXPENSE transactions — INCOME uses product_type instead (see below).
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('INCOME', 'EXPENSE')),
  icon text,
  created_at timestamptz not null default now()
);

create index if not exists categories_user_id_idx on public.categories (user_id);

alter table public.categories enable row level security;

create policy "Categories are viewable by owner"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Categories are insertable by owner"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Categories are updatable by owner"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Categories are deletable by owner"
  on public.categories for delete
  using (auth.uid() = user_id);

-- =========================================
-- Table: transactions
-- =========================================
-- EXPENSE rows use category_id + amount (entered directly).
-- INCOME rows use order_code/product_type/unit_price/quantity/discount/extra_fee,
-- with amount computed server-side as unit_price * quantity - discount - extra_fee.
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
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
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on public.transactions (user_id);
create index if not exists transactions_category_id_idx on public.transactions (category_id);
create index if not exists transactions_type_idx on public.transactions (type);

alter table public.transactions enable row level security;

create policy "Transactions are viewable by owner"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Transactions are insertable by owner"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Transactions are updatable by owner"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Transactions are deletable by owner"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- =========================================
-- Storage: transaction-images bucket
-- =========================================
-- Holds images attached to transactions. Public read (served by URL);
-- upload/delete require an authenticated session.
insert into storage.buckets (id, name, public)
values ('transaction-images', 'transaction-images', true)
on conflict (id) do nothing;

create policy "Public read access for transaction images"
  on storage.objects for select
  using (bucket_id = 'transaction-images');

create policy "Authenticated users can upload transaction images"
  on storage.objects for insert
  with check (bucket_id = 'transaction-images' and auth.role() = 'authenticated');

create policy "Authenticated users can delete transaction images"
  on storage.objects for delete
  using (bucket_id = 'transaction-images' and auth.role() = 'authenticated');
