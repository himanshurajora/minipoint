import { Engine, createCanvas } from '../lib';

const canvasOptions = {
  height: 100,
  width: 100,
  parentElement: document.body,
};

// test change pr
describe("The engine's basic tests", () => {
  test('It should initialize the engine', () => {
    const canvas = document.createElement('canvas');
    const engine = new Engine(canvas);
    expect(engine).toBeDefined();
  });

  test('It should provide canvas without options', () => {
    const { canvas } = createCanvas();
    expect(canvas).toBeDefined();
  });

  test('It should provide canvas with options', () => {
    const { canvas } = createCanvas(canvasOptions);
    expect(canvas).toBeDefined();
  });

  test('Canvas should have correct properties', () => {
    const { canvas } = createCanvas(canvasOptions);
    expect(canvas.width).toBe(canvasOptions.width);
    expect(canvas.height).toBe(canvasOptions.height);
  });
});
