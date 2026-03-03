import { PointOptions } from '../../types';
import { DefaultPointOptions } from '../../constants';
import { BaseObject } from './base-object';
import { Renderer } from '../renderer';
/**
 * The Point Class
 */
export class Point extends BaseObject<PointOptions, Point> {
  constructor(
    options: PointOptions = DefaultPointOptions,
    renderer?: Renderer,
  ) {
    // base class will handle defaults
    options = {
      ...DefaultPointOptions,
      ...options,
    };

    super(options, renderer);
  }

  override getCenter(): { x: number; y: number } {
    return { x: this.options.x, y: this.options.y };
  }

  override containsPoint(px: number, py: number): boolean {
    const dx = px - this.options.x;
    const dy = py - this.options.y;
    const r = this.options.radius ?? 5;
    return dx * dx + dy * dy <= r * r;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(
      this.options.x,
      this.options.y,
      this.options.radius!,
      0,
      Math.PI * 2,
    );
    if (this.options.color) this.context.fillStyle = this.options.color;
    this.context.fill();
    return this;
  }
}
