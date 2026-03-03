import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type EllipseOptions = DrawableObjectOptions<{
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  color?: string;
  stroke?: number;
  fill?: boolean;
  fillColor?: string;
  /** Start angle in radians @default 0 */
  startAngle?: number;
  /** End angle in radians @default 2π */
  endAngle?: number;
}>;

/**
 * An ellipse shape
 */
export class Ellipse extends BaseObject<EllipseOptions, Ellipse> {
  constructor(options: EllipseOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);
  }

  override getCenter(): { x: number; y: number } {
    return { x: this.options.x, y: this.options.y };
  }

  override containsPoint(px: number, py: number): boolean {
    const dx = px - this.options.x;
    const dy = py - this.options.y;
    const rx = this.options.radiusX;
    const ry = this.options.radiusY;
    return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
  }

  override draw() {
    this.context.beginPath();
    this.context.ellipse(
      this.options.x,
      this.options.y,
      this.options.radiusX,
      this.options.radiusY,
      this.options.rotation ?? 0,
      this.options.startAngle ?? 0,
      this.options.endAngle ?? Math.PI * 2,
    );

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
