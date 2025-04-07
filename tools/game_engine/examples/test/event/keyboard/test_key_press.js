
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

scene.on('keypress-W', () => {
	rect.y -= 5;
});
scene.on('keypress-S', () => {
	rect.y += 5;
});
scene.on('keypress-A', () => {
	rect.x -= 5;
});
scene.on('keypress-D', () => {
	rect.x += 5;
});

scene.add(rect);

export default scene;