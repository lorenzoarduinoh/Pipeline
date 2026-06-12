'use client';

// Página principal: el "muro" de mensajes.
// Es un client component porque usa estado (useState) y carga datos en el navegador.

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { validarMensaje } from '../lib/validarMensaje';

export default function Muro() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [error, setError] = useState('');

  // Trae todos los mensajes de Supabase, del más reciente al más antiguo
  async function cargarMensajes() {
    const { data, error } = await supabase
      .from('mensajes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('No se pudieron cargar los mensajes.');
    } else {
      setMensajes(data);
    }
  }

  // Al abrir la página, cargamos los mensajes una vez
  useEffect(() => {
    cargarMensajes();
  }, []);

  // Se ejecuta al apretar "Publicar"
  async function publicar(evento) {
    evento.preventDefault(); // evita que el formulario recargue la página
    setError('');

    // Validamos con la función derivada de la spec (Spec Driven Development).
    // Si es inválido, mostramos el error y NO enviamos nada a la base.
    const resultado = validarMensaje(nombre, mensaje);
    if (!resultado.valido) {
      setError(resultado.error);
      return;
    }

    // Insertamos el mensaje en la tabla "mensajes" de Supabase
    const { error: errorInsert } = await supabase
      .from('mensajes')
      .insert({ nombre: nombre.trim(), mensaje: mensaje.trim() });

    if (errorInsert) {
      setError('No se pudo publicar el mensaje. Probá de nuevo.');
      return;
    }

    // Si salió bien: limpiamos el formulario y refrescamos la lista
    setNombre('');
    setMensaje('');
    cargarMensajes();
  }

  return (
    <main className="muro">
      <h1>El Muro</h1>
      <p className="subtitulo">Dejá tu mensaje para que todos lo vean.</p>

      <form onSubmit={publicar}>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="Tu mensaje..."
        />
        <div className="fila">
          <span className="contador">{200 - mensaje.length} caracteres restantes</span>
          <button type="submit">Publicar</button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="lista">
        {mensajes.map((m) => (
          <li key={m.id}>
            <strong>{m.nombre}</strong>
            <p>{m.mensaje}</p>
            <small>{new Date(m.created_at).toLocaleString('es-AR')}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
