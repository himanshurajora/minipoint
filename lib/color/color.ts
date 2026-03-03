/**
 * Color utility class for creating and manipulating colors.
 */
export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.r = Math.max(0, Math.min(255, r));
    this.g = Math.max(0, Math.min(255, g));
    this.b = Math.max(0, Math.min(255, b));
    this.a = Math.max(0, Math.min(1, a));
  }

  // ─── Static Factory Methods ───────────────────────────────

  /** Create from hex string (#RGB, #RGBA, #RRGGBB, #RRGGBBAA) */
  static fromHex(hex: string): Color {
    hex = hex.replace('#', '');
    let r = 0, g = 0, b = 0, a = 1;

    if (hex.length === 3 || hex.length === 4) {
      r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
      g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
      b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
      if (hex.length === 4) {
        a = parseInt(hex.charAt(3) + hex.charAt(3), 16) / 255;
      }
    } else if (hex.length === 6 || hex.length === 8) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
      if (hex.length === 8) {
        a = parseInt(hex.substring(6, 8), 16) / 255;
      }
    }

    return new Color(r, g, b, a);
  }

  /** Create from HSL values (h: 0-360, s: 0-100, l: 0-100) */
  static fromHSL(h: number, s: number, l: number, a: number = 1): Color {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return new Color(
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      a,
    );
  }

  /** Create from HSV values (h: 0-360, s: 0-100, v: 0-100) */
  static fromHSV(h: number, s: number, v: number, a: number = 1): Color {
    h = h / 360;
    s = s / 100;
    v = v / 100;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r: number, g: number, b: number;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      default: r = 0; g = 0; b = 0;
    }

    return new Color(
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255),
      a,
    );
  }

  /** Parse a CSS color string (hex, rgb, rgba, hsl, hsla) */
  static parse(str: string): Color {
    str = str.trim();

    if (str.startsWith('#')) {
      return Color.fromHex(str);
    }

    const rgbaMatch = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
    if (rgbaMatch) {
      return new Color(
        parseInt(rgbaMatch[1] ?? '0'),
        parseInt(rgbaMatch[2] ?? '0'),
        parseInt(rgbaMatch[3] ?? '0'),
        rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
      );
    }

    const hslaMatch = str.match(/hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)/);
    if (hslaMatch) {
      return Color.fromHSL(
        parseFloat(hslaMatch[1] ?? '0'),
        parseFloat(hslaMatch[2] ?? '0'),
        parseFloat(hslaMatch[3] ?? '0'),
        hslaMatch[4] !== undefined ? parseFloat(hslaMatch[4]) : 1,
      );
    }

    return new Color(0, 0, 0, 1);
  }

  /** Generate a random color */
  static random(alpha: number = 1): Color {
    return new Color(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      alpha,
    );
  }

  /** Linearly interpolate between two colors */
  static lerp(a: Color, b: Color, t: number): Color {
    return new Color(
      Math.round(a.r + (b.r - a.r) * t),
      Math.round(a.g + (b.g - a.g) * t),
      Math.round(a.b + (b.b - a.b) * t),
      a.a + (b.a - a.a) * t,
    );
  }

  // ─── Preset Colors ───────────────────────────────────────

  static get white(): Color { return new Color(255, 255, 255); }
  static get black(): Color { return new Color(0, 0, 0); }
  static get red(): Color { return new Color(255, 0, 0); }
  static get green(): Color { return new Color(0, 255, 0); }
  static get blue(): Color { return new Color(0, 0, 255); }
  static get yellow(): Color { return new Color(255, 255, 0); }
  static get cyan(): Color { return new Color(0, 255, 255); }
  static get magenta(): Color { return new Color(255, 0, 255); }
  static get transparent(): Color { return new Color(0, 0, 0, 0); }
  static get gray(): Color { return new Color(128, 128, 128); }
  static get orange(): Color { return new Color(255, 165, 0); }
  static get purple(): Color { return new Color(128, 0, 128); }

  // ─── Instance Methods ─────────────────────────────────────

  /** Clone this color */
  clone(): Color {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /** Set alpha and return this */
  setAlpha(a: number): this {
    this.a = Math.max(0, Math.min(1, a));
    return this;
  }

  /** Lighten the color by a percentage (0-100) */
  lighten(percent: number): Color {
    const hsl = this.toHSL();
    hsl.l = Math.min(100, hsl.l + percent);
    return Color.fromHSL(hsl.h, hsl.s, hsl.l, this.a);
  }

  /** Darken the color by a percentage (0-100) */
  darken(percent: number): Color {
    const hsl = this.toHSL();
    hsl.l = Math.max(0, hsl.l - percent);
    return Color.fromHSL(hsl.h, hsl.s, hsl.l, this.a);
  }

  /** Get the complementary color */
  complementary(): Color {
    return new Color(255 - this.r, 255 - this.g, 255 - this.b, this.a);
  }

  /** Mix with another color */
  mix(other: Color, amount: number = 0.5): Color {
    return Color.lerp(this, other, amount);
  }

  /** Get luminance (0-1) */
  luminance(): number {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const lr = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const lg = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const lb = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  }

  /** Check if the color is dark (luminance < 0.5) */
  isDark(): boolean {
    return this.luminance() < 0.5;
  }

  /** Check if the color is light (luminance >= 0.5) */
  isLight(): boolean {
    return this.luminance() >= 0.5;
  }

  // ─── Conversion Methods ─────────────────────────────────

  /** Convert to CSS rgba() string */
  toRGBA(): string {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  /** Convert to CSS rgb() string */
  toRGB(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  /** Convert to hex string (#RRGGBB or #RRGGBBAA) */
  toHex(includeAlpha: boolean = false): string {
    const r = this.r.toString(16).padStart(2, '0');
    const g = this.g.toString(16).padStart(2, '0');
    const b = this.b.toString(16).padStart(2, '0');
    if (includeAlpha) {
      const a = Math.round(this.a * 255).toString(16).padStart(2, '0');
      return `#${r}${g}${b}${a}`;
    }
    return `#${r}${g}${b}`;
  }

  /** Convert to HSL object { h: 0-360, s: 0-100, l: 0-100 } */
  toHSL(): { h: number; s: number; l: number } {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h: number, s: number;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: h = 0;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /** Convert to CSS string (for use as a fill/stroke style) */
  toString(): string {
    return this.a < 1 ? this.toRGBA() : this.toHex();
  }
}
