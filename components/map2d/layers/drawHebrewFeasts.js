// components/map2d/layers/drawHebrewFeasts.js

function drawTextWithOutline(ctx, text, x, y, strokeColor = '#020617', strokeWidth = 3) {
  ctx.lineJoin = 'round';
  ctx.miterLimit = 2;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

// 📜 LAS 9 FIESTAS Y SUS ÁNGULOS EN EL ENGRANAJE POLAR
export const HEBREW_FEASTS_DATA = [
  // 7 FIESTAS BÍBLICAS (LEVÍTICO 23)
  { id: 'pesach', name: '1. PÉSAJ (PASCUA)', deg: 14, dateLabel: '14 Nisán [~31 Mar]', color: '#f59e0b', type: 'biblical' },
  { id: 'matzot', name: '2. MATZOT (PANES SIN LEVADURA)', deg: 20, dateLabel: '15-21 Nisán', color: '#fbbf24', type: 'biblical' },
  { id: 'bikkurim', name: '3. BIKKURIM (PRIMICIAS)', deg: 26, dateLabel: '16 Nisán', color: '#34d399', type: 'biblical' },
  { id: 'shavuot', name: '4. SHAVUOT (PENTECOSTÉS)', deg: 66, dateLabel: '6 Siván', color: '#60a5fa', type: 'biblical' },
  { id: 'teruah', name: '5. YOM TERUÁH (TROMPETAS)', deg: 180, dateLabel: '1 Tishrei', color: '#c084fc', type: 'biblical' },
  { id: 'kippur', name: '6. YOM KIPPUR (EXPIACIÓN)', deg: 190, dateLabel: '10 Tishrei', color: '#e879f9', type: 'biblical' },
  { id: 'sukkot', name: '7. SUKKOT (TABERNÁCULOS)', deg: 198, dateLabel: '15 Tishrei [~31 Sep]', color: '#f43f5e', type: 'biblical' },

  // 2 FIESTAS HISTÓRICAS
  { id: 'hanukkah', name: '8. JANUCÁ (LUCES)', deg: 255, dateLabel: '25 Kislev', color: '#38bdf8', type: 'historical' },
  { id: 'purim', name: '9. PURIM (SUERTES)', deg: 344, dateLabel: '14 Adar', color: '#a7f3d0', type: 'historical' }
];

export function drawHebrewFeasts(
  ctx,
  activeLayersOrCenterX,
  centerXOrY,
  mapRadiusOrRot,
  rotationOrAnimTime = 0,
  animTimeOrNeon = 0,
  isNeonParam = true
) {
  let activeLayers = {};
  let centerX, centerY, mapRadius, rotation, animTime, isNeon;

  if (typeof activeLayersOrCenterX === 'object' && activeLayersOrCenterX !== null) {
    activeLayers = activeLayersOrCenterX;
    centerX = centerXOrY;
    centerY = mapRadiusOrRot;
    mapRadius = rotationOrAnimTime;
    rotation = animTimeOrNeon || 0;
    animTime = isNeonParam || 0;
    isNeon = true;
  } else {
    centerX = activeLayersOrCenterX;
    centerY = centerXOrY;
    mapRadius = mapRadiusOrRot;
    rotation = rotationOrAnimTime;
    animTime = animTimeOrNeon;
    isNeon = isNeonParam;
  }

  const isEnabled =
    activeLayers?.hebrewFeasts ||
    activeLayers?.fiestasHebreas ||
    true;

  if (!isEnabled) return;
  if (typeof centerX !== 'number' || typeof centerY !== 'number' || typeof mapRadius !== 'number') return;

  ctx.save();
  const time = typeof animTime === 'number' ? animTime : Date.now() * 0.001;
  const baseRotationRad = (rotation * Math.PI) / 180;
  
  const eclipticR = mapRadius * 0.94;
  const jubileoR = mapRadius * 1.12; // Anillo exterior para el Jubileo

  // =========================================================================
  // 1. ANILLO PERIMETRAL DEL JUBILEO (YOVEL - CADA 50 AÑOS)
  // =========================================================================
  if (activeLayers?.jubileeYear ?? true) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, jubileoR, 0, Math.PI * 2);
    ctx.strokeStyle = '#eab308'; // Oro del Jubileo
    ctx.lineWidth = 2.0;
    ctx.setLineDash([12, 6, 3, 6]);
    ctx.lineDashOffset = -time * 5;

    if (isNeon) {
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 12;
    }
    ctx.stroke();

    // Badge del Gran Jubileo posicionado en la parte superior central
    ctx.font = 'bold 8.5px monospace';
    ctx.fillStyle = '#fef08a';
    ctx.textAlign = 'center';
    drawTextWithOutline(
      ctx,
      '👑 ANILLO DEL JUBILEO (YOVEL) • CICLO DE 50 AÑOS [LIBERACIÓN]',
      centerX,
      centerY - jubileoR - 6,
      '#020617',
      3
    );
    ctx.restore();
  }

  // =========================================================================
  // 2. RENDERING DE LAS 9 FIESTAS EN LA ECLÍPTICA
  // =========================================================================
  HEBREW_FEASTS_DATA.forEach((feast) => {
    // 0° Comienza en la Izquierda (Naciente) y gira en sentido horario
    const angleRad = Math.PI + (feast.deg * Math.PI) / 180 + baseRotationRad;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const px = centerX + cosA * eclipticR;
    const py = centerY + sinA * eclipticR;

    // Conector desde el centro hasta la fiesta
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(px, py);
    ctx.strokeStyle = `rgba(251, 191, 36, 0.25)`;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 4]);
    ctx.stroke();

    // Marcador Neón de la Fiesta
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = feast.color;
    if (isNeon) {
      ctx.shadowColor = feast.color;
      ctx.shadowBlur = 8;
    }
    ctx.fill();

    // Rótulo HUD
    const labelDist = eclipticR - 16;
    const lx = centerX + cosA * labelDist;
    const ly = centerY + sinA * labelDist;

    ctx.font = 'bold 7.5px monospace';
    const tW = ctx.measureText(feast.name).width;
    const bW = tW + 8;
    const bH = 13;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.strokeStyle = feast.color;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.roundRect(lx - bW / 2, ly - bH / 2, bW, bH, 3);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    drawTextWithOutline(ctx, feast.name, lx, ly + 0.5, '#020617', 2.2);

    ctx.restore();
  });

  ctx.restore();
}

export default drawHebrewFeasts;