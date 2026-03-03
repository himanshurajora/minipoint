import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type PathOptions = DrawableObjectOptions<{
  /** Array of path commands */
  commands: PathCommand[];
  color?: string;
  stroke?: number;
  fill?: boolean;
  fillColor?: string;
}>;

export type PathCommand =
  | { type: 'moveTo'; x: number; y: number }
  | { type: 'lineTo'; x: number; y: number }
  | { type: 'quadraticCurveTo'; cpx: number; cpy: number; x: number; y: number }
  | { type: 'bezierCurveTo'; cp1x: number; cp1y: number; cp2x: number; cp2y: number; x: number; y: number }
  | { type: 'arcTo'; x1: number; y1: number; x2: number; y2: number; radius: number }
  | { type: 'closePath' };

/**
 * A custom path shape built from path commands (lineTo, bezierCurveTo, etc.)
 */
export class Path extends BaseObject<PathOptions, Path> {
  constructor(options: PathOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);
  }

  override getCenter(): { x: number; y: number } {
    // Approximate center from moveTo/lineTo points
    const cmds = this.options.commands;
    let cx = 0, cy = 0, count = 0;
    for (const cmd of cmds) {
      if ('x' in cmd && 'y' in cmd) {
        cx += cmd.x;
        cy += cmd.y;
        count++;
      }
    }
    if (count === 0) return { x: 0, y: 0 };
    return { x: cx / count, y: cy / count };
  }

  override draw() {
    this.context.beginPath();

    for (const cmd of this.options.commands) {
      switch (cmd.type) {
        case 'moveTo':
          this.context.moveTo(cmd.x, cmd.y);
          break;
        case 'lineTo':
          this.context.lineTo(cmd.x, cmd.y);
          break;
        case 'quadraticCurveTo':
          this.context.quadraticCurveTo(cmd.cpx, cmd.cpy, cmd.x, cmd.y);
          break;
        case 'bezierCurveTo':
          this.context.bezierCurveTo(cmd.cp1x, cmd.cp1y, cmd.cp2x, cmd.cp2y, cmd.x, cmd.y);
          break;
        case 'arcTo':
          this.context.arcTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.radius);
          break;
        case 'closePath':
          this.context.closePath();
          break;
      }
    }

    if (this.options.fill) {
      this.context.fillStyle = this.options.fillColor ?? this.options.color ?? '#000';
      this.context.fill();
    }

    const oldStroke = this.context.strokeStyle;
    const oldWidth = this.context.lineWidth;
    if (this.options.color) this.context.strokeStyle = this.options.color;
    if (this.options.stroke) this.context.lineWidth = this.options.stroke;
    this.context.stroke();
    this.context.strokeStyle = oldStroke;
    this.context.lineWidth = oldWidth;

    return this;
  }
}
