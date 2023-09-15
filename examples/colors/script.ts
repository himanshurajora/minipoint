import { Engine, Point } from '../../lib';

const engine = new Engine(
  document.getElementById('canvas') as HTMLCanvasElement,
);
const renderer = engine.renderer;

const canvasX = engine.canvas.getBoundingClientRect().x;
const canvasY = engine.canvas.getBoundingClientRect().y;
let maxAmount = 100;

document.getElementById('max')?.addEventListener('change', (e) => {
  maxAmount = +(e.target as HTMLInputElement).value;
});

window.addEventListener('click', (e: MouseEvent) => {
  const p1 = new Point();
  p1.options.x = e.clientX - canvasX;
  p1.options.y = e.clientY - canvasY;
  p1.options.radius = 6;
  p1.options.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
    Math.random() * 255
  })`;

  renderer.addObject(p1);
});

console.log(renderer.objects);
