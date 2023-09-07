import { Renderer } from './renderer';

/**
 * The main rendering engine that container canvas, context and all of the configuration
 */
export class Engine {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  renderer: Renderer;

  constructor(
    canvasElement: HTMLCanvasElement | null,
    options?: {
      contextOptions: CanvasRenderingContext2DSettings;
      // TODO: not yet decided
      engineOptions: {};
    },
  ) {
    if (!canvasElement) {
      throw Error(
        "Couldn't find the canvas, the value might be null or undefined",
      );
    }

    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d', options?.contextOptions);
    if (!this.context) {
      throw Error(
        "Couldn't find the context, the value might be null or undefined",
      );
    }

    this.renderer = new Renderer(this.context);
  }

  get currentContext(): CanvasRenderingContext2D | null {
    return this.context;
  }

  set currentContext(context: CanvasRenderingContext2D) {
    this.context = context;
  }
}
