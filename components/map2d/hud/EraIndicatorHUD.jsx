'use client';

// Mapeo de los 12 sectores de 30°
const ZODIAC_HOUSES = [
  { name: 'PISCIS', symbol: '♓', era: 'ERA DE PISCIS', range: [0, 30] },
  { name: 'ARIES', symbol: '♈', era: 'ERA DE ARIES', range: [30, 60] },
  { name: 'TAURO', symbol: '♉', era: 'ERA DE TAURO', range: [60, 90] },
  { name: 'GÉMINIS', symbol: '♊', era: 'ERA DE GÉMINIS', range: [90, 120] },
  { name: 'CÁNCER', symbol: '♋', era: 'ERA DE CÁNCER', range: [120, 150] },
  { name: 'LEO', symbol: '♌', era: 'ERA DE LEO', range: [150, 180] },
  { name: 'VIRGO', symbol: '♍', era: 'ERA DE VIRGO', range: [180, 210] },
  { name: 'LIBRA', symbol: '♎', era: 'ERA DE LIBRA', range: [210, 240] },
  { name: 'ESCORPIO', symbol: '♏', era: 'ERA DE ESCORPIO', range: [240, 270] },
  { name: 'SAGITARIO', symbol: '♐', era: 'ERA DE SAGITARIO', range: [270, 300] },
  { name: 'CAPRICORNIO', symbol: '♑', era: 'ERA DE CAPRICORNIO', range: [300, 330] },
  { name: 'ACUARIO', symbol: '♒', era: 'ERA DE ACUARIO', range: [330, 360] },
];

export default function EraIndicatorHUD({ simulatedTime }) {
  const date = new Date(simulatedTime);
  const year = date.getFullYear();

  // Cálculo del ángulo precesional según el año
  // Año 2000 aprox = 10° en Piscis/Acuario
  const precessionAngle = (((2000 - year) / 72) + 3600) % 360;
  
  const currentHouse = ZODIAC_HOUSES.find(
    (h) => precessionAngle >= h.range[0] && precessionAngle < h.range[1]
  ) || ZODIAC_HOUSES[0];

  return (
    <div className="absolute top-20 right-4 z-20 font-mono text-xs bg-slate-950/90 border border-amber-500/50 p-2.5 rounded-xl backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.25)] text-amber-300 w-64 select-none">
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-1">
        <span className="font-bold text-[10px] tracking-wider text-amber-400">
          🏛️ RELOJ PRECESIONAL
        </span>
        <span className="text-[10px] bg-amber-950 border border-amber-600 px-1.5 py-0.5 rounded font-bold">
          {currentHouse.symbol} {currentHouse.name}
        </span>
      </div>

      <div className="flex justify-between items-center mt-1.5 text-[11px]">
        <span className="text-slate-400">ERA CÓSMICA ACTIVA:</span>
        <span className="font-bold text-cyan-300">{currentHouse.era}</span>
      </div>

      <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
        <span>ÁNGULO DE PRECESIÓN:</span>
        <span className="text-amber-200 font-bold tabular-nums">
          {precessionAngle.toFixed(2)}° / 360°
        </span>
      </div>
    </div>
  );
}