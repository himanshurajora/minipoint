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
  while (renderer.objects.length > maxAmount) {
    renderer.objects.shift();
  }

  const p1 = new Point();
  p1.options.x = e.clientX - canvasX;
  p1.options.y = e.clientY - canvasY;
  p1.options.radius = 1;

  renderer.addObject(p1);
});

console.log(renderer.objects);
