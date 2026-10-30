// components/map2d/hud/CitySearchHUD.jsx
'use client';

import { useState } from 'react';
import { useGeoData } from '../hooks/useGeoData';

export function CitySearchHUD({ onSelectLocation }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const geoDataRaw = useGeoData();
  const geoData = geoDataRaw?.geoData || geoDataRaw || {};
  const countriesData = geoData.countriesData;
  const airportsData = geoData.airportsData;

  const search = query.trim().toLowerCase();

  // BÚSQUEDA EN PAÍSES (Extrae coordenadas exactas de etiqueta/centroide)
  const matchedCountries =
    search.length > 0 && countriesData?.features
      ? countriesData.features
          .filter((f) => {
            const p = f.properties || {};
            const name = p.ADMIN || p.NAME || p.name || p.name_long || '';
            return name.toLowerCase().includes(search);
          })
          .map((f) => {
            const p = f.properties || {};
            const name = p.ADMIN || p.NAME || p.name || 'País';

            let lat = undefined;
            let lon = undefined;

            // 1. Usar coordenadas de etiqueta oficial si existen
            if (p.label_y !== undefined && p.label_x !== undefined) {
              lat = Number(p.label_y);
              lon = Number(p.label_x);
            } else if (p.LAT !== undefined && p.LON !== undefined) {
              lat = Number(p.LAT);
              lon = Number(p.LON);
            } else if (f.bbox && f.bbox.length >= 4) {
              // 2. Si usa bbox, ajustar si cruza el antimeridiano
              let minLon = f.bbox[0];
              let minLat = f.bbox[1];
              let maxLon = f.bbox[2];
              let maxLat = f.bbox[3];

              lat = (minLat + maxLat) / 2;
              
              if (maxLon < minLon) {
                lon = ((minLon + maxLon + 360) / 2) % 360;
                if (lon > 180) lon -= 360;
              } else {
                lon = (minLon + maxLon) / 2;
              }
            } else if (f.geometry?.coordinates) {
              // 3. Obtener primer vértice representativo
              const firstCoord =
                f.geometry.type === 'Polygon'
                  ? f.geometry.coordinates[0][0]
                  : f.geometry.coordinates[0][0][0];
              if (firstCoord) {
                lon = firstCoord[0];
                lat = firstCoord[1];
              }
            }

            return {
              name,
              lat: lat || 0,
              lon: lon || 0,
              subtext: 'País / Masa Terrestre',
              type: 'País',
            };
          })
      : [];

  // BÚSQUEDA EN AEROPUERTOS (Coordenadas de punto exacto)
  const matchedAirports =
    search.length > 0 && airportsData?.features
      ? airportsData.features
          .filter((f) => {
            const p = f.properties || {};
            const iata = p.iata_code || p.IATA || p.abbrev || '';
            const name = p.name || p.NAME || '';
            const muni = p.municipality || p.city || '';

            return (
              name.toLowerCase().includes(search) ||
              iata.toLowerCase().includes(search) ||
              muni.toLowerCase().includes(search)
            );
          })
          .map((f) => {
            const p = f.properties || {};
            const iata = p.iata_code || p.IATA || 'APT';
            const name = p.name || p.NAME || 'Aeropuerto';
            const city = p.municipality || p.city || 'Ubicación';
            const coords = f.geometry?.coordinates || [0, 0];

            return {
              name: `[${iata}] ${name}`,
              lat: coords[1],
              lon: coords[0],
              subtext: city,
              type: 'Aeropuerto',
            };
          })
      : [];

  const searchResults = [...matchedCountries, ...matchedAirports].slice(0, 8);

  const handleSelect = (loc) => {
    setQuery(loc.name);
    setIsOpen(false);
    if (typeof onSelectLocation === 'function') {
      onSelectLocation(loc.lat, loc.lon);
    }
  };

  return (
    <div className="w-72 font-mono text-xs select-none space-y-2 text-cyan-300 relative overflow-visible">
      <div className="relative overflow-visible">
        <div className="flex items-center gap-2 bg-slate-900 border border-cyan-500/40 rounded-lg px-2.5 py-1.5 focus-within:border-cyan-400 transition-colors shadow-lg">
          <span className="text-cyan-400">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar País, Ciudad o IATA..."
            className="w-full bg-transparent text-xs text-cyan-200 placeholder-slate-500 outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="text-slate-500 hover:text-cyan-300 font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {isOpen && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-950/95 border border-cyan-500/60 rounded-lg overflow-y-auto backdrop-blur-xl shadow-2xl z-[9999] max-h-60">
            {searchResults.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(loc);
                }}
                className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-200 border-b border-slate-800/60 last:border-0 flex justify-between items-center transition cursor-pointer"
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="font-semibold text-cyan-200 truncate">{loc.name}</span>
                  <span className="text-[10px] text-slate-400 truncate">{loc.subtext}</span>
                </div>
                <span className="text-[9px] bg-slate-900 text-cyan-400 border border-cyan-800/50 px-1.5 py-0.5 rounded shrink-0">
                  {loc.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CitySearchHUD;