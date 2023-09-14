import { v4 } from 'uuid';
import { DrawableObjectOptions, BaseObjectInterface } from '../../types';
import { Renderer } from '../renderer';

/**
 * The Base Object Class
 */
export abstract class BaseObject<T, K> implements BaseObjectInterface {
  id: string;
  options: T & DrawableObjectOptions;
  context: CanvasRenderingContext2D;
  renderer: Renderer;
  constructor(options: DrawableObjectOptions<T>, renderer?: Renderer) {
    this.options = options;
    this.id = v4();

    // Either the specifically given render or the global renderer
    this.renderer = window.MiniPointDefaultRenderer;
    if (renderer) {
      this.renderer = renderer;
    }

    // add the object to default or provided renderer
    this.renderer.addObject(this);
    this.context = this.renderer.context;
    this.checkDrawConditionAndDraw();
  }

  abstract draw(): K;

  checkDrawConditionAndDraw() {
    if (this.options.show) {
      this.draw();
    }
  }
}
