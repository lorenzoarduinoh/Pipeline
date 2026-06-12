# Especificación: validación de un mensaje del muro

> Esta especificación es la **única fuente de verdad** sobre las reglas de
> validación. El código (`lib/validarMensaje.js`) y los tests
> (`lib/validarMensaje.test.js`) se generan a partir de este documento.
> Si una regla de negocio cambia, primero se modifica esta spec y después
> se regeneran el código y los tests (Spec Driven Development).

## Función a implementar

Una función `validarMensaje(nombre, mensaje, cancion)` que recibe tres textos
(el nombre del autor, el mensaje a publicar y, opcionalmente, el link de una
canción de Spotify) y decide si la publicación es válida.

## Reglas de validación

1. **El nombre es obligatorio** y no puede estar compuesto solo por espacios.
2. **El nombre tiene un máximo de 50 caracteres** (después de recortar los
   espacios al inicio y al final).
3. **El mensaje es obligatorio** y no puede estar compuesto solo por espacios.
4. **El mensaje debe tener entre 1 y 200 caracteres**, contados después de
   recortar los espacios al inicio y al final.
5. **La canción es opcional**: si viene vacía, omitida o solo con espacios, la
   publicación es válida sin canción. Pero si se incluye, debe ser un enlace a
   una canción de Spotify: una URL que empiece con
   `https://open.spotify.com/` y contenga `/track/`.

## Valor de retorno

- Si la publicación es válida, la función devuelve: `{ valido: true }`
- Si no es válida, devuelve: `{ valido: false, error: "mensaje descriptivo en español" }`
  donde `error` explica en español cuál fue la regla incumplida.

## Casos de prueba esperados

1. **Caso válido**: con un nombre normal (por ejemplo "Ana") y un mensaje
   normal (por ejemplo "Hola a todos"), la función devuelve `{ valido: true }`.
2. **Mensaje de 201 caracteres**: debe ser inválido, con un error que indique
   que el mensaje supera los 200 caracteres.
3. **Nombre vacío**: debe ser inválido, con un error que indique que el
   nombre es obligatorio.
4. **Mensaje compuesto solo por espacios**: debe ser inválido, con un error
   que indique que el mensaje es obligatorio.
5. **Mensaje de exactamente 200 caracteres**: debe ser válido (200 es el
   límite permitido, no lo supera).
6. **Nombre de 51 caracteres**: debe ser inválido, con un error que indique
   que el nombre supera los 50 caracteres.
7. **Canción con un link válido de Spotify**: con nombre y mensaje válidos y
   un link como `https://open.spotify.com/track/abc123`, debe ser válido.
8. **Sin canción**: con nombre y mensaje válidos y la canción vacía u omitida,
   debe ser válido (la canción es opcional).
9. **Canción con un link que no es de Spotify**: por ejemplo un link de
   YouTube, debe ser inválido, con un error que mencione Spotify.

> Nota histórica: la regla 5 (canción de Spotify) se agregó después de la
> primera versión, siguiendo el flujo de Spec Driven Development: primero se
> modificó esta spec y a partir de ella se regeneraron el código y los tests.
