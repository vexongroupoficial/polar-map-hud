import { latLonToPolar } from '@/lib/polarMath';

export function drawAuroraBorealis(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation,
  auroraData = null,
  kpIndex = 3,
  time = Date.now()
) {
  if (!activeLayers?.auroraBorealis) return;

  // 1. Sanitizar el valor Kp
  const safeKp = Math.min(9, Math.max(1, Math.round(Number(kpIndex) || 3)));

  // 2. Coordenadas del Polo Norte Magnético
  const magneticPoleLat = 86.5;
  const magneticPoleLon = 156.8;

  const magCenter = latLonToPolar(magneticPoleLat, magneticPoleLon, mapRadius, rotation);
  const auroraCenterX = centerX + magCenter.x;
  const auroraCenterY = centerY + magCenter.y;

  // 3. Radio y grosor adaptativo según el nivel Kp
  const baseLat = Math.max(52, 73 - safeKp * 2.1);
  const polarPoint = latLonToPolar(baseLat, magneticPoleLon, mapRadius, rotation);

  const ringRadius = Math.max(
    15,
    Math.sqrt(Math.pow(magCenter.x - polarPoint.x, 2) + Math.pow(magCenter.y - polarPoint.y, 2))
  );

  const ringWidth = Math.max(3, (ringRadius * 0.08) + (safeKp * 1.2));

  // 4. CÁLCULO DE COLORES DINÁMICOS (VARIACIÓN CROMÁTICA EN EL TIEMPO)
  // Ciclo fluido de matiz HSL (140° Verde Esmeralda -> 180° Cian -> 280° Violeta/Magenta -> 340° Rojo)
  const hueShift = Math.sin(time * 0.0008) * 70; // Oscila el tono principal
  const primaryHue = 150 + hueShift;              // Color del núcleo
  const secondaryHue = (primaryHue + 60) % 360;    // Color del resplandor exterior

  const mainColor = `hsla(${primaryHue}, 85%, 55%, 0.7)`;
  const glowColor = `hsla(${secondaryHue}, 90%, 60%, 0.35)`;
  const shadowGlow = `hsl(${primaryHue}, 100%, 50%)`;

  ctx.save();

  // 5. RESPLANDOR GRADIENTE MULTICOLOR DINÁMICO
  const glowGradient = ctx.createRadialGradient(
    auroraCenterX,
    auroraCenterY,
    ringRadius - ringWidth * 1.8,
    auroraCenterX,
    auroraCenterY,
    ringRadius + ringWidth * 1.8
  );

  glowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  glowGradient.addColorStop(0.35, `hsla(${primaryHue + 40}, 80%, 50%, 0.15)`); 
  glowGradient.addColorStop(0.5, mainColor);                                   
  glowGradient.addColorStop(0.7, glowColor);                                   
  glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(auroraCenterX, auroraCenterY, ringRadius + ringWidth * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // 6. CORTINA LUMINOSA ONDULANTE CON CAMBIO DE COLOR EN VIVO
  ctx.lineWidth = ringWidth;
  ctx.strokeStyle = mainColor;
  ctx.shadowColor = shadowGlow;
  ctx.shadowBlur = 14;

  ctx.beginPath();
  const numPoints = 140;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const wave = Math.sin(angle * 8 + time * 0.002) * (ringWidth * 0.25) + 
                 Math.cos(angle * 14 - time * 0.0012) * (ringWidth * 0.15);
    const currentRadius = ringRadius + wave;

    const x = auroraCenterX + currentRadius * Math.cos(angle);
    const y = auroraCenterY + currentRadius * Math.sin(angle);

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.shadowBlur = 0;

  // 7. TELEMETRÍA TÁCTICA HUD
  ctx.font = 'bold 9px monospace';
  ctx.fillStyle = `hsl(${primaryHue}, 90%, 65%)`;
  ctx.textAlign = 'center';
  ctx.fillText('ÓVALO AURORAL BOREAL', auroraCenterX, auroraCenterY - 10);

  ctx.font = 'bold 8px monospace';
  ctx.fillStyle = '#a7f3d0';
  ctx.fillText(`KP: ${safeKp} | MAG-NORTH`, auroraCenterX, auroraCenterY + 4);

  ctx.restore();
}