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

const random = () => {
  return Math.random();
};

const speed = 1;

document.getElementById('checkbox')?.addEventListener('change', (e) => {
  engine.options.engineOptions!.clearEachFrame = (e.target as any).checked;
});

engine.update = (engine, deltaTime) => {
  const point = renderer.point({
    show: true,
    x: Math.random() * engine.width,
    y: Math.random() * engine.height,
    color: `rgb(${random() * 255}, ${random() * 255}, ${random() * 255})`,
    radius: random() * 10,
  });

  point.update = (_) => {
    point.options.x += speed * deltaTime;
    point.options.x += speed * deltaTime;
  };
};
