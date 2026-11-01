
// components/ui/CitySearchHUD.jsx
'use client';

import { useState, useMemo } from 'react';
import { WORLD_CITIES } from '@/lib/citiesData';

export default function CitySearchHUD({ onSelectCity, selectedCity }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCities = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return WORLD_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const handleSelect = (city) => {
    setQuery(city.name);
    setIsOpen(false);
    if (typeof onSelectCity === 'function') {
      onSelectCity(city);
    }
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    if (typeof onSelectCity === 'function') {
      onSelectCity(null);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-30 w-72 font-mono select-none">
      <div className="relative">
        <div className="flex items-center bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl px-3 py-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <span className="text-cyan-400 mr-2 text-sm">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="BUSCAR CIUDAD..."
            className="w-full bg-transparent text-xs text-cyan-100 placeholder-slate-500 outline-none font-bold uppercase tracking-wider"
          />
          {query && (
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-red-400 text-xs font-bold px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* DESPLEGABLE DE RESULTADOS */}
        {isOpen && filteredCities.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-1.5 bg-slate-950/95 backdrop-blur-md border border-cyan-500/30 rounded-xl overflow-hidden shadow-2xl z-40 space-y-0.5 p-1">
            {filteredCities.map((city) => {
              const isSelected = selectedCity?.id === city.id;
              return (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50'
                      : 'hover:bg-slate-900/80 text-slate-300 hover:text-cyan-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">📍</span>
                    <span className="font-bold">{city.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase">{city.country}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}