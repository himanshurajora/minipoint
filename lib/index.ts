import { MINIPOINT_LOGO } from './render';

export * from './physics';
export * from './render';
export * from './common';
export * from './input';
export * from './plugins';
export * from './collision';
export * from './animation';
export * from './camera';
export * from './color';
export * from './events';

// Simple things
import * as MiniPoint from '.';
console.log("%cWelcome! to minipoint. Let's Play...", 'color: green');
console.log('%cFor your ease, window.MiniPoint is a thing.', 'color: blue');
console.log('%cThis is a library so use it that way.', 'color: yellow');
console.log('%c' + MINIPOINT_LOGO, 'color: purple');
if (typeof window !== 'undefined') {
  (window as any).MiniPoint = MiniPoint;
}
