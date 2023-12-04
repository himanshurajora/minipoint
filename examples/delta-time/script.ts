import { Engine } from '../../lib';

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

const random = () => {
  return Math.random();
};

const speed = 1;

document.getElementById('checkbox')?.addEventListener('change', (e) => {
  engine.options.engineOptions!.clearEachFrame = (e.target as any).checked;
});

var lastTime = Date.now();

engine.update = (engine, deltaTime) => {
  var currentTime = Date.now();
  if (currentTime - lastTime > 50) {
    const point = renderer.point({
      show: true,
      x: Math.random() * engine.width,
      y: Math.random() * engine.height,
      color: `rgb(${random() * 255}, ${random() * 255}, ${random() * 255})`,
      radius: random() * 10,
    });
    setTimeout(() => {
      renderer.removeObject(point);
    }, 200);
    lastTime = Date.now();
  }
};
