import { Vector } from '../physics/vector';

/**
 * A 2D camera/viewport for panning and zooming
 */
export class Camera {
  /** Camera position (center of view) */
  position: Vector;
  /** Zoom level (1 = normal, >1 = zoomed in, <1 = zoomed out) */
  zoom: number;
  /** Rotation of the camera in radians */
  rotation: number;

  constructor(x: number = 0, y: number = 0, zoom: number = 1) {
    this.position = new Vector(x, y);
    this.zoom = zoom;
    this.rotation = 0;
  }

  /**
   * Move the camera by a delta vector
   */
  move(dx: number, dy: number): this {
    this.position.x += dx;
    this.position.y += dy;
    return this;
  }

  /**
   * Set the camera position
   */
  lookAt(x: number, y: number): this {
    this.position.set(x, y);
    return this;
  }

  /**
   * Set the zoom level
   */
  setZoom(zoom: number): this {
    this.zoom = Math.max(0.01, zoom);
    return this;
  }

  /**
   * Zoom in/out by a factor
   */
  zoomBy(factor: number): this {
    this.zoom = Math.max(0.01, this.zoom * factor);
    return this;
  }

  /**
   * Convert a screen coordinate to world coordinate
   */
  screenToWorld(screenX: number, screenY: number, canvasWidth: number, canvasHeight: number): Vector {
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    // Reverse the camera transform
    const x = (screenX - cx) / this.zoom + this.position.x;
    const y = (screenY - cy) / this.zoom + this.position.y;
    return new Vector(x, y);
  }

  /**
   * Convert a world coordinate to screen coordinate
   */
  worldToScreen(worldX: number, worldY: number, canvasWidth: number, canvasHeight: number): Vector {
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    const x = (worldX - this.position.x) * this.zoom + cx;
    const y = (worldY - this.position.y) * this.zoom + cy;
    return new Vector(x, y);
  }

  /**
   * Apply the camera transform to a canvas context.
   * Call this before rendering objects.
   */
  applyTransform(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number): void {
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.scale(this.zoom, this.zoom);
    if (this.rotation) {
      ctx.rotate(-this.rotation);
    }
    ctx.translate(-this.position.x, -this.position.y);
  }

  /**
   * Restore the context after camera transform.
   * Call this after rendering objects.
   */
  restoreTransform(ctx: CanvasRenderingContext2D): void {
    ctx.restore();
  }

  /**
   * Smoothly follow a target position
   */
  follow(targetX: number, targetY: number, lerpFactor: number = 0.1): this {
    this.position.x += (targetX - this.position.x) * lerpFactor;
    this.position.y += (targetY - this.position.y) * lerpFactor;
    return this;
  }
}
