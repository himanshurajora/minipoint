import { EasingFunction, Easing } from './easing';

export type TweenOptions<T> = {
  /** The target object to animate */
  target: T;
  /** Properties to animate: key → target value */
  to: Partial<Record<keyof T, number>>;
  /** Duration in seconds */
  duration: number;
  /** Easing function @default Easing.linear */
  easing?: EasingFunction;
  /** Delay before starting in seconds @default 0 */
  delay?: number;
  /** Number of times to repeat (-1 = infinite) @default 0 */
  repeat?: number;
  /** Whether to reverse (yoyo) on repeat @default false */
  yoyo?: boolean;
  /** Called each frame with the target */
  onUpdate?: (target: T) => void;
  /** Called when the tween completes */
  onComplete?: (target: T) => void;
  /** Called when the tween starts */
  onStart?: (target: T) => void;
};

/**
 * A Tween that animates numeric properties on a target object over time.
 */
export class Tween<T> {
  private _target: T;
  private _from: Record<string, number> = {};
  private _to: Record<string, number> = {};
  private _duration: number;
  private _easing: EasingFunction;
  private _delay: number;
  private _repeat: number;
  private _yoyo: boolean;
  private _elapsed: number = 0;
  private _delayElapsed: number = 0;
  private _repeatCount: number = 0;
  private _started: boolean = false;
  private _completed: boolean = false;
  private _reversed: boolean = false;
  private _paused: boolean = false;

  private _onUpdate: ((target: T) => void) | undefined;
  private _onComplete: ((target: T) => void) | undefined;
  private _onStart: ((target: T) => void) | undefined;

  constructor(options: TweenOptions<T>) {
    this._target = options.target;
    this._duration = options.duration;
    this._easing = options.easing ?? Easing.linear;
    this._delay = options.delay ?? 0;
    this._repeat = options.repeat ?? 0;
    this._yoyo = options.yoyo ?? false;
    this._onUpdate = options.onUpdate ?? undefined;
    this._onComplete = options.onComplete ?? undefined;
    this._onStart = options.onStart ?? undefined;

    // Store target values
    for (const key in options.to) {
      this._to[key as string] = options.to[key] as number;
    }
  }

  /** Whether this tween has finished */
  get isComplete(): boolean {
    return this._completed;
  }

  /** Whether this tween is currently paused */
  get isPaused(): boolean {
    return this._paused;
  }

  /** Pause the tween */
  pause(): this {
    this._paused = true;
    return this;
  }

  /** Resume the tween */
  resume(): this {
    this._paused = false;
    return this;
  }

  /** Stop and reset the tween */
  stop(): this {
    this._completed = true;
    return this;
  }

  /**
   * Update the tween. Call this each frame with deltaTime in seconds.
   */
  update(deltaTime: number): boolean {
    if (this._completed || this._paused) return this._completed;

    // Handle delay
    if (this._delayElapsed < this._delay) {
      this._delayElapsed += deltaTime;
      return false;
    }

    // Capture starting values on first update
    if (!this._started) {
      for (const key in this._to) {
        this._from[key] = (this._target as any)[key] as number;
      }
      this._started = true;
      this._onStart?.(this._target);
    }

    this._elapsed += deltaTime;
    let t = Math.min(this._elapsed / this._duration, 1);

    // Apply easing
    const easedT = this._reversed ? this._easing(1 - t) : this._easing(t);

    // Interpolate properties
    for (const key in this._to) {
      const from = (this._reversed ? this._to[key] : this._from[key]) ?? 0;
      const to = (this._reversed ? this._from[key] : this._to[key]) ?? 0;
      (this._target as any)[key] = from + (to - from) * easedT;
    }

    this._onUpdate?.(this._target);

    // Check completion
    if (t >= 1) {
      if (this._repeat === -1 || this._repeatCount < this._repeat) {
        this._repeatCount++;
        this._elapsed = 0;
        if (this._yoyo) {
          this._reversed = !this._reversed;
        }
        return false;
      }

      this._completed = true;
      this._onComplete?.(this._target);
      return true;
    }

    return false;
  }
}

/**
 * Manages a collection of active tweens and updates them each frame.
 */
export class TweenManager {
  private _tweens: Tween<any>[] = [];

  /**
   * Create and register a new tween
   */
  create<T>(options: TweenOptions<T>): Tween<T> {
    const tween = new Tween(options);
    this._tweens.push(tween);
    return tween;
  }

  /**
   * Add an existing tween to the manager
   */
  add<T>(tween: Tween<T>): Tween<T> {
    this._tweens.push(tween);
    return tween;
  }

  /**
   * Update all active tweens. Call each frame with deltaTime in seconds.
   */
  update(deltaTime: number): void {
    for (let i = this._tweens.length - 1; i >= 0; i--) {
      const tween = this._tweens[i];
      if (tween && tween.update(deltaTime)) {
        this._tweens.splice(i, 1);
      }
    }
  }

  /**
   * Get the number of active tweens
   */
  get count(): number {
    return this._tweens.length;
  }

  /**
   * Remove all tweens
   */
  clear(): void {
    this._tweens = [];
  }
}
