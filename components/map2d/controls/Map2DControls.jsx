'use client';

import { useState } from 'react';

export default function Map2DControls({
  rotation = 180,
  onRotateChange,
  zoom = 1,
  onZoomChange,
  onResetView,
  activeLayers = {},
  onToggleLayer,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isNeon = activeLayers?.neonMode ?? true;

  const CARDINAL_PRESETS = [
    { label: '180° N', value: 180 },
    { label: '0° S', value: 0 },
    { label: '90° E', value: 90 },
    { label: '270° W', value: 270 },
  ];

  const ZOOM_PRESETS = [1.0, 2.5, 5.0];

  return (
    <div className="absolute top-4 right-4 z-30 font-mono text-xs select-none">
      <div className="bg-slate-950/90 border border-cyan-500/40 rounded-xl backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.25)] text-cyan-300 w-64 overflow-hidden transition-all duration-300">
        
        {/* Cabecera Táctica */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-cyan-500/30">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-bold tracking-wider text-[11px] text-cyan-200">
              NAVEGACIÓN 2D
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-600/50 px-1.5 py-0.5 rounded font-bold tabular-nums">
              {Math.round(rotation)}°
            </span>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-cyan-300 px-1 text-xs"
              title={isCollapsed ? 'Expandir' : 'Plegar'}
            >
              {isCollapsed ? '▼' : '▲'}
            </button>
          </div>
        </div>

        {/* Contenido de Consola */}
        {!isCollapsed && (
          <div className="p-3 flex flex-col gap-3">
            
            {/* Orientación y Acimut */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>ORIENTACIÓN ACIMUTAL</span>
                <button
                  onClick={() => onRotateChange(180)}
                  className="text-cyan-400 hover:underline flex items-center gap-1 text-[9px]"
                >
                  🎯 NORTE (180°)
                </button>
              </div>

              {/* Botones Cardinales Rápido */}
              <div className="grid grid-cols-4 gap-1">
                {CARDINAL_PRESETS.map((cardinal) => (
                  <button
                    key={cardinal.value}
                    onClick={() => onRotateChange(cardinal.value)}
                    className={`py-1 border rounded text-center text-[9px] font-bold transition-all ${
                      Math.round(rotation) === cardinal.value
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-cyan-500/50'
                    }`}
                  >
                    {cardinal.label}
                  </button>
                ))}
              </div>

              {/* Ajuste Fino (+/- 15°) */}
              <div className="flex items-center gap-1 mt-0.5">
                <button
                  onClick={() => onRotateChange((prev) => prev - 15)}
                  className="flex-1 py-0.5 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded text-[9px] text-slate-400 transition-all"
                >
                  ↺ -15°
                </button>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={rotation}
                  onChange={(e) => onRotateChange(Number(e.target.value))}
                  className="flex-[2] h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <button
                  onClick={() => onRotateChange((prev) => prev + 15)}
                  className="flex-1 py-0.5 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded text-[9px] text-slate-400 transition-all"
                >
                  ↻ +15°
                </button>
              </div>
            </div>

            {/* Escala de Zoom */}
            <div className="flex flex-col gap-1.5 border-t border-cyan-500/20 pt-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>ESCALA DE ZOOM</span>
                <span className="text-amber-300 font-bold text-[11px] tabular-nums">
                  {Number(zoom).toFixed(2)}x
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onZoomChange((prev) => Math.max(prev - 0.2, 0.8))}
                  className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded font-bold text-sm text-cyan-300 transition-all"
                >
                  -
                </button>

                <div className="grid grid-cols-3 gap-1 flex-1">
                  {ZOOM_PRESETS.map((zVal) => (
                    <button
                      key={zVal}
                      onClick={() => onZoomChange(zVal)}
                      className={`py-0.5 border rounded text-center text-[9px] font-bold transition-all ${
                        Math.abs(zoom - zVal) < 0.1
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-cyan-300'
                      }`}
                    >
                      {zVal.toFixed(1)}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onZoomChange((prev) => Math.min(prev + 0.2, 10))}
                  className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded font-bold text-sm text-cyan-300 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Modos de Renderizado y Reset */}
            <div className="grid grid-cols-2 gap-1.5 border-t border-cyan-500/20 pt-2">
              <button
                onClick={onToggleLayer}
                className={`py-1.5 border rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                  isNeon
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-cyan-300'
                }`}
              >
                <span>{isNeon ? '💡 NEÓN' : '📐 TÉCNICO'}</span>
              </button>

              <button
                onClick={onResetView}
                className="py-1.5 bg-slate-900 border border-slate-800 hover:border-amber-400 hover:text-amber-300 rounded text-[10px] font-bold text-slate-300 transition-all flex items-center justify-center gap-1"
              >
                <span>🔄 RE-CENTRAR</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}