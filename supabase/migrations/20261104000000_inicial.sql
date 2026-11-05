-- Mathfra · esquema inicial. Aplica con: supabase db push (o pega en el SQL Editor).
-- Todas las tablas con RLS. El sitio inserta con la llave secreta (service role) desde el servidor.

create extension if not exists citext;

-- Envíos del formulario de contacto
create table if not exists public.contactos (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 2 and 80),
  email citext not null,
  telefono text,
  interes text not null,
  mensaje text not null check (char_length(mensaje) <= 1500),
  pagina text,
  acepta_privacidad boolean not null,
  acepta_publicidad boolean not null default false,
  ip_hash text,
  reenviado_agente boolean not null default false
);
alter table public.contactos enable row level security;
create index if not exists contactos_creado_idx on public.contactos (creado_en desc);

-- Suscriptores del boletín (doble opt-in)
create table if not exists public.suscriptores (
  id uuid primary key default gen_random_uuid(),
  email citext not null unique,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmado', 'baja')),
  token_confirmacion text unique,
  token_baja text unique,
  consentimiento_en timestamptz not null default now(),
  confirmado_en timestamptz,
  baja_en timestamptz,
  ip_hash text,
  creado_en timestamptz not null default now()
);
alter table public.suscriptores enable row level security;

-- Pagos (Stripe)
create table if not exists public.pagos (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  stripe_session_id text not null unique,
  plan text not null,
  email citext,
  nombre text,
  total_centavos integer not null,
  moneda text not null default 'mxn',
  metodo text,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'pagado', 'fallido', 'reembolsado')),
  terminos_aceptados_en timestamptz not null,
  usuario_id uuid references auth.users (id) on delete set null
);
alter table public.pagos enable row level security;

-- Perfiles de usuario (base para el panel)
create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  creado_en timestamptz not null default now()
);
alter table public.perfiles enable row level security;

create policy "perfil: leer el propio" on public.perfiles for select to authenticated using ((select auth.uid()) = id);
create policy "perfil: actualizar el propio" on public.perfiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "pagos: leer los propios" on public.pagos for select to authenticated using ((select auth.uid()) = usuario_id);

create or replace function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfiles (id) values (new.id) on conflict do nothing;
  return new;
end $$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario after insert on auth.users for each row execute function public.crear_perfil();
