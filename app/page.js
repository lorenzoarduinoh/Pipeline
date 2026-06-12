'use client';

// Página principal: "The Wall", el muro de mensajes y canciones.
// Es un client component porque usa estado (useState) y carga datos en el navegador.

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { validarMensaje } from '../lib/validarMensaje';

// Extrae el id de la canción de un link de Spotify para poder incrustar
// el reproductor (ej: .../track/abc123?si=xyz -> abc123)
function idDeCancion(link) {
  return link.split('/track/')[1].split('?')[0];
}

export default function Muro() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cancion, setCancion] = useState('');
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
    const resultado = validarMensaje(nombre, mensaje, cancion);
    if (!resultado.valido) {
      setError(resultado.error);
      return;
    }

    // Insertamos el mensaje en la tabla "mensajes" de Supabase
    const { error: errorInsert } = await supabase
      .from('mensajes')
      .insert({
        nombre: nombre.trim(),
        mensaje: mensaje.trim(),
        cancion: cancion.trim() || null, // si no hay canción, guardamos null
      });

    if (errorInsert) {
      setError('No se pudo publicar el mensaje. Probá de nuevo.');
      return;
    }

    // Si salió bien: limpiamos el formulario y refrescamos la lista
    setNombre('');
    setMensaje('');
    setCancion('');
    cargarMensajes();
  }

  return (
    <main className="muro">
      <h1>The Wall</h1>
      <p className="subtitulo">All in all, you&apos;re just another brick in the wall.</p>
      <p className="bajada">Dejá tu mensaje — y si querés, la canción que te suena en la cabeza.</p>

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
        <input
          value={cancion}
          onChange={(e) => setCancion(e.target.value)}
          placeholder="Link de Spotify de una canción (opcional)"
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
            {m.cancion && (
              <iframe
                className="cancion"
                src={`https://open.spotify.com/embed/track/${idDeCancion(m.cancion)}`}
                width="100%"
                height="80"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Canción de ${m.nombre}`}
              />
            )}
            <small>{new Date(m.created_at).toLocaleString('es-AR')}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}
