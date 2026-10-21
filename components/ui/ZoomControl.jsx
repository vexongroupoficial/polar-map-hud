'use client';

export default function ZoomControl({ zoom, setZoom }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Nivel de Zoom
        </h3>
        <span className="text-xs text-sky-400 font-mono font-bold">{zoom.toFixed(1)}x</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setZoom((z) => Math.max(0.8, Number((z - 0.2).toFixed(1))))}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-sky-400 font-bold transition-colors"
        >
          -
        </button>
        <input
          type="range"
          min="0.8"
          max="8"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <button
          onClick={() => setZoom((z) => Math.min(8, Number((z + 0.2).toFixed(1))))}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-sky-400 font-bold transition-colors"
        >
          +
        </button>
      </div>
      <button
        onClick={() => setZoom(1)}
        className="w-full mt-2 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded border border-slate-700/50 transition-colors"
      >
        Restablecer Vista (1x)
      </button>
    </div>
  );
}