import { Engine, createCanvas } from 'minipoint';

const { canvas } = createCanvas();
const engine = new Engine(canvas);

const renderer = engine.renderer;

renderer.drawPoint({ x: 100, y: 100 });
