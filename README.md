# El Muro 🧱

Aplicación de muro de mensajes construida para demostrar un entorno completo de
**Integración y Entrega Continua**. Cualquier visitante puede publicar un mensaje
(nombre + texto de hasta 200 caracteres) y ver todos los mensajes publicados,
del más reciente al más antiguo.

**Stack**: Next.js (JavaScript) · Supabase (base de datos) · Vitest (tests) ·
GitHub Actions (servidor de IC) · Vercel (entorno de entrega).

## Correr localmente

```bash
npm install
# Copiar .env.local.example como .env.local y completar las credenciales de Supabase
# (antes hay que crear el proyecto en Supabase y ejecutar supabase/setup.sql)
npm run dev
```

La app queda en http://localhost:3000.

## Correr los tests

```bash
npm run test
```

Los tests están generados a partir de la especificación
`specs/validacion-mensaje.md` mediante **Spec Driven Development**: la spec en
lenguaje natural es la fuente de verdad, y de ella se derivan tanto el código
(`lib/validarMensaje.js`) como los tests (`lib/validarMensaje.test.js`).

## El pipeline de CI/CD

```
push a main → GitHub Actions (npm ci → test → build) → Vercel despliega automáticamente
```

1. El desarrollador hace build y tests locales, y pushea a GitHub.
2. GitHub Actions (`.github/workflows/ci.yml`) corre los tests y el build.
3. Vercel, conectado al repositorio, despliega cada push a `main` a producción.
4. Feedback: check verde/rojo en el commit de GitHub y estado del deploy en Vercel.

Más detalle en [INFORME.md](INFORME.md).
