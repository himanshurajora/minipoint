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
  fill: boolean;
  fillColor: string;
}>;

export class Rectangle extends BaseObject<RectangleOptions, Rectangle> {
  constructor(options: RectangleOptions, renderer?: Renderer) {
    super(options, renderer);
    this.options = {
      ...DefaultDrawableObjectOptions,
      ...options,
    };
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
      this.context.fillStyle = this.options.fillColor;
      this.context.fill();
    }

    if (this.options.color) this.context.strokeStyle = this.options.color;
    if (this.options.stroke) this.context.lineWidth = this.options.stroke;
    this.context.stroke();

    return this;
  }
}
