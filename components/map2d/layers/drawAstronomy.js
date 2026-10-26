import { latLonToPolar } from '@/lib/polarMath';

function getAstronomyData(time = Date.now()) {
  const date = new Date(time);
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = (date - startOfYear) / (1000 * 60 * 60 * 24);

  // Sol
  const solarDeclination = 23.44 * Math.sin(((2 * Math.PI) / 365.25) * (dayOfYear - 80));
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let solarLon = (12 - utcHours) * 15;
  while (solarLon > 180) solarLon -= 360;
  while (solarLon < -180) solarLon += 360;

  // Luna
  const draconicDays = 27.2122;
  const lunarDeclination = 28.5 * Math.sin(((2 * Math.PI) / draconicDays) * (dayOfYear - 5));
  const synodicDays = 29.53059;
  const moonAgeDays = (dayOfYear % synodicDays);
  let moonLon = solarLon - (moonAgeDays / synodicDays) * 360;
  while (moonLon > 180) moonLon -= 360;
  while (moonLon < -180) moonLon += 360;

  // Nodos Lunares
  const nodalPrecessionDays = 6793.5;
  const nodeLonAscending = ((180 - (dayOfYear / nodalPrecessionDays) * 360) % 360);
  let nodeLonDescending = nodeLonAscending + 180;
  while (nodeLonDescending > 180) nodeLonDescending -= 360;

  // Fase Lunar y Elongación
  let angleDiff = ((solarLon - moonLon + 360) % 360);
  const phaseRatio = angleDiff / 360;
  const illuminationPct = Math.round((1 - Math.cos((angleDiff * Math.PI) / 180)) * 50);

  let phaseIcon = '🌕';
  let phaseName = 'LUNA LLENA';
  if (phaseRatio < 0.06 || phaseRatio >= 0.94) { phaseIcon = '🌑'; phaseName = 'LUNA NUEVA'; }
  else if (phaseRatio < 0.22) { phaseIcon = '🌒'; phaseName = 'CRECIENTE CÓNCAVA'; }
  else if (phaseRatio < 0.28) { phaseIcon = '🌓'; phaseName = 'CUARTO CRECIENTE'; }
  else if (phaseRatio < 0.44) { phaseIcon = '🌔'; phaseName = 'CRECIENTE GIBOSA'; }
  else if (phaseRatio < 0.56) { phaseIcon = '🌕'; phaseName = 'LUNA LLENA'; }
  else if (phaseRatio < 0.72) { phaseIcon = '🌖'; phaseName = 'MENGUANTE GIBOSA'; }
  else if (phaseRatio < 0.78) { phaseIcon = '🌗'; phaseName = 'CUARTO MENGUANTE'; }
  else { phaseIcon = '🌘'; phaseName = 'MENGUANTE CÓNCAVA'; }

  // Detección de Eclipse Activo
  const distAsc = Math.hypot(solarLon - nodeLonAscending, solarDeclination - 0);
  const distDesc = Math.hypot(solarLon - nodeLonDescending, solarDeclination - 0);
  const inNodeZone = (distAsc < 16 || distDesc < 16);
  const isConjunction = (angleDiff < 10 || angleDiff > 350);
  const isOpposition = (Math.abs(angleDiff - 180) < 10);

  let eclipseType = null;
  if (inNodeZone && isConjunction) eclipseType = '⚠️ ECLIPSE SOLAR';
  if (inNodeZone && isOpposition) eclipseType = '🔴 ECLIPSE LUNAR';

  return {
    dayOfYear: Math.floor(dayOfYear) || 1,
    solarDeclination,
    solarLon,
    lunarDeclination,
    moonLon,
    nodeLonAscending,
    nodeLonDescending,
    phaseIcon,
    phaseName,
    illuminationPct,
    phaseRatio,
    eclipseType,
  };
}

export function drawAstronomy(
  ctx,
  activeLayers,
  centerX,
  centerY,
  mapRadius,
  rotation,
  time = Date.now()
) {
  if (!activeLayers?.sunlight && !activeLayers?.analemma && !activeLayers?.moonPhases) return;

  ctx.save();
  const astro = getAstronomyData(time);

  const sunPolar = latLonToPolar(astro.solarDeclination, astro.solarLon, mapRadius, rotation);
  const sunX = centerX + sunPolar.x;
  const sunY = centerY + sunPolar.y;

  const moonPolar = latLonToPolar(astro.lunarDeclination, astro.moonLon, mapRadius, rotation);
  const moonX = centerX + moonPolar.x;
  const moonY = centerY + moonPolar.y;

  const nodeAscPolar = latLonToPolar(0, astro.nodeLonAscending, mapRadius, rotation);
  const nodeAscX = centerX + nodeAscPolar.x;
  const nodeAscY = centerY + nodeAscPolar.y;

  const nodeDescPolar = latLonToPolar(0, astro.nodeLonDescending, mapRadius, rotation);
  const nodeDescX = centerX + nodeDescPolar.x;
  const nodeDescY = centerY + nodeDescPolar.y;

  // 1. ANILLOS GUÍA
  const rMoonMaxNorth = mapRadius * ((90 - 28.5) / 180);
  const rCancer = mapRadius * ((90 - 23.44) / 180);
  const rEquator = mapRadius * (90 / 180);
  const rCapricorn = mapRadius * ((90 - (-23.44)) / 180);
  const rMoonMaxSouth = mapRadius * ((90 - (-28.5)) / 180);

  ctx.save();
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.arc(centerX, centerY, rMoonMaxNorth, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)'; ctx.setLineDash([2, 4]); ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, rCancer, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'; ctx.setLineDash([6, 4]); ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, rEquator, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)'; ctx.setLineDash([]); ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, rCapricorn, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)'; ctx.setLineDash([6, 4]); ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX, centerY, rMoonMaxSouth, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)'; ctx.setLineDash([2, 4]); ctx.stroke();
  ctx.restore();

  // 2. NODOS LUNARES (☊ y ☋)
  ctx.save();
  ctx.fillStyle = '#10b981'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
  ctx.shadowColor = '#34d399'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(nodeAscX, nodeAscY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.font = 'bold 9px monospace'; ctx.fillStyle = '#10b981'; ctx.textAlign = 'center';
  ctx.fillText('☊ NODO ASC', nodeAscX, nodeAscY - 10);

  ctx.fillStyle = '#f59e0b'; ctx.shadowColor = '#fbbf24';
  ctx.beginPath(); ctx.arc(nodeDescX, nodeDescY, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f59e0b'; ctx.fillText('☋ NODO DESC', nodeDescX, nodeDescY - 10);
  ctx.restore();

  // 3. ORBE SOLAR
  ctx.save();
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 22);
  sunGlow.addColorStop(0, '#ffffff'); sunGlow.addColorStop(0.3, '#fde047');
  sunGlow.addColorStop(0.7, '#f59e0b'); sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = sunGlow; ctx.beginPath(); ctx.arc(sunX, sunY, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#fde047'; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.arc(sunX, sunY, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // 4. ORBE LUNAR Y FASE (TERMINATOR)
  ctx.save();
  const moonRadius = 10;
  ctx.fillStyle = '#0f172a'; ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 1.5;
  ctx.shadowColor = '#c084fc'; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  const angleToSun = Math.atan2(sunY - moonY, sunX - moonX);
  ctx.save(); ctx.translate(moonX, moonY); ctx.rotate(angleToSun);
  ctx.fillStyle = '#f8fafc'; ctx.shadowColor = '#ffffff'; ctx.shadowBlur = 8;
  ctx.beginPath();
  if (astro.phaseRatio <= 0.5) {
    const normPhase = astro.phaseRatio * 2;
    ctx.arc(0, 0, moonRadius, -Math.PI / 2, Math.PI / 2, false);
    ctx.ellipse(0, 0, moonRadius * Math.abs(1 - 2 * normPhase), moonRadius, 0, Math.PI / 2, -Math.PI / 2, normPhase > 0.5);
  } else {
    const normPhase = (astro.phaseRatio - 0.5) * 2;
    ctx.arc(0, 0, moonRadius, Math.PI / 2, -Math.PI / 2, false);
    ctx.ellipse(0, 0, moonRadius * Math.abs(1 - 2 * normPhase), moonRadius, 0, -Math.PI / 2, Math.PI / 2, normPhase < 0.5);
  }
  ctx.fill(); ctx.restore(); ctx.restore();

  // 5. VECTOR DE ALINEACIÓN
  ctx.save();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)'; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
  ctx.beginPath(); ctx.moveTo(sunX, sunY); ctx.lineTo(moonX, moonY); ctx.stroke();
  ctx.restore();

  // 6. ALERTA Y TELEMETRÍA
  ctx.save();
  ctx.font = 'bold 8px monospace';
  if (astro.eclipseType) {
    ctx.fillStyle = '#ef4444'; ctx.shadowColor = '#f87171'; ctx.shadowBlur = 12;
    ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
    ctx.fillText(astro.eclipseType, (sunX + moonX) / 2, (sunY + moonY) / 2 - 12);
  }

  const tSol = `☀️ SOL | DEC: ${astro.solarDeclination > 0 ? '+' : ''}${astro.solarDeclination.toFixed(2)}°`;
  ctx.fillStyle = 'rgba(2, 6, 23, 0.92)'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(sunX - 50, sunY - 24, 100, 14, 3); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fef08a'; ctx.textAlign = 'center'; ctx.fillText(tSol, sunX, sunY - 17);

  const tLuna = `${astro.phaseIcon} ${astro.phaseName} (${astro.illuminationPct}%) | DEC: ${astro.lunarDeclination > 0 ? '+' : ''}${astro.lunarDeclination.toFixed(2)}°`;
  const twLuna = ctx.measureText(tLuna).width;
  ctx.fillStyle = 'rgba(2, 6, 23, 0.92)'; ctx.strokeStyle = '#a855f7'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(moonX - twLuna / 2 - 4, moonY + 14, twLuna + 8, 14, 3); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#f3e8ff'; ctx.fillText(tLuna, moonX, moonY + 21);

  ctx.restore(); ctx.restore();
}