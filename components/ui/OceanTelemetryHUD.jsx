// components/ui/OceanTelemetryHUD.jsx
'use client';

import { OCEAN_TELEMETRY } from '@/lib/oceanData';

export default function OceanTelemetryHUD({ selectedOceanId, onClose }) {
  if (!selectedOceanId || !OCEAN_TELEMETRY[selectedOceanId]) return null;

  const data = OCEAN_TELEMETRY[selectedOceanId];

  return (
    <div className="absolute bottom-6 right-6 z-30 w-80 bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 rounded-xl p-4 font-mono shadow-[0_0_20px_rgba(6,182,212,0.25)] select-none">
      {/* CABECERA */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-base">🌊</span>
          <h3 className="text-xs font-bold text-cyan-200 uppercase tracking-wider">
            {data.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-red-400 text-xs font-bold"
        >
          ✕
        </button>
      </div>

      {/* REJILLA DE TELEMETRÍA */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[9px] block uppercase">Salinidad</span>
          <span className="text-emerald-400 font-bold">{data.salinity}</span>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[9px] block uppercase">Temp. Promedio</span>
          <span className="text-amber-400 font-bold">{data.avgTemp}</span>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[9px] block uppercase">Prof. Máxima</span>
          <span className="text-cyan-400 font-bold">{data.maxDepth}</span>
        </div>
        <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
          <span className="text-slate-400 text-[9px] block uppercase">Densidad Agua</span>
          <span className="text-purple-400 font-bold">{data.density}</span>
        </div>
      </div>

      {/* CORRIENTE DOMINANTE */}
      <div className="mt-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[10px]">
        <span className="text-slate-400 text-[9px] block uppercase">Giro Oceanográfico</span>
        <span className="text-cyan-300 font-semibold">{data.current}</span>
      </div>
    </div>
  );
}