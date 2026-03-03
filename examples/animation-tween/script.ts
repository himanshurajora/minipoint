import { Circle, Vector, Tween, TweenManager, Easing, Text, Color, Engine } from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const renderer = engine.renderer;
const infoPanel = document.getElementById('info')!;

const tweenManager = new TweenManager();

// Easing functions to demonstrate
const easingFunctions = [
    { name: 'Linear', fn: Easing.linear },
    { name: 'EaseInQuad', fn: Easing.easeInQuad },
    { name: 'EaseOutQuad', fn: Easing.easeOutQuad },
    { name: 'EaseInOutCubic', fn: Easing.easeInOutCubic },
    { name: 'EaseInElastic', fn: Easing.easeInElastic },
    { name: 'EaseOutBounce', fn: Easing.easeOutBounce },
    { name: 'EaseInSine', fn: Easing.easeInSine },
    { name: 'EaseOutExpo', fn: Easing.easeOutExpo },
];

const ANIMATION_DURATION = 2000;
const START_X = 50;
const END_X = canvas.width - 50;

interface AnimatingCircle {
    circle: Circle;
    label: Text;
    tween?: Tween<any>;
}

const animatingCircles: AnimatingCircle[] = [];
let currentEasingIndex = 0;

function createAnimatedCircle(y: number, easingIndex: number) {
    const easing = easingFunctions[easingIndex % easingFunctions.length];
    const circleState = { x: START_X };
    const circle = new Circle({
        x: START_X,
        y,
        radius: 15,
        fillColor: Color.fromHSL(easingIndex * (360 / easingFunctions.length), 100, 50).toRGB(),
        color: '#fff',
        stroke: 2,
    });

    const label = new Text({
        x: 10,
        y: y - 25,
        text: easing.name,
        font: '12px monospace',
        color: '#0f0',
    });

    renderer.addObject(circle);
    renderer.addObject(label);

    const animatingCircle: AnimatingCircle = { circle, label };

    // Create tween with TweenOptions
    const tween = tweenManager.create({
        target: circleState,
        to: { x: END_X },
        duration: ANIMATION_DURATION / 1000, // duration in seconds
        easing: easing.fn,
        repeat: -1, // infinite repeat
        yoyo: true,
        onUpdate: (target) => {
            circle.options.x = target.x;
        },
    });

    animatingCircle.tween = tween;
    animatingCircles.push(animatingCircle);
    return animatingCircle;
}

// Create circles for each easing function
easingFunctions.forEach((_, index) => {
    const y = 60 + index * (canvas.height / easingFunctions.length);
    createAnimatedCircle(y, index);
});

// Event listener for clicking to restart (stop and re-create tweens)
canvas.addEventListener('click', () => {
    // Tweens with repeat=-1 auto-restart, click is just informational
});

// Add title
const title = new Text({
    x: canvas.width / 2,
    y: 20,
    text: 'Easing Functions - Click to Restart',
    font: 'bold 16px Arial',
    color: '#0f0',
    textAlign: 'center',
});
renderer.addObject(title);

// Animation loop
let lastTime = performance.now();

function animate() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.016);
    lastTime = now;

    // Update tweens
    tweenManager.update(dt * 1000); // TweenManager uses milliseconds

    // Update info
    let info = '<div>';
    easingFunctions.slice(0, 3).forEach((ef) => {
        info += `${ef.name}<br/>`;
    });
    info += '...more</div>';
    infoPanel.innerHTML = info;

    renderer.render(dt);
    requestAnimationFrame(animate);
}

animate();
