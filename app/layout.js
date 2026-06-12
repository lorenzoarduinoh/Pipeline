// Layout raíz: envuelve todas las páginas de la app (requerido por Next.js App Router)
import './globals.css';
import { Rock_Salt, Caveat } from 'next/font/google';

// Tipografías estilo "The Wall": Rock Salt para el título garabateado
// y Caveat para los nombres escritos a mano sobre la pared
const rockSalt = Rock_Salt({ weight: '400', subsets: ['latin'], variable: '--fuente-titulo' });
const caveat = Caveat({ weight: '700', subsets: ['latin'], variable: '--fuente-mano' });

export const metadata = {
  title: 'The Wall',
  description: 'Muro de mensajes y canciones — proyecto de Integración y Entrega Continua',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${rockSalt.variable} ${caveat.variable}`}>{children}</body>
    </html>
  );
}
