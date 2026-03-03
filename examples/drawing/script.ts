import { Engine, createCanvas, Point } from '../../lib';

const { canvas } = createCanvas();
const engine = new Engine(canvas);
const renderer = engine.renderer;

const canvasX = engine.canvas.getBoundingClientRect().x;
const canvasY = engine.canvas.getBoundingClientRect().y;
let maxAmount = 100;

document.getElementById('max')?.addEventListener('change', (e) => {
  maxAmount = +(e.target as HTMLInputElement).value;
});

window.addEventListener('mousemove', (e: MouseEvent) => {
  if (!e.shiftKey) return;

  // Remove excess objects when over max
  const objectKeys = Object.keys(renderer.objects);
  while (objectKeys.length > maxAmount) {
    const oldestKey = objectKeys.shift();
    if (oldestKey) {
      const obj = renderer.objects[oldestKey];
      if (obj) renderer.removeObject(obj);
    }
  }

  const p1 = new Point({
    x: e.clientX - canvasX,
    y: e.clientY - canvasY,
    radius: 1,
    addToRenderer: true,
  });

  renderer.addObject(p1);
});

console.log(renderer.objects);
