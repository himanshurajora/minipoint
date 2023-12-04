import BrowserOnly from '@docusaurus/BrowserOnly';
import useIsBrowser from '@docusaurus/useIsBrowser';

const RedDotExample = () => {
  return (
    (
      <BrowserOnly fallback={<>Canvas PlaceHolder</>}>
        {() => {
          const useEffect = require('react').useEffect;
          const useRef = require('react').useRef;
          const Engine = require('minipoint').Engine;

          const canvasRef = useRef();

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
        }}
      </BrowserOnly>
    )
  );
};

export default RedDotExample;
