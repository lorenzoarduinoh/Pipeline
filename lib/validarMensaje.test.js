// Código generado a partir de specs/validacion-mensaje.md mediante Spec Driven Development
// Cada test corresponde textualmente a un caso de la sección "Casos de prueba esperados".

import { describe, it, expect } from 'vitest';
import { validarMensaje } from './validarMensaje';

describe('validarMensaje (specs/validacion-mensaje.md)', () => {
  it('Caso válido: con un nombre normal y un mensaje normal, devuelve { valido: true }', () => {
    const resultado = validarMensaje('Ana', 'Hola a todos');
    expect(resultado).toEqual({ valido: true });
  });

  it('Mensaje de 201 caracteres: debe ser inválido, con un error que indique que el mensaje supera los 200 caracteres', () => {
    const mensajeDe201 = 'a'.repeat(201);
    const resultado = validarMensaje('Ana', mensajeDe201);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toContain('200');
  });

  it('Nombre vacío: debe ser inválido, con un error que indique que el nombre es obligatorio', () => {
    const resultado = validarMensaje('', 'Hola a todos');
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toContain('nombre es obligatorio');
  });

  it('Mensaje compuesto solo por espacios: debe ser inválido, con un error que indique que el mensaje es obligatorio', () => {
    const resultado = validarMensaje('Ana', '     ');
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toContain('mensaje es obligatorio');
  });

  it('Mensaje de exactamente 200 caracteres: debe ser válido (200 es el límite permitido, no lo supera)', () => {
    const mensajeDe200 = 'a'.repeat(200);
    const resultado = validarMensaje('Ana', mensajeDe200);
    expect(resultado).toEqual({ valido: true });
  });

  it('Nombre de 51 caracteres: debe ser inválido, con un error que indique que el nombre supera los 50 caracteres', () => {
    const nombreDe51 = 'a'.repeat(51);
    const resultado = validarMensaje(nombreDe51, 'Hola a todos');
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toContain('50');
  });

  it('Canción con un link válido de Spotify: con nombre y mensaje válidos, debe ser válido', () => {
    const resultado = validarMensaje('Ana', 'Hola a todos', 'https://open.spotify.com/track/abc123');
    expect(resultado).toEqual({ valido: true });
  });

  it('Sin canción: con nombre y mensaje válidos y la canción vacía u omitida, debe ser válido (la canción es opcional)', () => {
    expect(validarMensaje('Ana', 'Hola a todos', '')).toEqual({ valido: true });
    expect(validarMensaje('Ana', 'Hola a todos')).toEqual({ valido: true });
  });

  it('Canción con un link que no es de Spotify: debe ser inválido, con un error que mencione Spotify', () => {
    const resultado = validarMensaje('Ana', 'Hola a todos', 'https://www.youtube.com/watch?v=abc123');
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toContain('Spotify');
  });
});
