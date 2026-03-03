import { DefaultPointOptions } from '../constants';
import { BaseObjectInterface, BaseRenderer, PointOptions } from '../types';
import { Point } from './objects';
import { Engine } from './engine';

/**
 * The class that is responsible for drawing.
 * Manages objects, z-ordering, and per-frame rendering.
 */
export class Renderer extends BaseRenderer {
  engine: Engine;
  /** Internal sorted array for z-order rendering */
  private _sortedObjects: BaseObjectInterface[] = [];
  private _needsSort: boolean = false;

  constructor(engine: Engine) {
    if (!engine.context)
      throw new Error(
        "Context wasn't found while initializing renderer, please check your code",
      );
    super(engine.context);
    this.engine = engine;
  }

  /**
   * Mark that objects need re-sorting (called when objects change z-index)
   */
  markDirty() {
    this._needsSort = true;
  }

  private _sortObjects() {
    this._sortedObjects = Object.values(this.objects).sort(
      (a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0),
    );
    this._needsSort = false;
  }

  public render(deltaTime: number) {
    if (this._needsSort) {
      this._sortObjects();
    }
    for (const object of this._sortedObjects) {
      if (object) {
        object.checkDrawConditionAndDraw(deltaTime);
      }
    }
  }

  /**
   * Add object to the renderer and also add renderer to the object
   * *NOTE*: This will overwrite the default renderer of the object
   * @param {BaseObjectInterface<T>} object
   * @returns
   */
  public addObject<T extends BaseObjectInterface>(object: T): T {
    this.objects[object.id] = object as BaseObjectInterface<T>;
    (object as BaseObjectInterface<T>).renderer = this;
    this._needsSort = true;
    return object;
  }

  public removeObject<T extends BaseObjectInterface>(object: T) {
    delete this.objects[object.id];
    this._needsSort = true;
  }

  public getObject(id: string) {
    return this.objects[id];
  }

  /**
   * Get all objects as an array (sorted by z-index)
   */
  public getObjects(): BaseObjectInterface[] {
    if (this._needsSort) {
      this._sortObjects();
    }
    return [...this._sortedObjects];
  }

  /**
   * Get the number of objects in the renderer
   */
  public getObjectCount(): number {
    return Object.keys(this.objects).length;
  }

  /**
   * Remove all objects from the renderer
   */
  public clear(): void {
    this.objects = {};
    this._sortedObjects = [];
    this._needsSort = false;
  }

  /**
   * Create and add a Point
   */
  public point(point: PointOptions | Point = DefaultPointOptions) {
    if (point instanceof Point) {
      return this.addObject(point);
    }
    const _point = new Point(point, this);
    return this.addObject(_point);
  }
}
