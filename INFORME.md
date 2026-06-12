# INFORME — Entorno de Integración y Entrega Continua

Proyecto: **The Wall** — muro público de mensajes y canciones con pipeline
completo de CI/CD y estética inspirada en el álbum de Pink Floyd.

---

## 1. Resumen del proyecto

La aplicación es una página única donde cualquier visitante escribe su nombre,
un mensaje de hasta 200 caracteres y, opcionalmente, el link de una canción de
Spotify; lo publica con un botón y ve la lista de todos los mensajes ordenados
del más reciente al más antiguo (nombre, mensaje, la canción como reproductor
de Spotify embebido, y fecha).

**Herramientas**: Next.js (framework web, JavaScript), Supabase (base de datos
PostgreSQL), Vitest (pruebas), GitHub (repositorio), GitHub Actions (servidor
de IC) y Vercel (entorno de entrega).

### Mapeo: requisito de la consigna → componente implementado

| Requisito de la consigna | Componente implementado |
|---|---|
| Repositorio de código | Repositorio Git subido a **GitHub** |
| Servidor de IC | **GitHub Actions** con el workflow `.github/workflows/ci.yml` |
| Entorno de desarrollador con build local | Cualquier PC con Node: `npm install`, `npm run dev`, `npm run test`, `npm run build` |
| Prueba automatizada | `lib/validarMensaje.test.js` con **Vitest** (6 tests) |
| Build que despliega al entorno de entrega | **Vercel** conectado al repo: cada push a `main` que pasa el CI se despliega a producción |
| Spec Driven Development (punto extra) | `specs/validacion-mensaje.md` → de ahí se generaron `lib/validarMensaje.js` y sus tests |

---

## 2. Explicación paso a paso de lo construido

### `app/page.js` — la página del muro
Es la única página de la app. Tiene un formulario (nombre + mensaje con
contador de caracteres restantes + link opcional de Spotify) y la lista de
mensajes. Cuando apretás "Publicar": primero valida con `validarMensaje` (si
es inválido muestra el error y **no** envía nada), después inserta el mensaje
en Supabase, y por último vuelve a cargar la lista para que aparezca el
mensaje nuevo. Si un mensaje trae canción, se muestra el reproductor oficial
embebido de Spotify (un `iframe` con la URL
`open.spotify.com/embed/track/<id>`; el id se extrae del link guardado). Si la
carga o el insert fallan, muestra un texto de error. Es un *client component*
(`'use client'`) porque maneja estado con `useState` y carga datos desde el
navegador. La estética (pared de ladrillos, tipografía garabateada) vive en
`app/globals.css`: la pared es un patrón SVG dibujado en CSS, sin imágenes
externas.

### `lib/supabase.js` — la conexión a la base de datos
Crea el "cliente" de Supabase, que es el objeto que sabe hablar con la base de
datos. Las credenciales (URL y clave anónima) **no están escritas en el
código**: se leen de variables de entorno. Así el código puede ser público sin
regalar acceso, y cada entorno (mi PC, Vercel) usa sus propias credenciales.

### `lib/validarMensaje.js` — la regla de negocio
Una sola función que decide si una publicación es válida: nombre obligatorio y
de hasta 50 caracteres, mensaje obligatorio y de 1 a 200 caracteres (siempre
recortando espacios al inicio/fin), y canción opcional que, si se incluye,
debe ser un link de Spotify (`open.spotify.com/.../track/...`). Devuelve
`{ valido: true }` o `{ valido: false, error: "..." }`. **No la escribí "de
cero": se generó a partir de la spec** `specs/validacion-mensaje.md`
(ver sección 4).

### `lib/validarMensaje.test.js` — la prueba automatizada
Tests de Vitest que verifican cada caso de la sección "Casos de prueba
esperados" de la spec: caso válido, mensaje de 201 caracteres, nombre vacío,
mensaje de solo espacios, mensaje de exactamente 200 caracteres (válido) y
nombre de 51 caracteres. Los nombres de los tests citan textualmente la spec.
Esto es lo que corre el servidor de IC en cada push.

### `.github/workflows/ci.yml` — el servidor de IC
Le dice a GitHub Actions qué hacer en cada push o pull request a `main`:
levantar una máquina Ubuntu con Node 20, instalar dependencias (`npm ci`),
correr los tests (`npm run test`) y compilar (`npm run build`). Si cualquier
paso falla, el commit queda marcado en rojo. El build usa valores *dummy* para
las variables de Supabase porque Next.js necesita que existan para compilar,
pero el CI nunca toca la base de datos real.

### `supabase/setup.sql` — la base de datos
El script que se ejecuta una vez en el SQL Editor de Supabase. Crea la tabla
`mensajes` (id autogenerado, nombre, mensaje de máximo 200 caracteres, fecha) y
configura **Row Level Security** con dos políticas: los visitantes anónimos
pueden leer (`select`) y publicar (`insert`), pero nada más — nadie puede
borrar ni editar mensajes ajenos aunque tenga la clave anónima.

### Otros archivos
- `app/layout.js`: el "marco" HTML que Next.js exige; importa los estilos.
- `app/globals.css`: todos los estilos, en un solo archivo simple.
- `.env.local.example`: plantilla de las variables de entorno con instrucciones.
- `specs/validacion-mensaje.md`: la especificación (ver sección 4).

---

## 3. Cómo funciona el flujo completo de CI/CD

1. **Entorno de desarrollador**: edito el código en VS Code y verifico
   localmente con `npm run dev` (la app corriendo), `npm run test` (los tests)
   y `npm run build` (la **build local**, que confirma que el proyecto compila
   antes de compartirlo).
2. **Control de versiones**: hago `git commit` y `git push` a `main` en GitHub.
   El repositorio es el punto de integración: todo el equipo integra su trabajo
   ahí, varias veces al día.
3. **Servidor de IC**: el push dispara automáticamente GitHub Actions, que en
   una máquina limpia repite la verificación: instala dependencias, corre los
   tests y hace el build. Esto detecta el clásico "en mi máquina anda": si solo
   compila en mi PC por algo que olvidé commitear, acá falla.
4. **Despliegue al entorno de entrega**: Vercel está conectado al repositorio.
   Cada push a `main` genera un deploy automático a producción con las
   variables de entorno reales cargadas en Vercel.
5. **Mecanismo de feedback**: GitHub muestra un **check verde o una cruz roja**
   en cada commit (y avisa por email si falla); Vercel muestra el estado de
   cada deploy (Building / Ready / Error). En minutos sé si mi cambio rompió
   algo.

Esto se corresponde uno a uno con el esquema teórico clásico de IC:
**control de versiones** (GitHub) + **servidor de IC** (GitHub Actions) +
**build y pruebas automatizadas** (npm + Vitest) + **entorno de entrega**
(Vercel, con Supabase como base de datos) + **mecanismo de feedback**
(checks de GitHub y estados de deploy de Vercel).

---

## 4. Spec Driven Development (SDD)

**Qué es**: una forma de trabajar donde primero se escribe una
**especificación en lenguaje natural** de lo que el software debe hacer, y el
código y los tests se **generan a partir de esa spec**, en lugar de escribir
código primero y documentar después (si hay suerte).

**Cómo se aplicó acá**:
1. Primero se escribió `specs/validacion-mensaje.md`: las reglas de validación
   de un mensaje, en español, con sus casos de prueba esperados.
2. Después, derivando exclusivamente de esa spec, se generaron:
   - `lib/validarMensaje.js` (el código), y
   - `lib/validarMensaje.test.js` (los tests, cuyos nombres citan textualmente
     los casos de la spec).
3. La página del muro usa esa misma función, así que **toda** la validación de
   la app sale de la spec.

**Por qué la spec es la fuente de verdad**: el código y los tests son
"traducciones" de la spec; si alguna vez se contradicen, el que está mal es el
código, no la spec. La spec además la puede leer cualquiera (un profesor, un
cliente) sin saber programar.

**Argumento para defender el punto extra**: si mañana cambia una regla de
negocio — por ejemplo, el mensaje pasa de 200 a 280 caracteres — el flujo es:
modifico **la spec** (un documento en español), y a partir de ella regenero el
código y los tests. Los tres artefactos quedan siempre consistentes entre sí,
y el CI verifica automáticamente que el código nuevo cumple los casos de
prueba nuevos. La spec funciona como contrato verificable entre el negocio y
el código.

**Y no es solo teoría: en este proyecto pasó de verdad.** La regla de la
canción de Spotify (regla 5 de la spec) no existía en la primera versión: se
agregó después, siguiendo exactamente ese flujo — primero se modificó la spec
(nueva regla + tres casos de prueba nuevos), y de ella se regeneraron la
función y los tests (que pasaron de 6 a 9). La propia spec deja constancia en
su "nota histórica". Es la demostración práctica de que el ciclo
spec → código → tests funciona cuando el negocio cambia.

---

## 5. Pasos manuales que te quedan

- [ ] **a)** Crear un proyecto en https://supabase.com (gratis), entrar a
  **SQL Editor**, pegar el contenido de `supabase/setup.sql` y ejecutarlo (Run).
  *Si ya habías creado la tabla con la versión anterior del setup (sin la
  columna de la canción), ejecutá en cambio `supabase/migracion-cancion.sql`.*
- [ ] **b)** Copiar `.env.local.example` como `.env.local` y completar las dos
  variables con los valores de **Settings → API** de tu proyecto Supabase.
  Verificar con `npm run dev` que podés publicar y ver mensajes.
- [ ] **c)** Crear un repositorio vacío en GitHub y pushear:
  `git remote add origin <url-del-repo>` y `git push -u origin main`.
  Verificar que en la pestaña **Actions** corre el workflow "CI".
- [ ] **d)** En https://vercel.com, **Add New → Project**, importar el repo de
  GitHub y, antes de deployar, cargar las dos variables de entorno
  (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`) con los
  valores reales. Deploy.
- [ ] **e)** Verificar el pipeline completo: hacer un cambio chico (por ejemplo
  el texto del `<h1>`), commitear, pushear, y ver el check verde en GitHub y
  el deploy automático en Vercel.

---

## 6. Guion de presentación (5 minutos)

**0:00 – 0:45 — El esquema.** Mostrar el slide: "Este es mi entorno de IC.
El código vive en GitHub; cada push dispara GitHub Actions que corre tests y
build; si pasa, Vercel despliega automáticamente a producción, donde la app usa
Supabase como base de datos. El feedback son los checks de GitHub y el estado
del deploy."

**0:45 – 1:30 — La app en producción.** Abrir la URL de Vercel, publicar un
mensaje en vivo y mostrar que aparece en la lista. "Esto es el entorno de
entrega: lo que está acá pasó por todo el pipeline."

**1:30 – 3:00 — Romper el pipeline.** Antes de la presentación, dejar
preparado este cambio: en `lib/validarMensaje.js`, línea de la regla 4,
cambiar `mensajeLimpio.length > 200` por `mensajeLimpio.length > 100`.
Commitear ("simulo un error en una regla de negocio") y pushear. Mostrar en la
pestaña Actions cómo el workflow corre y **falla en rojo**: el test "mensaje de
exactamente 200 caracteres debe ser válido" no pasa. "El servidor de IC me
protegió: este error nunca llegó a producción."

**3:00 – 4:00 — Arreglar y deploy automático.** Revertir el cambio (volver a
`> 200`), commitear ("fix: restaurar límite de 200 según la spec") y pushear.
Mostrar el check verde y, en Vercel, el deploy automático en marcha. *(Tip: si
los 60–90 segundos del workflow se hacen largos, tener una pestaña con una
corrida verde anterior para mostrar mientras tanto.)*

**4:00 – 5:00 — Cierre con SDD.** Abrir `specs/validacion-mensaje.md` y al
lado `lib/validarMensaje.test.js`: "La validación no salió de mi cabeza al
teclado: primero escribí esta especificación en español, y de ella se
generaron el código y los tests — los nombres de los tests citan la spec
textualmente. Si cambia una regla, cambio la spec y regenero ambos. De hecho,
el test que falló recién, falló justamente porque el código dejó de cumplir
la spec."

---

## 7. Caso real: el día que el pipeline falló de verdad

Esto no es un ejemplo inventado: pasó durante el desarrollo de este proyecto, y
es el mejor argumento práctico para defender el valor de la Integración
Continua. Si el profesor pregunta "¿tuviste algún problema real?", esta es la
historia.

### Qué pasó

El primer push a GitHub falló: el workflow de Actions quedó en rojo a los 13
segundos, en el paso `npm ci`, con este error:

```
npm error `npm ci` can only install packages when your package.json and
package-lock.json or npm-shrinkwrap.json are in sync.
npm error Missing: @emnapi/core@1.11.0 from lock file
```

Lo llamativo: **en mi máquina todo funcionaba perfecto** — los tests pasaban,
el build compilaba, la app corría. El clásico "en mi máquina anda".

### La causa raíz

No era el código: era una **diferencia de versiones entre mi entorno local y el
del servidor de IC**.

- Mi máquina tiene Node 22 con **npm 11**.
- El workflow usa Node 20, que trae **npm 10**.
- npm 10 valida el `package-lock.json` de forma más estricta que npm 11: el
  lockfile tenía entradas incompletas de unas dependencias internas
  (`@emnapi/*`, usadas por binarios WASM) que npm 11 aceptaba sin quejarse,
  pero npm 10 rechazaba.
- El lockfile había quedado así porque las dependencias se instalaron en dos
  comandos separados (`npm install ...` y después `npm install --save-dev ...`),
  lo que dejó el árbol de dependencias inconsistente.

### Cómo se diagnosticó y arregló (y la lección de método)

1. **Primer intento (malo): parche mínimo.** Corrí `npm install` para
   "resincronizar" el lockfile, verifiqué que `npm ci` pasara localmente
   (con mi npm 11) y pusheé. **Volvió a fallar en CI**, ahora reclamando otros
   paquetes. Lección: verificar con un entorno distinto al del CI no prueba nada.
2. **Segundo intento (bueno): reproducir el entorno del CI localmente.**
   En lugar de seguir pusheando a prueba y error (cada intento son ~2 minutos
   de espera y un commit basura en el historial), reproduje la validación
   exacta del CI en mi máquina con la misma versión de npm que usa el runner:

   ```bash
   npx npm@10 ci --dry-run --os linux --cpu x64
   ```

3. **Control negativo y positivo.** Con ese comando verifiqué dos cosas antes
   de pushear: que el lockfile *viejo* fallaba con el **mismo error exacto**
   del CI (confirmando que había encontrado la causa real), y que el lockfile
   *nuevo* —regenerado desde cero borrando `node_modules` y
   `package-lock.json` y corriendo un único `npm install`— pasaba la
   validación.
4. **Recién entonces, push.** El fix entró con evidencia de que funcionaría,
   y el pipeline quedó en verde.

### Por qué esta historia defiende la teoría de IC

- **El servidor de IC cumplió exactamente su rol**: detectó en minutos un
  problema invisible en mi entorno, porque reconstruye el proyecto **desde
  cero en una máquina limpia**. Sin CI, este error habría aparecido recién en
  el deploy, o en la máquina de otro integrante del equipo.
- **El feedback rápido funcionó**: la cruz roja a los 13 segundos me dijo
  inmediatamente que algo estaba mal y en qué paso exacto.
- **Es un caso real de "funciona en mi máquina"**, el problema que la IC
  existe para resolver: el entorno del desarrollador y el de integración nunca
  son idénticos (acá diferían en la versión de npm), y la única verificación
  que cuenta es la de la máquina neutral.
- **Lección de método**: cuando el CI falla y localmente todo anda, no se
  arregla pusheando a ciegas; se **reproduce el entorno del CI localmente**
  (misma versión de herramientas) y se pushea recién cuando el fix está
  verificado. El historial de commits queda limpio y no se desperdician
  corridas del pipeline.

### Cómo contarlo en la defensa (versión de 30 segundos)

> "Me pasó de verdad: el primer push quedó en rojo aunque en mi máquina todo
> pasaba. La causa era que mi npm local (versión 11) aceptaba un lockfile que
> el npm del runner (versión 10, el que trae Node 20) rechazaba. En vez de
> pushear a prueba y error, reproduje el entorno del CI en mi máquina con
> `npx npm@10 ci --dry-run`, confirmé que reproducía el error exacto, regeneré
> el lockfile desde cero, verifiqué que con npm 10 ya pasaba, y recién ahí
> pusheé. Es el caso de libro de 'en mi máquina anda' que la IC existe para
> atrapar."

---

## 8. Posibles preguntas del profesor (y respuestas cortas)

**1. ¿Qué es la Integración Continua?**
Es la práctica de integrar el trabajo de todos los desarrolladores en un
repositorio compartido con frecuencia (idealmente varias veces al día), donde
cada integración se verifica con una build y pruebas automatizadas. El objetivo
es detectar errores de integración en minutos, no semanas.

**2. ¿Diferencia entre integración continua, entrega continua y despliegue continuo?**
La integración continua verifica cada cambio con build y tests automáticos. La
entrega continua agrega que el software queda *siempre listo para desplegar*,
pero el pase a producción es una decisión manual. El despliegue continuo va un
paso más: cada cambio que pasa el pipeline se despliega a producción
automáticamente, sin intervención humana — que es lo que hace este proyecto con
Vercel.

**3. ¿Qué es una build local y por qué importa?**
Es compilar y probar el proyecto en la máquina del desarrollador
(`npm run build` y `npm run test`) antes de compartir el cambio. Importa porque
es el primer filtro: evita subir código roto al repositorio y romperle el
trabajo al resto del equipo.

**4. ¿Qué rol cumple el servidor de IC?**
Es una máquina neutral que, ante cada push, reconstruye y prueba el proyecto
desde cero en un entorno limpio. Elimina el problema de "en mi máquina anda" y
da una señal objetiva y visible para todo el equipo de si el código integrado
funciona. Acá ese rol lo cumple GitHub Actions.

**5. ¿Qué es un pipeline?**
Es la secuencia automatizada de etapas que atraviesa un cambio de código desde
el commit hasta la entrega: en este proyecto, instalar dependencias → correr
tests → build → deploy. Si una etapa falla, el pipeline se corta y el cambio no
avanza a la siguiente.

**6. ¿Qué pasa si un test falla?**
El pipeline se detiene en ese paso: no se hace el build ni se considera el
cambio integrado correctamente, y GitHub marca el commit con una cruz roja y
notifica. El desarrollador debe arreglar el problema (o revertir el commit)
como prioridad, porque la rama principal rota bloquea al equipo.

**7. ¿Qué es RLS en Supabase?**
Row Level Security: un mecanismo de PostgreSQL donde la base de datos decide,
fila por fila y mediante políticas, qué operaciones puede hacer cada tipo de
usuario. Acá las políticas permiten a los anónimos solo leer e insertar
mensajes; aunque la clave pública quede expuesta en el navegador, nadie puede
borrar ni modificar datos.

**8. ¿Qué es Spec Driven Development?**
Es desarrollar partiendo de una especificación en lenguaje natural que actúa
como fuente de verdad: el código y los tests se generan a partir de la spec, no
al revés. Si cambia una regla de negocio se modifica la spec y se regeneran los
artefactos, garantizando que documentación, código y tests nunca se
contradigan.

**Bonus — ¿Por qué las variables de Supabase no están en el código?**
Porque las credenciales nunca deben commitearse: cada entorno las define por su
lado (`.env.local` en mi PC, variables de entorno en Vercel, valores dummy en
CI). Eso permite que el repositorio sea público sin exponer accesos.

---

## 9. Contenido sugerido para el slide

**Título**: "Mi entorno de Integración y Entrega Continua"

**Esquema** (de izquierda a derecha, con flechas):

```
[Desarrollador / VS Code]                [Feedback]
  build local + tests                  ✓ verde / ✗ rojo
        │ git push                          ▲
        ▼                                   │
   [GitHub] ──dispara──► [GitHub Actions] ──┤
  repositorio             npm ci → test     │
                          → build           │
                              │ si pasa     │
                              ▼             │
                         [Vercel] ──────────┘
                        producción
                              │
                              ▼
                        [Supabase]
                       base de datos
```

**Logos a incluir**: VS Code, Git, GitHub, GitHub Actions, Node.js/npm,
Vitest, Next.js, Vercel, Supabase.

**Una línea al pie**: "Spec Driven Development: la spec en lenguaje natural
genera el código y los tests."
