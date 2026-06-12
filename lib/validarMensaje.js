// Código generado a partir de specs/validacion-mensaje.md mediante Spec Driven Development
// Si cambia una regla de negocio, se modifica primero la spec y se regenera este archivo.

export function validarMensaje(nombre, mensaje) {
  // Recortamos espacios al inicio y al final, como indica la spec
  const nombreLimpio = (nombre || '').trim();
  const mensajeLimpio = (mensaje || '').trim();

  // Regla 1: el nombre es obligatorio y no puede ser solo espacios
  if (nombreLimpio.length === 0) {
    return { valido: false, error: 'El nombre es obligatorio.' };
  }

  // Regla 2: el nombre tiene un máximo de 50 caracteres
  if (nombreLimpio.length > 50) {
    return { valido: false, error: 'El nombre supera los 50 caracteres permitidos.' };
  }

  // Regla 3: el mensaje es obligatorio y no puede ser solo espacios
  if (mensajeLimpio.length === 0) {
    return { valido: false, error: 'El mensaje es obligatorio.' };
  }

  // Regla 4: el mensaje debe tener entre 1 y 200 caracteres
  if (mensajeLimpio.length > 200) {
    return { valido: false, error: 'El mensaje supera los 200 caracteres permitidos.' };
  }

  // Si pasó todas las reglas, la publicación es válida
  return { valido: true };
}
