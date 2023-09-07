import { DefaultCanvasOptions } from '../constants';
import { CanvasOptions } from '../types';

export function createCanvas(options?: CanvasOptions) {
  if (!document) {
    throw Error('Please run in a Browser Runtime (eg: chromium, gecko)');
  }

  if (!options) {
    options = DefaultCanvasOptions;
  }

  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;

  options.parentElement.appendChild(canvas);
  return {
    canvas,
    parent: options.parentElement,
  };
}
