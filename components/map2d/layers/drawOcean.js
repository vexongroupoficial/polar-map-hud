export function drawOcean(ctx, centerX, centerY, mapRadius) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, mapRadius, 0, 2 * Math.PI);
  ctx.fillStyle = '#020617';
  ctx.fill();
}