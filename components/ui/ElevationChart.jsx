'use client';

export default function ElevationChart({ profileData }) {
  if (!profileData || profileData.length === 0) return null;

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Perfil Topográfico Transversal (P1 ➔ P2)
      </h3>
      <div className="h-24 bg-slate-950 rounded-lg p-2 flex items-end space-x-1 border border-slate-800">
        {profileData.map((pt, idx) => {
          const heightPercent = Math.max(10, Math.min(100, (Math.abs(pt.elevation) / 3000) * 100));
          return (
            <div
              key={idx}
              style={{ height: `${heightPercent}%` }}
              className={`flex-1 rounded-t transition-all ${
                pt.elevation >= 0 ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-sky-600 hover:bg-sky-500'
              }`}
              title={`Lat: ${pt.lat.toFixed(1)}°, Lon: ${pt.lon.toFixed(1)}° | Alt: ${pt.elevation}m`}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>Punto 1</span>
        <span>Punto Medio</span>
        <span>Punto 2</span>
      </div>
    </div>
  );
}