import { createCanvas } from '../common';
import { DefaultEngineOptions } from '../constants';
import { Input } from '../input';
import { Vector } from '../physics';
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
  position: Vector = new Vector(0, 0);
  options: EngineOptions;
  input: Input;

  constructor(
    canvasElement?: HTMLCanvasElement | null,
    options: EngineOptions = DefaultEngineOptions,
  ) {
    options = {
      contextOptions: {
        ...DefaultEngineOptions.contextOptions,
        ...options.contextOptions,
      },
      engineOptions: {
        ...DefaultEngineOptions.engineOptions,
        ...options.engineOptions,
      },
    };
    this.options = options;
    // NOTE: even if the canvas is not given, we'll create it ourself
    if (!canvasElement) {
      const { canvas } = createCanvas();
      canvasElement = canvas;
    }

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
    const { x, y } = this.canvas.getBoundingClientRect();

    // even if the windows is scrolled initially, we want to make sure that
    // the initial position is calculated based on scrolled window.
    // otherwise, the position may be unexpected
    this.position = new Vector(x - window.scrollX, y - -window.scrollY);
    this.width = this.options.engineOptions?.width!;
    this.height = this.options.engineOptions?.height!;
    this.canvas.style.border = options.engineOptions!.border!;
    this.canvas.style.background = options.engineOptions!.bg!;
    this.canvas.style.width = options.engineOptions!.width!.toString() + 'px';
    this.canvas.style.height = options.engineOptions!.height!.toString() + 'px';
    this.canvas.width = options.engineOptions!.width!;
    this.canvas.height = options.engineOptions!.height!;

    if (!this.context) {
      throw Error(
        "Couldn't find the context, the value might be null or undefined",
      );
    }

    this.input = new Input(this);
    this.start(this);

    let previousTimestamp = 0;
    const render = (currentTimestamp: number) => {
      const deltaTime = (currentTimestamp - previousTimestamp) / 1000;
      previousTimestamp = currentTimestamp;
      this.update(this, deltaTime);
      if (options.engineOptions!.clearEachFrame) {
        this.context?.clearRect(0, 0, this.width, this.height);
      }
      this.renderer.render(deltaTime);
      this.resetEvent();
      requestAnimationFrame(render);
    };

    this.renderer = new Renderer(this);
    requestAnimationFrame((timestamp) => {
      previousTimestamp = timestamp;
      requestAnimationFrame(render);
    });

    // Set useful options to window
    // INFO: Make sure whenever new Engine is created it will overwrite the default
    // renderer and engine in the global scope
    window.MiniPointDefaultEngine = this;
    window.MiniPointDefaultRenderer = this.renderer;
  }

  update: (engine: Engine, deltaTime: number) => void = (
    _engine: Engine,
    _deltaTime: number,
  ) => {};

  start: (_engine: Engine) => void = (_engine: Engine) => {};

  // reset single frame events
  resetEvent() {
    this.input.mouse.click = false;
    this.input.mouse.move = false;
    this.input.keyboard.currentUpKey = '';
  }
}
