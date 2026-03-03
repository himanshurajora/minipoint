import { Color, Rectangle, Text, Vector, Engine } from '../../lib/index';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const renderer = engine.renderer;
const infoPanel = document.getElementById('info')!;

// Create color swatches
const baseColor = Color.fromHex('#FF6B6B');

const swatches: Map<string, { rect: Rectangle; label: Text; color: Color }> = new Map();
let swatchY = 40;

// Helper to create a swatch
function createSwatch(label: string, color: Color) {
    const rect = new Rectangle({
        x: 50,
        y: swatchY,
        width: 150,
        height: 40,
        fillColor: color.toRGB(),
        color: '#0f0',
        stroke: 1,
    });

    const text = new Text({
        x: 60,
        y: swatchY + 12,
        text: label,
        font: '10px monospace',
        color: color.isDark() ? '#fff' : '#000',
    });

    renderer.addObject(rect);
    renderer.addObject(text);

    swatches.set(label, { rect, label: text, color });
    swatchY += 50;

    return color;
}

// Original color
createSwatch('Base Color', baseColor.clone());

// Darkened versions
const darkened1 = baseColor.clone().darken(0.2);
createSwatch('Darken 20%', darkened1);

const darkened2 = baseColor.clone().darken(0.5);
createSwatch('Darken 50%', darkened2);

// Lightened versions
swatchY += 20;
const lightened1 = baseColor.clone().lighten(0.2);
createSwatch('Lighten 20%', lightened1);

const lightened2 = baseColor.clone().lighten(0.5);
createSwatch('Lighten 50%', lightened2);

// Complementary and mixed colors
swatchY += 20;
const complementary = baseColor.clone().complementary();
createSwatch('Complementary', complementary);

const mixed = baseColor.clone().mix(Color.fromHex('#4ECDC4'), 0.5);
createSwatch('Mixed w/ Cyan', mixed);

// HSL variations
swatchY += 20;
const rotatedHue = Color.fromHSL((baseColor.toHSL().h + 60) % 360, 100, 50);
createSwatch('Rotated Hue', rotatedHue);

// Grayscale
swatchY += 20;
const gray = baseColor.clone().mix(Color.fromHex('#808080'), 0.7);
createSwatch('Desaturated', gray);

// Add color format display
let mouseColor = baseColor;
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check which swatch was clicked
    for (const [label, swatch] of swatches) {
        const sx = swatch.rect.options.x;
        const sy = swatch.rect.options.y;
        const sw = swatch.rect.options.width;
        const sh = swatch.rect.options.height;

        if (x >= sx && x <= sx + sw && y >= sy && y <= sy + sh) {
            mouseColor = swatch.color;
            break;
        }
    }
});

let rotationAngle = 0;

function animate() {
    rotationAngle += 0.016;

    // Update color info
    const hex = mouseColor.toHex();
    const rgb = mouseColor.toRGB();
    const hsl = mouseColor.toHSL();

    let info = `
        <div style="margin-top: 10px;">
            <div style="color: #ffff00;">Selected Color:</div>
            <div>Hex: ${hex}</div>
            <div>RGB: ${rgb}</div>
            <div>HSL: hsl(${hsl.h.toFixed(0)}°, ${hsl.s.toFixed(0)}%, ${hsl.l.toFixed(0)}%)</div>
            <div style="margin-top: 10px;">
                <div style="color: ${mouseColor.isDark() ? '#ffff00' : '#00ff00'};">
                    ${mouseColor.isDark() ? 'Dark' : 'Light'} Color
                </div>
                <div>Luminance: ${mouseColor.luminance().toFixed(2)}</div>
            </div>
        </div>
    `;

    infoPanel.innerHTML = info;

    renderer.render(0);
    requestAnimationFrame(animate);
}

animate();
