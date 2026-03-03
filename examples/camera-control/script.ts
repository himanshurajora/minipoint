import { Vector, Rectangle, Circle, Polygon, Camera, Text, Engine } from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const renderer = engine.renderer;
const infoPanel = document.getElementById('info')!;

// Create camera
const camera = new Camera(0, 0, 1);

// Input state
const keys: { [key: string]: boolean } = {};

document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Create a grid of objects in world space
const worldObjects: Rectangle[] = [];
const gridSize = 10;
const cellSize = 100;

for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const x = i * cellSize;
        const y = j * cellSize;
        const color = ((i + j) % 2 === 0) ? '#4ecdc4' : '#ff6b6b';

        const rect = new Rectangle({
            x,
            y,
            width: cellSize - 10,
            height: cellSize - 10,
            fillColor: color,
            color: '#0f0',
            stroke: 1,
        });

        worldObjects.push(rect);
        renderer.addObject(rect);
    }
}

// Add some circles in world space
const circles: Circle[] = [];
for (let i = 0; i < 5; i++) {
    const x = Math.random() * gridSize * cellSize;
    const y = Math.random() * gridSize * cellSize;

    const circle = new Circle({
        x,
        y,
        radius: 25,
        fillColor: '#ffa502',
        color: '#ffff00',
        stroke: 2,
    });

    circles.push(circle);
    renderer.addObject(circle);
}

// Camera center info
const cameraInfo = new Text({
    x: canvas.width / 2,
    y: 20,
    text: 'Camera: (0, 0) Z: 1x',
    font: '12px monospace',
    color: '#0f0',
    textAlign: 'center',
});
renderer.addObject(cameraInfo);

// Animation loop
let lastTime = performance.now();

function update() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.016);
    lastTime = now;

    const panSpeed = 200; // pixels per second
    const zoomSpeed = 0.5; // zoom units per second
    const rotateSpeed = 2; // radians per second

    if (keys['arrowup']) {
        camera.move(0, -panSpeed * dt);
    }
    if (keys['arrowdown']) {
        camera.move(0, panSpeed * dt);
    }
    if (keys['arrowleft']) {
        camera.move(-panSpeed * dt, 0);
    }
    if (keys['arrowright']) {
        camera.move(panSpeed * dt, 0);
    }

    if (keys['z']) {
        camera.setZoom(camera.zoom + zoomSpeed * dt);
    }
    if (keys['x']) {
        camera.setZoom(camera.zoom - zoomSpeed * dt);
    }

    if (keys['r']) {
        camera.rotation += rotateSpeed * dt;
    }
    if (keys['t']) {
        camera.rotation -= rotateSpeed * dt;
    }

    // Reset view with spacebar
    if (keys[' ']) {
        camera.setZoom(1);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.rotation = 0;
    }

    // Update camera info
    const camPos = camera.position;
    cameraInfo.options.text = 
        `Camera: (${camPos.x.toFixed(0)}, ${camPos.y.toFixed(0)}) ` +
        `Z: ${camera.zoom.toFixed(2)}x R: ${(camera.rotation * 180 / Math.PI).toFixed(1)}°`;

    // Update info panel
    infoPanel.innerHTML = `
        <div>Position: (${camPos.x.toFixed(0)}, ${camPos.y.toFixed(0)})</div>
        <div>Zoom: ${camera.zoom.toFixed(2)}x</div>
        <div>Rotation: ${(camera.rotation * 180 / Math.PI).toFixed(1)}°</div>
        <div style="margin-top: 10px; color: #666;">
            Space: Reset View
        </div>
    `;
}

function render() {
    update();

    // Apply camera transform
    const ctx = renderer.context;
    camera.applyTransform(ctx, canvas.width, canvas.height);

    renderer.render(0);

    // Restore context
    camera.restoreTransform(ctx);

    requestAnimationFrame(render);
}

render();
