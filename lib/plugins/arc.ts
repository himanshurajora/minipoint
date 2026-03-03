import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type ArcOptions = DrawableObjectOptions<{
  x: number;
  y: number;
  radius: number;
  /** Start angle in radians */
  startAngle: number;
  /** End angle in radians */
  endAngle: number;
  /** Draw counter-clockwise @default false */
  counterClockwise?: boolean;
  color?: string;
  stroke?: number;
  fill?: boolean;
  fillColor?: string;
}>;

/**
 * An arc (partial circle) shape
 */
export class Arc extends BaseObject<ArcOptions, Arc> {
  constructor(options: ArcOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);
  }

  override getCenter(): { x: number; y: number } {
    return { x: this.options.x, y: this.options.y };
  }

  override containsPoint(px: number, py: number): boolean {
    const dx = px - this.options.x;
    const dy = py - this.options.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > this.options.radius) return false;
    // Check if within angle range
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += Math.PI * 2;
    let start = this.options.startAngle % (Math.PI * 2);
    let end = this.options.endAngle % (Math.PI * 2);
    if (start < 0) start += Math.PI * 2;
    if (end < 0) end += Math.PI * 2;
    if (start <= end) {
      return angle >= start && angle <= end;
    }
    return angle >= start || angle <= end;
  }

  override draw() {
    this.context.beginPath();
    this.context.arc(
      this.options.x,
      this.options.y,
      this.options.radius,
      this.options.startAngle,
      this.options.endAngle,
      this.options.counterClockwise ?? false,
    );

    if (this.options.fill) {
      this.context.fillStyle = this.options.fillColor ?? this.options.color ?? '#000';
      this.context.fill();
    }

    const oldStroke = this.context.strokeStyle;
    const oldWidth = this.context.lineWidth;
    if (this.options.color) this.context.strokeStyle = this.options.color;
    if (this.options.stroke) this.context.lineWidth = this.options.stroke;
    this.context.stroke();
    this.context.strokeStyle = oldStroke;
    this.context.lineWidth = oldWidth;

    return this;
  }
}
