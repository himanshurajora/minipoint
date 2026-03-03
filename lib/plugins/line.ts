import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type LineOptions = DrawableObjectOptions<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  stroke?: number;
}>;

export class Line extends BaseObject<LineOptions, Line> {
  constructor(options: LineOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);
  }

  override getCenter(): { x: number; y: number } {
    return {
      x: (this.options.x1 + this.options.x2) / 2,
      y: (this.options.y1 + this.options.y2) / 2,
    };
  }

  override containsPoint(px: number, py: number): boolean {
    // Check distance from point to line segment
    const threshold = (this.options.stroke ?? 1) + 4; // a bit of tolerance
    const { x1, y1, x2, y2 } = this.options;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) {
      // Line is a point
      const d = Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
      return d <= threshold;
    }
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;
    const dist = Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
    return dist <= threshold;
  }

  override draw() {
    this.context.beginPath();
    this.context.moveTo(this.options.x1, this.options.y1);
    this.context.lineTo(this.options.x2, this.options.y2);
    const defaultStroke = this.context.strokeStyle;
    const defaultWidth = this.context.lineWidth;
    if (this.options.color) this.context.strokeStyle = this.options.color;
    if (this.options.stroke) this.context.lineWidth = this.options.stroke;
    this.context.stroke();
    this.context.strokeStyle = defaultStroke;
    this.context.lineWidth = defaultWidth;
    return this;
  }
}
