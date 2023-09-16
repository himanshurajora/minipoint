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

engine.update = () => {
  if (input.mouse.click) {
    const p1 = new Point({
      x: input.mouse.position.x,
      y: input.mouse.position.y,
      radius: 6,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`,
    });

    renderer.addObject(p1);
  }
};
