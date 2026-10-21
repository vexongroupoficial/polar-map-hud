'use client';

import { useState } from 'react';

const POPULAR_CITIES = [
  { name: 'Quito, Ecuador', lat: -0.1807, lon: -78.4678 },
  { name: 'Bogotá, Colombia', lat: 4.711, lon: -74.0721 },
  { name: 'Caracas, Venezuela', lat: 10.4806, lon: -66.9036 },
  { name: 'Ciudad de México, México', lat: 19.4326, lon: -99.1332 },
  { name: 'Buenos Aires, Argentina', lat: -34.6037, lon: -58.3816 },
  { name: 'Madrid, España', lat: 40.4168, lon: -3.7038 },
  { name: 'Nueva York, EE.UU.', lat: 40.7128, lon: -74.006 },
  { name: 'Tokio, Japón', lat: 35.6762, lon: 139.6503 },
  { name: 'Sídney, Australia', lat: -33.8688, lon: 151.2093 },
];

export default function LocationSearch({ countriesData, onSelectLocation }) {
  const [query, setQuery] = useState('');

  const filteredCountries = countriesData
    ? countriesData.features
        .map((f) => ({
          name: f.properties?.ADMIN || f.properties?.NAME,
          bbox: f.bbox,
        }))
        .filter((c) => c.name && c.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectCountry = (country) => {
    if (country.bbox && typeof onSelectLocation === 'function') {
      const lon = (country.bbox[0] + country.bbox[2]) / 2;
      const lat = (country.bbox[1] + country.bbox[3]) / 2;
      onSelectLocation({ name: country.name, lat, lon });
    }
    setQuery('');
  };

  const handleSelectCity = (city) => {
    if (typeof onSelectLocation === 'function') {
      onSelectLocation(city);
    }
    setQuery('');
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 relative">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Buscador de Ubicaciones
      </h3>
      <input
        type="text"
        placeholder="Buscar país o ciudad..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
      />

      {query.length > 1 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto">
          {filteredCities.map((city) => (
            <button
              key={city.name}
              onClick={() => handleSelectCity(city)}
              className="w-full text-left px-3 py-2 text-xs text-sky-400 hover:bg-slate-900 border-b border-slate-900 transition-colors flex items-center justify-between"
            >
              <span>{city.name}</span>
              <span className="text-[10px] text-slate-500">Ciudad</span>
            </button>
          ))}
          {filteredCountries.map((country) => (
            <button
              key={country.name}
              onClick={() => handleSelectCountry(country)}
              className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-900 border-b border-slate-900 transition-colors flex items-center justify-between"
            >
              <span>{country.name}</span>
              <span className="text-[10px] text-slate-500">País</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}