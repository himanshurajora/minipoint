import React, { useRef, useEffect } from 'react';
import { Engine } from 'minipoint';
const RedDotExample = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  useEffect(() => {
    const canvas = canvasRef.current;

    let engine = new Engine(canvas);

    const point = engine.renderer.point({
      x: 100,
      y: 100,
      color: 'red',
      radius: 20,
    });

    let speedX = 0.1;
    let speedY = 0.1;

    engine.update = (engine) => {
      point.options.x += speedX;
      point.options.y += speedY;
    };

    // Add your canvas drawing code here
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default RedDotExample;
