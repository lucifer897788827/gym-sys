create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  phone text,
  whatsapp_phone text,
  city text,
  timezone text not null default 'Asia/Calcutta',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger gyms_set_updated_at
before update on public.gyms
for each row execute function public.set_updated_at();

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  gym_id uuid not null references public.gyms (id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('owner', 'manager', 'coach', 'staff')),
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id),
  unique (gym_id, email)
);

create index users_gym_id_idx on public.users (gym_id);

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  created_by_user_id uuid,
  full_name text not null,
  phone text not null,
  source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'visited', 'converted', 'lost')),
  notes text,
  last_contacted_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id),
  unique (gym_id, phone)
);

alter table public.leads
  add constraint leads_created_by_user_id_fkey
  foreign key (gym_id, created_by_user_id)
  references public.users (gym_id, id)
  on delete no action;

create index leads_gym_id_status_idx on public.leads (gym_id, status);
create index leads_gym_id_last_contacted_at_idx on public.leads (gym_id, last_contacted_at desc);

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  lead_id uuid unique,
  full_name text not null,
  phone text not null,
  email text,
  date_of_birth date,
  joined_at date not null default current_date,
  state text not null default 'ACTIVE' check (state in ('ACTIVE', 'EXPIRING', 'EXPIRED', 'LOST')),
  last_visit_at timestamptz,
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id),
  unique (gym_id, phone)
);

alter table public.members
  add constraint members_lead_id_fkey
  foreign key (gym_id, lead_id)
  references public.leads (gym_id, id)
  on delete no action;

create index members_gym_id_state_idx on public.members (gym_id, state);
create index members_gym_id_last_visit_at_idx on public.members (gym_id, last_visit_at desc);

create trigger members_set_updated_at
before update on public.members
for each row execute function public.set_updated_at();

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  name text not null,
  billing_period text not null check (billing_period in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  duration_days integer not null check (duration_days > 0),
  price_inr numeric(12,2) not null check (price_inr >= 0),
  setup_fee_inr numeric(12,2) not null default 0 check (setup_fee_inr >= 0),
  freeze_days integer not null default 0 check (freeze_days >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id),
  unique (gym_id, name)
);

create index membership_plans_gym_id_is_active_idx on public.membership_plans (gym_id, is_active);

create trigger membership_plans_set_updated_at
before update on public.membership_plans
for each row execute function public.set_updated_at();

create table if not exists public.member_subscriptions (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  member_id uuid not null,
  membership_plan_id uuid,
  start_date date not null,
  expiry_date date not null,
  status text not null default 'active' check (status in ('active', 'paused', 'cancelled', 'expired', 'renewed')),
  billing_cycle text check (billing_cycle in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  amount_inr numeric(12,2) not null check (amount_inr >= 0),
  discount_inr numeric(12,2) not null default 0 check (discount_inr >= 0),
  due_amount_inr numeric(12,2) not null default 0 check (due_amount_inr >= 0),
  last_payment_at timestamptz,
  cancelled_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id),
  check (expiry_date >= start_date)
);

alter table public.member_subscriptions
  add constraint member_subscriptions_member_id_fkey
  foreign key (gym_id, member_id)
  references public.members (gym_id, id)
  on delete cascade;

alter table public.member_subscriptions
  add constraint member_subscriptions_membership_plan_id_fkey
  foreign key (gym_id, membership_plan_id)
  references public.membership_plans (gym_id, id)
  on delete no action;

create index member_subscriptions_gym_id_member_id_idx on public.member_subscriptions (gym_id, member_id);
create index member_subscriptions_gym_id_expiry_date_idx on public.member_subscriptions (gym_id, expiry_date);
create index member_subscriptions_gym_id_status_idx on public.member_subscriptions (gym_id, status);

create trigger member_subscriptions_set_updated_at
before update on public.member_subscriptions
for each row execute function public.set_updated_at();

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  member_id uuid not null,
  member_subscription_id uuid,
  collected_by_user_id uuid,
  amount_inr numeric(12,2) not null check (amount_inr > 0),
  payment_method text not null check (payment_method in ('cash', 'UPI', 'card', 'other')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'verified')),
  reference_number text,
  paid_at timestamptz,
  received_by_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id)
);

alter table public.payments
  add constraint payments_member_id_fkey
  foreign key (gym_id, member_id)
  references public.members (gym_id, id)
  on delete cascade;

alter table public.payments
  add constraint payments_member_subscription_id_fkey
  foreign key (gym_id, member_subscription_id)
  references public.member_subscriptions (gym_id, id)
  on delete no action;

alter table public.payments
  add constraint payments_collected_by_user_id_fkey
  foreign key (gym_id, collected_by_user_id)
  references public.users (gym_id, id)
  on delete no action;

create index payments_gym_id_member_id_idx on public.payments (gym_id, member_id);
create index payments_gym_id_status_idx on public.payments (gym_id, status);
create index payments_gym_id_paid_at_idx on public.payments (gym_id, paid_at desc);

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create table if not exists public.attendance_logs (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  member_id uuid not null,
  check_in_at timestamptz not null default timezone('utc', now()),
  check_out_at timestamptz,
  source text not null default 'manual' check (source in ('manual', 'qr', 'import', 'api')),
  created_by_user_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id)
);

alter table public.attendance_logs
  add constraint attendance_logs_member_id_fkey
  foreign key (gym_id, member_id)
  references public.members (gym_id, id)
  on delete cascade;

alter table public.attendance_logs
  add constraint attendance_logs_created_by_user_id_fkey
  foreign key (gym_id, created_by_user_id)
  references public.users (gym_id, id)
  on delete no action;

create index attendance_logs_gym_id_member_id_idx on public.attendance_logs (gym_id, member_id);
create index attendance_logs_gym_id_check_in_at_idx on public.attendance_logs (gym_id, check_in_at desc);

create trigger attendance_logs_set_updated_at
before update on public.attendance_logs
for each row execute function public.set_updated_at();

create table if not exists public.follow_up_tasks (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  lead_id uuid,
  member_id uuid,
  assigned_to_user_id uuid,
  title text not null,
  description text,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'done', 'cancelled')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id),
  check (lead_id is not null or member_id is not null)
);

alter table public.follow_up_tasks
  add constraint follow_up_tasks_lead_id_fkey
  foreign key (gym_id, lead_id)
  references public.leads (gym_id, id)
  on delete no action;

alter table public.follow_up_tasks
  add constraint follow_up_tasks_member_id_fkey
  foreign key (gym_id, member_id)
  references public.members (gym_id, id)
  on delete no action;

alter table public.follow_up_tasks
  add constraint follow_up_tasks_assigned_to_user_id_fkey
  foreign key (gym_id, assigned_to_user_id)
  references public.users (gym_id, id)
  on delete no action;

create index follow_up_tasks_gym_id_priority_idx on public.follow_up_tasks (gym_id, priority);
create index follow_up_tasks_gym_id_status_due_at_idx on public.follow_up_tasks (gym_id, status, due_at);

create trigger follow_up_tasks_set_updated_at
before update on public.follow_up_tasks
for each row execute function public.set_updated_at();

create table if not exists public.whatsapp_activity_logs (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  lead_id uuid,
  member_id uuid,
  user_id uuid,
  template_key text,
  direction text not null check (direction in ('outbound', 'inbound')),
  status text not null check (status in ('queued', 'sent', 'delivered', 'read', 'failed')),
  phone text not null,
  message_body text,
  provider_message_id text,
  sent_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (gym_id, id)
);

alter table public.whatsapp_activity_logs
  add constraint whatsapp_activity_logs_lead_id_fkey
  foreign key (gym_id, lead_id)
  references public.leads (gym_id, id)
  on delete no action;

alter table public.whatsapp_activity_logs
  add constraint whatsapp_activity_logs_member_id_fkey
  foreign key (gym_id, member_id)
  references public.members (gym_id, id)
  on delete no action;

alter table public.whatsapp_activity_logs
  add constraint whatsapp_activity_logs_user_id_fkey
  foreign key (gym_id, user_id)
  references public.users (gym_id, id)
  on delete no action;

create index whatsapp_activity_logs_gym_id_created_at_idx on public.whatsapp_activity_logs (gym_id, created_at desc);
create index whatsapp_activity_logs_gym_id_status_idx on public.whatsapp_activity_logs (gym_id, status);

create trigger whatsapp_activity_logs_set_updated_at
before update on public.whatsapp_activity_logs
for each row execute function public.set_updated_at();
