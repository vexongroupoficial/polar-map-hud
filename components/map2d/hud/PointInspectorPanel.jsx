'use client';

export default function PointInspectorPanel({ selectedPoint }) {
  if (!selectedPoint) {
    return (
      <div className="bg-slate-950/80 backdrop-blur-md border border-sky-500/30 p-3 rounded-xl text-[10px] font-mono text-slate-400">
        🖱️ Haz clic en cualquier punto del plano polar para inspeccionar telemetría y cartografía.
      </div>
    );
  }

  const { lat, lon, rho, theta, cardinals, country, continent } = selectedPoint;

  return (
    <div className="bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 p-3.5 rounded-xl text-[10px] font-mono shadow-2xl space-y-2.5 min-w-[240px]">
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
        <span className="text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
          <span>🎯</span> INSPECTOR GEODÉSICO
        </span>
        <span className="text-emerald-400 text-[9px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">
          ACTIVO
        </span>
      </div>

      {/* Ubicación Cartográfica */}
      <div className="space-y-1 text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">CONTINENTE:</span>
          <span className="text-sky-300 font-bold truncate max-w-[130px]">{continent}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">PAÍS / REGIÓN:</span>
          <span className="text-amber-300 font-bold truncate max-w-[130px]">{country}</span>
        </div>
      </div>

      {/* Coordenadas Geográficas (Lat/Lon) */}
      <div className="border-t border-slate-800 pt-1.5 space-y-1 text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">LATITUD (Y):</span>
          <span className="text-emerald-300 font-bold">{lat.toFixed(4)}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">LONGITUD (X):</span>
          <span className="text-emerald-300 font-bold">{lon.toFixed(4)}°</span>
        </div>
      </div>

      {/* 4 Coordenadas Cardinales / Polares Relativas */}
      <div className="border-t border-slate-800 pt-1.5 space-y-1 text-slate-300">
        <div className="text-[9px] font-bold text-cyan-300 mb-1">VECTOR CARDINAL / POLAR:</div>
        <div className="flex justify-between">
          <span className="text-slate-400">EJE LATERAL (N/S):</span>
          <span className="text-sky-200 font-bold">{cardinals.norteRelativo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">EJE LONGITUD (E/W):</span>
          <span className="text-sky-200 font-bold">{cardinals.esteOeste}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">RADIO POLAR ($\rho$):</span>
          <span className="text-amber-200 font-bold">{rho.toFixed(1)} px</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">AZIMUT ($\theta$):</span>
          <span className="text-amber-200 font-bold">{cardinals.rumboAzimutal}</span>
        </div>
      </div>
    </div>
  );
}