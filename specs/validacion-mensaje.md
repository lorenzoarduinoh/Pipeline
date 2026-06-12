# Especificación: validación de un mensaje del muro

> Esta especificación es la **única fuente de verdad** sobre las reglas de
> validación. El código (`lib/validarMensaje.js`) y los tests
> (`lib/validarMensaje.test.js`) se generan a partir de este documento.
> Si una regla de negocio cambia, primero se modifica esta spec y después
> se regeneran el código y los tests (Spec Driven Development).

## Función a implementar

Una función `validarMensaje(nombre, mensaje)` que recibe dos textos
(el nombre del autor y el mensaje a publicar) y decide si la publicación
es válida.

## Reglas de validación

1. **El nombre es obligatorio** y no puede estar compuesto solo por espacios.
2. **El nombre tiene un máximo de 50 caracteres** (después de recortar los
   espacios al inicio y al final).
3. **El mensaje es obligatorio** y no puede estar compuesto solo por espacios.
4. **El mensaje debe tener entre 1 y 200 caracteres**, contados después de
   recortar los espacios al inicio y al final.

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
