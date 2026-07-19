'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const ocultarMenu =
    pathname === '/loggin' ||
    pathname === '/crear_usuario';

  if (ocultarMenu) {
    return <>{children}</>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="navbar-brand">
            <span>🎬</span>
            <span>Cine App</span>
          </div>

          <div className="navbar-links">
            <Link href="/dashboard">📊 Dashboard</Link>
            <Link href="/peliculas">🎬 Películas</Link>
            <Link href="/reservas">🎫 Reservas</Link>
            <Link href="/historial">📋 Historial</Link> 
          </div>
        </div>
      </nav>

      <main
        className="container"
        style={{
          paddingTop: '24px',
          paddingBottom: '24px',
        }}
      >
        {children}
      </main>
    </>
  );
}