/**
 * Easing functions for animations.
 * Each function takes a value t in [0, 1] and returns [0, 1].
 */
export const Easing = {
  /** Linear (no easing) */
  linear: (t: number): number => t,

  /** Quadratic ease in */
  easeInQuad: (t: number): number => t * t,

  /** Quadratic ease out */
  easeOutQuad: (t: number): number => t * (2 - t),

  /** Quadratic ease in/out */
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  /** Cubic ease in */
  easeInCubic: (t: number): number => t * t * t,

  /** Cubic ease out */
  easeOutCubic: (t: number): number => (--t) * t * t + 1,

  /** Cubic ease in/out */
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  /** Quartic ease in */
  easeInQuart: (t: number): number => t * t * t * t,

  /** Quartic ease out */
  easeOutQuart: (t: number): number => 1 - (--t) * t * t * t,

  /** Quartic ease in/out */
  easeInOutQuart: (t: number): number =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,

  /** Sine ease in */
  easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),

  /** Sine ease out */
  easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),

  /** Sine ease in/out */
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,

  /** Exponential ease in */
  easeInExpo: (t: number): number =>
    t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),

  /** Exponential ease out */
  easeOutExpo: (t: number): number =>
    t === 1 ? 1 : 1 - Math.pow(2, -10 * t),

  /** Exponential ease in/out */
  easeInOutExpo: (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  /** Elastic ease in */
  easeInElastic: (t: number): number => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
  },

  /** Elastic ease out */
  easeOutElastic: (t: number): number => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
  },

  /** Elastic ease in/out */
  easeInOutElastic: (t: number): number => {
    if (t === 0 || t === 1) return t;
    t *= 2;
    if (t < 1) {
      return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    }
    return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
  },

  /** Bounce ease out */
  easeOutBounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      t -= 1.5 / 2.75;
      return 7.5625 * t * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      t -= 2.25 / 2.75;
      return 7.5625 * t * t + 0.9375;
    } else {
      t -= 2.625 / 2.75;
      return 7.5625 * t * t + 0.984375;
    }
  },

  /** Bounce ease in */
  easeInBounce: (t: number): number => 1 - Easing.easeOutBounce(1 - t),

  /** Bounce ease in/out */
  easeInOutBounce: (t: number): number =>
    t < 0.5
      ? (1 - Easing.easeOutBounce(1 - 2 * t)) / 2
      : (1 + Easing.easeOutBounce(2 * t - 1)) / 2,

  /** Back ease in */
  easeInBack: (t: number): number => {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },

  /** Back ease out */
  easeOutBack: (t: number): number => {
    const s = 1.70158;
    t -= 1;
    return t * t * ((s + 1) * t + s) + 1;
  },

  /** Back ease in/out */
  easeInOutBack: (t: number): number => {
    const s = 1.70158 * 1.525;
    t *= 2;
    if (t < 1) return 0.5 * (t * t * ((s + 1) * t - s));
    t -= 2;
    return 0.5 * (t * t * ((s + 1) * t + s) + 2);
  },
} as const;

export type EasingFunction = (t: number) => number;
