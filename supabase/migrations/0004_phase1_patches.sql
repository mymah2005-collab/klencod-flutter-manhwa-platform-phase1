-- 0004: Phase 1 patches. Run after 0001-0003 and before seed.sql.

-- 1. Create a profile automatically when a user signs up.
--    Without this, signups succeed in Auth but the app has no profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'username', ''),
      'user_' || substr(replace(new.id::text, '-', ''), 1, 12)
    ),
    nullif(new.raw_user_meta_data ->> 'display_name', '')
  );
  return new;
end;
$$;

-- Trigger functions should never be callable through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. RLS policies call these helpers while running as anon or authenticated.
--    0002 revoked EXECUTE from anon on all functions, so public policies
--    (such as reading published works) could fail with "permission denied".
grant execute on function
  public.is_global_owner(),
  public.is_admin(),
  public.is_staff_or_admin(),
  public.is_active_user(),
  public.has_team_permission(uuid, text)
to anon, authenticated;

-- 3. Public bucket for site assets (the logo). Anyone can read it through
--    the public URL. Only admins and the owner can write to it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-assets', 'site-assets', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "site-assets: admins insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site-assets' and public.is_admin());

create policy "site-assets: admins update" on storage.objects
  for update to authenticated
  using (bucket_id = 'site-assets' and public.is_admin());

create policy "site-assets: admins delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-assets' and public.is_admin());
