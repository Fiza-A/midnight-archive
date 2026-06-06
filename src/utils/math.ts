/** Parametric heart curve — returns normalized points (0–1) */
export function generateHeartPoints(count: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);

    points.push({ x, y });
  }

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return points.map((p) => ({
    x: (p.x - minX) / (maxX - minX),
    y: 1 - (p.y - minY) / (maxY - minY),
  }));
}

/** Map heart points to screen coordinates */
export function heartPositions(
  count: number,
  width: number,
  height: number,
  padding = 0.08
): { x: number; y: number }[] {
  const points = generateHeartPoints(count);
  const innerW = width * (1 - padding * 2);
  const innerH = height * (1 - padding * 2);

  return points.map((p) => ({
    x: padding * width + p.x * innerW,
    y: padding * height + p.y * innerH,
  }));
}

/** Random star positions for constellation */
export function generateStarPositions(
  count: number,
  width: number,
  height: number
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const minDist = 0.12;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    while (attempts < 50) {
      const x = 0.08 + Math.random() * 0.84;
      const y = 0.08 + Math.random() * 0.84;
      const tooClose = positions.some(
        (p) =>
          Math.hypot(p.x - x, p.y - y) < minDist
      );
      if (!tooClose) {
        positions.push({ x: x * width, y: y * height });
        break;
      }
      attempts++;
    }
  }

  return positions;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
