import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type PolygonOptions = DrawableObjectOptions<{
  /** Array of [x, y] vertices */
  points: [number, number][];
  color?: string;
  stroke?: number;
  fill?: boolean;
  fillColor?: string;
}>;

/**
 * A polygon shape defined by an array of vertices
 */
export class Polygon extends BaseObject<PolygonOptions, Polygon> {
  constructor(options: PolygonOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);
  }

  override getCenter(): { x: number; y: number } {
    const pts = this.options.points;
    if (pts.length === 0) return { x: 0, y: 0 };
    let cx = 0, cy = 0;
    for (const [x, y] of pts) {
      cx += x;
      cy += y;
    }
    return { x: cx / pts.length, y: cy / pts.length };
  }

  override containsPoint(px: number, py: number): boolean {
    // Ray-casting algorithm
    const pts = this.options.points;
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const pi = pts[i]!;
      const pj = pts[j]!;
      const xi = pi[0], yi = pi[1];
      const xj = pj[0], yj = pj[1];
      if (
        ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi)
      ) {
        inside = !inside;
      }
    }
    return inside;
  }

  override draw() {
    const pts = this.options.points;
    if (pts.length < 2) return this;

    this.context.beginPath();
    const first = pts[0]!;
    this.context.moveTo(first[0], first[1]);
    for (let i = 1; i < pts.length; i++) {
      const pt = pts[i]!;
      this.context.lineTo(pt[0], pt[1]);
    }
    this.context.closePath();

    if (this.options.fill !== false) {
      this.context.fillStyle = this.options.fillColor ?? this.options.color ?? '#000';
      this.context.fill();
    }

    if (this.options.stroke) {
      const oldStroke = this.context.strokeStyle;
      const oldWidth = this.context.lineWidth;
      if (this.options.color) this.context.strokeStyle = this.options.color;
      this.context.lineWidth = this.options.stroke;
      this.context.stroke();
      this.context.strokeStyle = oldStroke;
      this.context.lineWidth = oldWidth;
    }

    return this;
  }
}
