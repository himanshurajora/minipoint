import { Renderer } from '../render/renderer';

export interface BaseObjectInterface<T = unknown> {
  // draw: () => T;
  checkDrawConditionAndDraw: (deltaTime: number) => T;
  /**
   * A Unique Id that will help us identify each object in the Engine
   */
  id: string;
  renderer: Renderer;
}

export type DrawableObjectOptions<T = unknown> = T & {
  /**
   * Weather to show the object or not
   */
  show?: boolean;
  addToRenderer?: boolean;
};

export type PointOptions = DrawableObjectOptions<{
  x: number;
  y: number;
  color?: string;
  radius?: number;
}>;
