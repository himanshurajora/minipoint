import { v4 } from 'uuid';
import { DrawableObjectOptions, BaseObjectInterface } from '../../types';
import { Renderer } from '../renderer';
import { Engine } from '../engine';

/**
 * The Base Object Class
 */
export abstract class BaseObject<T, K> implements BaseObjectInterface {
  id: string;
  options: T & DrawableObjectOptions;
  context: CanvasRenderingContext2D;
  renderer: Renderer;
  // TODO: Later add support for child elements
  children: (T & BaseObject<T, K>)[];
  constructor(options: DrawableObjectOptions<T>, renderer?: Renderer) {
    this.options = options;
    this.id = v4();

    // Either the specifically given render or the global renderer
    this.renderer = window.MiniPointDefaultRenderer;
    if (renderer) {
      this.renderer = renderer;
    }

    this.children = [];
    // add the object to default or provided renderer
    this.renderer.addObject(this);
    this.context = this.renderer.context;
    this.start(this.renderer.engine);
    this.checkDrawConditionAndDraw(0);
  }

  abstract draw(): K;

  update: (engine: Engine, deltaTime: number) => void = (_engine: Engine) => {};
  start: (engine: Engine) => void = (_engine: Engine) => {};

  checkDrawConditionAndDraw(deltaTime: number) {
    this.update(this.renderer.engine, deltaTime);
    if (this.options.show) {
      this.draw();
    }
  }
}
