import { Vector } from '../physics/vector';
import { Engine } from '../render';

export class Input {
  mouse: MouseInput;
  keyboard: KeyBoardInput;

  constructor(engine: Engine) {
    this.mouse = new MouseInput(engine);
    this.keyboard = new KeyBoardInput(engine);
  }

  /**
   * Remove all event listeners. Call when destroying the engine.
   */
  destroy() {
    this.mouse.destroy();
    this.keyboard.destroy();
  }
}

export class MouseInput {
  down?: boolean;
  up?: boolean;
  move?: boolean;
  click?: boolean;
  position: Vector = new Vector(0, 0);
  /** Touch is active (finger down) */
  touchActive: boolean = false;

  private _listeners: { type: string; handler: EventListener }[] = [];

  constructor(engine: Engine) {
    const addListener = (type: string, handler: EventListener) => {
      window.addEventListener(type, handler);
      this._listeners.push({ type, handler });
    };

    addListener('mousedown', (e: Event) => {
      const me = e as MouseEvent;
      this.up = false;
      this.down = true;
      this.position = this.getMousePositionOnCanvas(
        new Vector(me.clientX, me.clientY),
        engine,
      );
    });

    addListener('mouseup', (e: Event) => {
      const me = e as MouseEvent;
      this.up = true;
      this.down = false;
      this.position = this.getMousePositionOnCanvas(
        new Vector(me.clientX, me.clientY),
        engine,
      );
    });

    addListener('mousemove', (e: Event) => {
      const me = e as MouseEvent;
      this.move = true;
      this.position = this.getMousePositionOnCanvas(
        new Vector(me.clientX, me.clientY),
        engine,
      );
    });

    addListener('click', (e: Event) => {
      const me = e as MouseEvent;
      this.position = this.getMousePositionOnCanvas(
        new Vector(me.clientX, me.clientY),
        engine,
      );
      this.click = true;
    });

    // Touch input support
    addListener('touchstart', (e: Event) => {
      const te = e as TouchEvent;
      const touch = te.touches[0];
      if (te.touches.length > 0 && touch) {
        this.touchActive = true;
        this.down = true;
        this.up = false;
        this.position = this.getMousePositionOnCanvas(
          new Vector(touch.clientX, touch.clientY),
          engine,
        );
      }
    });

    addListener('touchmove', (e: Event) => {
      const te = e as TouchEvent;
      const touch = te.touches[0];
      if (te.touches.length > 0 && touch) {
        this.move = true;
        this.position = this.getMousePositionOnCanvas(
          new Vector(touch.clientX, touch.clientY),
          engine,
        );
      }
    });

    addListener('touchend', (_e: Event) => {
      this.touchActive = false;
      this.up = true;
      this.down = false;
    });
  }

  /**
   * The position on DOM and position on canvas may differ because of canvas's position
   * on DOM and scrolled browser view. So we are basically getting the exact position of
   * the clicked point on the canvas and not the DOM. I hope you got it 😄
   * @param {Vector} mousePointOnScreen Position detected by DOM
   * @param {Engine} engine The Engine
   * @returns {Vector} Final Position on Canvas
   */
  getMousePositionOnCanvas(mousePointOnScreen: Vector, engine: Engine): Vector {
    const scrollOffset = new Vector(window.scrollX, window.scrollY);
    return mousePointOnScreen.clone().subtract(
      engine.position,
      scrollOffset,
    );
  }

  /**
   * Remove all event listeners
   */
  destroy() {
    for (const { type, handler } of this._listeners) {
      window.removeEventListener(type, handler);
    }
    this._listeners = [];
  }
}

export class KeyBoardInput {
  currentDownKey: string = '';
  currentUpKey: string = '';
  currentPressedKey: string = '';
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;

  engine: Engine;

  private _listeners: { type: string; handler: EventListener }[] = [];

  constructor(engine: Engine) {
    this.engine = engine;

    const addListener = (type: string, handler: EventListener) => {
      window.addEventListener(type, handler);
      this._listeners.push({ type, handler });
    };

    addListener('keydown', (e: Event) => {
      const event = e as KeyboardEvent;
      this.currentDownKey = this.getKey(event.key);
      this.currentUpKey = '';
      this.altKey = event.altKey;
      this.shiftKey = event.shiftKey;
      this.ctrlKey = event.ctrlKey;
    });

    addListener('keyup', (e: Event) => {
      const event = e as KeyboardEvent;
      this.altKey = event.altKey;
      this.shiftKey = event.shiftKey;
      this.ctrlKey = event.ctrlKey;
      this.currentUpKey = this.getKey(event.key);
      this.currentDownKey = '';
      this.currentPressedKey = '';
    });
  }

  getKey(key: string) {
    if (!key) return '';

    if (this.engine.options.engineOptions?.preserveKeyboardInputCase) {
      return key;
    }

    return key.toLowerCase();
  }

  /**
   * Remove all event listeners
   */
  destroy() {
    for (const { type, handler } of this._listeners) {
      window.removeEventListener(type, handler);
    }
    this._listeners = [];
  }
}
