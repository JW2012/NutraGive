-- Run this in your Supabase SQL editor
-- If adding approved_by to an existing table, run this migration first:
-- alter table requests add column if not exists approved_by text;


-- Requests table
create table requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id),
  name text not null,
  title text not null,
  description text not null,
  amount_goal numeric(10,2) not null,
  amount_raised numeric(10,2) default 0,
  status text default 'open' check (status in ('open', 'funded', 'closed')),
  coupon_code text,
  tags text[] default '{}',
  feeds_people integer default 1,
  feeds_weeks integer default 1
);

-- Donations table
create table donations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  request_id uuid references requests(id),
  donor_name text,
  amount numeric(10,2) not null,
  stripe_payment_intent_id text unique
);

-- RLS: requests
alter table requests enable row level security;
create policy "Public read" on requests for select using (true);
create policy "Authenticated insert" on requests for insert
  with check (auth.uid() = user_id);
create policy "Owner update" on requests for update
  using (auth.uid() = user_id);
create policy "Owner delete" on requests for delete
  using (auth.uid() = user_id);

-- RLS: donations
alter table donations enable row level security;
create policy "Public read" on donations for select using (true);
create policy "Anyone can insert" on donations for insert with check (true);
