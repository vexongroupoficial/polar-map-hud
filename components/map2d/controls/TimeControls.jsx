'use client';

import { useState } from 'react';

export default function TimeControls({
  simulatedTime,
  setSimulatedTime,
  isPaused,
  setIsPaused,
  speedMultiplier,
  setSpeedMultiplier,
  onResetRealTime,
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  const SPEED_PRESETS = [
    { label: 'REAL', value: 1 },
    { label: '1h/s', value: 3600 },
    { label: '1d/s', value: 86400 },
    { label: '7d/s', value: 604800 },
    { label: '30d/s', value: 2592000 },
  ];

  const handleStepTime = (days) => {
    setSimulatedTime((prev) => prev + days * 86400 * 1000);
  };

  const currentDate = new Date(simulatedTime);

  return (
    <div className="absolute bottom-4 right-4 z-30 font-mono text-xs select-none w-80">
      <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] text-cyan-300 overflow-hidden transition-all duration-300">
        
        {/* Cabecera Telemétrica */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isPaused ? 'bg-amber-400' : 'bg-emerald-400'
                } opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isPaused ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              ></span>
            </span>
            <span className="font-bold text-[10px] tracking-wider text-cyan-200 uppercase">
              SIMULADOR DE LUMINARIAS
            </span>
          </div>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-slate-400 hover:text-cyan-300 px-1 text-[11px] font-bold"
            title={isMinimized ? 'Expandir' : 'Plegar'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>

        {/* Módulo de Tiempo UTC */}
        <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-semibold">TIEMPO KINEMÁTICO:</span>
          <span className="text-amber-300 font-bold text-[11px] tracking-widest tabular-nums">
            {currentDate.toISOString().replace('T', ' ').substring(0, 19)} UTC
          </span>
        </div>

        {/* Panel Principal de Mandos */}
        {!isMinimized && (
          <div className="p-2.5 flex flex-col gap-2.5 bg-slate-950/60">
            
            {/* Fila 1: Botones de Reproducción y Saltos */}
            <div className="grid grid-cols-5 gap-1">
              <button
                onClick={() => handleStepTime(-7)}
                className="py-1 bg-slate-900/90 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/40 rounded text-[10px] text-center transition-all"
                title="-7 Días"
              >
                ⏪ -7d
              </button>
              <button
                onClick={() => handleStepTime(-1)}
                className="py-1 bg-slate-900/90 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/40 rounded text-[10px] text-center transition-all"
                title="-1 Día"
              >
                ◀ -1d
              </button>
              
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`py-1 border rounded font-bold text-[10px] text-center transition-all ${
                  isPaused
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.35)]'
                    : 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.35)]'
                }`}
              >
                {isPaused ? '▶ PLAY' : '⏸ PAUSA'}
              </button>

              <button
                onClick={() => handleStepTime(1)}
                className="py-1 bg-slate-900/90 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/40 rounded text-[10px] text-center transition-all"
                title="+1 Día"
              >
                +1d ▶
              </button>
              <button
                onClick={() => handleStepTime(7)}
                className="py-1 bg-slate-900/90 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/40 rounded text-[10px] text-center transition-all"
                title="+7 Días"
              >
                +7d ⏩
              </button>
            </div>

            {/* Fila 2: Aceleración de Simulación y Reset */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-cyan-500/20">
              <div className="flex items-center gap-1 flex-1 justify-between">
                {SPEED_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      setSpeedMultiplier(preset.value);
                      setIsPaused(false);
                    }}
                    className={`px-1.5 py-0.5 text-[9px] rounded border transition-all ${
                      speedMultiplier === preset.value && !isPaused
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                        : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <button
                onClick={onResetRealTime}
                className="px-2 py-0.5 rounded border border-cyan-500/50 bg-cyan-950/70 hover:bg-cyan-800/60 text-[9px] text-cyan-200 font-bold transition-all"
                title="Restablecer UTC tiempo real"
              >
                ⏱️ REAL
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}