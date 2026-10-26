/**
 * Renderiza polígonos y zonas de anomalías magnéticas y geofísicas
 * (Triángulo de las Bermudas, Anomalía del Atlántico Sur - SAA, Mar del Diablo, etc.)
 */
export function drawAnomalies(ctx, anomaliesData, activeLayers, centerX, centerY, maxRadius, rotation) {
  // Verificar si la capa de anomalías está activa
  const showBermuda = activeLayers?.bermudaTriangle;
  const showSAA = activeLayers?.southAtlanticAnomaly;

  if (!showBermuda && !showSAA) return;

  ctx.save();

  // 1. RENDERIZAR DESDE EL GEOJSON SI ESTÁ CARGADO
  if (anomaliesData?.features) {
    anomaliesData.features.forEach((feature) => {
      const geom = feature.geometry;
      const props = feature.properties || {};
      const name = props.name || 'Zona Anómala';
      const category = props.category || 'bermuda';

      // Filtrar según el interruptor activo en el Sidebar
      if (category === 'saa' && !showSAA) return;
      if (category !== 'saa' && !showBermuda) return;

      if (geom?.type !== 'Polygon') return;

      const ring = geom.coordinates[0];
      if (!ring || ring.length === 0) return;

      ctx.beginPath();
      ring.forEach(([lon, lat], index) => {
        const radius = maxRadius * ((90 - lat) / 180);
        // Alineación geométrica exacta: Oeste-Izquierda / Este-Derecha
        const thetaRad = ((lon + (rotation - 180)) * Math.PI) / 180;
        const x = centerX + radius * Math.sin(thetaRad);
        const y = centerY + radius * Math.cos(thetaRad);

        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.closePath();

      // Personalizar estilo según el tipo de anomalía
      let strokeColor = '#f59e0b'; // Naranja neón por defecto
      let fillColor = 'rgba(245, 158, 11, 0.2)';

      if (category === 'saa') {
        strokeColor = '#a855f7'; // Violeta/Púrpura para la Anomalía del Atlántico Sur
        fillColor = 'rgba(168, 85, 247, 0.2)';
      }

      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([5, 3]);
      ctx.shadowColor = strokeColor;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.stroke();

      // Etiqueta en el primer vértice
      const [firstLon, firstLat] = ring[0];
      const radius = maxRadius * ((90 - firstLat) / 180);
      const thetaRad = ((firstLon + (rotation - 180)) * Math.PI) / 180;
      const labelX = centerX + radius * Math.sin(thetaRad);
      const labelY = centerY + radius * Math.cos(thetaRad);

      ctx.shadowBlur = 0;
      ctx.setLineDash([]);
      ctx.fillStyle = category === 'saa' ? '#e9d5ff' : '#fef08a';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`⚠️ ${name.toUpperCase()}`, labelX + 8, labelY);
    });
  }

  // 2. FALLBACK/PONTES DIRECTOS: DIBUJO DE SEGURIDAD PARA LA SAA (ANOMALÍA DEL ATLÁNTICO SUR)
  // Si no está en el GeoJSON pero el usuario activa southAtlanticAnomaly, dibuja la zona elíptica aproximada
  if (showSAA && !anomaliesData?.features?.some(f => f.properties?.category === 'saa')) {
    // Coordenadas aproximadas del centro de la SAA: [-25°S, -45°W]
    const saaCenterLat = -25.0;
    const saaCenterLon = -45.0;

    const radius = maxRadius * ((90 - saaCenterLat) / 180);
    const thetaRad = ((saaCenterLon + (rotation - 180)) * Math.PI) / 180;
    const x = centerX + radius * Math.sin(thetaRad);
    const y = centerY + radius * Math.cos(thetaRad);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, maxRadius * 0.18, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#e9d5ff';
    ctx.textAlign = 'center';
    ctx.fillText('🧲 ANOMALÍA DEL ATLÁNTICO SUR (SAA)', x, y);
    ctx.restore();
  }

  ctx.restore();
}