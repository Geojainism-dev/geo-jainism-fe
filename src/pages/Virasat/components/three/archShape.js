import * as THREE from "three";

/**
 * Points along a multi-cusped (Rajput/Mughal style) arch intrados.
 * Springs at (±halfSpan, base) and peaks at (0, base + rise). `lobes` small
 * scallops are cut into the curve; the apex is slightly pointed.
 */
export function archCurve({ halfSpan = 2.2, base = 3.7, rise = 1.3, lobes = 7, cusp = 0.075, steps = 140 } = {}) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 → right springing, 1 → left springing
    const theta = t * Math.PI;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    // ellipse, pushed up towards a point at the apex
    let x = halfSpan * cos;
    let y = rise * sin + rise * 0.22 * Math.pow(sin, 6);
    // cusps: pull the curve towards the springing-line centre in lobes
    const scallop = 1 - cusp * Math.abs(Math.sin(lobes * theta));
    x *= scallop;
    y *= scallop;
    pts.push(new THREE.Vector2(x, base + y));
  }
  return pts;
}

/** Solid arch "beam" spanning two pillars: rectangle with the arch cut out. */
export function archBeamShape({ outerHalf = 3.0, top = 5.6, ...curve } = {}) {
  const base = curve.base ?? 3.7;
  const half = curve.halfSpan ?? 2.2;
  const shape = new THREE.Shape();
  shape.moveTo(-outerHalf, base);
  shape.lineTo(-outerHalf, top);
  shape.lineTo(outerHalf, top);
  shape.lineTo(outerHalf, base);
  shape.lineTo(half, base);
  archCurve(curve).forEach((p) => shape.lineTo(p.x, p.y));
  shape.lineTo(-outerHalf, base);
  return shape;
}

/** Filled arch window (for the glowing portal). */
export function archWindowShape(curve = {}) {
  const base = curve.base ?? 0;
  const half = curve.halfSpan ?? 1;
  const shape = new THREE.Shape();
  shape.moveTo(-half, base - (curve.leg ?? 0));
  shape.lineTo(half, base - (curve.leg ?? 0));
  archCurve(curve).forEach((p) => shape.lineTo(p.x, p.y));
  shape.closePath();
  return shape;
}
