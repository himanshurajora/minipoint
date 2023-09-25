import { forEach } from 'lodash';
import { DefaultPointOptions } from '../constants';
import { BaseObjectInterface, BaseRenderer, PointOptions } from '../types';
import { Point } from './objects';
import { Engine } from './engine';
/**
 * The class that is responsible for drawing
 */
export class Renderer extends BaseRenderer {
  engine: Engine;
  constructor(engine: Engine) {
    if (!engine.context)
      throw new Error(
        "Context wan't found while initializing renderer, please check your code",
      );
    super(engine.context);
    this.engine = engine;
  }

  render(deltaTime: number) {
    forEach(this.objects, (object) => {
      object.checkDrawConditionAndDraw(deltaTime);
    });
  }

  /**
   * Add object to the renderer and also add renderer to the object
   * *NOTE*: This will overwrite the default renderer of the object
   * @param {BaseObjectInterface<T>} object
   * @returns
   */
  addObject<T>(object: T): T {
    this.objects.push(object as BaseObjectInterface<T>);
    (object as BaseObjectInterface<T>).renderer = this;
    return object;
  }

  point(options: PointOptions = DefaultPointOptions) {
    const point = new Point(options, this);
    this.objects.push(point);
    return point;
  }
}
