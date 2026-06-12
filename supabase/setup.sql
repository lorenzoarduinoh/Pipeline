-- Script de configuración de la base de datos.
-- Ejecutar UNA VEZ a mano en Supabase: tu proyecto -> SQL Editor -> pegar y "Run".

-- 1. Tabla donde se guardan los mensajes del muro
create table mensajes (
  id uuid primary key default gen_random_uuid(), -- identificador único autogenerado
  nombre text not null,                          -- nombre de quien publica
  mensaje varchar(200) not null,                 -- el mensaje (máximo 200 caracteres)
  created_at timestamptz default now()           -- fecha y hora de publicación
);

-- 2. Habilitar Row Level Security (RLS): sin políticas, nadie puede tocar la tabla.
alter table mensajes enable row level security;

-- 3. Política: cualquier visitante anónimo puede LEER los mensajes
create policy "lectura publica de mensajes"
  on mensajes for select
  to anon
  using (true);

-- 4. Política: cualquier visitante anónimo puede PUBLICAR un mensaje
create policy "publicacion anonima de mensajes"
  on mensajes for insert
  to anon
  with check (true);
