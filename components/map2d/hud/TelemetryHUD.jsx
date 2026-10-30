// components/map2d/hud/TelemetryHUD.jsx
'use client';

import { useState, useEffect } from 'react';

export default function TelemetryHUD({ mousePos, simulatedTime }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedTime = new Date(simulatedTime || Date.now())
    .toISOString()
    .substring(11, 19) + ' UTC';

  return (
    <div className="font-mono text-xs select-none space-y-2 text-cyan-300 w-64 p-1">
      {/* 1. RELOJ UTC */}
      <div className="flex justify-between items-center bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
        <span className="text-slate-400 font-semibold text-[11px]">HORA UTC:</span>
        <span className="text-amber-300 font-extrabold tabular-nums text-xs">
          {mounted ? formattedTime : '--:--:-- UTC'}
        </span>
      </div>

      {/* 2. UBICACIÓN GEOGRÁFICA */}
      <div className="space-y-1.5 bg-slate-900/50 p-2 rounded-lg border border-cyan-900/40">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400">CONTINENTE:</span>
          <span className="text-amber-400 font-bold truncate max-w-[130px] text-right">
            {mousePos?.continent || 'Océano Global'}
          </span>
        </div>

        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400">REGIÓN / PAÍS:</span>
          <span className="text-cyan-300 font-bold truncate max-w-[130px] text-right">
            {mousePos?.country || 'Mar Abierto'}
          </span>
        </div>
      </div>

      {/* 3. COORDENADAS GEODÉSICAS */}
      <div className="space-y-1.5 bg-slate-900/50 p-2 rounded-lg border border-cyan-900/40">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400">LATITUD:</span>
          <span className="text-cyan-200 font-bold tabular-nums">
            {mousePos?.lat !== undefined ? `${mousePos.lat.toFixed(4)}° N` : '0.0000° N'}
          </span>
        </div>

        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400">LONGITUD:</span>
          <span className="text-cyan-200 font-bold tabular-nums">
            {mousePos?.lon !== undefined ? `${mousePos.lon.toFixed(4)}° E` : '0.0000° E'}
          </span>
        </div>
      </div>
    </div>
  );
}