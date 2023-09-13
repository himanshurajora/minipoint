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
    options = { ...DefaultPointOptions, ...options };
    super(options, renderer);
  }

  draw() {
    if (!this.options.show) return this;
    this.context.beginPath();
    this.context.arc(
      this.options.x,
      this.options.y,
      this.options.radius!,
      0,
      Math.PI * 2,
    );

    this.context.fill();
    return this;
  }
}
