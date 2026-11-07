-- Mathfra · prospección automática (aliados B2B). Aplica con: supabase db push (o pega en el SQL Editor).
-- Solo el servidor (llave secreta) lee y escribe estas tablas: RLS activo y sin políticas públicas.
-- Minimización: guardamos solo datos del negocio que el propio negocio publica, con su fuente (URL y fecha).

-- Prospectos (negocios). Un registro por negocio; se borra a los 12 meses sin respuesta (borrar_en).
create table if not exists public.prospectos (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  clee text,
  nombre text not null check (char_length(nombre) between 2 and 120),
  giro_id text not null,
  giro text not null,
  tamano text check (tamano in ('micro', 'pequena', 'mediana', 'grande')),
  colonia text,
  direccion text,
  lat double precision,
  lon double precision,
  km numeric(6, 2),
  telefono text,                -- normalizado +52XXXXXXXXXX
  correo citext,                -- solo genéricos de la empresa (contacto@, ventas@, hola@…)
  correo_verificado text check (correo_verificado in ('mx', 'millionverifier', 'sin_verificar')),
  web text,
  dominio text,
  puntos integer not null check (puntos between 0 and 100),
  nivel text not null check (nivel in ('caliente', 'tibio', 'frio')),
  motivos jsonb not null default '[]',   -- por qué sacó ese puntaje
  fuentes jsonb not null default '[]',   -- [{campo, url, fecha, proveedor}] para demostrar el origen
  estado text not null default 'nuevo' check (estado in
    ('nuevo', 'en_secuencia', 'respondio', 'interesado', 'no_ahora', 'baja', 'descartado', 'terminado')),
  requiere_repep boolean not null default true, -- nunca llamar sin revisar el REPEP de Profeco
  ultimo_contacto_en timestamptz,
  borrar_en timestamptz not null default (now() + interval '12 months')
);
alter table public.prospectos enable row level security;
create unique index if not exists prospectos_clee_uq on public.prospectos (clee) where clee is not null;
create unique index if not exists prospectos_dominio_uq on public.prospectos (dominio) where dominio is not null;
create unique index if not exists prospectos_telefono_uq on public.prospectos (telefono) where telefono is not null;
create index if not exists prospectos_estado_idx on public.prospectos (estado);
create index if not exists prospectos_borrar_idx on public.prospectos (borrar_en);

-- Envíos: cada toque (paso 0 = día 0, 1 = día 3, 2 = día 10). En modo revisión nacen como pendiente_aprobacion.
create table if not exists public.envios (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  prospecto_id uuid not null references public.prospectos (id) on delete cascade,
  paso smallint not null check (paso between 0 and 2),
  para citext not null,
  asunto text not null check (char_length(asunto) <= 120),
  texto text not null,
  generado_por text not null check (generado_por in ('ia', 'plantilla')),
  estado text not null check (estado in
    ('pendiente_aprobacion', 'aprobado', 'rechazado', 'enviado', 'fallido', 'cancelado')),
  programado_para timestamptz not null default now(),
  aprobado_por text,
  aprobado_en timestamptz,
  enviado_en timestamptz,
  proveedor_id text,
  error text,
  costo_usd numeric(10, 5) not null default 0,
  unique (prospecto_id, paso)
);
alter table public.envios enable row level security;
create index if not exists envios_estado_idx on public.envios (estado, programado_para);

-- Respuestas leídas del buzón (IMAP). Guardamos un extracto corto, no el correo completo.
create table if not exists public.respuestas (
  id uuid primary key default gen_random_uuid(),
  recibido_en timestamptz not null default now(),
  message_id text not null unique,
  prospecto_id uuid references public.prospectos (id) on delete set null,
  de citext not null,
  asunto text,
  extracto text check (char_length(extracto) <= 600),
  clasificacion text not null check (clasificacion in ('interesado', 'no_ahora', 'baja', 'otro'))
);
alter table public.respuestas enable row level security;

-- Lista de bajas: PERMANENTE. Nunca se borra (no tiene borrar_en).
create table if not exists public.bajas (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  correo citext unique,
  dominio text,
  telefono text,
  origen text not null check (origen in ('enlace', 'respuesta', 'manual', 'queja'))
);
alter table public.bajas enable row level security;
create index if not exists bajas_dominio_idx on public.bajas (dominio);

-- Exclusiones manuales (clientes actuales, aliados que ya tienes): correo, dominio o teléfono.
create table if not exists public.prospeccion_excluir (
  id uuid primary key default gen_random_uuid(),
  creado_en timestamptz not null default now(),
  correo citext,
  dominio text,
  telefono text,
  nota text
);
alter table public.prospeccion_excluir enable row level security;

-- Ajustes (una sola fila): pausa y fin del modo revisión.
create table if not exists public.prospeccion_ajustes (
  id smallint primary key default 1 check (id = 1),
  pausado boolean not null default false,
  revision_hasta timestamptz,   -- se fija en la primera corrida: +14 días
  actualizado_en timestamptz not null default now()
);
alter table public.prospeccion_ajustes enable row level security;
insert into public.prospeccion_ajustes (id) values (1) on conflict do nothing;

-- Bitácora de corridas: para el resumen semanal y el costo.
create table if not exists public.prospeccion_corridas (
  id uuid primary key default gen_random_uuid(),
  inicio timestamptz not null default now(),
  fin timestamptz,
  tipo text not null,
  nuevos integer not null default 0,
  enviados integer not null default 0,
  respuestas integer not null default 0,
  interesados integer not null default 0,
  bajas integer not null default 0,
  costo_usd numeric(10, 5) not null default 0,
  avisos jsonb not null default '[]'
);
alter table public.prospeccion_corridas enable row level security;

-- CRM: los interesados entran a «contactos» con su fuente.
alter table public.contactos add column if not exists fuente text not null default 'formulario';
