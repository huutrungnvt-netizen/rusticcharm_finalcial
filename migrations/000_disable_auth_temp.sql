-- Run this ONLY if you already executed the original schema.sql (the one with
-- RLS policies and user_id references auth.users) against your Supabase project.
-- It brings an existing database in line with the no-auth-yet version of schema.sql.
-- Safe to skip if this is a brand-new project — just run schema.sql directly.

alter table public.categories drop constraint if exists categories_user_id_fkey;
alter table public.categories alter column user_id drop not null;
alter table public.categories disable row level security;

drop policy if exists "Categories are viewable by owner" on public.categories;
drop policy if exists "Categories are insertable by owner" on public.categories;
drop policy if exists "Categories are updatable by owner" on public.categories;
drop policy if exists "Categories are deletable by owner" on public.categories;

alter table public.transactions drop constraint if exists transactions_user_id_fkey;
alter table public.transactions alter column user_id drop not null;
alter table public.transactions disable row level security;

drop policy if exists "Transactions are viewable by owner" on public.transactions;
drop policy if exists "Transactions are insertable by owner" on public.transactions;
drop policy if exists "Transactions are updatable by owner" on public.transactions;
drop policy if exists "Transactions are deletable by owner" on public.transactions;
