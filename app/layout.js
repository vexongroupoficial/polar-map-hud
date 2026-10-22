import './globals.css';

export const metadata = {
  title: 'Estación Geodésica • Proyección Polar Terrestre HUD',
  description: 'Plano geodésico y mapa polar interactivo a nivel del mar con coordenadas azimutales, mediciones ortodrómicas y telemetría táctica.',
  keywords: ['mapa polar', 'proyección azimutal', 'geodesia', 'coordenadas polares', 'navegación geodésica', 'HUD'],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Estación Geodésica • Proyección Polar Terrestre HUD',
    description: 'Mapa polar interactivo nivel 0 con rutas geodésicas y análisis espacial.',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Logo Proyección Polar HUD',
      },
    ],
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