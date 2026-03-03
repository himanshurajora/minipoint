/**
 * A 2D Vector class representing a point or direction in 2D space.
 * Provides both mutating methods (that modify this vector) and
 * static methods (that return new vectors).
 */
export class Vector {
  x: number;
  y: number;

  /**
   * @param {number} x @default 0
   * @param {number} y @default 0
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // ─── Static Factory Methods ───────────────────────────────

  /** Create a zero vector (0, 0) */
  static zero(): Vector {
    return new Vector(0, 0);
  }

  /** Create a unit vector (1, 1) */
  static one(): Vector {
    return new Vector(1, 1);
  }

  /** Create a vector pointing up (0, -1) */
  static up(): Vector {
    return new Vector(0, -1);
  }

  /** Create a vector pointing down (0, 1) */
  static down(): Vector {
    return new Vector(0, 1);
  }

  /** Create a vector pointing left (-1, 0) */
  static left(): Vector {
    return new Vector(-1, 0);
  }

  /** Create a vector pointing right (1, 0) */
  static right(): Vector {
    return new Vector(1, 0);
  }

  /** Create a vector from an angle (in radians) and optional magnitude */
  static fromAngle(angle: number, magnitude: number = 1): Vector {
    return new Vector(
      Math.cos(angle) * magnitude,
      Math.sin(angle) * magnitude,
    );
  }

  /** Create a random vector with x and y in [0, 1) */
  static random(): Vector {
    return new Vector(Math.random(), Math.random());
  }

  /** Create a vector from an array [x, y] */
  static fromArray(arr: [number, number]): Vector {
    return new Vector(arr[0], arr[1]);
  }

  /** Create a vector from a plain object { x, y } */
  static from(obj: { x: number; y: number }): Vector {
    return new Vector(obj.x, obj.y);
  }

  /** Linear interpolation between two vectors */
  static lerp(a: Vector, b: Vector, t: number): Vector {
    return new Vector(
      a.x + (b.x - a.x) * t,
      a.y + (b.y - a.y) * t,
    );
  }

  /** Get the distance between two vectors */
  static distance(a: Vector, b: Vector): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /** Get the squared distance between two vectors (avoids sqrt) */
  static distanceSquared(a: Vector, b: Vector): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  /** Get the angle between two vectors in radians */
  static angleBetween(a: Vector, b: Vector): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
  }

  /** Dot product of two vectors */
  static dot(a: Vector, b: Vector): number {
    return a.x * b.x + a.y * b.y;
  }

  /** Cross product of two vectors (scalar result in 2D) */
  static cross(a: Vector, b: Vector): number {
    return a.x * b.y - a.y * b.x;
  }

  /** Add two vectors and return a new vector */
  static add(a: Vector, b: Vector): Vector {
    return new Vector(a.x + b.x, a.y + b.y);
  }

  /** Subtract b from a and return a new vector */
  static subtract(a: Vector, b: Vector): Vector {
    return new Vector(a.x - b.x, a.y - b.y);
  }

  /** Multiply two vectors component-wise and return a new vector */
  static multiply(a: Vector, b: Vector): Vector {
    return new Vector(a.x * b.x, a.y * b.y);
  }

  /** Divide a by b component-wise and return a new vector */
  static divide(a: Vector, b: Vector): Vector {
    return new Vector(a.x / b.x, a.y / b.y);
  }

  /** Check if two vectors are equal */
  static equals(a: Vector, b: Vector, epsilon: number = 0.0001): boolean {
    return Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon;
  }

  /** Get the min of two vectors component-wise */
  static min(a: Vector, b: Vector): Vector {
    return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y));
  }

  /** Get the max of two vectors component-wise */
  static max(a: Vector, b: Vector): Vector {
    return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y));
  }

  /** Clamp a vector between min and max vectors */
  static clamp(v: Vector, min: Vector, max: Vector): Vector {
    return new Vector(
      Math.max(min.x, Math.min(max.x, v.x)),
      Math.max(min.y, Math.min(max.y, v.y)),
    );
  }

  // ─── Instance Methods (Mutating) ─────────────────────────

  /** Set the x and y components */
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /** Copy values from another vector */
  copy(v: Vector): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  /** Create a clone of this vector */
  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  /** Add one or more vectors to this vector (mutates) */
  add(...vectors: Vector[]): this {
    for (const vector of vectors) {
      this.x += vector.x;
      this.y += vector.y;
    }
    return this;
  }

  /** Subtract one or more vectors from this vector (mutates) */
  subtract(...vectors: Vector[]): this {
    for (const vector of vectors) {
      this.x -= vector.x;
      this.y -= vector.y;
    }
    return this;
  }

  /** Multiply this vector component-wise by another vector (mutates) */
  multiply(v: Vector): this {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }

  /** Divide this vector component-wise by another vector (mutates) */
  divide(v: Vector): this {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }

  /** Scale this vector by a scalar (mutates) */
  scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /** Negate this vector (mutates) */
  negate(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /** Normalize this vector to unit length (mutates) */
  normalize(): this {
    const len = this.magnitude();
    if (len > 0) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }

  /** Limit the magnitude of this vector (mutates) */
  limit(max: number): this {
    if (this.magnitudeSquared() > max * max) {
      this.normalize().scale(max);
    }
    return this;
  }

  /** Set the magnitude of this vector (mutates) */
  setMagnitude(mag: number): this {
    return this.normalize().scale(mag);
  }

  /** Rotate this vector by an angle in radians (mutates) */
  rotate(angle: number): this {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const nx = this.x * cos - this.y * sin;
    const ny = this.x * sin + this.y * cos;
    this.x = nx;
    this.y = ny;
    return this;
  }

  /** Linearly interpolate towards another vector (mutates) */
  lerp(target: Vector, t: number): this {
    this.x += (target.x - this.x) * t;
    this.y += (target.y - this.y) * t;
    return this;
  }

  /** Floor the components (mutates) */
  floor(): this {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  /** Ceil the components (mutates) */
  ceil(): this {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  /** Round the components (mutates) */
  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  // ─── Instance Methods (Non-Mutating / Getters) ───────────

  /** Get the magnitude (length) of this vector */
  magnitude(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /** Alias for magnitude */
  length(): number {
    return this.magnitude();
  }

  /** Get the squared magnitude (avoids sqrt, useful for comparisons) */
  magnitudeSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /** Alias for magnitudeSquared */
  lengthSquared(): number {
    return this.magnitudeSquared();
  }

  /** Dot product with another vector */
  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y;
  }

  /** Cross product with another vector (scalar result in 2D) */
  cross(v: Vector): number {
    return this.x * v.y - this.y * v.x;
  }

  /** Get the distance to another vector */
  distanceTo(v: Vector): number {
    return Vector.distance(this, v);
  }

  /** Get the squared distance to another vector */
  distanceSquaredTo(v: Vector): number {
    return Vector.distanceSquared(this, v);
  }

  /** Get the angle of this vector in radians */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /** Get the angle from this vector to another in radians */
  angleTo(v: Vector): number {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }

  /** Check equality with another vector */
  equals(v: Vector, epsilon: number = 0.0001): boolean {
    return Vector.equals(this, v, epsilon);
  }

  /** Check if this is a zero vector */
  isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  /** Get the perpendicular vector (rotated 90 degrees) */
  perpendicular(): Vector {
    return new Vector(-this.y, this.x);
  }

  /** Return a normalized copy without mutating */
  normalized(): Vector {
    return this.clone().normalize();
  }

  /** Convert to array [x, y] */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /** Convert to plain object { x, y } */
  toObject(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  /** String representation */
  toString(): string {
    return `Vector(${this.x}, ${this.y})`;
  }
}
