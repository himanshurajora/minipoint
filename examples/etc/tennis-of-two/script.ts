import { Engine, Point, Line, Rectangle } from '../../../lib';

const engine = new Engine(
  document.getElementById('canvas') as HTMLCanvasElement,
  {
    engineOptions: {
      width: 800,
      height: 600,
      clearEachFrame: true,
    },
  },
);

// layout - line in the middle
const middleLine = new Line({
  x1: 400,
  y1: 0,
  x2: 400,
  y2: 600,
  color: 'blue',
  stroke: 2,
});

const player = new Rectangle({
  x: 5,
  y: 0,
  width: 10,
  height: 50,
  fill: true,
  fillColor: 'black',
});

let yAxisInput = 0;
const speed = 300;

const ball = new Point({
  x: 400,
  y: 300,
  radius: 10,
  color: 'red',
});

// ball velocity
let ballXVelocity = Math.random() - 100;
let ballYVelocity = Math.random() + 100;

engine.update = (_, deltaTime) => {
  if (engine.input.keyboard.currentDownKey === 'arrowup') {
    yAxisInput = -1;
  } else if (engine.input.keyboard.currentDownKey === 'arrowdown') {
    yAxisInput = 1;
  } else {
    yAxisInput = 0;
  }

  player.options.y += yAxisInput * speed * deltaTime;

  // stop the player on the top and bottom
  if (player.options.y < 0) {
    player.options.y = 0;
  } else if (player.options.y > 550) {
    player.options.y = 550;
  }

  // ball movement
  ball.options.x += ballXVelocity * deltaTime;
  ball.options.y += ballYVelocity * deltaTime;

  if (ball.options.y < 0 || ball.options.y > 600) {
    ballYVelocity = -ballYVelocity;
  }

  if (ball.options.x < 0 || ball.options.x > 800) {
    ballXVelocity = -ballXVelocity;
  }

  // ball collision with player
  if (
    ball.options.x < player.options.x + player.options.width &&
    ball.options.x > player.options.x &&
    ball.options.y < player.options.y + player.options.height &&
    ball.options.y > player.options.y
  ) {
    ballXVelocity = -ballXVelocity;
  }
};
