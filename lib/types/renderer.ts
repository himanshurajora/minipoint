declare global {
  interface Window {
    MiniPointDefaultRenderer: Renderer;
    MiniPointDefaultEngine: Engine;
  }
}

import { Engine } from '../render';
import { Renderer } from '../render/renderer';
import { BaseObjectInterface } from './shapes';

export abstract class BaseRenderer {
  context: CanvasRenderingContext2D;
  objects: BaseObjectInterface[];

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.objects = [];
  }
  abstract render(deltaTime: number): void;
}
