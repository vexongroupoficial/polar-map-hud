'use client';

import { useState } from 'react';
import { utmToPolar } from '@/lib/polarMath';

export default function UtmInspector({ onNavigateToUtm }) {
  const [easting, setEasting] = useState('500000');
  const [northing, setNorthing] = useState('0');
  const [zone, setZone] = useState('17');
  const [isNorthern, setIsNorthern] = useState(true);

  const handleConvert = (e) => {
    e.preventDefault();
    if (!onNavigateToUtm) return;
    
    onNavigateToUtm({
      easting: Number(easting),
      northing: Number(northing),
      zone: Number(zone),
      isNorthern,
    });
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Inspector / Conversor UTM
      </h3>

      <form onSubmit={handleConvert} className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Este (m)</label>
            <input
              type="number"
              value={easting}
              onChange={(e) => setEasting(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Norte (m)</label>
            <input
              type="number"
              value={northing}
              onChange={(e) => setNorthing(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1">Zona UTM</label>
            <input
              type="number"
              min="1"
              max="60"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Hemisferio</label>
            <select
              value={isNorthern ? 'N' : 'S'}
              onChange={(e) => setIsNorthern(e.target.value === 'N')}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200"
            >
              <option value="N">Norte (N)</option>
              <option value="S">Sur (S)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium transition-colors mt-1"
        >
          Ubicar Coordenada UTM
        </button>
      </form>
    </div>
  );
}