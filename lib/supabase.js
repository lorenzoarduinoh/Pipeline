// Cliente de Supabase: la conexión a la base de datos.
// Las credenciales NO van en el código: se leen de variables de entorno
// (ver .env.local.example). El prefijo NEXT_PUBLIC_ permite usarlas en el navegador.

import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
