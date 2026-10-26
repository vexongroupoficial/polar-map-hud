'use client';

import { useMemo } from 'react';

function findNextEclipse(startTimeMs) {
  let searchTime = startTimeMs;
  const stepMs = 12 * 3600 * 1000;
  const maxSearchMs = startTimeMs + 365 * 86400 * 1000;

  while (searchTime < maxSearchMs) {
    const date = new Date(searchTime);
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const dayOfYear = (date - startOfYear) / (1000 * 60 * 60 * 24);

    const solarDeclination = 23.44 * Math.sin(((2 * Math.PI) / 365.25) * (dayOfYear - 80));
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    let solarLon = (12 - utcHours) * 15;
    while (solarLon > 180) solarLon -= 360;
    while (solarLon < -180) solarLon += 360;

    const draconicDays = 27.2122;
    const lunarDeclination = 28.5 * Math.sin(((2 * Math.PI) / draconicDays) * (dayOfYear - 5));
    const synodicDays = 29.53059;
    const moonAgeDays = (dayOfYear % synodicDays);
    let moonLon = solarLon - (moonAgeDays / synodicDays) * 360;
    while (moonLon > 180) moonLon -= 360;
    while (moonLon < -180) moonLon += 360;

    const nodalPrecessionDays = 6793.5;
    const nodeLonAscending = ((180 - (dayOfYear / nodalPrecessionDays) * 360) % 360);
    let nodeLonDescending = nodeLonAscending + 180;
    while (nodeLonDescending > 180) nodeLonDescending -= 360;

    let angleDiff = ((solarLon - moonLon + 360) % 360);

    const distAsc = Math.hypot(solarLon - nodeLonAscending, solarDeclination - 0);
    const distDesc = Math.hypot(solarLon - nodeLonDescending, solarDeclination - 0);
    const inNodeZone = (distAsc < 16 || distDesc < 16);

    const isConjunction = (angleDiff < 10 || angleDiff > 350);
    const isOpposition = (Math.abs(angleDiff - 180) < 10);

    if (inNodeZone && isConjunction) {
      return { type: 'SOLAR', targetTime: searchTime, node: distAsc < 16 ? '☊ ASCENDENTE' : '☋ DESCENDENTE' };
    }
    if (inNodeZone && isOpposition) {
      return { type: 'LUNAR', targetTime: searchTime, node: distAsc < 16 ? '☊ ASCENDENTE' : '☋ DESCENDENTE' };
    }

    searchTime += stepMs;
  }

  return null;
}

export default function EclipseDetectorHUD({ simulatedTime }) {
  const nextEclipse = useMemo(() => findNextEclipse(simulatedTime), [simulatedTime]);

  if (!nextEclipse) return null;

  const timeDiffMs = nextEclipse.targetTime - simulatedTime;
  const daysLeft = Math.floor(timeDiffMs / (86400 * 1000));
  const hoursLeft = Math.floor((timeDiffMs % (86400 * 1000)) / (3600 * 1000));

  const isOngoing = daysLeft <= 0 && hoursLeft <= 2;

  return (
    <div className="absolute top-52 right-4 z-20 flex flex-col gap-1.5 bg-slate-950/90 border border-purple-500/50 p-2.5 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.3)] font-mono text-xs w-64 select-none">
      <div className="flex items-center justify-between border-b border-purple-500/30 pb-1">
        <span className="flex items-center gap-1 font-bold text-purple-300 text-[11px]">
          <span className="animate-pulse">🔴</span> DETECTOR ECLIPSES
        </span>
        <span className="text-[9px] px-1 py-0.5 rounded bg-purple-950 border border-purple-600 text-purple-200 font-bold">
          {nextEclipse.node}
        </span>
      </div>

      <div className="flex items-center justify-between mt-0.5 text-[11px]">
        <span className="text-slate-400">EVENTO:</span>
        <span className={`font-bold ${nextEclipse.type === 'SOLAR' ? 'text-amber-400' : 'text-rose-400'}`}>
          ECLIPSE {nextEclipse.type}
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">FECHA:</span>
        <span className="text-cyan-300 font-bold">
          {new Date(nextEclipse.targetTime).toISOString().substring(0, 10)}
        </span>
      </div>

      <div className="mt-0.5 p-1 bg-slate-900 border border-purple-500/30 rounded text-center">
        {isOngoing ? (
          <span className="text-rose-400 font-bold animate-pulse text-[11px]">
            ⚠️ ALINEACIÓN EN CURSO
          </span>
        ) : (
          <div className="flex justify-center items-center gap-1.5 text-cyan-200 text-[11px]">
            <span>T-MINUS:</span>
            <span className="text-amber-300 font-bold">
              {daysLeft}d {hoursLeft}h
            </span>
          </div>
        )}
      </div>
    </div>
  );
}