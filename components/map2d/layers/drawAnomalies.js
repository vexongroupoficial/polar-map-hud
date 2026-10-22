export function drawAnomalies(ctx, anomaliesData, activeLayers, centerX, centerY, maxRadius, rotation) {
  if (!activeLayers?.bermudaTriangle || !anomaliesData?.features) return;

  ctx.save();

  anomaliesData.features.forEach((feature) => {
    const geom = feature.geometry;
    const name = feature.properties?.name || 'Zona Anómala';
    if (geom?.type !== 'Polygon') return;

    ctx.beginPath();
    const ring = geom.coordinates[0];

    ring.forEach(([lon, lat], index) => {
      const radius = maxRadius * ((90 - lat) / 180);
      // CORRECCIÓN: Usar sin(-thetaRad) y cos(thetaRad) para alinear Oeste-Izquierda / Este-Derecha
      const thetaRad = ((lon + (rotation - 180)) * Math.PI) / 180;
      const x = centerX + radius * Math.sin(thetaRad);
      const y = centerY + radius * Math.cos(thetaRad);

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.closePath();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 3]);
    ctx.fill();
    ctx.stroke();

    // Etiqueta centrada en el primer vértice
    const [firstLon, firstLat] = ring[0];
    const radius = maxRadius * ((90 - firstLat) / 180);
    const thetaRad = ((firstLon + (rotation - 180)) * Math.PI) / 180;
    const labelX = centerX + radius * Math.sin(thetaRad);
    const labelY = centerY + radius * Math.cos(thetaRad);

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 10px monospace';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.fillText(`⚠️ ${name.toUpperCase()}`, labelX + 8, labelY);
  });

  ctx.restore();
}