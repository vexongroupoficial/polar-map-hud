import './globals.css';

export const metadata = {
  // Configurar la URL exacta de Render en producción
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://mapageodesico.onrender.com'
  ),
  title: 'Estación Geodésica • Proyección Polar Terrestre HUD',
  description: 'Plano geodésico y mapa polar interactivo a nivel del mar con coordenadas azimutales, mediciones ortodrómicas y telemetría táctica.',
  keywords: ['mapa polar', 'proyección azimutal', 'geodesia', 'coordenadas polares', 'navegación geodésica', 'HUD'],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Estación Geodésica • Proyección Polar Terrestre HUD',
    description: 'Mapa polar interactivo nivel 0 con rutas geodésicas y análisis espacial.',
    url: 'https://mapageodesico.onrender.com',
    siteName: 'Estación Geodésica Polar',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'Logo Proyección Polar HUD',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100 antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}