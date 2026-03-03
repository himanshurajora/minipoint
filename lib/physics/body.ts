import { Vector } from './vector';

/**
 * A physics body with position, velocity, acceleration, and forces.
 * Integrates motion each frame using Euler integration.
 */
export class Body {
  /** Current position */
  position: Vector;
  /** Current velocity */
  velocity: Vector;
  /** Current acceleration */
  acceleration: Vector;
  /** Mass of the body @default 1 */
  mass: number;
  /** Friction coefficient (0 = no friction, 1 = full stop) @default 0 */
  friction: number;
  /** Maximum velocity magnitude @default Infinity */
  maxSpeed: number;
  /** Whether the body is static (doesn't move) @default false */
  isStatic: boolean;

  constructor(
    x: number = 0,
    y: number = 0,
    options?: {
      mass?: number;
      friction?: number;
      maxSpeed?: number;
      isStatic?: boolean;
    },
  ) {
    this.position = new Vector(x, y);
    this.velocity = Vector.zero();
    this.acceleration = Vector.zero();
    this.mass = options?.mass ?? 1;
    this.friction = options?.friction ?? 0;
    this.maxSpeed = options?.maxSpeed ?? Infinity;
    this.isStatic = options?.isStatic ?? false;
  }

  /**
   * Apply a force to the body (F = ma, so a = F/m)
   */
  applyForce(force: Vector): this {
    if (this.isStatic) return this;
    this.acceleration.add(
      new Vector(force.x / this.mass, force.y / this.mass),
    );
    return this;
  }

  /**
   * Apply gravity (a constant downward force)
   * @param g Gravity strength @default 9.8
   */
  applyGravity(g: number = 9.8): this {
    return this.applyForce(new Vector(0, g * this.mass));
  }

  /**
   * Apply an impulse (instantaneous velocity change)
   */
  applyImpulse(impulse: Vector): this {
    if (this.isStatic) return this;
    this.velocity.add(
      new Vector(impulse.x / this.mass, impulse.y / this.mass),
    );
    return this;
  }

  /**
   * Update the body's position based on velocity and acceleration.
   * Call once per frame with deltaTime in seconds.
   */
  update(deltaTime: number): this {
    if (this.isStatic) return this;

    // Apply acceleration to velocity
    this.velocity.add(
      new Vector(
        this.acceleration.x * deltaTime,
        this.acceleration.y * deltaTime,
      ),
    );

    // Apply friction
    if (this.friction > 0) {
      this.velocity.scale(1 - this.friction * deltaTime);
    }

    // Clamp speed
    if (this.maxSpeed < Infinity) {
      this.velocity.limit(this.maxSpeed);
    }

    // Apply velocity to position
    this.position.add(
      new Vector(
        this.velocity.x * deltaTime,
        this.velocity.y * deltaTime,
      ),
    );

    // Reset acceleration (forces must be reapplied each frame)
    this.acceleration.set(0, 0);

    return this;
  }

  /**
   * Get the kinetic energy of the body
   */
  kineticEnergy(): number {
    return 0.5 * this.mass * this.velocity.magnitudeSquared();
  }

  /**
   * Get the momentum of the body
   */
  momentum(): Vector {
    return new Vector(
      this.velocity.x * this.mass,
      this.velocity.y * this.mass,
    );
  }

  /**
   * Stop the body (zero velocity and acceleration)
   */
  stop(): this {
    this.velocity.set(0, 0);
    this.acceleration.set(0, 0);
    return this;
  }
}
