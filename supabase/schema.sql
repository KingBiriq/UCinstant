create extension if not exists "uuid-ossp";

create table if not exists profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text,email text,phone text,
 role text default 'customer' check (role in ('customer','admin')),
 created_at timestamptz default now()
);

create table if not exists categories (
 id uuid primary key default uuid_generate_v4(),
 name text not null, slug text unique, game_code text,
 image text, description text,
 type text default 'api' check (type in ('api','manual')),
 sort_order int default 0, active boolean default true,
 created_at timestamptz default now()
);

create table if not exists products (
 id uuid primary key default uuid_generate_v4(),
 category_id uuid references categories(id) on delete set null,
 product_type text default 'api' check (product_type in ('api','manual')),
 game_code text, catalogue_id text, catalogue_name text,
 title text, description text, image text,
 api_price numeric default 0, sell_price numeric not null default 0,
 profit numeric default 0, stock int,
 active boolean default true, last_api_sync timestamptz,
 created_at timestamptz default now()
);

create table if not exists orders (
 id uuid primary key default uuid_generate_v4(),
 user_id uuid references auth.users(id) on delete set null,
 customer_phone text, game_code text, player_id text, player_name text, server_id text,
 product_id uuid references products(id) on delete set null,
 catalogue_id text, catalogue_name text,
 amount_paid numeric default 0, api_price numeric default 0, sell_price numeric default 0, profit numeric default 0,
 payment_status text default 'PENDING', delivery_status text default 'PENDING',
 g2bulk_order_id text, raw_api_response jsonb, raw_webhook jsonb,
 created_at timestamptz default now()
);

create table if not exists banners (
 id uuid primary key default uuid_generate_v4(),
 title text not null, subtitle text, image text not null, link text,
 sort_order int default 0, active boolean default true,
 created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table banners enable row level security;

create policy "read categories" on categories for select using (true);
create policy "read products" on products for select using (true);
create policy "read banners" on banners for select using (true);
create policy "read orders" on orders for select using (true);
create policy "insert orders" on orders for insert with check (true);

-- Quick testing only. Later, lock these policies to role='admin'.
create policy "auth write categories" on categories for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "auth write products" on products for all using (auth.role()='authenticated') with check (auth.role()='authenticated');
create policy "auth write banners" on banners for all using (auth.role()='authenticated') with check (auth.role()='authenticated');

insert into categories (name,slug,game_code,image,description,type,sort_order,active) values
('PUBG Mobile','pubgm','pubgm','https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop','PUBG Mobile UC instant top-up.','api',1,true),
('Free Fire','free_fire','free_fire','https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop','Free Fire diamonds, memberships and regional offers.','api',2,true),
('Gaming Accounts','accounts','','https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1200&auto=format&fit=crop','Manual gaming accounts and special products.','manual',3,true)
on conflict (slug) do nothing;

insert into banners (title,subtitle,image,link,sort_order,active) values
('Instant PUBG UC Top-Up','Fast delivery, trusted by Somali gamers.','https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop','/category/pubgm',1,true),
('Free Fire Diamonds & Memberships','Global, regional and special offers.','https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1600&auto=format&fit=crop','/category/free_fire',2,true),
('Biriq Store Gaming Market','Top-ups, accounts and digital products.','https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=1600&auto=format&fit=crop','/categories',3,true);
