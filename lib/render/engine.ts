import { createCanvas } from '../common';
import { DefaultEngineOptions } from '../constants';
import { Input } from '../input';
import { Vector } from '../physics';
import { EngineOptions } from '../types';
import { Renderer } from './renderer';

/**
 * The main rendering engine that contains canvas, context and all of the configuration
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
  /** Whether the engine's render loop is running */
  private _running: boolean = true;
  private _animFrameId: number = 0;
  private _resizeHandler: (() => void) | null = null;

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
    // NOTE: even if the canvas is not given, we'll create it ourselves
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

    // Calculate initial position accounting for scroll
    this.position = new Vector(x + window.scrollX, y + window.scrollY);
    this.width = this.options.engineOptions?.width ?? DefaultEngineOptions.engineOptions.width;
    this.height = this.options.engineOptions?.height ?? DefaultEngineOptions.engineOptions.height;
    this.canvas.style.border = options.engineOptions?.border ?? '';
    this.canvas.style.background = options.engineOptions?.bg ?? '';
    this.canvas.style.width = this.width.toString() + 'px';
    this.canvas.style.height = this.height.toString() + 'px';
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (!this.context) {
      throw Error(
        "Couldn't find the context, the value might be null or undefined",
      );
    }

    this.input = new Input(this);
    this.start(this);

    let previousTimestamp = 0;
    const render = (currentTimestamp: number) => {
      if (!this._running) return;
      const deltaTime = (currentTimestamp - previousTimestamp) / 1000;
      previousTimestamp = currentTimestamp;
      this.update(this, deltaTime);
      if (options.engineOptions?.clearEachFrame !== false) {
        this.context?.clearRect(0, 0, this.width, this.height);
      }
      this.renderer.render(deltaTime);
      this.resetEvent();
      this._animFrameId = requestAnimationFrame(render);
    };

    this.renderer = new Renderer(this);
    this._animFrameId = requestAnimationFrame((timestamp) => {
      previousTimestamp = timestamp;
      this._animFrameId = requestAnimationFrame(render);
    });

    // Handle window resize — update canvas position
    this._resizeHandler = () => {
      const rect = this.canvas.getBoundingClientRect();
      this.position = new Vector(rect.x + window.scrollX, rect.y + window.scrollY);
    };
    window.addEventListener('resize', this._resizeHandler);
    window.addEventListener('scroll', this._resizeHandler);

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

  /**
   * Resize the canvas
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    if (this.options.engineOptions) {
      this.options.engineOptions.width = width;
      this.options.engineOptions.height = height;
    }
  }

  /**
   * Make the canvas fill its parent element and auto-resize
   */
  setFullscreen(parent?: HTMLElement): void {
    const container = parent ?? this.canvas.parentElement ?? document.body;
    const updateSize = () => {
      this.resize(container.clientWidth, container.clientHeight);
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
  }

  /**
   * Pause the render loop
   */
  pause(): void {
    this._running = false;
  }

  /**
   * Resume the render loop
   */
  resume(): void {
    if (!this._running) {
      this._running = true;
      let previousTimestamp = performance.now();
      const render = (currentTimestamp: number) => {
        if (!this._running) return;
        const deltaTime = (currentTimestamp - previousTimestamp) / 1000;
        previousTimestamp = currentTimestamp;
        this.update(this, deltaTime);
        if (this.options.engineOptions?.clearEachFrame !== false) {
          this.context?.clearRect(0, 0, this.width, this.height);
        }
        this.renderer.render(deltaTime);
        this.resetEvent();
        this._animFrameId = requestAnimationFrame(render);
      };
      this._animFrameId = requestAnimationFrame(render);
    }
  }

  /**
   * Check if the engine is currently running
   */
  isRunning(): boolean {
    return this._running;
  }

  /**
   * Destroy the engine and clean up all resources
   */
  destroy(): void {
    this._running = false;
    cancelAnimationFrame(this._animFrameId);
    this.input.destroy();
    this.renderer.clear();
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      window.removeEventListener('scroll', this._resizeHandler);
    }
  }
}
