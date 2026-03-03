import { Vector, Point, Circle, Line, Engine } from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const infoPanel = document.getElementById('info-panel')!;
const engine = new Engine(canvas);
const renderer = engine.renderer;

// Vector visualization objects
const vectorArrowScale = 100;
let angle = 0;
let time = 0;

// Create two vectors to demonstrate operations
let v1 = new Vector(1, 0);
let v2 = new Vector(0.7, 0.7);

// Visualization points and lines
const originPoint = new Point({ x: 200, y: 300, color: '#0f0', radius: 5 });
const v1EndPoint = new Point({ x: 0, y: 0, color: '#ff0000', radius: 5 });
const v2EndPoint = new Point({ x: 0, y: 0, color: '#00ff00', radius: 5 });
const resultPoint = new Point({ x: 0, y: 0, color: '#ffff00', radius: 5 });

const v1Line = new Line({ x1: 200, y1: 300, x2: 0, y2: 0, color: '#ff0000', stroke: 2 });
const v2Line = new Line({ x1: 200, y1: 300, x2: 0, y2: 0, color: '#00ff00', stroke: 2 });
const resultLine = new Line({ x1: 200, y1: 300, x2: 0, y2: 0, color: '#ffff00', stroke: 2 });

// Dot product visualization
const dotProductCircle = new Circle({ x: 550, y: 100, radius: 30, fillColor: '#333', fill: true });
const dotProductPoint = new Point({ x: 0, y: 0, color: '#0f0', radius: 4 });

// Magnitude visualization
const magCircle1 = new Circle({ x: 550, y: 250, radius: 0, color: '#ff0000', stroke: 2 });
const magCircle2 = new Circle({ x: 550, y: 250, radius: 0, color: '#00ff00', stroke: 2 });

// Angle visualization
const angleArc = new Circle({ 
    x: 200, 
    y: 300, 
    radius: 40, 
    fill: false,
    color: '#666', 
    stroke: 1 
});

// Add objects to renderer
renderer.addObject(originPoint);
renderer.addObject(v1EndPoint);
renderer.addObject(v2EndPoint);
renderer.addObject(resultPoint);
renderer.addObject(v1Line);
renderer.addObject(v2Line);
renderer.addObject(resultLine);
renderer.addObject(angleArc);
renderer.addObject(dotProductCircle);
renderer.addObject(dotProductPoint);
renderer.addObject(magCircle1);
renderer.addObject(magCircle2);

function updateVectorDisplay() {
    time += 0.016; // ~60 FPS
    angle = (time * 0.5) % (Math.PI * 2);

    // Rotate first vector continuously
    v1 = Vector.fromAngle(angle).scale(2);

    // Update vector end points
    v1EndPoint.options.x = 200 + v1.x * vectorArrowScale;
    v1EndPoint.options.y = 300 + v1.y * vectorArrowScale;
    v2EndPoint.options.x = 200 + v2.x * vectorArrowScale;
    v2EndPoint.options.y = 300 + v2.y * vectorArrowScale;

    // Calculate and display various operations
    const v1Mag = v1.magnitude();
    const v2Mag = v2.magnitude();

    const dotProd = v1.dot(v2);
    const crossProd = v1.cross(v2);

    const v1Normalized = v1.clone().normalize();
    const v2Normalized = v2.clone().normalize();

    const distance = v1.distanceTo(v2);
    const angleBetween = v1.angleTo(v2);

    // Lerp between v1 and v2
    const lerpT = (Math.sin(time * 0.5) + 1) / 2;
    const lerped = Vector.lerp(v1, v2, lerpT);

    resultPoint.options.x = 200 + lerped.x * vectorArrowScale;
    resultPoint.options.y = 300 + lerped.y * vectorArrowScale;
    resultLine.options.x2 = 200 + lerped.x * vectorArrowScale;
    resultLine.options.y2 = 300 + lerped.y * vectorArrowScale;

    // Update magnitude circles
    magCircle1.options.radius = v1Mag * vectorArrowScale;
    magCircle2.options.radius = v2Mag * vectorArrowScale;

    // Update angle arc visualization
    const arcRadius = 40;
    const arcEndX = 200 + Math.cos(angle) * arcRadius;
    const arcEndY = 300 + Math.sin(angle) * arcRadius;

    // Update info panel
    infoPanel.innerHTML = `
        <div style="color: #0f0; margin-bottom: 10px;">VECTOR OPERATIONS DEMO</div>
        <div style="color: #ff0000;">Vector 1: [${v1.x.toFixed(2)}, ${v1.y.toFixed(2)}]</div>
        <div>Magnitude: ${v1Mag.toFixed(2)}</div>
        <div>Normalized: [${v1Normalized.x.toFixed(2)}, ${v1Normalized.y.toFixed(2)}]</div>
        
        <div style="color: #00ff00; margin-top: 10px;">Vector 2: [${v2.x.toFixed(2)}, ${v2.y.toFixed(2)}]</div>
        <div>Magnitude: ${v2Mag.toFixed(2)}</div>
        <div>Normalized: [${v2Normalized.x.toFixed(2)}, ${v2Normalized.y.toFixed(2)}]</div>
        
        <div style="color: #ffff00; margin-top: 10px;">Operations:</div>
        <div>Dot Product: ${dotProd.toFixed(2)}</div>
        <div>Cross Product: ${crossProd.toFixed(2)}</div>
        <div>Distance: ${distance.toFixed(2)}</div>
        <div>Angle Between: ${(angleBetween * 180 / Math.PI).toFixed(1)}°</div>
        <div style="color: #0ff;">Lerp t: ${lerpT.toFixed(2)}</div>
        
        <div style="margin-top: 10px; font-size: 10px; color: #888;">
            Red = V1 (rotating)<br/>
            Green = V2 (static)<br/>
            Yellow = Lerp result
        </div>
    `;
}

// Update loop
let lastUpdate = performance.now();
function animate() {
    const now = performance.now();
    const dt = (now - lastUpdate) / 1000;
    lastUpdate = now;

    updateVectorDisplay();
    renderer.render(dt);
    requestAnimationFrame(animate);
}

animate();
