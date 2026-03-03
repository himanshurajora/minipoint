import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type TextOptions = DrawableObjectOptions<{
  x: number;
  y: number;
  text: string;
  color?: string;
  font?: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  fill?: boolean;
  stroke?: number;
  maxWidth?: number;
}>;

/**
 * A text rendering object
 */
export class Text extends BaseObject<TextOptions, Text> {
  constructor(options: TextOptions, renderer?: Renderer) {
    super(
      {
        ...DefaultDrawableObjectOptions,
        fontSize: 16,
        fontFamily: 'sans-serif',
        textAlign: 'left',
        textBaseline: 'top',
        fill: true,
        ...options,
      },
      renderer,
    );
  }

  private _getFont(): string {
    if (this.options.font) return this.options.font;
    return `${this.options.fontSize ?? 16}px ${this.options.fontFamily ?? 'sans-serif'}`;
  }

  override getCenter(): { x: number; y: number } {
    return { x: this.options.x, y: this.options.y };
  }

  override containsPoint(px: number, py: number): boolean {
    this.context.font = this._getFont();
    const metrics = this.context.measureText(this.options.text);
    const width = this.options.maxWidth
      ? Math.min(metrics.width, this.options.maxWidth)
      : metrics.width;
    const height = this.options.fontSize ?? 16;
    return (
      px >= this.options.x &&
      px <= this.options.x + width &&
      py >= this.options.y &&
      py <= this.options.y + height
    );
  }

  /**
   * Measure the text width
   */
  measureWidth(): number {
    this.context.font = this._getFont();
    return this.context.measureText(this.options.text).width;
  }

  override draw() {
    this.context.font = this._getFont();
    if (this.options.textAlign) this.context.textAlign = this.options.textAlign;
    if (this.options.textBaseline) this.context.textBaseline = this.options.textBaseline;

    if (this.options.fill !== false) {
      this.context.fillStyle = this.options.color ?? '#000';
      this.context.fillText(
        this.options.text,
        this.options.x,
        this.options.y,
        this.options.maxWidth,
      );
    }

    if (this.options.stroke) {
      const oldStroke = this.context.strokeStyle;
      const oldWidth = this.context.lineWidth;
      if (this.options.color) this.context.strokeStyle = this.options.color;
      this.context.lineWidth = this.options.stroke;
      this.context.strokeText(
        this.options.text,
        this.options.x,
        this.options.y,
        this.options.maxWidth,
      );
      this.context.strokeStyle = oldStroke;
      this.context.lineWidth = oldWidth;
    }

    return this;
  }
}
