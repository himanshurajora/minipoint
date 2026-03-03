import {
    Vector,
    Point,
    Line,
    Rectangle,
    Circle,
    Ellipse,
    Triangle,
    Polygon,
    Arc,
    Text,
    Path,
    Engine,
} from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const renderer = engine.renderer;

let time = 0;

// Row 1: Basic Shapes

// Point
const point = new Point({
    x: 50,
    y: 50,
    radius: 5,
    color: '#ff6b6b',
});
renderer.addObject(point);

// Line
const line = new Line({
    x1: 120,
    y1: 30,
    x2: 220,
    y2: 70,
    color: '#4ecdc4',
    stroke: 3,
});
renderer.addObject(line);

// Rectangle
const rect = new Rectangle({
    x: 260,
    y: 30,
    width: 80,
    height: 50,
    fillColor: '#ffa502',
    color: '#ffff00',
    stroke: 2,
});
renderer.addObject(rect);

// Circle
const circle = new Circle({
    x: 390,
    y: 55,
    radius: 25,
    fillColor: '#95e1d3',
    color: '#00ff00',
    stroke: 2,
});
renderer.addObject(circle);

// Ellipse
const ellipse = new Ellipse({
    x: 510,
    y: 55,
    radiusX: 40,
    radiusY: 20,
    fillColor: '#ff66ff',
    color: '#ffff00',
    stroke: 2,
});
renderer.addObject(ellipse);

// Row 2: Geometric Shapes

// Triangle
const triangle = new Triangle({
    x1: 50,
    y1: 120,
    x2: 90,
    y2: 180,
    x3: 10,
    y3: 180,
    fillColor: '#a8e6cf',
    color: '#0f0',
    stroke: 2,
});
renderer.addObject(triangle);

// Polygon (Star) - points are absolute coordinates
const star = new Polygon({
    points: [
        [150, 125],
        [158, 142],
        [175, 144],
        [163, 153],
        [165, 170],
        [150, 162],
        [135, 170],
        [137, 153],
        [125, 144],
        [142, 142],
    ],
    fillColor: '#ffd93d',
    color: '#ff6b6b',
    stroke: 2,
});
renderer.addObject(star);

// Arc
const arc = new Arc({
    x: 280,
    y: 150,
    radius: 30,
    startAngle: 0,
    endAngle: Math.PI * 1.5,
    fillColor: 'transparent',
    color: '#45b7d1',
    stroke: 3,
});
renderer.addObject(arc);

// Text
const text = new Text({
    x: 370,
    y: 150,
    text: 'Text Shape',
    font: '16px Arial',
    color: '#0f0',
    textAlign: 'center',
});
renderer.addObject(text);

// Path (Custom shape using commands)
const path = new Path({
    commands: [
        { type: 'moveTo', x: 460, y: 130 },
        { type: 'quadraticCurveTo', cpx: 480, cpy: 110, x: 500, y: 130 },
        { type: 'quadraticCurveTo', cpx: 520, cpy: 150, x: 500, y: 170 },
        { type: 'quadraticCurveTo', cpx: 480, cpy: 190, x: 460, y: 170 },
        { type: 'quadraticCurveTo', cpx: 440, cpy: 150, x: 460, y: 130 },
        { type: 'closePath' },
    ],
    fillColor: '#ff69b4',
    color: '#ffff00',
    stroke: 2,
    fill: true,
});
renderer.addObject(path);

// Row 3: Complex Shapes

// Animated Rectangle (rotating)
const rectRotating = new Rectangle({
    x: 50,
    y: 280,
    width: 60,
    height: 40,
    fillColor: '#ff6b6b',
    color: '#fff',
    stroke: 2,
});
renderer.addObject(rectRotating);

// Animated Circle (scaling)
const circleScaling = new Circle({
    x: 150,
    y: 280,
    radius: 25,
    fillColor: '#4ecdc4',
    color: '#fff',
    stroke: 2,
});
renderer.addObject(circleScaling);

// Animated Polygon - absolute coordinates
const polygonRotating = new Polygon({
    points: [
        [260, 260],
        [300, 260],
        [300, 300],
        [260, 300],
    ],
    fillColor: '#ffa502',
    color: '#fff',
    stroke: 2,
});
renderer.addObject(polygonRotating);

// Animated Ellipse (rotation)
const ellipseRotating = new Ellipse({
    x: 400,
    y: 280,
    radiusX: 35,
    radiusY: 15,
    fillColor: '#ff66ff',
    color: '#fff',
    stroke: 2,
});
renderer.addObject(ellipseRotating);

// Nested Circles
const outerCircle = new Circle({
    x: 520,
    y: 280,
    radius: 30,
    fillColor: 'transparent',
    color: '#00ff00',
    stroke: 2,
});
const middleCircle = new Circle({
    x: 520,
    y: 280,
    radius: 20,
    fillColor: 'transparent',
    color: '#00ff00',
    stroke: 2,
});
const innerCircle = new Circle({
    x: 520,
    y: 280,
    radius: 10,
    fillColor: '#00ff00',
});
renderer.addObject(outerCircle);
renderer.addObject(middleCircle);
renderer.addObject(innerCircle);

function animate() {
    time += 0.016; // ~60 FPS

    // Note: Transform methods (rotation, scaling, opacity) are not available in the current library
    // Update arc endAngle
    arc.options.endAngle = (Math.PI * 3.5 * (Math.sin(time) + 1)) / 2;

    renderer.render(0);
    requestAnimationFrame(animate);
}

animate();
