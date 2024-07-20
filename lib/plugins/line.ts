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
    super(options, renderer);
    this.options = {
      ...DefaultDrawableObjectOptions,
      ...options,
    };
  }
  override draw() {
    console.log('Called');
    this.context.beginPath();
    this.context.moveTo(this.options.x1, this.options.y1);
    this.context.lineTo(this.options.x2, this.options.y2);
    if (this.options.color) this.context.strokeStyle = this.options.color;
    if (this.options.stroke) this.context.lineWidth = this.options.stroke;
    this.context.stroke();
    return this;
  }
}
