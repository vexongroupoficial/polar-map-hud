'use client';

export default function Map2DControls({
  rotation = 0,
  onRotateChange,
  zoom = 1,
  onZoomChange,
  onResetView,
}) {
  return (
    <div
      className="absolute top-4 right-4 flex flex-col gap-2 z-30 select-none pointer-events-auto"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* TARJETA COMPACTA DE ROTACIÓN Y ZOOM UNIFICADA */}
      <div className="bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-sky-500/30 shadow-2xl flex flex-col gap-2 w-52 text-xs">
        {/* Header Orientación */}
        <div className="flex items-center justify-between text-[11px] font-mono border-b border-slate-800 pb-1">
          <span className="text-slate-400 font-bold">ORIENTACIÓN 2D</span>
          <span className="text-sky-400 font-bold">{Math.round(rotation)}°</span>
        </div>

        {/* Botones de giro rápido */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => onRotateChange?.((r) => r - 15)}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-[11px] text-slate-200 font-mono"
          >
            ↺ -15°
          </button>
          <button
            onClick={() => onRotateChange?.(0)}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-[11px] text-amber-400 font-mono"
            title="Resetear al Norte (0°)"
          >
            🧭 N
          </button>
          <button
            onClick={() => onRotateChange?.((r) => r + 15)}
            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-[11px] text-slate-200 font-mono"
          >
            +15° ↻
          </button>
        </div>

        {/* Slider de Rotación */}
        <input
          type="range"
          min="0"
          max="360"
          value={Math.round(rotation)}
          onChange={(e) => onRotateChange?.(parseFloat(e.target.value))}
          className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded cursor-pointer"
        />

        {/* Zoom Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] font-mono">
          <span className="text-slate-400 font-bold">ZOOM:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onZoomChange?.((z) => Math.max(z - 0.2, 0.8))}
              className="w-6 h-6 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-200 text-center font-bold"
            >
              -
            </button>
            <span className="text-emerald-400 font-bold w-12 text-center">
              {zoom.toFixed(2)}x
            </span>
            <button
              onClick={() => onZoomChange?.((z) => Math.min(z + 0.2, 10))}
              className="w-6 h-6 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 text-slate-200 text-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        {onResetView && (
          <button
            onClick={onResetView}
            className="w-full mt-1 py-1 bg-sky-950/60 hover:bg-sky-900/80 border border-sky-800/60 rounded text-[10px] text-sky-300 font-mono transition"
          >
            🎯 Re-centrar Plano
          </button>
        )}
      </div>
    </div>
  );
}