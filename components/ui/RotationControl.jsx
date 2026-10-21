'use client';

export default function RotationControl({ rotation, setRotation }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Orientación del Plano
      </h3>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
        />
        <span className="text-xs text-sky-400 font-mono w-10 text-right">{rotation}°</span>
      </div>
    </div>
  );
}