# GUION DE PRESENTACIÓN — detallado (5 minutos)

Proyecto: **The Wall** · muro de mensajes con pipeline de CI/CD.
Este guion te dice, paso a paso, **qué hacer, qué comando tipear, qué mostrar
en pantalla y qué decir**. Está pensado para que no improvises nada en vivo.

> Datos reales del proyecto (para no equivocarte):
> - Repo (público): `https://github.com/lorenzoarduinoh/Pipeline`
> - Actions: `https://github.com/lorenzoarduinoh/Pipeline/actions`
> - App en producción: `https://pipeline-seven-kohl.vercel.app`
> - Scripts npm: `dev`, `build`, `start`, `test` (`vitest run`)
> - CI (pipeline en **etapas**): Node 20, en paralelo `lint` (ESLint) y `test`
>   (Vitest con **cobertura**) → si pasan, `build` → job **`ci`** que resume todo.
>   Ese job `ci` es el **check obligatorio** de la branch protection.
> - Tests: **9** (en `lib/validarMensaje.test.js`), con reporte de cobertura.
> - La regla que vas a romper está en `lib/validarMensaje.js`, **línea 26**.
> - **Protección activa:** `main` tiene branch protection que **exige PR + el
>   check `ci` en verde** para mergear. Ya está probado que funciona.

> ⏱️ **CONTROL DE TIEMPO (la consigna exige máx. 5 minutos).** La demo tiene
> **dos esperas de CI** (romper ~30–60s y arreglar ~60–90s); en vivo eso es lo
> que más se estira. **Plan de seguridad:** mientras un CI corre, narrá sobre la
> **corrida verde anterior** ya abierta; y si vas justo de tiempo, mostrá el
> paso "arreglar/mergear" con esa corrida verde de respaldo en vez de esperar el
> CI en vivo. Ensayá una vez **con cronómetro** para confirmar que entrás en 5.

---

## 0. ANTES DE ENTRAR (preparar 10 minutos antes)

Dejá **todo abierto y probado** para no perder tiempo ni depender de la suerte.

**Pestañas del navegador (en este orden, de izquierda a derecha):**
1. `esquema-pipeline.html` (el esquema interactivo) — abrilo y apretá **F11**
   para pantalla completa. Probá que pasa de paso con "Siguiente".
2. La app en producción: `https://pipeline-seven-kohl.vercel.app`
3. La pestaña **Actions** del repo: `…/Pipeline/actions`.
4. Una **corrida verde anterior** ya abierta (plan B por si el CI tarda).
5. El **dashboard de Vercel** (Deployments) para mostrar el deploy.

**Editor (VS Code) abierto en la carpeta del proyecto, con estos archivos en pestañas:**
- `lib/validarMensaje.js`
- `lib/validarMensaje.test.js`
- `specs/validacion-mensaje.md`
- `.github/workflows/ci.yml`

**Terminal abierta en la carpeta del proyecto:**
```bash
cd C:\Users\ahlor\Desktop\pipeline
git status                 # debe estar limpio
git branch --show-current  # debe decir: main
```

**Tené a mano un link de canción de Spotify** (en Spotify: **Compartir → Copiar
enlace de la canción**). Idea temática: *"Another Brick in the Wall (Part 2)"*
de Pink Floyd, que pega con el nombre del proyecto.

**Mini-ensayo previo:** corré una vez `npm run test` (deben dar **9 en verde**) y
levantá la app con `npm run dev` para ver que anda; cerrala con Ctrl+C antes de
presentar.

**Dejá creada la rama de la demo (opcional, para ir más rápido en vivo):** podés
hacer el `checkout -b` recién en el momento, pero si querés ahorrar tiempo dejá
la rama lista y solo te falta editar + commitear + pushear durante la charla.

---

## 1. (0:00 – 0:45) EL ESQUEMA — abrir con el HTML interactivo

**Qué mostrar:** `esquema-pipeline.html` en pantalla completa (F11).

**Qué hacer:** arrancá en "Ver todo" y andá tocando **Siguiente** para recorrer
Equipo → Control de versiones → Servidor de IC → Entornos de entrega →
Mecanismo de feedback. Que se vea la animación y los logos reales.

**Qué decir:**
> "Este es mi entorno de Integración y Entrega Continua. El equipo programa y
> verifica en local; el código se integra en **GitHub**; cada push o PR dispara
> **GitHub Actions**, que en una máquina limpia corre los tests y el build; si
> pasa, **Vercel** despliega a producción, donde la app usa **Supabase** como
> base de datos. El feedback son los **checks de GitHub** y el estado del deploy
> en Vercel. Ahora lo muestro funcionando de verdad."

**Tip:** usá el esquema como apoyo visual y hablá vos. 45 segundos, no más.

---

## 2. (0:45 – 1:30) LA APP EN PRODUCCIÓN — publicar en vivo

**Qué mostrar:** `https://pipeline-seven-kohl.vercel.app` (producción, no localhost).

**Qué hacer:**
1. Escribí tu **nombre** y un **mensaje** corto.
2. Pegá el **link de Spotify** preparado.
3. Apretá **Publicar**.
4. Mostrá que el mensaje **aparece arriba** con el reproductor de Spotify embebido.

**Qué decir:**
> "Esto es el **entorno de entrega**: lo que está acá pasó por todo el pipeline.
> Publico un mensaje en vivo… y aparece, con la canción embebida desde Spotify.
> Los datos se guardan en Supabase."

**Plan B:** si la wifi falla, mostrá un screenshot/grabación previa y seguí.

---

## 3. (1:30 – 3:30) ROMPER EL PIPELINE — con Pull Request y protección

Esta es la parte fuerte. Mostrás **dos filtros** (la build local y el servidor
de IC) y que la **rama principal está protegida**: el código roto **no se puede
mergear**, así que nunca llega a producción.

### 3.1 — Mostrá la regla y rompela

Abrí `lib/validarMensaje.js` y señalá la **línea 26**:
```js
if (mensajeLimpio.length > 200) {
```
Cambiala a:
```js
if (mensajeLimpio.length > 100) {
```
**Qué decir:** "Simulo un error en una regla de negocio: bajo el límite del
mensaje de 200 a 100, contradiciendo la spec."

### 3.2 — La BUILD LOCAL ya te avisa (feedback instantáneo)

En la terminal:
```bash
npm run test
```
Falla **1 de 9**. Señalá el test que se rompe:
> *"Mensaje de exactamente 200 caracteres: debe ser válido (200 es el límite
> permitido, no lo supera)"*

*(Opcional: `npm run lint` para mostrar también la etapa de inspección de código.)*

**Qué decir:** "Antes de compartir nada, mi build local me avisa: este test, que
sale de la spec, ahora falla porque el código dejó de cumplirla. Es el primer
filtro, en mi propia máquina."

### 3.3 — Subo el cambio en una rama y abro un PR

```bash
git checkout -b romper-regla
git commit -am "cambio limite de mensaje a 100 (simulo error de regla)"
git push -u origin romper-regla
```
En GitHub aparece **"Compare & pull request"** → abrí el **PR** hacia `main`.

**Qué decir:** "No pusheo directo a la rama principal: abro un Pull Request. Eso
dispara al **servidor de IC**, que reconstruye todo desde cero en una máquina
limpia."

### 3.4 — Mostrá el PR: CI rojo, Vercel verde, merge bloqueado

Esperá ~30–60s y mostrá, dentro del PR, el recuadro de checks:
- ❌ **`CI / ci (pull_request)` — Failing**, con la etiqueta **`Required`**.
- ✅ **Vercel — Deployment has completed** (verde).
- 🔒 El botón **"Merge pull request" deshabilitado**: *"Required statuses must
  pass before merging"*. Para mergear habría que tildar **"bypass rules"**.

**Qué decir (ESTE es el argumento estrella):**
> "Acá se ve la diferencia entre **desplegar** y **verificar**. **Vercel** generó
> su preview en verde, porque el código *compila* — el bug es de lógica, no de
> compilación. Pero el **CI** corrió los tests y lo marcó en **rojo**, y es un
> check **obligatorio**: el botón de merge queda **bloqueado**. El código roto
> vive en una rama y en un PR; **no puede entrar a `main` ni a producción**.
> Así trabaja un equipo: nadie integra a la rama principal sin pasar el pipeline."

---

## 4. (3:30 – 4:20) ARREGLAR, MERGEAR Y DEPLOY AUTOMÁTICO

### 4.1 — Arreglá en la misma rama

Volvé a `> 200` en la **línea 26**. Verificá local:
```bash
npm run test     # 9 en verde
```
Subí el fix a la rama del PR:
```bash
git commit -am "fix: restaurar limite de 200 segun la spec"
git push
```

### 4.2 — El CI pasa y el merge se habilita

En el PR (refrescá): el check **`CI` ahora en verde** ✅ y el botón **"Merge pull
request" habilitado**. Hacé clic en **Merge** (y **Confirm merge**).

### 4.3 — Mostrá el deploy a producción

- En **Actions** (sobre `main`): el commit del merge con **check verde**.
- En **Vercel → Deployments**: el deploy **Production** en **Building → Ready**.

**Qué decir:**
> "Restauro el límite según la spec, el CI queda en verde, recién ahí se habilita
> el merge a `main`, y Vercel dispara el deploy automático a **producción**. Eso
> es **despliegue continuo**: solo lo que pasa el pipeline llega a producción."

**Tip de tiempo:** el CI tarda ~60–90s. Mientras corre, mostrá la **corrida verde
anterior** (pestaña de respaldo) para no quedarte en silencio.

---

## 5. (4:20 – 5:00) CIERRE CON SPEC DRIVEN DEVELOPMENT

**Qué mostrar:** lado a lado `specs/validacion-mensaje.md` y
`lib/validarMensaje.test.js`.

**Qué decir:**
> "La validación no salió de mi cabeza al teclado. Primero escribí esta
> **especificación en español**, con sus casos de prueba. De ella se generaron el
> **código** y los **tests** — los nombres de los tests **citan la spec
> textualmente**. Si cambia una regla, cambio la spec y regenero ambos. De hecho,
> el test que falló recién falló justamente porque el código dejó de cumplir la
> spec. La spec es el **contrato verificable** entre el negocio y el código, y el
> CI verifica que se cumpla en cada cambio."

Rematá volviendo un segundo al esquema interactivo:
> "Resumiendo: control de versiones en GitHub, servidor de IC en GitHub Actions,
> build y pruebas automatizadas, entrega continua con Vercel y Supabase, feedback
> en minutos, y la rama principal protegida. Gracias."

---

## COMANDOS DE REFERENCIA (todos juntos)

```bash
# Ubicarte y verificar estado
cd C:\Users\ahlor\Desktop\pipeline
git status
git branch --show-current     # main

# Ensayo previo (las etapas del pipeline, en local)
npm run lint                  # ESLint: 0 errores (1 aviso intencional)
npm run test:coverage         # 9 en verde + reporte de cobertura
npm run build                 # compila
npm run dev                   # levanta la app (Ctrl+C antes de presentar)

# --- ROMPER (en una rama + PR) ---
git checkout -b romper-regla
# editar lib/validarMensaje.js linea 26: 200 -> 100
npm run test                  # falla 1 de 9 (build local)
git commit -am "cambio limite de mensaje a 100 (simulo error de regla)"
git push -u origin romper-regla
# abrir el PR en GitHub: CI rojo (Required) + Vercel verde + merge BLOQUEADO

# --- ARREGLAR (misma rama) ---
# editar lib/validarMensaje.js linea 26: 100 -> 200
npm run test                  # 9 en verde
git commit -am "fix: restaurar limite de 200 segun la spec"
git push
# en el PR: CI verde + merge HABILITADO -> Merge -> deploy Production en Vercel

# --- Volver a main local despues del merge ---
git checkout main
git pull
```

---

## RESPUESTAS RÁPIDAS A POSIBLES PREGUNTAS

Desarrolladas en `INFORME.md`, sección 7. Repaso relámpago:

- **¿Qué es IC?** Integrar seguido en un repo compartido, verificando cada cambio
  con build y tests automáticos para detectar errores en minutos.
- **IC vs entrega vs despliegue continuo:** IC verifica cada cambio; entrega deja
  el software *siempre listo* para desplegar (pase manual); despliegue continuo
  manda a producción automáticamente lo que pasa el pipeline → **esto hago con
  Vercel**.
- **¿Build local?** Compilar y testear en mi PC (`npm run build`, `npm run test`)
  antes de compartir: primer filtro.
- **¿Rol del servidor de IC?** Máquina neutral que reconstruye todo desde cero en
  cada push/PR; elimina el "en mi máquina anda".
- **¿Pipeline?** Secuencia automatizada: `npm ci` → tests → build → deploy. Si una
  etapa falla, se corta.
- **¿Si falla un test?** El pipeline se detiene; con la rama protegida, el check
  en rojo **impide el merge** y GitHub avisa con la cruz roja.
- **¿Por qué Vercel quedó verde si el test fallaba?** Porque desplegar y verificar
  son cosas distintas: Vercel solo *compila y publica* (el bug compilaba); el CI
  *corre los tests* y es el check obligatorio que bloquea el merge.
- **¿RLS en Supabase?** Políticas por fila: los anónimos solo leen e insertan;
  aunque la clave pública quede expuesta, nadie borra ni edita datos ajenos.
- **¿SDD?** Spec en lenguaje natural como fuente de verdad; código y tests se
  generan de ella.
- **¿Por qué el repo puede ser público?** Porque las credenciales nunca se
  commitean: cada entorno define las suyas (`.env.local`, variables en Vercel,
  dummy en CI). El código público no expone ningún acceso.

---

## APÉNDICE — Cómo explicar la branch protection de `main`

Si el profe abre la configuración (Settings → Branches → regla de `main`) o
pregunta cómo protegés producción, explicá opción por opción:

- **Branch name pattern: `main`** → la regla protege la rama **`main`**, que es
  la de **producción** (desde `main` despliega Vercel). Es un candado sobre la
  rama de la que sale lo que ven los usuarios.

- ☑️ **Require a pull request before merging** → **nadie pushea directo a
  `main`.** Todo cambio entra por un **Pull Request** desde otra rama.
  - *(Require approvals destildado)* → no exijo aprobación de otra persona porque
    es un **proyecto individual**; en un equipo acá iría "al menos 1 review".

- ☑️ **Require status checks to pass before merging** + el check **`ci`** → para
  mergear el PR, mi workflow de GitHub Actions (`ci`: `npm ci → tests → build`)
  **tiene que estar en verde**. Si un test falla, el merge queda **bloqueado**.
  Este es **el gate** que impide que código roto entre a `main` (y a producción).

- ☑️ **Require branches to be up to date before merging** → la rama del PR tiene
  que estar **actualizada con lo último de `main`** antes de mergear. Garantiza
  que se testeó **contra el código más reciente**, no contra una versión vieja.

**Versión hablada (30 segundos):**
> "Protegí la rama `main`, que es la de producción. La configuración hace tres
> cosas: primero, **nadie pushea directo a `main`** — todo entra por un Pull
> Request. Segundo, ese PR **no se puede mergear si mi CI no está en verde**: el
> check de GitHub Actions, que corre los tests y el build, es obligatorio. Y
> tercero, la rama tiene que estar **actualizada con `main`** antes de mergear,
> así se testea siempre contra lo último. En resumen: el código roto no puede
> llegar a la rama principal, y por lo tanto tampoco a producción. No pongo
> aprobación de otra persona porque es un proyecto individual; en un equipo, ahí
> iría el code review."

**Frase para cerrar el concepto:**
> "Esto convierte al check del CI de un simple aviso a una **barrera real**: en
> vez de avisarme que rompí algo *después*, me **impide integrarlo**."

**De dónde sale el check `ci` (el archivo `.github/workflows/ci.yml`):**
El check obligatorio **es** este workflow, que corre un **pipeline en etapas**:
- `name: CI` → nombre del **workflow** (lo que ves en la pestaña Actions).
- `on: push/pull_request → branches:[main]` → corre en push a `main` y en PR a
  `main` (por eso al abrir el PR se disparó).
- Jobs, en máquinas Ubuntu limpias con Node 20:
  - **`lint`** → `npm run lint` (ESLint, inspección estática del código).
  - **`test`** → `npm run test:coverage` (Vitest + cobertura; sube el reporte
    como **artefacto**). *Acá falla al romper la regla de los 200 caracteres.*
  - **`build`** → `npm run build` (compila; solo corre si `lint` y `test` pasan).
  - **`ci`** → la **compuerta**: depende de los tres y queda verde solo si todos
    pasaron. **Este `ci` es el check `Required`** que marcaste en la protección.
- Por eso, si una etapa falla, el job `ci` queda en rojo y bloquea el merge.

> "El `ci.yml` **define** qué se verifica, en etapas; el job `ci` lo **resume** en
> un solo check; y la branch protection lo **vuelve obligatorio**."

---

## CHECKLIST FINAL (60 segundos antes de empezar)

- [ ] `esquema-pipeline.html` en pantalla completa y probado.
- [ ] App de Vercel (`pipeline-seven-kohl.vercel.app`) cargada y funcionando.
- [ ] Pestaña Actions abierta + una corrida verde anterior de respaldo.
- [ ] Terminal en la carpeta, `git status` limpio y en `main`.
- [ ] Link de Spotify copiado y listo para pegar.
- [ ] Editor con los 4 archivos clave en pestañas.
- [ ] Rama `romper-regla` del ensayo ya borrada (no dejar basura).
- [ ] Micrófono/pantalla compartida funcionando.
