-- Run this in the Supabase SQL Editor to bring an existing project's
-- transactions table in line with the updated schema.sql:
-- INCOME transactions now capture order_code / product_type / unit_price /
-- quantity / discount / extra_fee instead of a category, with amount
-- computed as unit_price * quantity - discount - extra_fee.
-- EXPENSE transactions are unchanged (still use category_id + amount).

alter table public.transactions add column if not exists type text;

update public.transactions t
set type = c.type
from public.categories c
where t.category_id = c.id and t.type is null;

update public.transactions set type = 'EXPENSE' where type is null;

alter table public.transactions alter column type set not null;

alter table public.transactions drop constraint if exists transactions_type_check;
alter table public.transactions
  add constraint transactions_type_check
  check (type in ('INCOME', 'EXPENSE'));

alter table public.transactions add column if not exists order_code text;
alter table public.transactions add column if not exists product_type text;

alter table public.transactions drop constraint if exists transactions_product_type_check;
alter table public.transactions
  add constraint transactions_product_type_check
  check (product_type in ('Mơ', 'Mận', 'Táo mèo'));

alter table public.transactions add column if not exists unit_price numeric;
alter table public.transactions add column if not exists quantity numeric;
alter table public.transactions add column if not exists discount numeric not null default 0;
alter table public.transactions add column if not exists extra_fee numeric not null default 0;

create index if not exists transactions_type_idx on public.transactions (type);
