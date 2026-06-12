-- Migración: agregar la canción de Spotify a los mensajes.
-- Solo para quien ya creó la tabla con la versión anterior de setup.sql.
-- Ejecutar UNA VEZ en Supabase: SQL Editor -> pegar y "Run".

alter table mensajes add column cancion text; -- link opcional a una canción de Spotify
