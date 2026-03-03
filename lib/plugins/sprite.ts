import {
  BaseObject,
  DefaultDrawableObjectOptions,
  DrawableObjectOptions,
} from '../render';
import { Renderer } from '../render/renderer';

export type SpriteOptions = DrawableObjectOptions<{
  x: number;
  y: number;
  width: number;
  height: number;
  /** Image source URL or HTMLImageElement */
  image: string | HTMLImageElement;
  /** Source rectangle for sprite sheets (optional) */
  sourceX?: number;
  sourceY?: number;
  sourceWidth?: number;
  sourceHeight?: number;
}>;

/**
 * A sprite/image rendering object
 */
export class Sprite extends BaseObject<SpriteOptions, Sprite> {
  private _image: HTMLImageElement;
  private _loaded: boolean = false;

  constructor(options: SpriteOptions, renderer?: Renderer) {
    super({ ...DefaultDrawableObjectOptions, ...options }, renderer);

    if (typeof options.image === 'string') {
      this._image = new Image();
      this._image.onload = () => {
        this._loaded = true;
      };
      this._image.src = options.image;
    } else {
      this._image = options.image;
      this._loaded = this._image.complete;
      if (!this._loaded) {
        this._image.onload = () => {
          this._loaded = true;
        };
      }
    }
  }

  /** Check if the image has loaded */
  isLoaded(): boolean {
    return this._loaded;
  }

  /** Get the underlying HTMLImageElement */
  getImage(): HTMLImageElement {
    return this._image;
  }

  override getCenter(): { x: number; y: number } {
    return {
      x: this.options.x + this.options.width / 2,
      y: this.options.y + this.options.height / 2,
    };
  }

  override containsPoint(px: number, py: number): boolean {
    return (
      px >= this.options.x &&
      px <= this.options.x + this.options.width &&
      py >= this.options.y &&
      py <= this.options.y + this.options.height
    );
  }

  override draw() {
    if (!this._loaded) return this;

    if (
      this.options.sourceX !== undefined &&
      this.options.sourceY !== undefined &&
      this.options.sourceWidth !== undefined &&
      this.options.sourceHeight !== undefined
    ) {
      // Draw from sprite sheet
      this.context.drawImage(
        this._image,
        this.options.sourceX,
        this.options.sourceY,
        this.options.sourceWidth,
        this.options.sourceHeight,
        this.options.x,
        this.options.y,
        this.options.width,
        this.options.height,
      );
    } else {
      this.context.drawImage(
        this._image,
        this.options.x,
        this.options.y,
        this.options.width,
        this.options.height,
      );
    }

    return this;
  }
}
