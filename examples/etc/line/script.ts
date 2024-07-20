import { Engine, Point, Line } from '../../../lib';

const engine = new Engine(
  document.getElementById('canvas') as HTMLCanvasElement,
  {
    engineOptions: {
      width: 600,
      height: 400,
    },
  },
);

const { renderer } = engine;

const lines: Line[] = [];
let lastTime = 0;
engine.update = () => {
  const currentTime = performance.now();
  // draw a line each second
  if (currentTime - lastTime > 1000) {
    const line = new Line({
      x1: Math.random() * 600,
      y1: Math.random() * 400,
      x2: Math.random() * 600,
      y2: Math.random() * 400,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`,
      stroke: Math.random() * 10,
    });

    lines.push(line);
    renderer.addObject(line);
    lastTime = currentTime;
  }
};
