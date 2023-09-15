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
    // base class will de
    options = {
      ...DefaultPointOptions,
      ...options,
    };

    super(options, renderer);
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
