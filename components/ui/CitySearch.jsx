'use client';

import { useState } from 'react';

// Base de datos táctica rápida de ubicaciones clave
const QUICK_LOCATIONS = [
  { name: 'Tokyo (HND)', lat: 35.5494, lon: 139.7798, country: 'Japón' },
  { name: 'Nueva York (JFK)', lat: 40.6413, lon: -73.7781, country: 'EE.UU.' },
  { name: 'Londres (LHR)', lat: 51.4700, lon: -0.4543, country: 'Reino Unido' },
  { name: 'París (CDG)', lat: 49.0097, lon: 2.5479, country: 'Francia' },
  { name: 'Sídney (SYD)', lat: -33.9399, lon: 151.1753, country: 'Australia' },
  { name: 'Buenos Aires (EZE)', lat: -34.8222, lon: -58.5358, country: 'Argentina' },
  { name: 'Ciudad de México (MEX)', lat: 19.4363, lon: -99.0721, country: 'México' },
  { name: 'Reikiavik (KEF)', lat: 63.9850, lon: -22.6056, country: 'Islandia' },
  { name: 'El Cairo (CAI)', lat: 30.1219, lon: 31.4056, country: 'Egipto' },
];

export default function CitySearch({ onSelectLocation, airportsData }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filtrar sugerencias combinadas (Locales + GeoJSON de Aeropuertos cargados)
  const results = query.trim().length > 1
    ? [
        ...QUICK_LOCATIONS.filter(l => l.name.toLowerCase().includes(query.toLowerCase())),
        ...(airportsData?.features || [])
          .filter(f => {
            const p = f.properties || {};
            const search = query.toLowerCase();
            return (
              (p.name && p.name.toLowerCase().includes(search)) ||
              (p.iata_code && p.iata_code.toLowerCase().includes(search)) ||
              (p.municipality && p.municipality.toLowerCase().includes(search))
            );
          })
          .map(f => ({
            name: `[${f.properties.iata_code || 'APT'}] ${f.properties.name}`,
            lat: f.geometry.coordinates[1],
            lon: f.geometry.coordinates[0],
            country: f.properties.municipality || 'Aeropuerto'
          }))
      ].slice(0, 6)
    : [];

    // En components/ui/CitySearch.jsx
    const handleSelect = (loc) => {
    if (typeof onSelectLocation === 'function') {
        onSelectLocation(loc.lat, loc.lon);
    }
    setQuery(loc.name);
    setIsOpen(false);
    };

  return (
    <div className="absolute top-4 left-4 z-30 w-72">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="🔍 Buscar Ciudad / Aeropuerto (IATA)..."
          className="w-full bg-slate-900/90 border border-sky-500/40 text-sky-200 text-xs rounded-lg px-3 py-2 pl-8 focus:outline-none focus:border-sky-400 backdrop-blur shadow-lg shadow-sky-950/50"
        />
        <span className="absolute left-2.5 top-2.5 text-sky-400 text-xs">🌐</span>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-slate-900/95 border border-sky-500/30 rounded-lg overflow-hidden backdrop-blur shadow-2xl">
          {results.map((loc, index) => (
            <button
              key={index}
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-sky-500/20 hover:text-sky-300 border-b border-slate-800/50 last:border-0 flex justify-between items-center transition-colors"
            >
              <span className="font-mono font-semibold truncate">{loc.name}</span>
              <span className="text-[10px] text-sky-400/70 font-mono ml-2">{loc.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}