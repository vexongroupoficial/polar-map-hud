import './globals.css';

export const metadata = {
  title: 'Mapa Polar Terrestre',
  description: 'Plano polar azimutal de la Tierra en coordenadas polares',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}