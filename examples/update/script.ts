import { Engine, Point } from '../../lib';

const engine = new Engine(
  document.getElementById('canvas') as HTMLCanvasElement,
  {
    engineOptions: {
      width: 600,
      height: 400,
    },
  },
);

const { renderer, input } = engine;

// we will always get the engine as parameter for any use.
engine.update = (_engine) => {
  if (input.mouse.click) {
    const p1 = new Point({
      x: input.mouse.position.x,
      y: input.mouse.position.y,
      radius: 6,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`,
    });

    // this is object specific update method, it could be conditional as well.
    p1.update = () => {
      p1.options.radius = (p1.options.radius ?? 0) + 0.1;
    };

    renderer.addObject(p1);
  }
};
