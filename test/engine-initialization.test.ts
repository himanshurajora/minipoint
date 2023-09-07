import { Engine } from '../lib/render/engine';

describe('The engine initialization tests', () => {
  test('The Engine Should Initialize', () => {
    const canvas = document.createElement('canvas');
    const engine = new Engine(canvas);
    expect(engine).toBeDefined();
  });
});
