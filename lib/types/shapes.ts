import { Renderer } from '../render/renderer';

export interface BaseObjectInterface<T = unknown> {
  draw: () => T;
  checkDrawConditionAndDraw: (deltaTime: number) => T | void;
  /**
   * A Unique Id that will help us identify each object in the Engine
   */
  id: string;
  renderer: Renderer;
  /** Z-index for rendering order (higher = on top) */
  zIndex: number;
}

export type DrawableObjectOptions<T = unknown> = T & {
  /**
   * Whether to show the object or not
   */
  show?: boolean;
  /**
   * Whether to automatically add the object to the renderer on creation
   */
  addToRenderer?: boolean;
  /**
   * Z-index for rendering order (higher values render on top)
   */
  zIndex?: number;
  /**
   * Rotation angle in radians
   */
  rotation?: number;
  /**
   * Scale factor for x and y
   */
  scaleX?: number;
  scaleY?: number;
  /**
   * Opacity (0 = transparent, 1 = fully opaque)
   */
  opacity?: number;
};

export type PointOptions = DrawableObjectOptions<{
  x: number;
  y: number;
  color?: string;
  radius?: number;
}>;

