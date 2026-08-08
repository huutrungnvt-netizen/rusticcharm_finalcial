-- Run this LATER, once login is implemented and every existing row has been
-- backfilled with a real user_id (UPDATE ... SET user_id = '<your-auth-user-id>'
-- WHERE user_id IS NULL, for both tables) — the NOT NULL constraint below will
-- fail otherwise.

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
