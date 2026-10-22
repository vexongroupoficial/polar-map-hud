export function drawAirports(ctx, airportsData, activeLayers, centerX, centerY, maxRadius, rotation, zoom) {
  if (!activeLayers?.airports || !airportsData?.features) return;

  ctx.save();

  airportsData.features.forEach((feature) => {
    const coords = feature.geometry?.coordinates;
    if (!coords) return;

    const [lon, lat] = coords;
    const props = feature.properties || {};

    // Extraer identificadores: IATA, Nombre y Ciudad
    const iata = props.iata_code || props.abbrev || props.gps_code || '';
    const name = props.name || props.name_en || 'Aeropuerto';
    const location = props.municipality || props.region || '';

    // Ajustar densidad según el Zoom
    const type = props.type || props.featurecla || '';
    if (zoom < 1.4 && type !== 'major' && type !== 'large_airport' && !iata) return;

    const radius = maxRadius * ((90 - lat) / 180);
    // CORRECCIÓN: Orientación Este/Oeste corregida
    const thetaRad = ((lon + (rotation - 180)) * Math.PI) / 180;

    const x = centerX + radius * Math.sin(thetaRad);
    const y = centerY + radius * Math.cos(thetaRad);

    // Dibujar Nodo Luminoso
    ctx.beginPath();
    const pointSize = zoom > 2.5 ? 3.5 : 2;
    ctx.arc(x, y, pointSize, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 6;
    ctx.fill();

    // Dibujar Nombres y Etiqueta si el zoom lo permite o es un aeropuerto principal
    if (zoom > 1.2) {
      ctx.font = '9px monospace';
      ctx.fillStyle = '#e0f2fe';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 3;

      let labelText = iata ? `[${iata}] ${name}` : name;
      if (location && zoom > 2.2) {
        labelText += ` (${location})`;
      }

      ctx.fillText(labelText, x + 6, y + 3);
    }
  });

  ctx.restore();
}