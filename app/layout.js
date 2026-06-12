// Layout raíz: envuelve todas las páginas de la app (requerido por Next.js App Router)
import './globals.css';

export const metadata = {
  title: 'El Muro',
  description: 'Muro de mensajes — proyecto de Integración y Entrega Continua',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
