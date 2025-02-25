import {
	Camera2D,
	CanvasRender,
	Scene2D,
	CanvasEvent,
} from '../../src/index.js';

export const canvasDom = document.getElementById('renderCanvas');
export const camera = new Camera2D();

export const scene = new Scene2D();
scene.bindCamera(camera);
globalThis.scene = scene;

export const renderer = new CanvasRender(canvasDom, {
	onResize(width, height) {
		camera.setRange(width, height);
	}
});

export const canvasEvents = new CanvasEvent(canvasDom);
canvasEvents.bindScene(scene);

let x = 0, y = 0, allowMove = false;
scene.on('mousedown', function (e) {
	x = e.offsetX;
	y = e.offsetY;
	allowMove = true;
});
scene.on('mousemove', function (e) {
	// console.info('e:', e);
	// console.info('this.camera:', this.camera);
	if (allowMove) {
		this.camera.x += x - e.offsetX;
		this.camera.y += y - e.offsetY;
		x = e.offsetX;
		y = e.offsetY;
	}
});
scene.on('mouseup', function () {
	allowMove = false;
});
scene.on('wheel', function (e, camera) {
	camera.x += e.deltaX;
	camera.y += e.deltaY;
});

let afterRender = null;
function animationFrame() {
	requestAnimationFrame(animationFrame);
	renderer.render(scene);
	if (afterRender) {
		afterRender();
	}
}
function start(callback) {
	animationFrame();
	afterRender = callback;
}

export default start;