import { Vector } from '../physics/vector';
import { Engine } from '../render';

export class Input {
  mouse: MouseInput;
  keyboard: KeyBoardInput;

  constructor(engine: Engine) {
    this.mouse = new MouseInput(engine);
    this.keyboard = new KeyBoardInput(engine);
  }
}

export class MouseInput {
  down?: boolean;
  up?: boolean;
  move?: boolean;
  click?: boolean;
  position: Vector = new Vector(0, 0);

  constructor(engine: Engine) {
    window.addEventListener('mousedown', (e) => {
      this.up = false;
      this.down = true;
      this.position = this.getMousePositionOnCanvas(
        new Vector(e.clientX, e.clientY),
        engine,
      );
    });

    window.addEventListener('mouseup', (e) => {
      this.up = true;
      this.down = false;
      this.position = this.getMousePositionOnCanvas(
        new Vector(e.clientX, e.clientY),
        engine,
      );
    });

    window.addEventListener('mousemove', (e) => {
      this.move = true;
      this.position = this.getMousePositionOnCanvas(
        new Vector(e.clientX, e.clientY),
        engine,
      );
    });

    window.addEventListener('click', (e) => {
      this.position = this.getMousePositionOnCanvas(
        new Vector(e.clientX, e.clientY),
        engine,
      );
      this.click = true;
      console.log(window.scrollX, window.scrollY);
    });
  }

  /**
   * The position on DOM and position on canvas may differ because of canvas's position
   * on DOM and scrolled browser view. So we are basically getting the exact position of
   * the clicked point on the canvas and not the DOM. I hope you got it 😄
   * @param {Vector} mousePointOnScreen Position detected by DOM
   * @param {Engine} engine The Engine
   * @returns {Vector} Final Position on Canvas
   */
  getMousePositionOnCanvas(mousePointOnScreen: Vector, engine: Engine): Vector {
    return mousePointOnScreen.subtract(
      engine.position,
      new Vector(window.scrollX, -window.scrollY),
    );
  }
}

export class KeyBoardInput {
  constructor(_engine: Engine) {}
}
