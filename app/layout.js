import './globals.css';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Estación Geodésica • Proyección Polar Terrestre HUD',
  description: 'Plano geodésico y mapa polar interactivo a nivel del mar con coordenadas azimutales y mediciones ortodrómicas.',
  keywords: ['mapa polar', 'proyección azimutal', 'geodesia', 'coordenadas polares', 'HUD'],
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