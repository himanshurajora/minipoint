import {
    Vector,
    Circle,
    Rectangle,
    Body,
    Collision,
    Text,
    Color,
    Engine,
} from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const renderer = engine.renderer;
const infoPanel = document.getElementById('info')!;

const GRAVITY = 500;
const FRICTION = 0.96;
const BOUNCE_DAMPING = 0.8;
const MAX_OBJECTS = 50;

interface PhysicsObject {
    shape: Circle | Rectangle;
    body: Body;
    type: 'circle' | 'rect';
    color: Color;
}

const objects: PhysicsObject[] = [];
let isPaused = false;
let draggedObject: PhysicsObject | null = null;
let dragOffset = new Vector(0, 0);

// Ground
const ground = new Rectangle({
    x: 0,
    y: canvas.height - 30,
    width: canvas.width,
    height: 30,
    fillColor: '#2a4a2a',
    color: '#0f0',
    stroke: 2,
});
renderer.addObject(ground);

// Left wall
const leftWall = new Rectangle({
    x: 0,
    y: 0,
    width: 20,
    height: canvas.height,
    fillColor: '#3a3a5a',
    color: '#44ff44',
    stroke: 1,
});
renderer.addObject(leftWall);

// Right wall
const rightWall = new Rectangle({
    x: canvas.width - 20,
    y: 0,
    width: 20,
    height: canvas.height,
    fillColor: '#3a3a5a',
    color: '#44ff44',
    stroke: 1,
});
renderer.addObject(rightWall);

// Status text
const statusText = new Text({
    x: canvas.width / 2,
    y: 20,
    text: 'Interactive Physics Playground',
    font: 'bold 14px Arial',
    color: '#0f0',
    textAlign: 'center',
});
renderer.addObject(statusText);

function createBall(x: number, y: number, radius: number = 12) {
    if (objects.length >= MAX_OBJECTS) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502', '#95e1d3', '#ff66ff'];
    const color = Color.fromHex(colors[Math.floor(Math.random() * colors.length)]);

    const circle = new Circle({
        x,
        y,
        radius,
        fillColor: color.toRGB(),
        color: '#0f0',
        stroke: 1,
    });

    const body = new Body(x, y, {
        mass: (radius / 10) * 1,
        friction: FRICTION,
        maxSpeed: 800,
    });

    renderer.addObject(circle);
    objects.push({ shape: circle, body, type: 'circle', color });
}

function createCube(x: number, y: number, size: number = 30) {
    if (objects.length >= MAX_OBJECTS) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502', '#95e1d3'];
    const color = Color.fromHex(colors[Math.floor(Math.random() * colors.length)]);

    const rect = new Rectangle({
        x: x - size / 2,
        y: y - size / 2,
        width: size,
        height: size,
        fillColor: color.toRGB(),
        color: '#0f0',
        stroke: 1,
    });

    const body = new Body(x, y, {
        mass: (size / 30) * 1.5,
        friction: FRICTION,
        maxSpeed: 800,
    });

    renderer.addObject(rect);
    objects.push({ shape: rect, body, type: 'rect', color });
}

function resetScene() {
    // Clear all objects
    objects.forEach((obj) => {
        renderer.removeObject(obj.shape);
    });
    objects.length = 0;

    // Create initial setup
    for (let i = 0; i < 5; i++) {
        createBall(100 + i * 80, 100 + Math.random() * 100);
    }
}

// Input handling
const input = engine.input;
let mouseDown = false;
let mouseDownPos = new Vector(0, 0);

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseDownPos.x = e.clientX - rect.left;
    mouseDownPos.y = e.clientY - rect.top;
    mouseDown = true;

    // Check if clicking on an object
    for (const obj of objects) {
        const dist = mouseDownPos.distanceTo(obj.body.position);

        if (
            (obj.type === 'circle' && dist <= (obj.shape as Circle).options.radius) ||
            (obj.type === 'rect' && dist <= Math.sqrt((obj.shape as Rectangle).options.width ** 2 + (obj.shape as Rectangle).options.height ** 2) / 2)
        ) {
            draggedObject = obj;
            dragOffset = new Vector(obj.body.position.x - mouseDownPos.x, obj.body.position.y - mouseDownPos.y);
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!mouseDown) return;

    const rect = canvas.getBoundingClientRect();
    const currentPos = new Vector(e.clientX - rect.left, e.clientY - rect.top);

    if (draggedObject) {
        draggedObject.body.position.x = currentPos.x + dragOffset.x;
        draggedObject.body.position.y = currentPos.y + dragOffset.y;
    }
});

canvas.addEventListener('mouseup', (e) => {
    if (draggedObject) {
        // Calculate throw velocity
        const rect = canvas.getBoundingClientRect();
        const releasePos = new Vector(e.clientX - rect.left, e.clientY - rect.top);
        draggedObject.body.velocity = releasePos.clone().subtract(mouseDownPos).scale(1.5);
        draggedObject = null;
    }
    mouseDown = false;
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        createBall(Math.random() * canvas.width, 50 + Math.random() * 100);
    } else if (e.key === 'c' || e.key === 'C') {
        createCube(Math.random() * canvas.width, 50 + Math.random() * 100);
    } else if (e.key === 'p' || e.key === 'P') {
        isPaused = !isPaused;
        statusText.options.text = isPaused ? 'PAUSED' : 'Interactive Physics Playground';
    } else if (e.key === 'r' || e.key === 'R') {
        resetScene();
    }
});

// Initial setup
resetScene();

let lastTime = performance.now();
let collisionPairs = 0;
let dt = 0;

function update() {
    const now = performance.now();
    dt = Math.min((now - lastTime) / 1000, 0.016);
    lastTime = now;

    if (isPaused) return;

    collisionPairs = 0;

    // Update physics
    for (const obj of objects) {
        obj.body.applyGravity(GRAVITY);
        obj.body.update(dt);

        obj.shape.options.x = obj.body.position.x;
        obj.shape.options.y = obj.body.position.y;

        // Ground collision
        const objHeight =
            obj.type === 'circle'
                ? (obj.shape as Circle).options.radius
                : (obj.shape as Rectangle).options.height / 2;

        if (obj.body.position.y + objHeight > canvas.height - 30) {
            obj.body.position.y = canvas.height - 30 - objHeight;
            obj.body.velocity.y *= -BOUNCE_DAMPING;

            if (Math.abs(obj.body.velocity.y) < 5) {
                obj.body.velocity.y = 0;
            }
        }

        // Left wall
        if (
            obj.type === 'circle' &&
            obj.body.position.x - (obj.shape as Circle).options.radius < 20
        ) {
            obj.body.position.x = 20 + (obj.shape as Circle).options.radius;
            obj.body.velocity.x *= -0.9;
        }

        // Right wall
        if (
            obj.type === 'circle' &&
            obj.body.position.x + (obj.shape as Circle).options.radius > canvas.width - 20
        ) {
            obj.body.position.x = canvas.width - 20 - (obj.shape as Circle).options.radius;
            obj.body.velocity.x *= -0.9;
        }
    }

    // Simple circle-circle collision
    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            const a = objects[i];
            const b = objects[j];

            if (a.type === 'circle' && b.type === 'circle') {
                const dist = a.body.position.distanceTo(b.body.position);
                const minDist = (a.shape as Circle).options.radius + (b.shape as Circle).options.radius;

                if (dist < minDist) {
                    collisionPairs++;

                    // Separate circles
                    const normal = b.body.position
                        .clone()
                        .subtract(a.body.position)
                        .normalize();
                    const overlap = minDist - dist;

                    a.body.position.subtract(normal.clone().scale(overlap / 2));
                    b.body.position.add(normal.clone().scale(overlap / 2));

                    // Bounce
                    const relVel = b.body.velocity
                        .clone()
                        .subtract(a.body.velocity);
                    const velAlongNormal = relVel.dot(normal);

                    if (velAlongNormal < 0) {
                        const impulse = normal.clone().scale(velAlongNormal * -1.1);
                        a.body.velocity.subtract(impulse);
                        b.body.velocity.add(impulse);
                    }
                }
            }
        }
    }

    // Update info
    infoPanel.innerHTML = `
        <div style="color: #0f0;">Objects: ${objects.length}/${MAX_OBJECTS}</div>
        <div>Collisions: ${collisionPairs}</div>
        <div style="margin-top: 10px;">
            <div style="color: #ff6b6b;">Avg Velocity:</div>
            <div>${objects.length > 0 ? (objects.reduce((sum, o) => sum + o.body.velocity.magnitude(), 0) / objects.length).toFixed(1) : 0} px/s</div>
        </div>
        <div style="margin-top: 10px;">
            <div style="color: #ffff00;">Total KE:</div>
            <div>${objects.length > 0 ? objects.reduce((sum, o) => sum + 0.5 * o.body.mass * o.body.velocity.magnitude() ** 2, 0).toFixed(0) : 0}</div>
        </div>
    `;
}

function render() {
    update();
    renderer.render(dt);
    requestAnimationFrame(render);
}

render();
