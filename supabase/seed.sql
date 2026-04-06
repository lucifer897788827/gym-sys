insert into public.gyms (
  id,
  name,
  slug,
  phone,
  whatsapp_phone,
  city,
  timezone
)
values (
  '11111111-1111-1111-1111-111111111111',
  'Strong Box Gym',
  'strong-box-gym',
  '+919999999999',
  '+919999999999',
  'Pune',
  'Asia/Calcutta'
)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  phone = excluded.phone,
  whatsapp_phone = excluded.whatsapp_phone,
  city = excluded.city,
  timezone = excluded.timezone;

insert into public.membership_plans (
  id,
  gym_id,
  name,
  billing_period,
  duration_days,
  price_inr,
  setup_fee_inr,
  freeze_days,
  is_active
)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Monthly Unlimited',
  'monthly',
  30,
  2500,
  0,
  7,
  true
)
on conflict (id) do update
set
  gym_id = excluded.gym_id,
  name = excluded.name,
  billing_period = excluded.billing_period,
  duration_days = excluded.duration_days,
  price_inr = excluded.price_inr,
  setup_fee_inr = excluded.setup_fee_inr,
  freeze_days = excluded.freeze_days,
  is_active = excluded.is_active;

-- Manual verification accounts for the auth-linked rows below:
-- owner@strong-box.test / Password123!  -> public.users.id = 33333333-3333-3333-3333-333333333333
-- staff@strong-box.test / Password123!  -> public.users.id = 44444444-4444-4444-4444-444444444444
-- member@strong-box.test / Password123! -> public.members.auth_user_id = 55555555-5555-5555-5555-555555555555

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'owner@strong-box.test',
    crypt('Password123!', gen_salt('bf')),
    now(),
    null,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Gym Owner"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '44444444-4444-4444-4444-444444444444',
    'authenticated',
    'authenticated',
    'staff@strong-box.test',
    crypt('Password123!', gen_salt('bf')),
    now(),
    null,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Desk Staff"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '55555555-5555-5555-5555-555555555555',
    'authenticated',
    'authenticated',
    'member@strong-box.test',
    crypt('Password123!', gen_salt('bf')),
    now(),
    null,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Member One"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  recovery_sent_at = excluded.recovery_sent_at,
  last_sign_in_at = excluded.last_sign_in_at,
  raw_app_meta_data = excluded.raw_app_meta_data,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = excluded.updated_at,
  confirmation_token = excluded.confirmation_token,
  email_change = excluded.email_change,
  email_change_token_new = excluded.email_change_token_new,
  recovery_token = excluded.recovery_token;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values
  (
    'a3333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    '{"sub":"33333333-3333-3333-3333-333333333333","email":"owner@strong-box.test"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    '{"sub":"44444444-4444-4444-4444-444444444444","email":"staff@strong-box.test"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'a5555555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-555555555555',
    '55555555-5555-5555-5555-555555555555',
    '{"sub":"55555555-5555-5555-5555-555555555555","email":"member@strong-box.test"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  )
on conflict (id) do update
set
  user_id = excluded.user_id,
  provider_id = excluded.provider_id,
  identity_data = excluded.identity_data,
  provider = excluded.provider,
  last_sign_in_at = excluded.last_sign_in_at,
  updated_at = excluded.updated_at;

insert into public.users (
  id,
  gym_id,
  email,
  full_name,
  role,
  phone,
  is_active
)
values
  (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'owner@strong-box.test',
    'Gym Owner',
    'owner',
    '+919999999991',
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'staff@strong-box.test',
    'Desk Staff',
    'staff',
    '+919999999992',
    true
  )
on conflict (id) do update
set
  gym_id = excluded.gym_id,
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  phone = excluded.phone,
  is_active = excluded.is_active;

insert into public.members (
  id,
  gym_id,
  auth_user_id,
  full_name,
  phone,
  email,
  joined_at,
  state,
  source,
  notes
)
values (
  '66666666-6666-6666-6666-666666666666',
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555555',
  'Member One',
  '+919999999993',
  'member@strong-box.test',
  current_date,
  'ACTIVE',
  'manual',
  'Seeded member linked to auth_user_id for manual RLS verification.'
)
on conflict (id) do update
set
  gym_id = excluded.gym_id,
  auth_user_id = excluded.auth_user_id,
  full_name = excluded.full_name,
  phone = excluded.phone,
  email = excluded.email,
  joined_at = excluded.joined_at,
  state = excluded.state,
  source = excluded.source,
  notes = excluded.notes;

insert into public.member_subscriptions (
  id,
  gym_id,
  member_id,
  membership_plan_id,
  start_date,
  expiry_date,
  status,
  billing_cycle,
  amount_inr,
  discount_inr,
  due_amount_inr,
  notes
)
values (
  '77777777-7777-7777-7777-777777777777',
  '11111111-1111-1111-1111-111111111111',
  '66666666-6666-6666-6666-666666666666',
  '22222222-2222-2222-2222-222222222222',
  current_date,
  current_date + 30,
  'active',
  'monthly',
  2500,
  0,
  0,
  'Seeded subscription for internal/member RLS verification.'
)
on conflict (id) do update
set
  gym_id = excluded.gym_id,
  member_id = excluded.member_id,
  membership_plan_id = excluded.membership_plan_id,
  start_date = excluded.start_date,
  expiry_date = excluded.expiry_date,
  status = excluded.status,
  billing_cycle = excluded.billing_cycle,
  amount_inr = excluded.amount_inr,
  discount_inr = excluded.discount_inr,
  due_amount_inr = excluded.due_amount_inr,
  notes = excluded.notes;

insert into public.payments (
  id,
  gym_id,
  member_id,
  member_subscription_id,
  collected_by_user_id,
  amount_inr,
  payment_method,
  status,
  paid_at,
  received_by_name,
  notes
)
values (
  '88888888-8888-8888-8888-888888888888',
  '11111111-1111-1111-1111-111111111111',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '33333333-3333-3333-3333-333333333333',
  2500,
  'cash',
  'paid',
  now(),
  'Gym Owner',
  'Seeded payment for internal/member RLS verification.'
)
on conflict (id) do update
set
  gym_id = excluded.gym_id,
  member_id = excluded.member_id,
  member_subscription_id = excluded.member_subscription_id,
  collected_by_user_id = excluded.collected_by_user_id,
  amount_inr = excluded.amount_inr,
  payment_method = excluded.payment_method,
  status = excluded.status,
  paid_at = excluded.paid_at,
  received_by_name = excluded.received_by_name,
  notes = excluded.notes;

insert into public.attendance_logs (
  id,
  gym_id,
  member_id,
  check_in_at,
  check_out_at,
  source,
  created_by_user_id,
  notes
)
values (
  '99999999-9999-9999-9999-999999999999',
  '11111111-1111-1111-1111-111111111111',
  '66666666-6666-6666-6666-666666666666',
  timezone('utc', now()),
  null,
  'manual',
  '44444444-4444-4444-4444-444444444444',
  'Seeded attendance row for internal/member RLS verification.'
)
on conflict (id) do update
set
  gym_id = excluded.gym_id,
  member_id = excluded.member_id,
  check_in_at = excluded.check_in_at,
  check_out_at = excluded.check_out_at,
  source = excluded.source,
  created_by_user_id = excluded.created_by_user_id,
  notes = excluded.notes;

