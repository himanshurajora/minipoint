import { v4 } from 'uuid';
import { DrawableObjectOptions, BaseObjectInterface } from '../../types';
import { Renderer } from '../renderer';
import { Engine } from '../engine';
import { EventEmitter } from '../../events';

/**
 * Event types that can be emitted by a BaseObject
 */
export type ObjectEventMap = {
  click: { x: number; y: number };
  mousedown: { x: number; y: number };
  mouseup: { x: number; y: number };
  mousemove: { x: number; y: number };
  mouseenter: { x: number; y: number };
  mouseleave: { x: number; y: number };
  update: { deltaTime: number };
  destroy: void;
};

/**
 * The Base Object Class
 * All renderable objects extend this class.
 */
export abstract class BaseObject<T, K> implements BaseObjectInterface {
  id: string;
  options: T & DrawableObjectOptions;
  context: CanvasRenderingContext2D;
  renderer: Renderer;
  /** Z-index for rendering order */
  zIndex: number;
  /** Child objects */
  children: BaseObject<any, any>[];
  /** Parent object (null if top-level) */
  parent: BaseObject<any, any> | null = null;
  /** Event emitter for per-object events */
  events: EventEmitter<ObjectEventMap>;
  /** Whether the mouse is currently over this object */
  private _isHovered: boolean = false;

  constructor(options: DrawableObjectOptions<T>, renderer?: Renderer) {
    this.options = {
      show: true,
      addToRenderer: true,
      zIndex: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      ...options,
    };
    this.id = v4();
    this.zIndex = this.options.zIndex ?? 0;
    this.events = new EventEmitter<ObjectEventMap>();

    // Either the specifically given renderer or the global renderer
    this.renderer = window.MiniPointDefaultRenderer;
    if (renderer) {
      this.renderer = renderer;
    }

    this.children = [];

    // Respect the addToRenderer option
    if (this.options.addToRenderer !== false) {
      this.renderer.addObject(this);
    }

    this.context = this.renderer.context;
  }

  abstract draw(): K;

  update: (engine: Engine, deltaTime: number) => void = (_engine: Engine, _deltaTime: number) => {};
  start: (engine: Engine) => void = (_engine: Engine) => {};

  private _started: boolean = false;

  /**
   * Called by the renderer each frame. Handles update lifecycle and draw conditions.
   */
  checkDrawConditionAndDraw(deltaTime: number) {
    if (!this._started) {
      this.start(this.renderer.engine);
      this._started = true;
    }

    this.update(this.renderer.engine, deltaTime);
    this.events.emit('update', { deltaTime });

    // Check per-object mouse events
    this._checkMouseEvents();

    if (this.options.show) {
      this.context.save();

      // Apply opacity
      if (this.options.opacity !== undefined && this.options.opacity < 1) {
        this.context.globalAlpha = this.options.opacity;
      }

      // Apply transforms (rotation, scale) around object center
      const center = this.getCenter();
      if (this.options.rotation || this.options.scaleX !== 1 || this.options.scaleY !== 1) {
        this.context.translate(center.x, center.y);
        if (this.options.rotation) {
          this.context.rotate(this.options.rotation);
        }
        if (this.options.scaleX !== 1 || this.options.scaleY !== 1) {
          this.context.scale(this.options.scaleX ?? 1, this.options.scaleY ?? 1);
        }
        this.context.translate(-center.x, -center.y);
      }

      this.draw();

      this.context.restore();

      // Draw children
      for (const child of this.children) {
        child.checkDrawConditionAndDraw(deltaTime);
      }
    }
  }

  /**
   * Get the center point of this object (override in subclasses for accuracy)
   */
  getCenter(): { x: number; y: number } {
    const opts = this.options as any;
    return { x: opts.x ?? 0, y: opts.y ?? 0 };
  }

  /**
   * Check if a point is inside this object (override in subclasses)
   */
  containsPoint(_x: number, _y: number): boolean {
    return false;
  }

  /**
   * Check mouse events against this object
   */
  private _checkMouseEvents() {
    const mouse = this.renderer.engine.input.mouse;
    const mx = mouse.position.x;
    const my = mouse.position.y;
    const inside = this.containsPoint(mx, my);

    if (inside && !this._isHovered) {
      this._isHovered = true;
      this.events.emit('mouseenter', { x: mx, y: my });
    } else if (!inside && this._isHovered) {
      this._isHovered = false;
      this.events.emit('mouseleave', { x: mx, y: my });
    }

    if (inside) {
      if (mouse.move) {
        this.events.emit('mousemove', { x: mx, y: my });
      }
      if (mouse.click) {
        this.events.emit('click', { x: mx, y: my });
      }
      if (mouse.down) {
        this.events.emit('mousedown', { x: mx, y: my });
      }
      if (mouse.up) {
        this.events.emit('mouseup', { x: mx, y: my });
      }
    }
  }

  // ─── Visibility Methods ─────────────────────────────────

  /** Show this object */
  show(): this {
    this.options.show = true;
    return this;
  }

  /** Hide this object */
  hide(): this {
    this.options.show = false;
    return this;
  }

  /** Toggle visibility */
  toggleVisibility(): this {
    this.options.show = !this.options.show;
    return this;
  }

  /** Check if visible */
  isVisible(): boolean {
    return this.options.show ?? true;
  }

  // ─── Child Management ───────────────────────────────────

  /** Add a child object */
  addChild<C extends BaseObject<any, any>>(child: C): C {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  /** Remove a child object */
  removeChild<C extends BaseObject<any, any>>(child: C): C | null {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parent = null;
      return child;
    }
    return null;
  }

  /** Remove all children */
  removeAllChildren(): void {
    for (const child of this.children) {
      child.parent = null;
    }
    this.children = [];
  }

  // ─── Transform Methods ──────────────────────────────────

  /** Set rotation in radians */
  setRotation(angle: number): this {
    this.options.rotation = angle;
    return this;
  }

  /** Get rotation in radians */
  getRotation(): number {
    return this.options.rotation ?? 0;
  }

  /** Set uniform scale */
  setScale(scaleX: number, scaleY?: number): this {
    this.options.scaleX = scaleX;
    this.options.scaleY = scaleY ?? scaleX;
    return this;
  }

  /** Set opacity (0–1) */
  setOpacity(opacity: number): this {
    this.options.opacity = Math.max(0, Math.min(1, opacity));
    return this;
  }

  // ─── Lifecycle ──────────────────────────────────────────

  /**
   * Remove this object from its renderer and clean up
   */
  destroy(): void {
    this.events.emit('destroy', undefined as any);
    this.events.clear();
    this.removeAllChildren();
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.renderer.removeObject(this);
  }
}
