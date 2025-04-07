
import { Rect, Scene, Camera2D } from '../../../../src/index.js';

const camera = new Camera2D();
const scene = new Scene({
	wheelMoveCamera: true,
});
scene.bindCamera(camera);

const rect = new Rect({
	x: 400,
	y: 300,

	width: 150,
	height: 150,
	// rxlt: 150,
	// rylt: 150,

	fill: '#0000ff',
	stroke: '#0000ff',
	strokeWidth: 0,
});

scene.on('keyup-W', () => {
	rect.y -= 5;
});
scene.on('keyup-S', () => {
	rect.y += 5;
});
scene.on('keyup-A', () => {
	rect.x -= 5;
});
scene.on('keyup-D', () => {
	rect.x += 5;
});

scene.add(rect);

export default scene;