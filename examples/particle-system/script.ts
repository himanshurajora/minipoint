import { Vector, Point, Body, Circle, Color, Text, Engine } from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const renderer = engine.renderer;
const infoPanel = document.getElementById('info')!;

const GRAVITY = 300; // pixels per second squared
const PARTICLE_LIFE = 3000; // milliseconds

interface Particle {
    point: Point;
    body: Body;
    life: number;
    maxLife: number;
    color: Color;
}

const particles: Particle[] = [];
let totalCreated = 0;

function createParticleBurst(x: number, y: number, count: number = 20) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502', '#95e1d3', '#ff66ff'];

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = 150 + Math.random() * 150;

        const velocity = Vector.fromAngle(angle).scale(speed);
        const color = Color.fromHex(colors[Math.floor(Math.random() * colors.length)]);

        const point = new Point({
            x,
            y,
            radius: 3 + Math.random() * 3,
            color: color.toRGB(),
        });

        const body = new Body(x, y, {
            mass: 1,
            friction: 0.98,
        });
        body.velocity = velocity;

        renderer.addObject(point);

        particles.push({
            point,
            body,
            life: PARTICLE_LIFE,
            maxLife: PARTICLE_LIFE,
            color,
        });

        totalCreated++;
    }
}

// Mouse click to create particles
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createParticleBurst(x, y, 30);
});

// Auto-create particles at random locations
let autoCreateInterval = setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5; // Upper half
    createParticleBurst(x, y, 15);
}, 500);

// Title
const title = new Text({
    x: canvas.width / 2,
    y: 20,
    text: 'Click for Particle Burst',
    font: 'bold 16px Arial',
    color: '#0f0',
    textAlign: 'center',
});
renderer.addObject(title);

let lastTime = performance.now();
let dt = 0;

function update() {
    const now = performance.now();
    dt = Math.min((now - lastTime) / 1000, 0.016);
    lastTime = now;

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];

        // Apply gravity
        particle.body.applyGravity(GRAVITY);

        // Update physics
        particle.body.update(dt);

        // Update particle position and opacity
        particle.point.options.x = particle.body.position.x;
        particle.point.options.y = particle.body.position.y;

        // Fade out
        particle.life -= dt * 1000;
        const alpha = particle.life / particle.maxLife;
        particle.point.options.color = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${Math.max(0, alpha)})`;

        // Bounce on ground
        if (particle.body.position.y > canvas.height - 10) {
            particle.body.position.y = canvas.height - 10;
            particle.body.velocity.y *= -0.7;

            // Slow down
            if (Math.abs(particle.body.velocity.y) < 10) {
                particle.body.velocity.y = 0;
            }
        }

        // Remove dead particles
        if (particle.life <= 0) {
            renderer.removeObject(particle.point);
            particles.splice(i, 1);
        }
    }

    // Update info
    infoPanel.innerHTML = `
        <div>Active Particles: ${particles.length}</div>
        <div>Total Created: ${totalCreated}</div>
        <div style="margin-top: 10px; font-size: 10px;">
            Average Life: ${particles.length > 0 ? (particles.reduce((sum, p) => sum + p.life, 0) / particles.length).toFixed(0) : 0}ms
        </div>
    `;
}

function animate() {
    update();
    renderer.render(dt);
    requestAnimationFrame(animate);
}

animate();

// Cleanup
window.addEventListener('beforeunload', () => {
    clearInterval(autoCreateInterval);
});
