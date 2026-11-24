-- ============================================================================
-- Belagavi Travel Chronicles — Supabase PostgreSQL Schema, RLS & Seed Data
-- Run this script in your Supabase project's SQL Editor.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Trip Bookings Table
-- ----------------------------------------------------------------------------
create table if not exists public.trip_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_id text not null unique,
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  duration text not null check (duration in ('1 Day', '2 Days / 1 Night', '3 Days / 2 Nights')),
  travelers integer not null check (travelers >= 1 and travelers <= 50),
  budget text not null check (budget in ('Budget', 'Standard', 'Premium')),
  selected_destinations text[] not null default '{}',
  experiences text[] not null default '{}',
  notes text not null default '',
  status text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Completed')),
  created_at timestamptz not null default now()
);

alter table public.trip_bookings enable row level security;

drop policy if exists "Public can read trip_bookings" on public.trip_bookings;
create policy "Public can read trip_bookings"
  on public.trip_bookings for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert trip_bookings" on public.trip_bookings;
create policy "Public can insert trip_bookings"
  on public.trip_bookings for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can update trip_bookings" on public.trip_bookings;
create policy "Public can update trip_bookings"
  on public.trip_bookings for update
  to anon, authenticated
  using (true)
  with check (true);

drop policy if exists "Public can delete trip_bookings" on public.trip_bookings;
create policy "Public can delete trip_bookings"
  on public.trip_bookings for delete
  to anon, authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- 2. Visitor Reviews Table
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  visitor_name text not null,
  origin_city text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  visited_landmark text not null,
  comment text not null,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews"
  on public.reviews for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert reviews" on public.reviews;
create policy "Public can insert reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can delete reviews" on public.reviews;
create policy "Public can delete reviews"
  on public.reviews for delete
  to anon, authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- 3. Gallery Photos Table
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Heritage', 'Nature', 'Food', 'Culture')),
  caption text not null default '',
  image_url text not null,
  is_custom boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.gallery_photos enable row level security;

drop policy if exists "Public can read gallery_photos" on public.gallery_photos;
create policy "Public can read gallery_photos"
  on public.gallery_photos for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert gallery_photos" on public.gallery_photos;
create policy "Public can insert gallery_photos"
  on public.gallery_photos for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public can delete gallery_photos" on public.gallery_photos;
create policy "Public can delete gallery_photos"
  on public.gallery_photos for delete
  to anon, authenticated
  using (true);

-- ----------------------------------------------------------------------------
-- 4. Seed Data: 2 Sample Trip Bookings
-- ----------------------------------------------------------------------------
insert into public.trip_bookings (
  booking_id,
  full_name,
  email,
  phone,
  preferred_date,
  duration,
  travelers,
  budget,
  selected_destinations,
  experiences,
  notes,
  status,
  created_at
) values
(
  'BGM-2026-4812',
  'Meera Deshpande',
  'meera.deshpande@example.com',
  '+91 98452 71094',
  '2026-12-05',
  '2 Days / 1 Night',
  4,
  'Standard',
  array['Gokak Falls', 'Godchinamalaki Falls', 'Belagavi Fort & Kamal Basti'],
  array['Local Food Trail', 'Nature & Waterfall Trek'],
  'Would love a morning tasting stop for warm Belagavi Kunda and Gokak Karadant.',
  'Confirmed',
  '2026-11-18T09:20:00.000Z'
),
(
  'BGM-2026-7390',
  'Raghavendra Rao',
  'raghav.rao@example.com',
  '+91 97310 44821',
  '2026-12-19',
  '3 Days / 2 Nights',
  2,
  'Premium',
  array['Belagavi Fort & Kamal Basti', 'Rajhansgad (Yellur Fort)', 'Kittur Rani Channamma Fort & Palace', 'Bhimgad Wildlife Sanctuary'],
  array['Heritage & Fort Walk', 'Art & Handicraft Shopping'],
  'Interested in visiting Shahapur handloom weavers and Khanapur terracotta workshops.',
  'Pending',
  '2026-11-22T14:45:00.000Z'
)
on conflict (booking_id) do nothing;

-- ----------------------------------------------------------------------------
-- 5. Seed Data: 3 Sample Visitor Reviews
-- ----------------------------------------------------------------------------
insert into public.reviews (
  id,
  visitor_name,
  origin_city,
  rating,
  visited_landmark,
  comment,
  created_at
) values
(
  '11111111-1111-4111-8111-111111111101',
  'Siddharth Joshi',
  'Pune, Maharashtra',
  5,
  'Gokak Falls',
  'Walking across the historic suspension bridge above the roaring Ghataprabha gorge at sunrise is unforgettable. Paired it with warm Karadant from Gokak market.',
  '2026-10-14T11:00:00.000Z'
),
(
  '11111111-1111-4111-8111-111111111102',
  'Kavita Hegde',
  'Bengaluru, Karnataka',
  5,
  'Belagavi Fort & Kamal Basti',
  'The carved lotus ceiling inside Kamal Basadi is a hidden architectural marvel. Afterwards we picked up fresh slow-cooked Belagavi Kunda and Jolada Roti thali nearby.',
  '2026-11-02T16:30:00.000Z'
),
(
  '11111111-1111-4111-8111-111111111103',
  'Aarav Sawant',
  'Panaji, Goa',
  4,
  'Rajhansgad (Yellur Fort)',
  'An easy drive from the Goa border up to sweeping green Sahyadri views. The quiet Shiva temple inside the basalt ramparts makes it worth every step.',
  '2026-11-15T08:45:00.000Z'
)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 6. Seed Data: Belagavi Gallery Photos
-- ----------------------------------------------------------------------------
insert into public.gallery_photos (
  id,
  title,
  category,
  caption,
  image_url,
  is_custom,
  created_at
) values
(
  '22222222-2222-4222-8222-222222222201',
  'Monsoon Roar at Gokak Falls',
  'Nature',
  'Ghataprabha River plunging 170 ft beneath the historic hanging bridge.',
  '/src/assets/images/dest_gokak_falls_1795511401556.jpg',
  false,
  '2026-09-12T08:30:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222202',
  'Kamal Basadi Basalt Mandapa',
  'Heritage',
  'Lathe-turned 12th-century Ratta pillars inside Belagavi Fort.',
  '/src/assets/images/dest_kamal_basti_1795511401772.jpg',
  false,
  '2026-09-14T10:15:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222203',
  'Slow-Caramelized Belagavi Kunda',
  'Food',
  'Warm brass-bowl serving garnished with roasted pistachios and cardamom.',
  '/src/assets/images/food_belagavi_kunda_1795511403154.jpg',
  false,
  '2026-09-18T14:00:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222204',
  'Morning Mist Over Rajhansgad',
  'Heritage',
  'Basalt bastions overlooking the emerald Yellur valley.',
  '/src/assets/images/dest_rajhansgad_fort_1795511403187.jpg',
  false,
  '2026-09-20T06:45:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222205',
  'Dollu Kunitha Drum Procession',
  'Culture',
  'Evening folk percussionists performing during heritage festivities.',
  '/src/assets/images/culture_kittur_utsava_1795511407130.jpg',
  false,
  '2026-10-03T18:20:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222206',
  'North Karnataka Jolada Roti Thali',
  'Food',
  'Sorghum flatbread with Enne Gai stuffed brinjal and peanut chutney pudi.',
  '/src/assets/images/food_jolada_roti_1795511405543.jpg',
  false,
  '2026-10-08T12:30:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222207',
  'Gokak Lacquered Woodcraft',
  'Culture',
  'Hand-turned wooden fruit replicas crafted on traditional lathes.',
  '/src/assets/images/art_gokak_toys_1795511405482.jpg',
  false,
  '2026-10-12T11:00:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222208',
  'Godchinamalaki Stepped Cascades',
  'Nature',
  'Two-tier waterfall tucked deep inside the Markandeya gorge.',
  '/src/assets/images/dest_godchinamalaki_falls_1795511403515.jpg',
  false,
  '2026-10-15T09:10:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222209',
  'Shahapur Silk Pit-Loom Weaves',
  'Culture',
  'Handwoven temple-border Ilkal sarees resting on a wooden loom.',
  '/src/assets/images/art_shahapur_handloom_1795511405772.jpg',
  false,
  '2026-10-19T15:40:00.000Z'
),
(
  '22222222-2222-4222-8222-222222222210',
  'Bhimgad Rainforest Sunbeams',
  'Nature',
  'Misty evergreen canopy trail in the Khanapur Western Ghats.',
  '/src/assets/images/dest_bhimgad_forest_1795511402913.jpg',
  false,
  '2026-10-22T07:50:00.000Z'
)
on conflict (id) do nothing;
