import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type TriangleOptions = DrawableObjectOptions<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  color?: string;
  stroke?: number;
  fill?: boolean;
  fillColor?: string;
}>;

/**
 * A triangle shape defined by three vertices
 */
export class Triangle extends BaseObject<TriangleOptions, Triangle> {
  constructor(options: TriangleOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);
  }

  override getCenter(): { x: number; y: number } {
    return {
      x: (this.options.x1 + this.options.x2 + this.options.x3) / 3,
      y: (this.options.y1 + this.options.y2 + this.options.y3) / 3,
    };
  }

  override containsPoint(px: number, py: number): boolean {
    const { x1, y1, x2, y2, x3, y3 } = this.options;
    // Barycentric coordinate method
    const denom = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    const a = ((y2 - y3) * (px - x3) + (x3 - x2) * (py - y3)) / denom;
    const b = ((y3 - y1) * (px - x3) + (x1 - x3) * (py - y3)) / denom;
    const c = 1 - a - b;
    return a >= 0 && b >= 0 && c >= 0;
  }

  override draw() {
    this.context.beginPath();
    this.context.moveTo(this.options.x1, this.options.y1);
    this.context.lineTo(this.options.x2, this.options.y2);
    this.context.lineTo(this.options.x3, this.options.y3);
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
