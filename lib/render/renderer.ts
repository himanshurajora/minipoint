import { PointOptions, RendererInterface } from '../types';
import { DefaultPointOptions } from '../constants';
/**
 * The class that is responsible for drawing
 */
export class Renderer implements RendererInterface {
  context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  drawPoint(options?: PointOptions) {
    options = {
      ...DefaultPointOptions,
      ...options,
    };

    this.context.beginPath();
    // @ts-ignore
    this.context.arc(options.x, options.y, options.radius, 0, Math.PI * 2);
    this.context.fill();
  }
}
