-- Turbo Aid: providers table
-- Run this in your Supabase SQL Editor to set up the database

create table if not exists providers (
  id          text primary key,
  name        text not null,
  services    text[] not null,
  distance    numeric(5, 2) not null,
  eta         integer not null,
  is_open     boolean not null default true,
  verified    boolean not null default false,
  phone       text not null,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (read-only for anon)
alter table providers enable row level security;

create policy "Allow public read" on providers
  for select using (true);

-- Seed with initial providers
insert into providers (id, name, services, distance, eta, is_open, verified, phone) values
  ('1', 'QuickFix Auto Services',  array['tyre-puncture','battery-jumpstart','mechanical-help'], 2.3, 15, true,  true,  '+911234567890'),
  ('2', 'Highway Heroes',          array['towing','mechanical-help','fuel-assistance'],          3.8, 20, true,  true,  '+911234567891'),
  ('3', 'RoadSafe Assistance',     array['tyre-puncture','fuel-assistance','battery-jumpstart'], 5.1, 25, true,  true,  '+911234567892'),
  ('4', '24/7 Vehicle Care',       array['tyre-puncture','battery-jumpstart','towing','mechanical-help'], 6.5, 30, true, true, '+911234567893'),
  ('5', 'Express Towing Services', array['towing'],                                              4.2, 22, false, true,  '+911234567894'),
  ('6', 'FuelUp Highway',          array['fuel-assistance'],                                     1.8, 12, true,  true,  '+911234567895'),
  ('7', 'Battery Boost Pro',       array['battery-jumpstart'],                                   3.2, 18, true,  false, '+911234567896'),
  ('8', 'MegaTow Services',        array['towing','mechanical-help'],                            7.9, 35, true,  true,  '+911234567897')
on conflict (id) do nothing;
