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

const { renderer } = engine;

const random = () => {
  return Math.random();
};


document.getElementById('checkbox')?.addEventListener('change', (e) => {
  engine.options.engineOptions!.clearEachFrame = (e.target as any).checked;
});


let n = 1000;

let points: Point[] = [];
function createPoints() {
  points = [];
  let x = 0;
  for (let i = 0; i < n; i++) {
    const point = new Point({
      x: random() * 30 + x,
      y: random() * engine.height,
      radius: 1,
      color: `rgba(${random() * 255},${random() * 255},${random() * 255},1)`,
    });
    points.push(point);
    renderer.addObject(point);
  }
}

createPoints();


let velocity = 100;

engine.update = (engine, deltaTime) => {
  if (engine.input.keyboard.currentDownKey === "arrowright") {
    velocity += 1;
  }
  if (engine.input.keyboard.currentDownKey === "arrowleft") {
    velocity -= 1;
  }

  if (engine.input.keyboard.currentDownKey === "arrowup") {
    n *= 1.2;
    // remove all points
    points.forEach(point => {
      renderer.removeObject(point);
    });
    velocity = 100;
    console.log({n});
    createPoints();
  }

  if (engine.input.keyboard.currentDownKey === "arrowdown") {
    n *= 0.95;
    // remove all points
    points.forEach(point => {
      renderer.removeObject(point);
    });
    velocity = 100;
    console.log({n});
    createPoints();
  }


  points.forEach(point => {
    point.options.x += velocity * deltaTime;
  })
};
