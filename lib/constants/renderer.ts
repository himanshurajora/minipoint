import { DrawableObjectOptions, PointOptions } from '../types';

export const DefaultDrawableObjectOptions: DrawableObjectOptions = {
  show: true,
};

export const DefaultPointOptions: PointOptions = {
  ...DefaultDrawableObjectOptions,
  x: 0,
  y: 0,
  radius: 5,
};

export const DefaultCanvasOptions = {
  parentElement: document.body,
  width: 800,
  height: 600,
};
