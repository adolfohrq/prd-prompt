-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  name text,
  email text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin'))
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create table for PRDs
create table prds (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content jsonb not null, -- Armazena todo o objeto complexo do PRD
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table prds enable row level security;

create policy "Users can view own prds." on prds
  for select using (auth.uid() = user_id);

create policy "Users can insert own prds." on prds
  for insert with check (auth.uid() = user_id);

create policy "Users can update own prds." on prds
  for update using (auth.uid() = user_id);

create policy "Users can delete own prds." on prds
  for delete using (auth.uid() = user_id);

-- Create table for Prompts
create table prompts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  prd_id uuid references prds(id) on delete set null, -- Pode existir sem PRD (ou PRD deletado)
  prd_title text, -- Cache do título para facilitar listagem
  content text not null,
  meta jsonb, -- Armazena metadados: type, platform, stack, etc
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table prompts enable row level security;

create policy "Users can view own prompts." on prompts
  for select using (auth.uid() = user_id);

create policy "Users can insert own prompts." on prompts
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own prompts." on prompts
  for delete using (auth.uid() = user_id);


-- ADMIN POLICIES

-- Helper function to check if user is admin (SECURITY DEFINER to avoid RLS recursion)
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Permitir que admins vejam tudo
create policy "Admins can view all profiles" on profiles
  for select using (
    is_admin()
  );

create policy "Admins can view all prds" on prds
  for select using (
    is_admin()
  );

create policy "Admins can view all prompts" on prompts
  for select using (
    is_admin()
  );

-- Trigger para criar perfil automaticamente ao se cadastrar
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url', 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

