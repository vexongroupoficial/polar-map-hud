import { latLonToPolar } from '@/lib/polarMath';

export function drawGraticule(ctx, activeLayers, centerX, centerY, mapRadius, rotation, zoom) {
  if (!activeLayers?.graticule && !activeLayers?.ecuador && !activeLayers?.tropics) return;

      // DIBUJAR RETÍCULA RADAR HUD EN EL POLO NORTE (CENTRO)
    ctx.save();
    ctx.translate(centerX, centerY);

    // Anillo giratorio interno
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 3]);
    ctx.stroke();

    // Retícula en Cruz
    ctx.beginPath();
    ctx.moveTo(-24, 0); ctx.lineTo(24, 0);
    ctx.moveTo(0, -24); ctx.lineTo(0, 24);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.stroke();

    // Núcleo central
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; // Punto rojo de origen
    ctx.fill();

    ctx.restore();

  // --- 1. MERIDIANOS Y PARALELOS ESTÁNDAR ---
  if (activeLayers?.graticule) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 0.8;

    // Paralelos (Círculos concéntricos cada 15 grados)
    for (let lat = 75; lat >= -75; lat -= 15) {
      const rho = mapRadius * ((90 - lat) / 180);
      if (rho > 0 && rho <= mapRadius) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, rho, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // Meridianos (Líneas radiales cada 30 grados)
    for (let lon = 0; lon < 360; lon += 30) {
      const angleRad = ((lon + rotation) * Math.PI) / 180;
      // Excluir momentáneamente el de Greenwich para dibujarlo resaltado después
      if (lon === 0 || lon === 180) continue; 

      const xEnd = centerX + mapRadius * Math.sin(angleRad);
      const yEnd = centerY - mapRadius * Math.cos(angleRad);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(xEnd, yEnd);
      ctx.stroke();
    }
  }

  // --- 2. DESTACAR EL MERIDIANO DE GREENWICH (0° - 180°) ---
  if (activeLayers?.graticule) {
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)'; // Verde esmeralda brillante
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    const angleGreenwich = (0 + rotation) * Math.PI / 180;
    const x1 = centerX + mapRadius * Math.sin(angleGreenwich);
    const y1 = centerY - mapRadius * Math.cos(angleGreenwich);
    const x2 = centerX - mapRadius * Math.sin(angleGreenwich);
    const y2 = centerY + mapRadius * Math.cos(angleGreenwich);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]); // Resetear patrón de línea
  }

  // --- 3. LÍNEA DEL ECUADOR (Anillo medio) ---
  if (activeLayers?.ecuador) {
    const equatorRho = mapRadius * 0.5; // Latitud 0° (mitad de radio)
    ctx.strokeStyle = '#ef4444'; // Rojo vivo
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, equatorRho, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // --- 4. TRÓPICOS Y CÍRCULOS POLARES ---
  if (activeLayers?.tropics) {
    ctx.strokeStyle = '#f59e0b'; // Ámbar
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 3]);

    // Trópico de Cáncer (+23.5°) y Capricornio (-23.5°)
    [23.5, -23.5].forEach((lat) => {
      const rho = mapRadius * ((90 - lat) / 180);
      ctx.beginPath();
      ctx.arc(centerX, centerY, rho, 0, 2 * Math.PI);
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  ctx.restore();
}