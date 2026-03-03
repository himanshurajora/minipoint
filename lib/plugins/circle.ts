import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type CircleOptions = DrawableObjectOptions<{
  x: number;
  y: number;
  radius: number;
  color?: string;
  stroke?: number;
  fill?: boolean;
  fillColor?: string;
}>;

/**
 * A circle shape (distinct from Point — Circle supports stroke and fill)
 */
export class Circle extends BaseObject<CircleOptions, Circle> {
  constructor(options: CircleOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);
  }

  override getCenter(): { x: number; y: number } {
    return { x: this.options.x, y: this.options.y };
  }

  override containsPoint(px: number, py: number): boolean {
    const dx = px - this.options.x;
    const dy = py - this.options.y;
    return dx * dx + dy * dy <= this.options.radius * this.options.radius;
  }

  override draw() {
    this.context.beginPath();
    this.context.arc(
      this.options.x,
      this.options.y,
      this.options.radius,
      0,
      Math.PI * 2,
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
