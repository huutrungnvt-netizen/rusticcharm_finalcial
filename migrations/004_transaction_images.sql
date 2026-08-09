-- Run this in the Supabase SQL Editor.
-- Adds an image attachment to each transaction (both INCOME and EXPENSE),
-- and a storage bucket to hold the uploaded files. Read access is public
-- (simplest way to serve images by URL); write access requires being
-- logged in, consistent with the rest of the app's RLS.

alter table public.transactions add column if not exists image_url text;

insert into storage.buckets (id, name, public)
values ('transaction-images', 'transaction-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read access for transaction images" on storage.objects;
create policy "Public read access for transaction images"
  on storage.objects for select
  using (bucket_id = 'transaction-images');

drop policy if exists "Authenticated users can upload transaction images" on storage.objects;
create policy "Authenticated users can upload transaction images"
  on storage.objects for insert
  with check (bucket_id = 'transaction-images' and auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete transaction images" on storage.objects;
create policy "Authenticated users can delete transaction images"
  on storage.objects for delete
  using (bucket_id = 'transaction-images' and auth.role() = 'authenticated');
