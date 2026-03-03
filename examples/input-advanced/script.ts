import { Vector, Circle, Rectangle, Text, Engine } from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const renderer = engine.renderer;
const infoPanel = document.getElementById('info')!;

// Get input from engine
const input = engine.input;

// Create a player circle that can be controlled
const playerCircle = new Circle({
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    fillColor: '#4ecdc4',
    color: '#0f0',
    stroke: 2,
});
renderer.addObject(playerCircle);

// Create mouse tracker
const mouseTracker = new Circle({
    x: 0,
    y: 0,
    radius: 5,
    fillColor: '#ff6b6b',
});
renderer.addObject(mouseTracker);

// Trail points
const trailPoints: Circle[] = [];
const maxTrailLength = 50;

// Key status display
const keyStatus = new Text({
    x: 10,
    y: canvas.height - 60,
    text: '',
    font: '10px monospace',
    color: '#0f0',
});
renderer.addObject(keyStatus);

// Mouse status display
const mouseStatus = new Text({
    x: 10,
    y: canvas.height - 30,
    text: '',
    font: '10px monospace',
    color: '#ff6b6b',
});
renderer.addObject(mouseStatus);

let playerVelocity = new Vector(0, 0);
const playerSpeed = 200; // pixels per second
const playerFriction = 0.85;

function updateInput() {
    // Keyboard input
    const keysPressed: string[] = [];
    const key = input.keyboard.currentDownKey;

    if (key === 'w' || key === 'arrowup') {
        playerVelocity.y -= playerSpeed;
        keysPressed.push('↑');
    }
    if (key === 's' || key === 'arrowdown') {
        playerVelocity.y += playerSpeed;
        keysPressed.push('↓');
    }
    if (key === 'a' || key === 'arrowleft') {
        playerVelocity.x -= playerSpeed;
        keysPressed.push('←');
    }
    if (key === 'd' || key === 'arrowright') {
        playerVelocity.x += playerSpeed;
        keysPressed.push('→');
    }

    // Apply friction
    playerVelocity.x *= playerFriction;
    playerVelocity.y *= playerFriction;

    // Update player position
    playerCircle.options.x += playerVelocity.x * 0.016;
    playerCircle.options.y += playerVelocity.y * 0.016;

    // Keep in bounds
    const radius = playerCircle.options.radius;
    if (playerCircle.options.x - radius < 0) playerCircle.options.x = radius;
    if (playerCircle.options.x + radius > canvas.width) playerCircle.options.x = canvas.width - radius;
    if (playerCircle.options.y - radius < 0) playerCircle.options.y = radius;
    if (playerCircle.options.y + radius > canvas.height) playerCircle.options.y = canvas.height - radius;

    // Mouse input
    const mousePos = input.mouse.position;
    mouseTracker.options.x = mousePos.x;
    mouseTracker.options.y = mousePos.y;

    // Create trail on mouse movement
    if (input.mouse.move && trailPoints.length < maxTrailLength) {
        const trail = new Circle({
            x: mousePos.x,
            y: mousePos.y,
            radius: 2,
            fillColor: 'rgba(255, 255, 255, 0.3)',
        });
        trailPoints.push(trail);
        renderer.addObject(trail);
    }

    // Remove old trail points
    while (trailPoints.length > maxTrailLength) {
        const oldTrail = trailPoints.shift();
        if (oldTrail) renderer.removeObject(oldTrail);
    }

    // Update key status
    let keyText = 'Keys: ';
    if (keysPressed.length > 0) {
        keyText += keysPressed.join(', ');
    } else {
        keyText += 'None';
    }

    if (input.keyboard.shiftKey) {
        keyText += ' [SHIFT]';
        // Scale effect (modify radius instead if radius exists)
        playerCircle.options.radius = 30;
    } else {
        playerCircle.options.radius = 20;
    }

    keyStatus.options.text = keyText;

    // Update mouse status
    const pos = { x: playerCircle.options.x, y: playerCircle.options.y };
    let mouseText = `Mouse: (${mousePos.x.toFixed(0)}, ${mousePos.y.toFixed(0)})`;
    if (input.mouse.down) {
        mouseText += ' [BUTTON DOWN]';
        playerCircle.options.fillColor = '#ff6b6b';
    } else if (input.mouse.move) {
        playerCircle.options.fillColor = '#4ecdc4';
    }

    mouseStatus.options.text = mouseText;

    // Update info panel
    infoPanel.innerHTML = `
        <div>Player Pos: (${playerCircle.options.x.toFixed(0)}, ${playerCircle.options.y.toFixed(0)})</div>
        <div>Velocity: (${playerVelocity.x.toFixed(0)}, ${playerVelocity.y.toFixed(0)})</div>
        <div>Speed: ${playerVelocity.magnitude().toFixed(0)} px/s</div>
        <div style="margin-top: 10px;">
            <div>Trail Points: ${trailPoints.length}</div>
        </div>
    `;
}

function animate() {
    updateInput();
    renderer.render(0);
    requestAnimationFrame(animate);
}

animate();
