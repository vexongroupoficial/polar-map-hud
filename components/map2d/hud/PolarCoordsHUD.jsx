// components/map2d/hud/PolarCoordsHUD.jsx
'use client';

export function PolarCoordsHUD({
  radiusPx = 241.2,
  azimuthDeg = 99.7,
}) {
  return (
    <div className="w-56 font-mono text-xs select-none space-y-1 text-cyan-300">
      <div className="text-[10px] text-cyan-400/80 font-bold tracking-wider uppercase border-b border-cyan-900/40 pb-1">
        📐 COORDENADAS POLARES (ρ, θ)
      </div>

      <div className="flex items-center justify-between py-0.5">
        <span className="text-slate-400 text-[11px]">RADIO POLAR (ρ):</span>
        <span className="text-amber-300 font-bold tabular-nums">{radiusPx} px</span>
      </div>

      <div className="flex items-center justify-between py-0.5">
        <span className="text-slate-400 text-[11px]">ÁNGULO AZIMUT (θ):</span>
        <span className="text-amber-300 font-bold tabular-nums">{azimuthDeg}°</span>
      </div>
    </div>
  );
}

export default PolarCoordsHUD;