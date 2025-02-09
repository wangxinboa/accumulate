import {
	Camera2d,
	CanvasRender,
	Scene,
	CanvasEvents,
} from '../../src/index.js';

export const canvasDom = document.getElementById('renderCanvas');
export const camera = new Camera2d();
export const scene = new Scene();
export const renderer = new CanvasRender(canvasDom, {
	onResize(width, height) {
		camera.setRange(width, height);
	}
});
export const canvasEvents = new CanvasEvents(canvasDom);
canvasEvents.addScene(scene, camera);

let x = 0, y = 0, allowMove = false;
scene.on('mousedown', function (e) {
	x = e.offsetX;
	y = e.offsetY;
	allowMove = true;
});
scene.on('mousemove', function (e, camera) {
	if (allowMove) {
		camera.x += x - e.offsetX;
		camera.y += y - e.offsetY;
		x = e.offsetX;
		y = e.offsetY;
	}
});
scene.on('mouseup', function () {
	allowMove = false;
});

let afterRender = null;
function animationFrame() {
	requestAnimationFrame(animationFrame);
	renderer.render(scene, camera);
	if (afterRender) {
		afterRender();
	}
}
function start(callback) {
	animationFrame();
	afterRender = callback;
}

export default start;