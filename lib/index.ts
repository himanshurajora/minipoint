import { MINIPOINT_LOGO } from './render';

export * from './render';
export * from './common';

// Simple things
import * as MiniPoint from '.';
console.log("%cWelcome! to minipoint. Let's Play...", 'color: green');
console.log('%cFor your ease, window.MiniPoint is a thing.', 'color: blue');
console.warn('This is a library so use it that way.');
console.log('%c' + MINIPOINT_LOGO, 'color: purple');
if (window) {
  (window as any).MiniPoint = MiniPoint;
}
