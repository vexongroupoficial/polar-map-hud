export function drawWindCurrents(ctx, jetStreamsData, activeLayers, centerX, centerY, maxRadius, rotation) {
  if (!activeLayers?.windCurrents || !jetStreamsData?.features) return;

  ctx.save();
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([6, 3]);

  jetStreamsData.features.forEach((feature) => {
    const coords = feature.geometry?.coordinates;
    if (!coords) return;

    ctx.beginPath();
    coords.forEach(([lon, lat], index) => {
      const radius = maxRadius * ((90 - lat) / 180);
      const thetaRad = ((lon + (rotation - 180)) * Math.PI) / 180;
      const x = centerX + radius * Math.sin(thetaRad);
      const y = centerY + radius * Math.cos(thetaRad);

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  ctx.restore();
}