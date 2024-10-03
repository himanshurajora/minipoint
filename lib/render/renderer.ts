import _, { forEach } from 'lodash';
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

  public render(deltaTime: number) {
    forEach(this.objects, (object) => {
      if (object) {
        object.checkDrawConditionAndDraw(deltaTime);
      }
    });
  }

  /**
   * Add object to the renderer and also add renderer to the object
   * *NOTE*: This will overwrite the default renderer of the object
   * @param {BaseObjectInterface<T>} object
   * @returns
   */
  public addObject<T extends BaseObjectInterface>(object: T): T {
    this.objects[object.id] = object as BaseObjectInterface<T>;
    (object as BaseObjectInterface<T>).renderer = this;
    return object;
  }

  public removeObject<T extends BaseObjectInterface>(object: T) {
    delete this.objects[object.id];
  }

  public getObject(id: string) {
    return this.objects[id];
  }

  public point(point: PointOptions | Point = DefaultPointOptions) {
    if (point instanceof Point) {
      return this.addObject(point);
    }
    const _point = new Point(point, this);
    return this.addObject(_point);
  }
}
