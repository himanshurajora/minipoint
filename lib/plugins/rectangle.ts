import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type RectangleOptions = DrawableObjectOptions<{
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  stroke?: number;
  fill?: boolean;
  fillColor?: string;
}>;

export class Rectangle extends BaseObject<RectangleOptions, Rectangle> {
  constructor(options: RectangleOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);
  }

  override getCenter(): { x: number; y: number } {
    return {
      x: this.options.x + this.options.width / 2,
      y: this.options.y + this.options.height / 2,
    };
  }

  override containsPoint(px: number, py: number): boolean {
    return (
      px >= this.options.x &&
      px <= this.options.x + this.options.width &&
      py >= this.options.y &&
      py <= this.options.y + this.options.height
    );
  }

  override draw() {
    this.context.beginPath();
    this.context.rect(
      this.options.x,
      this.options.y,
      this.options.width,
      this.options.height,
    );

    if (this.options.fill) {
      this.context.fillStyle = this.options.fillColor ?? '#000';
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
