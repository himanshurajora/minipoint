import { Vector } from '../physics/vector';

/**
 * Axis-Aligned Bounding Box for collision detection
 */
export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Circle bounds for collision detection
 */
export interface CircleBounds {
  x: number;
  y: number;
  radius: number;
}

/**
 * Collision detection utilities
 */
export class Collision {
  /**
   * Check if a point is inside an AABB
   */
  static pointInRect(px: number, py: number, rect: AABB): boolean {
    return (
      px >= rect.x &&
      px <= rect.x + rect.width &&
      py >= rect.y &&
      py <= rect.y + rect.height
    );
  }

  /**
   * Check if a point is inside a circle
   */
  static pointInCircle(px: number, py: number, circle: CircleBounds): boolean {
    const dx = px - circle.x;
    const dy = py - circle.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  /**
   * Check if two AABBs overlap
   */
  static rectRect(a: AABB, b: AABB): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  /**
   * Check if two circles overlap
   */
  static circleCircle(a: CircleBounds, b: CircleBounds): boolean {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distSq = dx * dx + dy * dy;
    const radSum = a.radius + b.radius;
    return distSq <= radSum * radSum;
  }

  /**
   * Check if a circle and a rectangle overlap
   */
  static circleRect(circle: CircleBounds, rect: AABB): boolean {
    // Find the closest point on the rect to the circle center
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  /**
   * Check if a point is inside a polygon (array of vertices).
   * Uses the ray-casting algorithm.
   */
  static pointInPolygon(px: number, py: number, vertices: Vector[]): boolean {
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const vi = vertices[i]!;
      const vj = vertices[j]!;
      const xi = vi.x, yi = vi.y;
      const xj = vj.x, yj = vj.y;
      if (
        ((yi > py) !== (yj > py)) &&
        (px < (xj - xi) * (py - yi) / (yj - yi) + xi)
      ) {
        inside = !inside;
      }
    }
    return inside;
  }

  /**
   * Check if a line segment intersects another line segment.
   * Returns the intersection point or null.
   */
  static lineLineIntersection(
    p1: Vector,
    p2: Vector,
    p3: Vector,
    p4: Vector,
  ): Vector | null {
    const d1x = p2.x - p1.x;
    const d1y = p2.y - p1.y;
    const d2x = p4.x - p3.x;
    const d2y = p4.y - p3.y;

    const denom = d1x * d2y - d1y * d2x;
    if (Math.abs(denom) < 1e-10) return null; // Parallel

    const t = ((p3.x - p1.x) * d2y - (p3.y - p1.y) * d2x) / denom;
    const u = ((p3.x - p1.x) * d1y - (p3.y - p1.y) * d1x) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return new Vector(p1.x + t * d1x, p1.y + t * d1y);
    }

    return null;
  }

  /**
   * Check if a line segment intersects a circle.
   */
  static lineCircle(p1: Vector, p2: Vector, circle: CircleBounds): boolean {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const fx = p1.x - circle.x;
    const fy = p1.y - circle.y;

    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - circle.radius * circle.radius;

    let discriminant = b * b - 4 * a * c;
    if (discriminant < 0) return false;

    discriminant = Math.sqrt(discriminant);
    const t1 = (-b - discriminant) / (2 * a);
    const t2 = (-b + discriminant) / (2 * a);

    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
  }

  /**
   * Get the overlap/penetration vector between two AABBs.
   * Returns null if they don't overlap.
   */
  static rectRectOverlap(a: AABB, b: AABB): Vector | null {
    const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

    if (overlapX <= 0 || overlapY <= 0) return null;

    // Return minimum translation vector
    if (overlapX < overlapY) {
      const sign = (a.x + a.width / 2) < (b.x + b.width / 2) ? -1 : 1;
      return new Vector(overlapX * sign, 0);
    } else {
      const sign = (a.y + a.height / 2) < (b.y + b.height / 2) ? -1 : 1;
      return new Vector(0, overlapY * sign);
    }
  }

  /**
   * Get the overlap/penetration vector between two circles.
   * Returns null if they don't overlap.
   */
  static circleCircleOverlap(a: CircleBounds, b: CircleBounds): Vector | null {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minDist = a.radius + b.radius;

    if (dist >= minDist) return null;

    const overlap = minDist - dist;
    if (dist === 0) {
      return new Vector(overlap, 0);
    }
    return new Vector((dx / dist) * overlap, (dy / dist) * overlap);
  }

  /**
   * Simple Separating Axis Theorem (SAT) test for convex polygons.
   * Vertices should be in order (CW or CCW).
   */
  static satTest(verticesA: Vector[], verticesB: Vector[]): boolean {
    const polygons = [verticesA, verticesB];

    for (const polygon of polygons) {
      for (let i = 0; i < polygon.length; i++) {
        const j = (i + 1) % polygon.length;
        const pi = polygon[i]!;
        const pj = polygon[j]!;
        const edge = new Vector(
          pj.x - pi.x,
          pj.y - pi.y,
        );
        // Normal axis
        const axis = new Vector(-edge.y, edge.x);

        let minA = Infinity, maxA = -Infinity;
        for (const v of verticesA) {
          const proj = axis.x * v.x + axis.y * v.y;
          minA = Math.min(minA, proj);
          maxA = Math.max(maxA, proj);
        }

        let minB = Infinity, maxB = -Infinity;
        for (const v of verticesB) {
          const proj = axis.x * v.x + axis.y * v.y;
          minB = Math.min(minB, proj);
          maxB = Math.max(maxB, proj);
        }

        if (maxA < minB || maxB < minA) {
          return false; // Separating axis found
        }
      }
    }

    return true; // No separating axis found, they overlap
  }
}
