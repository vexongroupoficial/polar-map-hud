'use client';

// Mapeo sincronizado 1:1 con el Ascendente (0° = Casa I / Aries)
const ZODIAC_HOUSES = [
  { house: 1, name: 'ARIES', symbol: '♈', era: 'ERA DE ARIES', range: [0, 30], color: '#ef4444' },
  { house: 2, name: 'TAURO', symbol: '♉', era: 'ERA DE TAURO', range: [30, 60], color: '#f59e0b' },
  { house: 3, name: 'GÉMINIS', symbol: '♊', era: 'ERA DE GÉMINIS', range: [60, 90], color: '#eab308' },
  { house: 4, name: 'CÁNCER', symbol: '♋', era: 'ERA DE CÁNCER', range: [90, 120], color: '#10b981' },
  { house: 5, name: 'LEO', symbol: '♌', era: 'ERA DE LEO', range: [120, 150], color: '#06b6d4' },
  { house: 6, name: 'VIRGO', symbol: '♍', era: 'ERA DE VIRGO', range: [150, 180], color: '#38bdf8' },
  { house: 7, name: 'LIBRA', symbol: '♎', era: 'ERA DE LIBRA', range: [180, 210], color: '#3b82f6' },
  { house: 8, name: 'ESCORPIO', symbol: '♏', era: 'ERA DE ESCORPIO', range: [210, 240], color: '#6366f1' },
  { house: 9, name: 'SAGITARIO', symbol: '♐', era: 'ERA DE SAGITARIO', range: [240, 270], color: '#a855f7' },
  { house: 10, name: 'CAPRICORNIO', symbol: '♑', era: 'ERA DE CAPRICORNIO', range: [270, 300], color: '#ec4899' },
  { house: 11, name: 'ACUARIO', symbol: '♒', era: 'ERA DE ACUARIO', range: [300, 330], color: '#f43f5e' },
  { house: 12, name: 'PISCIS', symbol: '♓', era: 'ERA DE PISCIS', range: [330, 360], color: '#94a3b8' },
];

export default function EraIndicatorHUD({ simulatedTime }) {
  // Manejo flexible de simulatedTime: acepta Timestamp (ms) o Número de Año directo (-2160, 2026, etc.)
  const year = typeof simulatedTime === 'number' 
    ? (simulatedTime > 100000 || simulatedTime < -100000 
        ? new Date(simulatedTime).getFullYear() 
        : simulatedTime)
    : new Date(simulatedTime || Date.now()).getFullYear();

  // Cálculo del ángulo precesional exacto (72 años por grado)
  // El punto de origen (Año 0 d.C.) se alinea al inicio de la rueda
  const rawAngle = ((2000 - year) / 72) % 360;
  const precessionAngle = (rawAngle + 360) % 360;

  // Búsqueda de la Casa/Era activa según el ángulo
  const currentHouse = ZODIAC_HOUSES.find(
    (h) => precessionAngle >= h.range[0] && precessionAngle < h.range[1]
  ) || ZODIAC_HOUSES[0];

  return (
    <div className="absolute top-20 right-4 z-20 font-mono text-xs bg-slate-950/90 border border-amber-500/50 p-2.5 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.25)] text-amber-300 w-68 select-none">
      {/* Cabecera del HUD */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-1.5">
        <span className="font-bold text-[10px] tracking-wider text-amber-400 flex items-center gap-1">
          <span>🏛️</span> RELOJ PRECESIONAL
        </span>
        <span 
          className="text-[10px] bg-slate-900 border px-2 py-0.5 rounded font-bold transition-colors"
          style={{ borderColor: currentHouse.color, color: currentHouse.color }}
        >
          {currentHouse.symbol} {currentHouse.name} (CASA {currentHouse.house})
        </span>
      </div>

      {/* Telemetría: Era Cósmica Activa */}
      <div className="flex justify-between items-center mt-2 text-[11px]">
        <span className="text-slate-400">ERA CÓSMICA ACTIVA:</span>
        <span className="font-bold text-cyan-300 tracking-wide">{currentHouse.era}</span>
      </div>

      {/* Telemetría: Ángulo y Año Simulado */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
        <span>AÑO SIMULADO:</span>
        <span className="text-white font-bold tabular-nums">
          {year >= 0 ? `${year} d.C.` : `${Math.abs(year)} a.C.`}
        </span>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-0.5">
        <span>ÁNGULO DE PRECESIÓN:</span>
        <span className="text-amber-200 font-bold tabular-nums">
          {precessionAngle.toFixed(2)}° / 360°
        </span>
      </div>
    </div>
  );
}