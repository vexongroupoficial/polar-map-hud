import './globals.css';

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://mapageodesico.onrender.com'
  ),
  title: 'Estación Geodésica • Proyección Polar Terrestre HUD',
  description: 'Plano geodésico y mapa polar interactivo a nivel del mar con coordenadas azimutales y mediciones ortodrómicas.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Mapa Polar',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="bg-slate-950">
      <head>
        <meta name="theme-color" content="#020617" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased overflow-hidden selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  );
}