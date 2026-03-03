import { DrawableObjectOptions, PointOptions } from '../types';

export const DefaultDrawableObjectOptions: DrawableObjectOptions = {
  show: true,
  addToRenderer: true,
  zIndex: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  opacity: 1,
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

export const DefaultEngineOptions = {
  engineOptions: {
    clearEachFrame: true,
    border: '1px solid black',
    bg: '#eee',
    width: DefaultCanvasOptions.width,
    height: DefaultCanvasOptions.height,
  },
  contextOptions: {},
};
