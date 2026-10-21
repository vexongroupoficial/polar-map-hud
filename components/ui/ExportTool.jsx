'use client';

export default function ExportTool() {
  const handleExportHD = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'mapa-polar-terrestre-hd.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Exportar Cartografía
      </h3>
      <button
        onClick={handleExportHD}
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors shadow-lg"
      >
        📥 Descargar Plano Polar (PNG HD)
      </button>
    </div>
  );
}