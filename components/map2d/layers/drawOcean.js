// components/map2d/layers/drawOcean.js
export function drawOcean(ctx, centerX, centerY, mapRadius, isNeon = true) {
  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#020617';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, Math.PI * 2);

  if (isNeon) {
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 22;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
  } else {
    // 🎯 DESACTIVAR RESPLANDOR
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
  }

  ctx.stroke();
  ctx.restore();
}