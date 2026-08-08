-- Run this AFTER creating your login user in Supabase Dashboard
-- (Authentication → Users → Add User → email nguyenhuutrung@rusticcharm.local,
-- your password, toggle "Auto Confirm User" on → Create user).
--
-- Copy the "User UID" shown for that user and replace every occurrence of
-- '<AUTH_USER_ID>' below with it, then run the whole script.
--
-- This backfills existing rows (currently owned by nobody, since the app had
-- no login yet) to your account, then locks the tables down so only that
-- account can read/write them — supersedes migrations/001_enable_auth.sql,
-- which only had the second half.

update public.categories set user_id = '<AUTH_USER_ID>' where user_id is null;
update public.transactions set user_id = '<AUTH_USER_ID>' where user_id is null;

alter table public.categories alter column user_id set default auth.uid();
alter table public.categories alter column user_id set not null;
alter table public.categories
  add constraint categories_user_id_fkey foreign key (user_id)
  references auth.users (id) on delete cascade;

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

alter table public.transactions alter column user_id set default auth.uid();
alter table public.transactions alter column user_id set not null;
alter table public.transactions
  add constraint transactions_user_id_fkey foreign key (user_id)
  references auth.users (id) on delete cascade;

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
