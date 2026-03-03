import { Vector, Circle, Rectangle, Triangle, Polygon, Collision, Point, Engine } from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const renderer = engine.renderer;
const infoPanel = document.getElementById('info')!;

// Mouse tracker
let mousePos = new Vector(canvas.width / 2, canvas.height / 2);
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
});

// Create test objects
const testCircle = new Circle({
    x: 150,
    y: 150,
    radius: 40,
    fillColor: '#4ecdc4',
    color: '#0f0',
    fill: true,
    stroke: 2,
});

const testRect = new Rectangle({
    x: 350,
    y: 120,
    width: 100,
    height: 80,
    fillColor: '#ff6b6b',
    color: '#0f0',
    fill: true,
    stroke: 2,
});

const testTriangle = new Triangle({
    x1: 550,
    y1: 100,
    x2: 650,
    y2: 200,
    x3: 550,
    y3: 200,
    fillColor: '#ffa502',
    color: '#0f0',
    fill: true,
    stroke: 2,
});

// Polygon has no x/y - points are absolute coordinates
const testPolygon = new Polygon({
    points: [
        [750, 110],
        [780, 130],
        [780, 170],
        [750, 190],
        [720, 170],
        [720, 130],
    ],
    fillColor: '#95e1d3',
    color: '#0f0',
    fill: true,
    stroke: 2,
});

// Cursor circle (for testing)
const cursorCircle = new Circle({
    x: mousePos.x,
    y: mousePos.y,
    radius: 20,
    color: '#ffff00',
    fill: false,
    stroke: 2,
});

renderer.addObject(testCircle);
renderer.addObject(testRect);
renderer.addObject(testTriangle);
renderer.addObject(testPolygon);
renderer.addObject(cursorCircle);

// Update function
const update = () => {
    // Update cursor circle position
    cursorCircle.options.x = mousePos.x;
    cursorCircle.options.y = mousePos.y;

    // Test point in circle collision
    const pointInCir = Collision.pointInCircle(
        mousePos.x, mousePos.y,
        { x: testCircle.options.x, y: testCircle.options.y, radius: testCircle.options.radius },
    );

    // Test point in rectangle collision
    const pointInRec = Collision.pointInRect(
        mousePos.x, mousePos.y,
        { x: testRect.options.x, y: testRect.options.y, width: testRect.options.width, height: testRect.options.height },
    );

    // Test point in triangle collision (use pointInPolygon with triangle vertices)
    const pointInTri = Collision.pointInPolygon(
        mousePos.x, mousePos.y,
        [
            new Vector(testTriangle.options.x1, testTriangle.options.y1),
            new Vector(testTriangle.options.x2, testTriangle.options.y2),
            new Vector(testTriangle.options.x3, testTriangle.options.y3),
        ],
    );

    // Test point in polygon collision
    const polyVerts = (testPolygon.options.points || []).map(
        (p: [number, number]) => new Vector(p[0], p[1])
    );
    const pointInPoly = Collision.pointInPolygon(
        mousePos.x, mousePos.y,
        polyVerts,
    );

    // Build collision info
    let info = `<div style="color: #0f0; font-family: monospace;">`;
    info += `Mouse: ${mousePos.x.toFixed(0)}, ${mousePos.y.toFixed(0)}<br/>`;
    info += `<br/>`;

    if (pointInCir) {
        info += `<div style="color: #00ff00;">✓ Colliding with Circle</div>`;
    } else {
        info += `<div style="color: #ff0000;">✗ Not in Circle</div>`;
    }

    if (pointInRec) {
        info += `<div style="color: #00ff00;">✓ Colliding with Rectangle</div>`;
    } else {
        info += `<div style="color: #ff0000;">✗ Not in Rectangle</div>`;
    }

    if (pointInTri) {
        info += `<div style="color: #00ff00;">✓ Colliding with Triangle</div>`;
    } else {
        info += `<div style="color: #ff0000;">✗ Not in Triangle</div>`;
    }

    if (pointInPoly) {
        info += `<div style="color: #00ff00;">✓ Colliding with Polygon</div>`;
    } else {
        info += `<div style="color: #ff0000;">✗ Not in Polygon</div>`;
    }

    info += `</div>`;
    infoPanel.innerHTML = info;

    // Update collision indicator colors
    testCircle.options.fillColor = pointInCir ? '#00ff00' : '#4ecdc4';
    testRect.options.fillColor = pointInRec ? '#00ff00' : '#ff6b6b';
    testTriangle.options.fillColor = pointInTri ? '#00ff00' : '#ffa502';
    testPolygon.options.fillColor = pointInPoly ? '#00ff00' : '#95e1d3';
};

// Render loop
const render = () => {
    update();
    renderer.render(0);
    requestAnimationFrame(render);
};

render();

