import { DefaultEngineOptions } from '../constants';
import { EngineOptions } from '../types';
import { Renderer } from './renderer';

/**
 * The main rendering engine that container canvas, context and all of the configuration
 */
export class Engine {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  renderer: Renderer;
  width: number;
  height: number;
  x: number;
  y: number;

  constructor(
    canvasElement: HTMLCanvasElement | null,
    options: EngineOptions = DefaultEngineOptions,
  ) {
    if (!canvasElement) {
      throw Error(
        "Couldn't find the canvas, the value might be null or undefined",
      );
    }

    this.canvas = canvasElement;
    this.context = canvasElement.getContext(
      '2d',
      options?.contextOptions,
    ) as CanvasRenderingContext2D;
    this.x = this.canvas.getBoundingClientRect().x;
    this.y = this.canvas.getBoundingClientRect().y;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.canvas.style.border = options.engineOptions.border;
    this.canvas.style.background = options.engineOptions.bg;
    this.canvas.width = options.engineOptions.width;
    this.canvas.height = options.engineOptions.height;
    if (!this.context) {
      throw Error(
        "Couldn't find the context, the value might be null or undefined",
      );
    }

    const render = () => {
      if (options.engineOptions.clearEachFrame) {
        this.context?.clearRect(0, 0, this.width, this.height);
      }
      this.renderer.render();
      requestAnimationFrame(render);
    };

    this.renderer = new Renderer(this.context);
    render();

    // Set useful options to window
    // INFO: Make sure whenever new Engine is created it will overwrite the default
    // renderer and engine in the global scope
    window.MiniPointDefaultEngine = this;
    window.MiniPointDefaultRenderer = this.renderer;
  }

  get currentContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  set currentContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }
}
