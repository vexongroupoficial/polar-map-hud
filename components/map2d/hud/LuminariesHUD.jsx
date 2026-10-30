// components/map2d/hud/LuminariesHUD.jsx
'use client';

import { useState, useEffect, useRef } from 'react';

export function LuminariesHUD({
  simulatedTime = Date.now(),
  setSimulatedTime,
  activeLayers = {},
  onToggleLayer,
}) {
  const [isPaused, setIsPaused] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isMounted, setIsMounted] = useState(false); // Prevención de Hydration Mismatch
  const animRef = useRef(null);
  const lastTimeRef = useRef(performance.now());

  // Sincronización para garantizar que el componente esté cargado en el cliente antes de renderizar la fecha
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const SPEED_PRESETS = [
    { label: 'REAL', value: 1 },
    { label: '1h/s', value: 3600 },
    { label: '1d/s', value: 86400 },
    { label: '7d/s', value: 604800 },
    { label: '30d/s', value: 2592000 },
  ];

  // Bucle Kinemático a 60 FPS
  useEffect(() => {
    if (isPaused) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now) => {
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (typeof setSimulatedTime === 'function' && deltaMs > 0) {
        setSimulatedTime((prevTime) => prevTime + deltaMs * speedMultiplier);
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPaused, speedMultiplier, setSimulatedTime]);

  const handleStepDays = (days) => {
    if (typeof setSimulatedTime === 'function') {
      setSimulatedTime((prevTime) => prevTime + days * 86400 * 1000);
    }
  };

  const handleResetRealTime = () => {
    if (typeof setSimulatedTime === 'function') {
      setSimulatedTime(Date.now());
    }
    setIsPaused(true);
    setSpeedMultiplier(1);
  };

  const handleToggle = (layerId) => {
    if (typeof onToggleLayer === 'function') {
      onToggleLayer(layerId);
    }
  };

  // Formateo dinámico seguro
  const formattedDate = new Date(simulatedTime)
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19) + ' UTC';

  const isSunlightActive = !!activeLayers.sunlight;
  const isMoonActive = !!activeLayers.moonPhases || !!activeLayers.moon;
  const isPlanetsActive = !!activeLayers.planets;

  return (
    <div className="w-72 font-mono text-xs select-none space-y-2 text-cyan-300">
      
      {/* 1. VISOR TEMPORAL KINEMÁTICO */}
      <div className="px-2.5 py-1.5 bg-slate-900 border border-cyan-500/40 rounded-lg shadow-inner">
        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
          <span>TIEMPO CELESTE:</span>
          <span className={isPaused ? 'text-amber-400 font-extrabold' : 'text-emerald-400 font-extrabold'}>
            {isPaused ? '⏸ PAUSADO' : `▶ ${speedMultiplier}x`}
          </span>
        </div>
        <div className="text-amber-300 font-extrabold text-[12px] text-center tabular-nums mt-0.5 tracking-wider">
          {/* Muestra un placeholder en SSR y la fecha real tras hidratarse en el navegador */}
          {isMounted ? formattedDate : '---- --- -- --:--:-- UTC'}
        </div>
      </div>

      {/* 2. CONTROLES REPRODUCTORES TEMPORALES */}
      <div className="grid grid-cols-5 gap-1">
        <button
          type="button"
          onClick={() => handleStepDays(-7)}
          className="py-1 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded text-[10px] font-bold cursor-pointer transition active:scale-95"
          title="Retroceder 7 días"
        >
          -7d
        </button>
        <button
          type="button"
          onClick={() => handleStepDays(-1)}
          className="py-1 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded text-[10px] font-bold cursor-pointer transition active:scale-95"
          title="Retroceder 1 día"
        >
          -1d
        </button>
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className={`py-1 border rounded font-extrabold text-[10px] cursor-pointer transition active:scale-95 ${
            isPaused
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
              : 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
          }`}
        >
          {isPaused ? '▶ PLAY' : '⏸ PAUSA'}
        </button>
        <button
          type="button"
          onClick={() => handleStepDays(1)}
          className="py-1 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded text-[10px] font-bold cursor-pointer transition active:scale-95"
          title="Avanzar 1 día"
        >
          +1d
        </button>
        <button
          type="button"
          onClick={() => handleStepDays(7)}
          className="py-1 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded text-[10px] font-bold cursor-pointer transition active:scale-95"
          title="Avanzar 7 días"
        >
          +7d
        </button>
      </div>

      {/* 3. MULTIPLICADORES DE VELOCIDAD */}
      <div className="flex items-center gap-1">
        {SPEED_PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => {
              setSpeedMultiplier(p.value);
              setIsPaused(false);
            }}
            className={`flex-1 py-0.5 border text-[9px] font-bold rounded cursor-pointer transition active:scale-95 ${
              speedMultiplier === p.value && !isPaused
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)] font-black'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-200'
            }`}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleResetRealTime}
          className="px-2 py-0.5 border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900 text-[9px] text-amber-300 font-extrabold rounded cursor-pointer transition active:scale-95 shrink-0"
          title="Restablecer tiempo actual UTC"
        >
          ⏱️ REAL
        </button>
      </div>

      {/* 4. INTERRUPTORES DIRECTOS DE CAPAS ASTRONÓMICAS */}
      <div className="pt-2 border-t border-slate-800/80 space-y-1">
        <button
          type="button"
          onClick={() => handleToggle('sunlight')}
          className={`w-full py-1 px-2 rounded border text-[10px] font-bold flex justify-between items-center transition cursor-pointer ${
            isSunlightActive
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span>☀️</span>
            <span>SOL REAL / DÍA-NOCHE</span>
          </span>
          <span className={`w-2 h-2 rounded-full ${isSunlightActive ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24]' : 'bg-slate-700'}`} />
        </button>

        <button
          type="button"
          onClick={() => handleToggle('moonPhases')}
          className={`w-full py-1 px-2 rounded border text-[10px] font-bold flex justify-between items-center transition cursor-pointer ${
            isMoonActive
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span>🌙</span>
            <span>FASES LUNARES Y NODOS</span>
          </span>
          <span className={`w-2 h-2 rounded-full ${isMoonActive ? 'bg-cyan-300 shadow-[0_0_6px_#67e8f9]' : 'bg-slate-700'}`} />
        </button>

        <button
          type="button"
          onClick={() => handleToggle('planets')}
          className={`w-full py-1 px-2 rounded border text-[10px] font-bold flex justify-between items-center transition cursor-pointer ${
            isPlanetsActive
              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.25)]'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <span>🪐</span>
            <span>PLANETAS CLÁSICOS</span>
          </span>
          <span className={`w-2 h-2 rounded-full ${isPlanetsActive ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-700'}`} />
        </button>
      </div>

    </div>
  );
}

export default LuminariesHUD;