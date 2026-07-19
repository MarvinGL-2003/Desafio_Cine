import type { Metadata } from 'next';
import { Providers } from './providers';
import { AppShell } from './utils/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: '🎬 Cine App - Sistema de Gestión de Entradas',
  description: 'Sistema de gestión de venta de entradas para cine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}