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

document.getElementById('checkbox')?.addEventListener('change', (e) => {
  engine.options.engineOptions!.clearEachFrame = (e.target as any).checked;
});

engine.update = () => {
  if (input.keyboard.currentUpKey?.toLowerCase() === 'j') {
    const p1 = new Point({
      x: input.mouse.position.x,
      y: input.mouse.position.y,
      radius: 6,
      color: `rgb(${random() * 255}, ${random() * 255}, ${random() * 255})`,
    });

    p1.update = () => {
      p1.options.x += random() > 0.5 ? random() * 2 : -random() * 2;
      p1.options.y += random() > 0.5 ? random() * 2 : -random() * 2;
    };

    renderer.addObject(p1);
  }
};
