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
  constructor(options: DrawableObjectOptions<T>, renderer?: Renderer) {
    this.options = options;
    // Either the specifically given render or the global renderer
    this.context = renderer?.context || window.MiniPointDefaultRenderer.context;
    this.id = v4();
    this.checkDrawConditionAndDraw();
  }

  abstract draw(): K;

  checkDrawConditionAndDraw() {
    if (this.options.show) {
      this.draw();
    }
  }
}
