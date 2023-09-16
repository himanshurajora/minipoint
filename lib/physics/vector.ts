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

  subtract(...vectors: Vector[]) {
    for (let vector of vectors) {
      this.x -= vector.x;
      this.y -= vector.y;
    }

    return this;
  }
}
