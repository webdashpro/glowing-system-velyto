-- Velyto 3.0 database schema (PostgreSQL 13+). Safe to run repeatedly.
-- Apply with:  npm run db:migrate   (reads DATABASE_URL from env or .env)

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  token_hash text primary key,
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists sessions_user_idx on sessions(user_id);

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  slug text not null unique,
  name text not null,
  tagline text not null default '',
  city text not null default '',
  category text not null default 'General',
  currency text not null default 'USD',
  whatsapp text not null default '',
  products jsonb not null default '[]'::jsonb,
  views integer not null default 0,
  wa_clicks integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists shops_user_idx on shops(user_id);
create index if not exists shops_dir_idx on shops(published, city, category);

create table if not exists business_docs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  number text not null default '',
  client_name text not null default '',
  currency text not null default 'USD',
  total numeric(14,2) not null default 0,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists business_docs_user_idx on business_docs(user_id, created_at desc);

create table if not exists business_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists study_state (
  user_id uuid primary key references users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  user_id uuid references users(id) on delete set null,
  interest text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists tool_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  author text not null default '',
  title text not null,
  details text not null default '',
  votes integer not null default 0,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists request_votes (
  request_id uuid not null references tool_requests(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  primary key (request_id, user_id)
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
