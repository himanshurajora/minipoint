import { Engine, createCanvas, Point } from '../../lib';

const { canvas } = createCanvas();
const engine = new Engine(canvas);
const renderer = engine.renderer;

for (let i = 0; i < 100; i++) {
  renderer.addObject(
    new Point({ x: Math.random() * 400, y: Math.random() * 400 }),
  );
}
