// components/map2d/hud/NavigationHUD.jsx
'use client';

export default function NavigationHUD({
  rotation = 180,
  setRotation,
  onRotateChange,
  zoom = 1,
  setZoom,
  onZoomChange,
  onResetView,
  onReset,
}) {
  const updateRotation = (valOrFn) => {
    const fn = typeof onRotateChange === 'function' ? onRotateChange : setRotation;
    if (typeof fn === 'function') fn(valOrFn);
  };

  const updateZoom = (valOrFn) => {
    const fn = typeof onZoomChange === 'function' ? onZoomChange : setZoom;
    if (typeof fn === 'function') fn(valOrFn);
  };

  const handleReset = () => {
    if (typeof onResetView === 'function') onResetView();
    else if (typeof onReset === 'function') onReset();
  };

  return (
    <div className="font-mono text-xs select-none space-y-3 text-cyan-300 w-64 p-1">
      {/* 1. ORIENTACIÓN AZIMUTAL */}
      <div className="space-y-1.5 bg-slate-900/60 p-2 rounded-xl border border-cyan-900/40">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400 font-bold">ORIENTACIÓN AZIMUTAL:</span>
          <span className="text-amber-300 font-extrabold tabular-nums bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">
            {Math.round(rotation)}°
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1 pt-1">
          {[
            { label: '180° N', val: 180 },
            { label: '0° S', val: 0 },
            { label: '90° E', val: 90 },
            { label: '270° W', val: 270 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => updateRotation(preset.val)}
              className="px-1 py-1 bg-slate-950 hover:bg-cyan-950/60 text-cyan-200 border border-slate-800 rounded text-[10px] font-bold transition active:scale-95"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-1 pt-1">
          <button
            type="button"
            onClick={() => updateRotation((prev) => prev - 15)}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[10px] font-bold"
          >
            ↺ -15°
          </button>
          <button
            type="button"
            onClick={() => updateRotation((prev) => prev + 15)}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[10px] font-bold"
          >
            ↻ +15°
          </button>
        </div>
      </div>

      {/* 2. ESCALA DE ZOOM */}
      <div className="space-y-1.5 bg-slate-900/60 p-2 rounded-xl border border-cyan-900/40">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-slate-400 font-bold">ESCALA DE ZOOM:</span>
          <span className="text-amber-300 font-extrabold tabular-nums bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">
            {Number(zoom).toFixed(2)}x
          </span>
        </div>

        <div className="flex items-center gap-1 pt-1">
          <button
            type="button"
            onClick={() => updateZoom((prev) => prev * 0.85)}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[11px] font-bold"
          >
            -
          </button>
          {[1.0, 2.5, 5.0].map((zVal) => (
            <button
              key={zVal}
              type="button"
              onClick={() => updateZoom(zVal)}
              className="flex-1 py-1 bg-slate-950 hover:bg-cyan-950/60 text-cyan-200 border border-slate-800 rounded text-[10px] font-bold"
            >
              {zVal.toFixed(1)}x
            </button>
          ))}
          <button
            type="button"
            onClick={() => updateZoom((prev) => prev * 1.15)}
            className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded text-[11px] font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* 3. RE-CENTRAR (ANCHO COMPLETO) */}
      <div className="pt-1 border-t border-slate-800">
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2 bg-amber-950/50 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
        >
          <span>🎯</span>
          <span>RE-CENTRAR VISTA GLOBAL</span>
        </button>
      </div>
    </div>
  );
}