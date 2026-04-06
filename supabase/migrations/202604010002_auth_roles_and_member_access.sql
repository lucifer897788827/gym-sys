alter table public.members
  add column if not exists auth_user_id uuid unique references auth.users(id) on delete set null;

alter table public.users drop constraint if exists users_role_check;
update public.users
set role = 'staff'
where role in ('manager', 'coach');
alter table public.users add constraint users_role_check check (role in ('owner', 'staff'));

create index if not exists members_auth_user_id_idx on public.members (auth_user_id);

create or replace function public.is_internal_user_for_gym(target_gym_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and gym_id = target_gym_id
      and role in ('owner', 'staff')
  );
$$;

grant execute on function public.is_internal_user_for_gym(uuid) to anon, authenticated;

alter table public.users enable row level security;
alter table public.members enable row level security;
alter table public.member_subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.attendance_logs enable row level security;

drop policy if exists users_same_gym_read on public.users;
create policy users_same_gym_read on public.users
  for select
  to authenticated
  using (public.is_internal_user_for_gym(users.gym_id));

drop policy if exists members_same_gym_or_self_read on public.members;
create policy members_same_gym_or_self_read on public.members
  for select
  to authenticated
  using (public.is_internal_user_for_gym(members.gym_id) or members.auth_user_id = auth.uid());

drop policy if exists member_subscriptions_same_gym_read on public.member_subscriptions;
create policy member_subscriptions_same_gym_read on public.member_subscriptions
  for select
  to authenticated
  using (public.is_internal_user_for_gym(member_subscriptions.gym_id));

drop policy if exists payments_same_gym_read on public.payments;
create policy payments_same_gym_read on public.payments
  for select
  to authenticated
  using (public.is_internal_user_for_gym(payments.gym_id));

drop policy if exists attendance_logs_same_gym_read on public.attendance_logs;
create policy attendance_logs_same_gym_read on public.attendance_logs
  for select
  to authenticated
  using (public.is_internal_user_for_gym(attendance_logs.gym_id));
