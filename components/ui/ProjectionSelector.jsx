'use client';

export default function ProjectionSelector({ projectionCenter, setProjectionCenter }) {
  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Centro Focal del Plano
      </h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => setProjectionCenter('NPR')}
          className={`py-1.5 rounded font-medium transition-colors ${
            projectionCenter === 'NPR' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Polo Norte (Estándar)
        </button>
        <button
          onClick={() => setProjectionCenter('EQ')}
          className={`py-1.5 rounded font-medium transition-colors ${
            projectionCenter === 'EQ' ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          Ecuador / Órbita
        </button>
      </div>
    </div>
  );
}