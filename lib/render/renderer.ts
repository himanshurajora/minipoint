import { forEach } from 'lodash';
import { DefaultPointOptions } from '../constants';
import { BaseRenderer, PointOptions } from '../types';
import { Point } from './objects';
/**
 * The class that is responsible for drawing
 */
export class Renderer extends BaseRenderer {
  constructor(context: CanvasRenderingContext2D) {
    super(context);
  }

  render() {
    forEach(this.objects, (object) => {
      object.checkDrawConditionAndDraw();
    });
  }

  point(options: PointOptions = DefaultPointOptions) {
    const point = new Point(options, this);
    this.objects.push(point);
    return point;
  }
}
