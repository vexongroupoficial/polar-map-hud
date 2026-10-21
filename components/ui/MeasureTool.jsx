'use client';

import { calculateHaversineDistance } from '../map2d/layers/drawMeasurements';

export default function MeasureTool({ measurePoints = [], onClearMeasurements }) {
  const points = measurePoints || [];
  const p1 = points[0];
  const p2 = points[1];

  const distanceKm = p1 && p2 ? calculateHaversineDistance(p1.lat, p1.lon, p2.lat, p2.lon) : null;

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Medidor de Distancia
        </h3>
        {points.length > 0 && (
          <button
            onClick={onClearMeasurements}
            className="text-[10px] text-rose-400 hover:underline"
          >
            Limpiar Puntos
          </button>
        )}
      </div>

      <p className="text-[11px] text-slate-400">
        Activa la capa de medición y haz clic en el mapa para marcar P1 y P2.
      </p>

      <div className="space-y-1 text-xs font-mono">
        <div className="flex justify-between text-slate-300">
          <span>P1:</span>
          <span>
            {p1 ? `${p1.lat.toFixed(2)}°, ${p1.lon.toFixed(2)}°` : 'Haga clic en mapa'}
          </span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>P2:</span>
          <span>
            {p2 ? `${p2.lat.toFixed(2)}°, ${p2.lon.toFixed(2)}°` : 'Haga clic en mapa'}
          </span>
        </div>
      </div>

      {distanceKm !== null && (
        <div className="bg-slate-950 p-2.5 rounded-lg border border-sky-500/30 text-center">
          <div className="text-[10px] text-slate-400 uppercase">Distancia Ortodrómica Real</div>
          <div className="text-lg font-bold text-sky-400 font-mono">
            {distanceKm.toLocaleString()} km
          </div>
        </div>
      )}
    </div>
  );
}