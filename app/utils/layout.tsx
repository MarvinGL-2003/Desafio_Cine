import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

// --------------------------------------------------
// METADATOS DE LA PÁGINA
// --------------------------------------------------
export const metadata: Metadata = {
  title: '🎬 Cine App - Sistema de Gestión de Entradas',
  description: 'Sistema de gestión de venta de entradas para cine',
};

// --------------------------------------------------
// LAYOUT PRINCIPAL
// --------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {/* BARRA DE NAVEGACIÓN */}
          <nav className="navbar">
            <div className="container navbar-content">
              <div className="navbar-brand">
                <span>🎬</span>
                <span>Cine App</span>
              </div>
              <div className="navbar-links">
                <a href="/dashboard">📊 Dashboard</a>
                <a href="/peliculas">🎬 Películas</a>
                <a href="/reservas">🎫 Reservas</a>
              </div>
            </div>
          </nav>

          {/* CONTENIDO PRINCIPAL */}
          <main className="container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}