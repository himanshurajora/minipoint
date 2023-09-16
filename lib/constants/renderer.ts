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
