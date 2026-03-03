import { Vector, Circle, Rectangle, Body, Engine } from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const infoPanel = document.getElementById('info')!;
const engine = new Engine(canvas);
const renderer = engine.renderer;

const GRAVITY = 9.81 * 100; // pixels per second squared
const BOUNCE_DAMPING = 0.85;
const FRICTION = 0.98;

interface PhysicsObject {
    circle: Circle;
    body: Body;
    radius: number;
}

const objects: PhysicsObject[] = [];
let windForce = 0;

// Ground
const groundLine = new Rectangle({
    x: 0,
    y: canvas.height - 20,
    width: canvas.width,
    height: 20,
    fillColor: '#333',
    fill: true,
});
renderer.addObject(groundLine);

// Walls
const leftWall = new Rectangle({
    x: 0,
    y: 0,
    width: 10,
    height: canvas.height,
    fillColor: '#444',
    fill: true,
});
const rightWall = new Rectangle({
    x: canvas.width - 10,
    y: 0,
    width: 10,
    height: canvas.height,
    fillColor: '#444',
    fill: true,
});
renderer.addObject(leftWall);
renderer.addObject(rightWall);

function createPhysicsObject(x: number, y: number, radius: number = 10) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502', '#95e1d3'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const circle = new Circle({
        x,
        y,
        radius,
        fillColor: color,
        fill: true,
    });

    const body = new Body(x, y, {
        mass: (radius / 10) * 1, // Mass based on radius
        friction: FRICTION,
        maxSpeed: 800,
    });

    renderer.addObject(circle);

    objects.push({ circle, body, radius });
}

// Mouse click to create objects
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createPhysicsObject(x, y, 8 + Math.random() * 8);
});

// Create initial objects
for (let i = 0; i < 3; i++) {
    createPhysicsObject(100 + i * 100, 100, 10 + Math.random() * 5);
}

let lastTime = performance.now();
let dt = 0;

function update() {
    const now = performance.now();
    dt = Math.min((now - lastTime) / 1000, 0.016); // Cap at 60 FPS
    lastTime = now;

    // Oscillating wind force
    windForce = Math.sin(now / 1000) * 200;

    // Update physics for each object
    for (let i = objects.length - 1; i >= 0; i--) {
        const obj = objects[i];
        const { circle, body, radius } = obj;

        // Apply forces
        body.applyGravity(GRAVITY);
        body.applyForce(new Vector(windForce, 0));

        // Update physics
        body.update(dt);

        // Update circle position
        circle.options.x = body.position.x;
        circle.options.y = body.position.y;

        // Ground collision
        if (body.position.y + radius > canvas.height - 20) {
            body.position.y = canvas.height - 20 - radius;
            body.velocity.y *= -BOUNCE_DAMPING;

            // Stop if too slow
            if (Math.abs(body.velocity.y) < 1) {
                body.velocity.y = 0;
            }
        }

        // Ceiling collision
        if (body.position.y - radius < 0) {
            body.position.y = radius;
            body.velocity.y *= -BOUNCE_DAMPING;
        }

        // Left wall collision
        if (body.position.x - radius < 10) {
            body.position.x = 10 + radius;
            body.velocity.x *= -0.9;
        }

        // Right wall collision
        if (body.position.x + radius > canvas.width - 10) {
            body.position.x = canvas.width - 10 - radius;
            body.velocity.x *= -0.9;
        }

        // Remove if falls off screen
        if (body.position.y > canvas.height + 50) {
            renderer.removeObject(circle);
            objects.splice(i, 1);
        }
    }

    // Update info
    infoPanel.innerHTML = `
        <div>Objects: ${objects.length}</div>
        <div>Wind Force: ${windForce.toFixed(1)} px/s²</div>
        <div style="margin-top: 5px; font-size: 10px;">
            Avg Velocity: ${objects.length > 0 ? (objects.reduce((sum, o) => sum + o.body.velocity.magnitude(), 0) / objects.length).toFixed(1) : 0} px/s
        </div>
    `;
}

function render() {
    update();
    renderer.render(dt);
    requestAnimationFrame(render);
}

render();
