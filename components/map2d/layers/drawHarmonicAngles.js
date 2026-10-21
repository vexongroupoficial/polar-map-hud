/**
 * Dibuja un Compás Táctico Perimetral de Alta Precisión con Marcas Métricas y Gráficos HUD.
 */
export function drawHarmonicAngles(ctx, activeLayers, centerX, centerY, mapRadius, rotation = 0) {
  if (!activeLayers?.harmonicAngles && !activeLayers?.angles) return;

  ctx.save();

  const bezelRadius = mapRadius + 14;

  // 1. ANILLO BASE DEL COMPÁS NÁUTICO
  ctx.beginPath();
  ctx.arc(centerX, centerY, bezelRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 2. GRADUACIÓN MÉTRICA (Marcas de precisión cada 5°, 15° y 30°)
  for (let deg = 0; deg < 360; deg += 5) {
    const isCardinal = deg % 90 === 0;   // 0°, 90°, 180°, 270°
    const isMajor = deg % 30 === 0;      // 30°, 60°, 120°...
    const isMinor = deg % 15 === 0;

    const angleRad = ((deg + rotation - 90) * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const tickLength = isCardinal ? 12 : isMajor ? 8 : isMinor ? 5 : 3;
    const innerR = bezelRadius - tickLength;

    ctx.beginPath();
    ctx.moveTo(centerX + innerR * cosA, centerY + innerR * sinA);
    ctx.lineTo(centerX + bezelRadius * cosA, centerY + bezelRadius * sinA);

    if (isCardinal) {
      ctx.strokeStyle = '#ef4444'; // Rojo carmesí para ejes principales
      ctx.lineWidth = 2;
    } else if (isMajor) {
      ctx.strokeStyle = '#38bdf8'; // Cian brillante para 30°, 60°, 120°
      ctx.lineWidth = 1.5;
    } else {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 0.8;
    }
    ctx.stroke();

    // Rotular Números de Grados (solo principales cada 30°)
    if (isMajor) {
      const textR = bezelRadius - 18;
      const tx = centerX + textR * cosA;
      const ty = centerY + textR * sinA;

      ctx.font = isCardinal ? 'bold 10px monospace' : '9px monospace';
      ctx.fillStyle = isCardinal ? '#f87171' : '#7dd3fc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${deg}°`, tx, ty);
    }
  }

  // 3. RAYOS TÁCTICOS RADIALES EN EL INTERIOR DEL MAPA
  const HARMONICS = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  HARMONICS.forEach((deg) => {
    const isCardinal = deg % 90 === 0;
    const angleRad = ((deg + rotation - 90) * Math.PI) / 180;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + (mapRadius - 5) * Math.cos(angleRad),
      centerY + (mapRadius - 5) * Math.sin(angleRad)
    );
    ctx.strokeStyle = isCardinal ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  });

  ctx.restore();
}